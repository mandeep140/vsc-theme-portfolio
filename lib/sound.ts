let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => { });
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('portfolio_sound_enabled') === 'false';
  } catch {
    return false;
  }
}

export function getVolumeMultiplier(): number {
  if (isSoundMuted()) return 0;
  if (typeof window === 'undefined') return 0.8;
  try {
    const vol = localStorage.getItem('portfolio_sound_volume');
    if (vol !== null) {
      const parsed = parseInt(vol, 10);
      if (!isNaN(parsed)) {
        return Math.max(0, Math.min(100, parsed)) / 50;
      }
    }
  } catch { }
  return 0.8;
}

export function playClickSound() {
  const vol = getVolumeMultiplier();
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(850, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);

  const maxGain = 0.28 * vol;
  gain.gain.setValueAtTime(maxGain, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}

export function playKeypressSound() {
  const vol = getVolumeMultiplier();
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = 480 + Math.random() * 100;
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.03);

  const maxGain = 0.22 * vol;
  gain.gain.setValueAtTime(maxGain, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.03);
}

export function playPopSound() {
  const vol = getVolumeMultiplier();
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(380, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.09);

  const maxGain = 0.35 * vol;
  gain.gain.setValueAtTime(maxGain, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.09);
}

export function playToggleSound() {
  const vol = getVolumeMultiplier();
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(620, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.06);

  const maxGain = 0.28 * vol;
  gain.gain.setValueAtTime(maxGain, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

export function playToastSound() {
  const vol = getVolumeMultiplier();
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(659.25, now);
  osc1.frequency.setValueAtTime(880, now + 0.06);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1046.5, now + 0.12);

  const maxGain = 0.26 * vol;
  gain.gain.setValueAtTime(maxGain, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.12);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.24);
}

export function playSuccessSound() {
  const vol = getVolumeMultiplier();
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.04);

    const maxGain = 0.24 * vol;
    gain.gain.setValueAtTime(maxGain, now + i * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.04);
    osc.stop(now + i * 0.04 + 0.16);
  });
}
