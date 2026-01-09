class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    try {
      const savedMute = localStorage.getItem('gw-muted');
      this.isMuted = savedMute === 'true';
    } catch (e) {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.updateMasterVolume();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private updateMasterVolume() {
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      // Volume level 0.2 is comfortable for SFX
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.2, now + 0.1);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('gw-muted', String(this.isMuted));
    // Ensure context exists on user interaction
    if (!this.ctx) {
      this.initContext();
    }
    this.updateMasterVolume();
    return this.isMuted;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  // Effect 1: Button Hover (Low hum pulse)
  public playHover() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency dip creates a "hum" feel
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Effect 2: Click/Generate (Lightsaber ignition style snap)
  public playClick() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sharp frequency rise
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Effect 3: Quote Reveal (Mystical chime/swell)
  public playReveal() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // Create a major chord swell
    const frequencies = [220, 329.63, 440]; // A major
    
    frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        // Staggered entry for "swell" effect
        const start = t + (i * 0.05);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.05, start + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 2.0);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start(start);
        osc.stop(start + 2.5);
    });
  }
}

export const soundManager = new SoundController();