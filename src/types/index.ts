export type LocationId =
  | 'truck'
  | 'barber'
  | 'tapri'
  | 'auto'
  | 'bus'
  | 'office'
  | 'baraat'
  | 'concert'
  | 'mahfil'
  | 'city_streets';

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  mood: string;
}

export type AvatarGender = 'man' | 'woman';
export type CameraMode = 'third-person' | 'first-person';

export interface LocationZone {
  id: LocationId;
  name: string;
  hindiName: string;
  tagline: string;
  category: string;
  description: string;
  culturalDetail: string;
  playlistId: string;
  playlistUrl?: string;
  videoIds: string[];
  icon: string;
  accentColor: string;
  glowColor: string;
  position: { x: number; y: number; z: number };
  radius: number;
  hasInterior: boolean;
  interiorSpawn: { x: number; y: number; z: number; yaw: number; pitch?: number; seatHeight?: number };
  actionPrompt: string;
  ambientProfile: {
    type: 'traffic' | 'salon' | 'tapri' | 'office' | 'baraat' | 'concert' | 'mahfil' | 'highway' | 'auto';
    intensity: number;
  };
  sampleTracks: TrackInfo[];
}

export interface AudioState {
  isPlaying: boolean;
  activeLocationId: LocationId;
  playlistId: string;
  currentTrackIndex: number;
  currentTrackTitle: string;
  currentArtist: string;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  isAudioUnlocked: boolean;
  ambientEnabled: boolean;
  currentTime: number;
  duration: number;
}

export interface PlayerState {
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  speed: number;
  isSprint: boolean;
  isMoving: boolean;
  inInterior: boolean;
  currentZone: LocationZone | null;
  nearbyZone: LocationZone | null;
  distanceToNearest: number;
}
