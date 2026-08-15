// YouTube IFrame Player wrapper for seamless location-based playlist switching

import { LocationZone } from '../types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export type PlayerStateCallback = (state: {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTrackIndex: number;
  totalTracks: number;
  videoTitle: string;
}) => void;

class YouTubeAudioService {
  private player: any = null;
  private isReady: boolean = false;
  private currentLocationId: string = '';
  private currentVideoList: string[] = [];
  private currentTrackIndex: number = 0;
  private targetVolume: number = 75;
  private isMuted: boolean = false;
  private listeners: Set<PlayerStateCallback> = new Set();
  private pendingZone: LocationZone | null = null;
  private pendingPlaylist: string | null = null;
  private initPromise: Promise<boolean> | null = null;
  private containerId: string = 'dhunmarg-isolated-yt-audio';

  public init(): Promise<boolean> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      // Ensure isolated container exists outside React tree
      let hostEl = document.getElementById(this.containerId);
      if (!hostEl) {
        hostEl = document.createElement('div');
        hostEl.id = this.containerId;
        hostEl.style.position = 'fixed';
        hostEl.style.bottom = '-9999px';
        hostEl.style.left = '-9999px';
        hostEl.style.width = '120px';
        hostEl.style.height = '120px';
        hostEl.style.pointerEvents = 'none';
        hostEl.style.opacity = '0.001';
        hostEl.style.zIndex = '-9999';
        document.body.appendChild(hostEl);
      }

      if (window.YT && window.YT.Player) {
        this.createPlayer(resolve);
        return;
      }

