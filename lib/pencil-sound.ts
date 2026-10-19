// The pencil's scratch (spec 6.10), synthesized with Web Audio, so there is
// no file to load and the sound follows the hand. Fitted, third-octave by
// third-octave, to a recording of a pencil writing (within 0.8dB on average
// from 160Hz to 14kHz): a soft "shhh" rising to a sheen at 10 to 12kHz,
// over a body around 550Hz from the pencil and the desk. Its loudness flutters every few
// tens of milliseconds even mid-stroke, like graphite catching the paper.
// Louder the faster the pencil moves, silent when it stops. Only ever started
// from a pointerdown, which is the user gesture browsers need before audio.

/** Level at full speed. Kept low: it is texture, not a feature. */
const LOUDNESS = 0.05;
/** Pointer speed (px per ms) that counts as full speed. */
const FULL_SPEED = 1.4;
/** Butterworth (flat) response: Web Audio reads a low/high-pass Q in dB. */
const FLAT_Q = -3.01;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let voice: { source: AudioBufferSourceNode; sheen: BiquadFilterNode; level: GainNode } | null = null;
let restTimer: ReturnType<typeof setTimeout> | undefined;

// Three seconds of white noise whose loudness wanders between 0.45 and 1.1
// every 25 to 60ms, eased (cosine) from one level to the next.
function makeNoise(context: AudioContext): AudioBuffer {
  const rate = context.sampleRate;
  const buffer = context.createBuffer(1, rate * 3, rate);
  const data = buffer.getChannelData(0);
  let from = 1;
  let to = 1;
  let start = 0;
  let span = 1;
  for (let i = 0; i < data.length; i++) {
    if (i - start >= span) {
      from = to;
      to = 0.45 + Math.random() * 0.65;
      start = i;
      span = Math.round(rate * (0.025 + Math.random() * 0.035));
    }
    const t = (1 - Math.cos((Math.PI * (i - start)) / span)) / 2;
    data[i] = (Math.random() * 2 - 1) * (from + (to - from) * t);
  }
  return buffer;
}

function filter(context: AudioContext, type: BiquadFilterType, frequency: number, q = FLAT_Q, gain = 0) {
  const node = context.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  node.gain.value = gain;
  return node;
}

export const pencilSound = {
  /** Pencil touches the paper. */
  start() {
    if (typeof window === "undefined" || !("AudioContext" in window)) return;
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    noise ??= makeNoise(ctx);
    pencilSound.stop();

    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;
    const level = ctx.createGain();
    level.gain.value = 0;

    // The graphite: 900Hz up, a +5dB sheen at 11.5kHz (1.2 octaves wide),
    // rolled off past 15kHz.
    const sheen = filter(ctx, "highpass", 900);
    source
      .connect(sheen)
      .connect(filter(ctx, "peaking", 11500, 1.17, 5))
      .connect(filter(ctx, "lowpass", 15000))
      .connect(level);

    // The body: a wide band (Q 0.7) around 550Hz, 12dB up.
    const body = ctx.createGain();
    body.gain.value = 4;
    source.connect(filter(ctx, "bandpass", 550, 0.7)).connect(body).connect(level);

    level.connect(ctx.destination);
    source.start(0, Math.random() * 2.5);
    voice = { source, sheen, level };
  },

  /** Pencil moved: `speed` in px per ms, `pressure` 0 to 1 (0.5 for a mouse). */
  move(speed: number, pressure = 0.5) {
    if (!ctx || !voice) return;
    const pace = Math.min(speed / FULL_SPEED, 1);
    const now = ctx.currentTime;
    voice.level.gain.setTargetAtTime(LOUDNESS * pace ** 0.7 * (0.6 + pressure * 0.8), now, 0.03);
    // A quicker stroke opens up a little lower.
    voice.sheen.frequency.setTargetAtTime(1000 - pace * 300, now, 0.06);
    // No move events while the hand holds still: go quiet after a beat.
    clearTimeout(restTimer);
    restTimer = setTimeout(pencilSound.rest, 70);
  },

  /** Pencil paused on the paper: fade to silence but keep the voice. */
  rest() {
    if (!ctx || !voice) return;
    voice.level.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
  },

  /** Pencil lifted. */
  stop() {
    clearTimeout(restTimer);
    if (!ctx || !voice) return;
    const { source, level } = voice;
    voice = null;
    level.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    source.stop(ctx.currentTime + 0.2);
  },
};
