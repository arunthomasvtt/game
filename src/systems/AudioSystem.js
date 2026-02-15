export class AudioSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.ctx = null;
    this.master = null;
    this.mode = 'exploration';
  }

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.08;
    this.master.connect(this.ctx.destination);
    this.ambient = this.makeLayer(120, 'sine');
    this.suspense = this.makeLayer(95, 'triangle');
    this.combat = this.makeLayer(70, 'sawtooth');
  }

  makeLayer(freq, type) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain).connect(this.master);
    osc.start();
    return gain;
  }

  update() {
    if (!this.ctx) return;
    const mode = this.gameState.alertState;
    if (mode === this.mode) return;
    this.mode = mode;

    this.ambient.gain.linearRampToValueAtTime(mode === 'exploration' ? 0.26 : 0.08, this.ctx.currentTime + 0.4);
    this.suspense.gain.linearRampToValueAtTime(mode === 'suspense' ? 0.2 : 0.05, this.ctx.currentTime + 0.4);
    this.combat.gain.linearRampToValueAtTime(mode === 'combat' ? 0.3 : 0.02, this.ctx.currentTime + 0.3);
  }
}
