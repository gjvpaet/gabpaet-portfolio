// Shared Web Audio plumbing for the site's synthesized sounds (spec 6.7,
// 6.10): one AudioContext, one noise buffer and a filter helper. Nothing is
// created until the first sound is asked for, so a visitor who never draws
// or clicks the lamp never loads any of it.

/** Butterworth (flat) response: Web Audio reads a low/high-pass Q in dB. */
const FLAT_Q = -3.01;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

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

export function filter(context: AudioContext, type: BiquadFilterType, frequency: number, q = FLAT_Q, gain = 0) {
  const node = context.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  node.gain.value = gain;
  return node;
}

// The shared context and noise, made on first use. Callers only ask from a
// user gesture (a pointerdown, a click, a key), which browsers need before
// audio may play.
export function audio(): { context: AudioContext; grain: AudioBuffer } | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  noise ??= makeNoise(ctx);
  return { context: ctx, grain: noise };
}
