let audioCtx: AudioContext | null = null;
let unlocked = false;
let listening = false;

function getContext() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
}

function resumeContext() {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  unlocked = ctx.state === "running";
}

export function unlockNotificationSound() {
  if (listening || typeof window === "undefined") return;
  listening = true;

  function unlock() {
    resumeContext();
    if (!unlocked) return;
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  }

  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export function playNotificationSound() {
  if (typeof window === "undefined") return;

  const ctx = getContext();
  if (!ctx) return;

  const ring = () => {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.16, now);
    master.connect(ctx.destination);

    const notes = [
      { freq: 880, start: 0, duration: 0.14 },
      { freq: 1175, start: 0.11, duration: 0.22 },
    ];

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.freq, now + note.start);
      gain.gain.setValueAtTime(0.0001, now + note.start);
      gain.gain.exponentialRampToValueAtTime(1, now + note.start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
      osc.connect(gain).connect(master);
      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration + 0.03);
    }
  };

  if (ctx.state === "suspended") {
    void ctx.resume().then(() => {
      unlocked = ctx.state === "running";
      if (unlocked) ring();
    });
    return;
  }

  ring();
}
