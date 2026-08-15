import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  ListMusic,
  Waves,
  Sparkles,
  ExternalLink,
  Footprints
} from 'lucide-react';
import { AudioState, LocationZone } from '../../types';

interface MusicPlayerHUDProps {
  audioState: AudioState;
  activeZone: LocationZone | null;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleAmbient: () => void;
  onOpenDirectory: () => void;
}

export const MusicPlayerHUD: React.FC<MusicPlayerHUDProps> = ({
  audioState,
  activeZone,
  onTogglePlay,
  onNext,
  onPrevious,
  onVolumeChange,
  onToggleMute,
  onToggleAmbient,
  onOpenDirectory
}) => {
  const zoneName = activeZone ? activeZone.name : 'DhunMarg Neutral Streets';
  const zoneHindi = activeZone ? activeZone.hindiName : 'शांत नगर पथ';
  const zoneAccent = activeZone ? activeZone.accentColor : '#64748B';

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-40">
      <div
        className="rounded-2xl p-3 md:p-4 shadow-2xl transition-all border backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(23, 19, 31, 0.88)',
          borderColor: activeZone ? `${zoneAccent}50` : 'rgba(100, 116, 139, 0.3)',
          boxShadow: activeZone ? `0 10px 30px -10px ${zoneAccent}30` : '0 10px 30px -10px rgba(0,0,0,0.5)'
        }}
      >
        {/* Top Info Bar: Environment Badge & Equalizer */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-stone-800/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activeZone ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: zoneAccent }}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold truncate" style={{ color: activeZone ? '#fef08a' : '#cbd5e1' }}>
                {activeZone ? (
                  <Radio className="w-3.5 h-3.5 flex-shrink-0" style={{ color: zoneAccent }} />
                ) : (
                  <Footprints className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
                )}
                <span className="truncate">{zoneName}</span>
                <span className="hidden sm:inline text-stone-400 font-normal">({zoneHindi})</span>
              </div>
              <div className="text-[11px] text-stone-400 truncate">
                {activeZone ? activeZone.tagline : 'Walk into any glowing circle to trigger that venue\'s music'}
              </div>
            </div>
          </div>

          {/* Equalizer Wave / YouTube Music link */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {activeZone && audioState.isPlaying && (
              <div className="flex items-end gap-0.5 h-4 px-1.5">
                <span className="w-1 bg-amber-400 rounded-t animate-eq-1" />
                <span className="w-1 bg-orange-400 rounded-t animate-eq-2" />
                <span className="w-1 bg-rose-400 rounded-t animate-eq-3" />
                <span className="w-1 bg-amber-400 rounded-t animate-eq-4" />
              </div>
            )}
            {activeZone && (
              <a
                href={activeZone.playlistUrl || `https://music.youtube.com/search?q=${encodeURIComponent(activeZone.name + ' Hindi Songs')}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 text-[11px] text-stone-400 hover:text-amber-300 transition-colors"
                title="Open YouTube Music"
              >
                <span>Playlist</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Controls Row: Track Info + Play/Next Buttons + Volume */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Track Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-stone-950 flex-shrink-0 shadow"
              style={{
                background: activeZone
                  ? `linear-gradient(135deg, ${zoneAccent}, #1c1917)`
                  : 'linear-gradient(135deg, #334155, #1e293b)'
              }}
            >
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div className="min-w-0">
              <div className="text-xs md:text-sm font-semibold text-stone-100 truncate">
                {activeZone
                  ? (audioState.currentTrackTitle || activeZone.sampleTracks[0]?.title)
                  : 'Silent Zone (City Ambience Only)'}
              </div>
              <div className="text-[11px] text-stone-400 truncate">
                {activeZone
                  ? (audioState.currentArtist || activeZone.sampleTracks[0]?.artist)
                  : 'Step inside any zone circle to play'}
              </div>
            </div>
          </div>

          {/* Center Playback Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={onPrevious}
              disabled={!activeZone}
              className={`p-2 rounded-full text-stone-300 transition cursor-pointer ${
                !activeZone ? 'opacity-40 cursor-not-allowed' : 'hover:text-white hover:bg-stone-800/60'
              }`}
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              disabled={!activeZone}
              className={`p-2.5 sm:p-3 rounded-full text-stone-950 font-bold shadow-lg transition cursor-pointer ${
                activeZone
                  ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 hover:scale-105 active:scale-95'
                  : 'bg-stone-600 opacity-50 cursor-not-allowed'
              }`}
              title={audioState.isPlaying ? 'Pause' : 'Play'}
            >
              {audioState.isPlaying && activeZone ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              disabled={!activeZone}
              className={`p-2 rounded-full text-stone-300 transition cursor-pointer ${
                !activeZone ? 'opacity-40 cursor-not-allowed' : 'hover:text-white hover:bg-stone-800/60'
              }`}
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right Utility: Volume & Directory Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-1.5 bg-stone-800/50 px-2 py-1 rounded-full border border-stone-700/40">
              <button
                onClick={onToggleMute}
                className="text-stone-400 hover:text-amber-300 transition cursor-pointer"
                title={audioState.isMuted ? 'Unmute' : 'Mute'}
              >
                {audioState.isMuted || audioState.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={audioState.isMuted ? 0 : audioState.volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                title="Volume"
              />
            </div>

            {/* Ambient Sound Toggle */}
            <button
              onClick={onToggleAmbient}
              className={`p-2 rounded-full border transition cursor-pointer ${
                audioState.ambientEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-800/40 text-stone-400 border-stone-700/40'
              }`}
              title="Toggle Urban Environmental Ambience"
            >
              <Waves className="w-4 h-4" />
            </button>

            {/* Playlist Directory Button */}
            <button
              onClick={onOpenDirectory}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-800/70 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:border-amber-500/60 text-xs transition cursor-pointer"
              title="Explore all 9 Locations & Playlists"
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Venues</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
