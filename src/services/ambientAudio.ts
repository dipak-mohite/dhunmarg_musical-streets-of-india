// Web Audio API procedural soundscape engine for authentic Indian ambient environments

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized: boolean = false;
  private masterGain: GainNode | null = null;
  private currentType: string = 'traffic';
  private currentIntensity: number = 0.5;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private intervalId: any = null;
  private isMuted: boolean = false;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
      this.startAmbience('traffic', 0.5);
    } catch (e) {
      console.warn('Web Audio Ambient Engine not supported', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.28, this.ctx.currentTime);
    }
  }

  public setEnvironment(type: string, intensity: number = 0.6) {
    if (!this.isInitialized || !this.ctx) return;
    if (this.currentType === type && Math.abs(this.currentIntensity - intensity) < 0.1) return;

    this.currentType = type;
    this.currentIntensity = intensity;
    this.startAmbience(type, intensity);
  }

  private clearCurrent() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  private startAmbience(type: string, intensity: number) {
    if (!this.ctx || !this.masterGain) return;
    this.clearCurrent();

    const now = this.ctx.currentTime;
    const envGain = this.ctx.createGain();
    envGain.gain.setValueAtTime(0, now);
    envGain.gain.linearRampToValueAtTime(Math.min(1.0, intensity), now + 0.8);
    envGain.connect(this.masterGain);
    this.activeNodes.push(envGain);

    switch (type) {
      case 'tapri':
        this.createTapriAmbience(envGain);
        break;
      case 'salon':
        this.createSalonAmbience(envGain);
        break;
      case 'highway':
      case 'truck':
        this.createTruckAmbience(envGain);
        break;
      case 'auto':
        this.createAutoAmbience(envGain);
        break;
      case 'office':
        this.createOfficeAmbience(envGain);
        break;
      case 'baraat':
        this.createBaraatAmbience(envGain);
        break;
      case 'concert':
        this.createConcertAmbience(envGain);
        break;
      case 'mahfil':
        this.createMahfilAmbience(envGain);
        break;
      case 'traffic':
      default:
        this.createCityAmbience(envGain);
        break;
    }
  }

  // --- Procedural sound generators ---

  private createCityAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Low rumble noise
    const rumble = this.createPinkNoise(60, 250);
    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.value = 0.15;
    rumble.connect(rumbleGain);
    rumbleGain.connect(parentGain);
    this.activeNodes.push(rumble, rumbleGain);

    // Evening cricket high frequency pulse
    const cricketOsc = this.ctx.createOscillator();
    const cricketGain = this.ctx.createGain();
    cricketOsc.type = 'sine';
    cricketOsc.frequency.value = 4600;
    cricketGain.gain.value = 0.02;
    cricketOsc.connect(cricketGain);
    cricketGain.connect(parentGain);
    cricketOsc.start();
    this.activeNodes.push(cricketOsc, cricketGain);

    // Periodic distant horn beep
    this.intervalId = setInterval(() => {
      if (!this.ctx || Math.random() > 0.45) return;
      this.playDistantHorn(parentGain);
    }, 4500);
  }

  private createTapriAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Kettle boiling steam hiss
    const steam = this.createWhiteNoise(1200, 4500);
    const steamGain = this.ctx.createGain();
    steamGain.gain.value = 0.08;
    steam.connect(steamGain);
    steamGain.connect(parentGain);
    this.activeNodes.push(steam, steamGain);

    // Occasional glass chai cup clink
    this.intervalId = setInterval(() => {
      if (!this.ctx || Math.random() > 0.6) return;
      this.playGlassClink(parentGain);
    }, 3200);
  }

  private createSalonAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Scissor snips
    this.intervalId = setInterval(() => {
      if (!this.ctx) return;
      this.playScissorSnip(parentGain);
    }, 1800);

    // Gentle hum of electric trimmer
    const humOsc = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    humOsc.type = 'sawtooth';
    humOsc.frequency.value = 120;
    humGain.gain.value = 0.03;
    humOsc.connect(humGain);
    humGain.connect(parentGain);
    humOsc.start();
    this.activeNodes.push(humOsc, humGain);
  }

  private createTruckAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Low heavy diesel rumble
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 52;
    oscGain.gain.value = 0.12;
    osc.connect(oscGain);
    oscGain.connect(parentGain);
    osc.start();
    this.activeNodes.push(osc, oscGain);

    // Highway wind noise
    const wind = this.createPinkNoise(150, 600);
    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.1;
    wind.connect(windGain);
    windGain.connect(parentGain);
    this.activeNodes.push(wind, windGain);
  }

  private createAutoAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // 2-stroke engine pulse
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 85;
    oscGain.gain.value = 0.07;
    osc.connect(oscGain);
    oscGain.connect(parentGain);
    osc.start();
    this.activeNodes.push(osc, oscGain);
  }

  private createOfficeAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // HVAC soft air whisper
    const air = this.createPinkNoise(200, 1000);
    const airGain = this.ctx.createGain();
    airGain.gain.value = 0.06;
    air.connect(airGain);
    airGain.connect(parentGain);
    this.activeNodes.push(air, airGain);

    // Keystroke clicks
    this.intervalId = setInterval(() => {
      if (!this.ctx || Math.random() > 0.5) return;
      this.playKeyClicks(parentGain);
    }, 1400);
  }

  private createBaraatAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Dhol thump heartbeat
    this.intervalId = setInterval(() => {
      if (!this.ctx) return;
      this.playDholThump(parentGain);
    }, 650);
  }

  private createConcertAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Crowd murmur & subwoofer hum
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 44;
    subGain.gain.value = 0.14;
    sub.connect(subGain);
    subGain.connect(parentGain);
    sub.start();
    this.activeNodes.push(sub, subGain);
  }

  private createMahfilAmbience(parentGain: GainNode) {
    if (!this.ctx) return;
    // Tanpura drone (Sa - Pa - Sa harmonic fundamentals: 146.8Hz, 220Hz, 293.6Hz)
    const freqs = [146.83, 220.0, 293.66];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.035 / (idx + 1);
      osc.connect(gain);
      gain.connect(parentGain);
      osc.start();
      this.activeNodes.push(osc, gain);
    });

    // Subtle devotional bells
    this.intervalId = setInterval(() => {
      if (!this.ctx || Math.random() > 0.6) return;
      this.playGhungrooClap(parentGain);
    }, 4000);
  }

  // --- Helper procedural sound effects ---

  private playDistantHorn(destination: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(390, now);
    osc.frequency.setValueAtTime(440, now + 0.12);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  private playGlassClink(destination: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  private playScissorSnip(destination: GainNode) {
    if (!this.ctx) return;
    const noise = this.createWhiteNoise(3000, 8000);
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(gain);
    gain.connect(destination);
    setTimeout(() => {
      try {
        noise.disconnect();
        gain.disconnect();
      } catch (e) {}
    }, 150);
  }

  private playDholThump(destination: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  private playKeyClicks(destination: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 600, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  private playGhungrooClap(destination: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  private createWhiteNoise(lowCut: number, highCut: number) {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = (lowCut + highCut) / 2;
    filter.Q.value = 1.0;

    noise.connect(filter);
    noise.start();
    return filter;
  }

  private createPinkNoise(lowCut: number, highCut: number) {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = (lowCut + highCut) / 2;
    filter.Q.value = 0.8;

    noise.connect(filter);
    noise.start();
    return filter;
  }
}

export const ambientEngine = new AmbientSoundEngine();
