/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CityCanvas } from './components/3d/CityCanvas';
import { LandingScreen } from './components/ui/LandingScreen';
import { LocationBanner } from './components/ui/LocationBanner';
import { MiniMap } from './components/ui/MiniMap';
import { MusicPlayerHUD } from './components/ui/MusicPlayerHUD';
import { ControlsGuide } from './components/ui/ControlsGuide';
import { MobileControls } from './components/ui/MobileControls';
import { PlaylistDirectoryModal } from './components/ui/PlaylistDirectoryModal';
import { LOCATIONS } from './config/locations';
import { ambientEngine } from './services/ambientAudio';
import { youtubeService } from './services/youtube';
import { AudioState, AvatarGender, CameraMode, LocationZone, PlayerState } from './types';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [avatarGender, setAvatarGender] = useState<AvatarGender>('man');
  const [cameraMode, setCameraMode] = useState<CameraMode>('third-person');
  const [activeZone, setActiveZone] = useState<LocationZone | null>(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isHudHidden, setIsHudHidden] = useState<boolean>(false);
  const [teleportTarget, setTeleportTarget] = useState<{ x: number; y: number; z: number; yaw?: number } | null>(null);

  // Mobile control states
  const [mobileMove, setMobileMove] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mobileLook, setMobileLook] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mobileSprint, setMobileSprint] = useState<boolean>(false);
  const [mobileActionTrigger, setMobileActionTrigger] = useState<number>(0);

  // Real-time Player State (Position, Rotation, Distances)
  const [playerState, setPlayerState] = useState<PlayerState>({
    position: { x: 0, y: 1.7, z: 0 },
    rotation: { yaw: 0, pitch: 0 },
    speed: 0,
    isSprint: false,
    isMoving: false,
    inInterior: false,
    currentZone: null,
    nearbyZone: null,
    distanceToNearest: 999
  });

  // Audio Player State
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    activeLocationId: 'city_streets',
    playlistId: '',
    currentTrackIndex: 0,
    currentTrackTitle: 'DhunMarg City Ambient',
    currentArtist: 'Streets of India Radio',
    volume: 75,
    isMuted: false,
    isBuffering: false,
    isAudioUnlocked: false,
    ambientEnabled: true,
    currentTime: 0,
    duration: 0
  });

  // Subscribe to YouTube audio state changes
  useEffect(() => {
    const unsubscribe = youtubeService.subscribe((ytState) => {
      setAudioState((prev) => ({
        ...prev,
        isPlaying: ytState.isPlaying,
        isBuffering: ytState.isBuffering,
        currentTrackIndex: ytState.currentTrackIndex,
        currentTrackTitle: ytState.videoTitle || prev.currentTrackTitle
      }));
    });
    return () => unsubscribe();
  }, []);

  // Enter city & unlock audio engines
  const handleEnterExperience = (selectedGender?: AvatarGender) => {
    if (selectedGender) {
      setAvatarGender(selectedGender);
    }
    setHasEntered(true);
    ambientEngine.init();
    youtubeService.init();

    setAudioState((prev) => ({
      ...prev,
      isAudioUnlocked: true
    }));

    // Start with street ambience
    ambientEngine.setEnvironment('traffic', 0.5);
  };

  const handleToggleCameraMode = useCallback(() => {
    setCameraMode((prev) => (prev === 'third-person' ? 'first-person' : 'third-person'));
  }, []);

  // Automatic Location-Based Music Activation & Catchment Range Trigger
  const handleZoneChange = useCallback((newZone: LocationZone | null) => {
    setActiveZone(newZone);

    if (newZone) {
      // Automatic Playlist Switch based on location
      setAudioState((prev) => ({
        ...prev,
        activeLocationId: newZone.id,
        playlistId: newZone.playlistId,
        currentTrackTitle: newZone.sampleTracks[0]?.title || newZone.name,
        currentArtist: newZone.sampleTracks[0]?.artist || 'DhunMarg Radio'
      }));

      // Play YouTube songs queue for this physical environment
      youtubeService.loadLocationZone(newZone, true);

      // Transition procedural ambient soundscape to match zone
      ambientEngine.setEnvironment(newZone.ambientProfile.type, newZone.ambientProfile.intensity);
    } else {
      // Outside any song range circle: STOP the music and return to peaceful street ambience
      youtubeService.stopLocationAudio();

      setAudioState((prev) => ({
        ...prev,
        activeLocationId: 'city_streets',
        currentTrackTitle: 'Neutral Streets • Step inside any glowing circle',
        currentArtist: 'DhunMarg City Ambience'
      }));

      ambientEngine.setEnvironment('traffic', 0.45);
    }
  }, []);

  // Fast-travel / Teleport into inner interactive spots
  const handleFastTravel = (zone: LocationZone) => {
    setTeleportTarget({
      x: zone.interiorSpawn ? zone.interiorSpawn.x : zone.position.x,
      y: zone.interiorSpawn ? zone.interiorSpawn.y : 1.7,
      z: zone.interiorSpawn ? zone.interiorSpawn.z : zone.position.z,
      yaw: zone.interiorSpawn ? zone.interiorSpawn.yaw : 0
    });
  };

  // Global keyboard shortcuts: 'M' for Directory, 'H' for Zen Mode, 'V' for Camera
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        setIsDirectoryOpen((prev) => !prev);
      }
      if (e.code === 'KeyH' || e.code === 'KeyU') {
        setIsHudHidden((prev) => !prev);
      }
      if (e.code === 'KeyV') {
        setCameraMode((prev) => (prev === 'third-person' ? 'first-person' : 'third-person'));
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-stone-950 text-stone-100 font-['Outfit',sans-serif]">
      
      {/* 1. Walkable Indian City Scene (3rd Person Player Avatar / 1st Person) */}
      <CityCanvas
        avatarGender={avatarGender}
        cameraMode={cameraMode}
        onToggleCameraMode={handleToggleCameraMode}
        onZoneChange={handleZoneChange}
        onPlayerStateUpdate={setPlayerState}
        teleportTarget={teleportTarget}
        onTeleportComplete={() => setTeleportTarget(null)}
        isAudioUnlocked={audioState.isAudioUnlocked}
        mobileMoveInput={mobileMove}
        mobileLookInput={mobileLook}
        mobileSprint={mobileSprint}
        mobileActionTrigger={mobileActionTrigger}
      />

      {/* 2. Opening Landing Screen (Unlocks audio & introduces world) */}
      {!hasEntered && <LandingScreen onEnter={handleEnterExperience} />}

      {/* 3. Zen Mode Mini Restore Button (When UI is hidden) */}
      {hasEntered && isHudHidden && (
        <button
          onClick={() => setIsHudHidden(false)}
          className="fixed top-4 left-4 z-50 glass-panel-gold px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-amber-300 hover:text-amber-100 hover:bg-stone-900/90 transition cursor-pointer shadow-2xl border border-amber-500/40"
          title="Show UI & Controls (Press H)"
        >
          <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Show UI (Press H)</span>
        </button>
      )}

      {/* 4. In-Game HUD & Controls (Active after entering and when UI is not hidden) */}
      {hasEntered && !isHudHidden && (
        <>
          {/* Top-Left Controls Hint */}
          <ControlsGuide
            cameraMode={cameraMode}
            onToggleCameraMode={handleToggleCameraMode}
            onToggleDirectory={() => setIsDirectoryOpen(true)}
            onToggleHideHud={() => setIsHudHidden(true)}
          />

          {/* Top-Right Interactive GPS Mini-Map */}
          <MiniMap
            playerState={playerState}
            onFastTravel={handleFastTravel}
          />

          {/* Center Location Discovery Banner */}
          <LocationBanner
            zone={activeZone}
            onInteract={() => setMobileActionTrigger(Date.now())}
          />

          {/* Mobile Virtual Joystick & Touch Controls */}
          <MobileControls
            onMoveChange={setMobileMove}
            onLookChange={setMobileLook}
            isSprint={mobileSprint}
            onToggleSprint={() => setMobileSprint(!mobileSprint)}
            onActionTrigger={() => setMobileActionTrigger(Date.now())}
          />

          {/* Bottom Floating Custom Music Player */}
          <MusicPlayerHUD
            audioState={audioState}
            activeZone={activeZone}
            onTogglePlay={() => youtubeService.togglePlay()}
            onNext={() => youtubeService.next()}
            onPrevious={() => youtubeService.previous()}
            onVolumeChange={(vol) => {
              setAudioState((prev) => ({ ...prev, volume: vol, isMuted: false }));
              youtubeService.setVolume(vol);
            }}
            onToggleMute={() => {
              const muted = youtubeService.toggleMute();
              setAudioState((prev) => ({ ...prev, isMuted: muted }));
            }}
            onToggleAmbient={() => {
              const nextState = !audioState.ambientEnabled;
              ambientEngine.setMuted(!nextState);
              setAudioState((prev) => ({ ...prev, ambientEnabled: nextState }));
            }}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
          />

          {/* 9 Venues Directory Modal */}
          <PlaylistDirectoryModal
            isOpen={isDirectoryOpen}
            onClose={() => setIsDirectoryOpen(false)}
            onSelectLocation={handleFastTravel}
            activeLocationId={audioState.activeLocationId}
          />
        </>
      )}

    </main>
  );
}