      // Load YouTube API script if not already present
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        this.createPlayer(resolve);
      };

      // Fallback timeout in case YouTube API takes longer to initialize
      setTimeout(() => {
        if (!this.isReady) {
          this.isReady = true;
          resolve(true);
        }
      }, 4000);
    });

    return this.initPromise;
  }

  private createPlayer(resolve: (value: boolean) => void) {
    try {
      this.player = new window.YT.Player(this.containerId, {
        height: '120',
        width: '120',
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          autoplay: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            this.isReady = true;
            try {
              this.player?.setVolume?.(this.targetVolume);
            } catch (e) {
              // ignore
            }
            if (this.pendingZone) {
              this.loadLocationZone(this.pendingZone, true);
              this.pendingZone = null;
            } else if (this.pendingPlaylist) {
              this.loadPlaylist(this.pendingPlaylist);
              this.pendingPlaylist = null;
            }
            this.notifyState();
            resolve(true);
          },
          onStateChange: (event: any) => {
            this.notifyState();
            // Loop next song when video finishes
            if (event?.data === 0) { // 0 = ENDED
              this.next();
            }
          },
          onError: () => {
            // Auto skip to next track if one video is geo-restricted or unavailable
            try {
              this.next();
            } catch (e) {
              // ignore
            }
          }
        }
      });
    } catch (err) {
      this.isReady = true;
      resolve(false);
    }
  }

  public subscribe(callback: PlayerStateCallback): () => void {
    this.listeners.add(callback);
    this.notifyState();
    return () => this.listeners.delete(callback);
  }

  private notifyState() {
    if (!this.player || !this.isReady) return;
    try {
      const state = this.player.getPlayerState ? this.player.getPlayerState() : -1;
      const isPlaying = state === 1; // YT.PlayerState.PLAYING
      const isBuffering = state === 3; // YT.PlayerState.BUFFERING
      const currentTrackIndex = this.player.getPlaylistIndex ? (this.player.getPlaylistIndex() ?? this.currentTrackIndex) : this.currentTrackIndex;
      const playlist = this.player.getPlaylist ? (this.player.getPlaylist() || this.currentVideoList) : this.currentVideoList;
      const videoData = this.player.getVideoData ? (this.player.getVideoData() || {}) : {};

      const safeTitle = typeof videoData.title === 'string' ? videoData.title : '';

      this.listeners.forEach((cb) => {
        try {
          cb({
            isPlaying,
            isBuffering,
            currentTrackIndex,
            totalTracks: Array.isArray(playlist) && playlist.length > 0 ? playlist.length : Math.max(1, this.currentVideoList.length),
            videoTitle: safeTitle
          });
        } catch (e) {
          // protect against callback errors
        }
      });
    } catch (e) {
      // ignore
    }
  }

  /**
   * Primary method for seamless environment switching:
   * Explicitly stops previous audio and loads the new zone's video playlist queue.
   */
  public loadLocationZone(zone: LocationZone, autoplay: boolean = true) {
    if (!zone) return;

    if (this.currentLocationId === zone.id) {
      if (autoplay) {
        this.play();
      }
      return;
    }

    this.currentLocationId = zone.id;
    this.currentVideoList = zone.videoIds && zone.videoIds.length > 0 ? [...zone.videoIds] : [];
    this.currentTrackIndex = 0;

    if (!this.isReady || !this.player) {
      this.pendingZone = zone;
      return;
    }

    try {
      // 1. Explicitly stop and wipe the prior environment's stream
      try {
        this.player.stopVideo?.();
      } catch (e) {
        // ignore
      }

      // 2. Load the new location's specific playlist queue from user playlistId or videoIds
      if (zone.playlistId && typeof this.player.loadPlaylist === 'function') {
        if (autoplay) {
          this.player.loadPlaylist({
            list: zone.playlistId,
            listType: 'playlist',
            index: 0,
            suggestedQuality: 'small'
          });
        } else {
          this.player.cuePlaylist({
            list: zone.playlistId,
            listType: 'playlist',
            index: 0
          });
        }
      } else if (this.currentVideoList.length > 0 && typeof this.player.loadPlaylist === 'function') {
        if (autoplay) {
          this.player.loadPlaylist(this.currentVideoList, 0, 0);
        } else {
          this.player.cuePlaylist(this.currentVideoList, 0, 0);
        }
      } else if (this.currentVideoList.length > 0 && typeof this.player.loadVideoById === 'function') {
        if (autoplay) {
          this.player.loadVideoById(this.currentVideoList[0], 0);
        } else {
          this.player.cueVideoById(this.currentVideoList[0], 0);
        }
      }
      this.notifyState();
    } catch (e) {
      console.warn('Failed to load location songs into YouTube player', e);
    }
  }

  /**
   * Called when player leaves all zones into neutral street ambience:
   * Stops the playback and resets location tracker so re-entering works seamlessly.
   */
  public stopLocationAudio() {
    this.currentLocationId = '';
    this.pause();
  }

  public loadPlaylist(playlistId: string, autoplay: boolean = true) {
    if (!this.isReady || !this.player || !this.player.loadPlaylist) {
      this.pendingPlaylist = playlistId;
      return;
    }

    try {
      if (autoplay) {
        this.player.loadPlaylist({
          list: playlistId,
          listType: 'playlist',
          index: 0,
          suggestedQuality: 'small'
        });
      } else {
        this.player.cuePlaylist({
          list: playlistId,
          listType: 'playlist',
          index: 0
        });
      }
      this.notifyState();
    } catch (e) {
      console.warn('Failed to load playlist into YouTube player', e);
    }
  }

  public play() {
    if (!this.player || !this.isReady) return;
    try {
      this.player.playVideo?.();
      this.notifyState();
    } catch (e) {
      console.warn('Play failed', e);
    }
  }

  public pause() {
    if (!this.player || !this.isReady) return;
    try {
      this.player.pauseVideo?.();
      this.notifyState();
    } catch (e) {
      console.warn('Pause failed', e);
    }
  }

  public togglePlay() {
    if (!this.player || !this.isReady) return;
    try {
      const state = this.player.getPlayerState?.();
      if (state === 1) {
        this.pause();
      } else {
        this.play();
      }
    } catch (e) {
      this.play();
    }
  }

  public next() {
    if (!this.player || !this.isReady) return;
    try {
      if (this.currentVideoList.length > 1) {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentVideoList.length;
        if (typeof this.player.nextVideo === 'function') {
          this.player.nextVideo();
        } else if (typeof this.player.loadVideoById === 'function') {
          this.player.loadVideoById(this.currentVideoList[this.currentTrackIndex], 0);
        }
      } else {
        this.player.nextVideo?.();
      }
      this.notifyState();
    } catch (e) {
      console.warn('Next failed', e);
    }
  }

  public previous() {
    if (!this.player || !this.isReady) return;
    try {
      if (this.currentVideoList.length > 1) {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.currentVideoList.length) % this.currentVideoList.length;
        if (typeof this.player.previousVideo === 'function') {
          this.player.previousVideo();
        } else if (typeof this.player.loadVideoById === 'function') {
          this.player.loadVideoById(this.currentVideoList[this.currentTrackIndex], 0);
        }
      } else {
        this.player.previousVideo?.();
      }
      this.notifyState();
    } catch (e) {
      console.warn('Previous failed', e);
    }
  }

  public setVolume(vol: number) {
    this.targetVolume = Math.max(0, Math.min(100, vol));
    if (!this.player || !this.isReady) return;
    try {
      this.player.setVolume?.(this.targetVolume);
      if (this.targetVolume > 0 && this.isMuted) {
        this.unMute();
      }
    } catch (e) {
      // ignore
    }
  }

  public mute() {
    this.isMuted = true;
    if (!this.player || !this.isReady) return;
    try {
      this.player.mute?.();
    } catch (e) {
      // ignore
    }
  }

  public unMute() {
    this.isMuted = false;
    if (!this.player || !this.isReady) return;
    try {
      this.player.unMute?.();
      this.player.setVolume?.(this.targetVolume);
    } catch (e) {
      // ignore
    }
  }

  public toggleMute(): boolean {
    if (this.isMuted) {
      this.unMute();
      return false;
    } else {
      this.mute();
      return true;
    }
  }
}

export const youtubeService = new YouTubeAudioService();
