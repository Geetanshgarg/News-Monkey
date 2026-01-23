"use client";

class SoundManager {
    private ctx: AudioContext | null = null;
    private initialized: boolean = false;

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.error("AudioContext failed", e);
        }
    }

    private playTone(freq: number, decay: number, type: OscillatorType, volume: number) {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + decay);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + decay);
    }

    play(profile: 'mechanical' | 'clicky' | 'thock' | 'blaster' | 'lightsaber') {
        switch (profile) {
            case 'mechanical':
                // Classic Brown Switch sound (Mid-range, short decay)
                this.playTone(150, 0.08, 'square', 0.04);
                this.playTone(800, 0.02, 'sine', 0.01); // Tiny high-end "click"
                break;
            case 'clicky':
                // Blue Switch sound (High pitch, sharp)
                this.playTone(400, 0.05, 'square', 0.03);
                this.playTone(1200, 0.03, 'sine', 0.02);
                break;
            case 'thock':
                // Deep POM/Ink sound (Low frequency, slightly longer)
                this.playTone(80, 0.12, 'triangle', 0.06);
                this.playTone(200, 0.08, 'sine', 0.02);
                break;
            case 'blaster':
                // Star Wars Blaster (High sweep down, very fast)
                this.playTone(2000, 0.15, 'sawtooth', 0.02);
                this.playTone(1000, 0.1, 'square', 0.02);
                break;
            case 'lightsaber':
                // Saber Clash (Low hum + harmonic burst)
                this.playTone(90, 0.2, 'triangle', 0.06);
                this.playTone(50, 0.2, 'sine', 0.06);
                this.playTone(400, 0.05, 'sawtooth', 0.01);
                break;
        }
    }
}

export const soundManager = new SoundManager();
