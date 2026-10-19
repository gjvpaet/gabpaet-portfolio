import { audio, filter } from "@/lib/sound";

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
let ctx: AudioContext | null = null;
let voice: { source: AudioBufferSourceNode; sheen: BiquadFilterNode; level: GainNode } | null = null;
let restTimer: ReturnType<typeof setTimeout> | undefined;

/** A new stroke starts when the hand turns further than this (radians, about 55deg). */
const TURN = 0.95;
/** How far (px) the hand travels before its heading counts, so jitter does not. */
const HEADING_PX = 6;
/** The current stroke: where its heading was last measured, its last two
    headings, and when it began. */
let stroke: { x: number; y: number; headings: number[]; start: number; settle: number } | null = null;

// Freeze a parameter where it is now, so a new shape can start from there.
function hold(param: AudioParam, at: number) {
  if (typeof param.cancelAndHoldAtTime === "function") {
    param.cancelAndHoldAtTime(at);
  } else {
    const value = param.value;
    param.cancelScheduledValues(at);
    param.setValueAtTime(value, at);
  }
}

/** The eraser: three rubs, back and forth, each a little lighter. */
const RUBS = [1, 0.8, 0.55];
const RUB_S = 0.11;
const RUB_GAP_S = 0.025;
const ERASE_LOUDNESS = 0.07;

// One knock of wood on the desk: a click of noise rung through a narrow
// band (the pencil's body) over a short low thump (the desk).
function tap(context: AudioContext, grain: AudioBuffer, at: number, pitch: number, loudness: number) {
  const level = context.createGain();
  level.gain.setValueAtTime(0, at);
  level.gain.linearRampToValueAtTime(loudness, at + 0.002);
  level.gain.setTargetAtTime(0, at + 0.002, 0.012);
  level.connect(context.destination);

  const click = context.createBufferSource();
  click.buffer = grain;
  click.connect(filter(context, "bandpass", pitch, 5)).connect(level);
  click.start(at, Math.random() * 2.5);
  click.stop(at + 0.12);

  const thump = context.createOscillator();
  thump.frequency.setValueAtTime(pitch / 9, at);
  thump.frequency.exponentialRampToValueAtTime(pitch / 14, at + 0.05);
  const thumpLevel = context.createGain();
  thumpLevel.gain.setValueAtTime(0, at);
  thumpLevel.gain.linearRampToValueAtTime(loudness * 0.06, at + 0.003);
  thumpLevel.gain.setTargetAtTime(0, at + 0.003, 0.015);
  thump.connect(thumpLevel).connect(context.destination);
  thump.start(at);
  thump.stop(at + 0.12);
}

// A short brush of graphite: the pencil's high band, swelling and gone.
function slide(context: AudioContext, grain: AudioBuffer, at: number, length: number, loudness: number) {
  const level = context.createGain();
  level.gain.setValueAtTime(0, at);
  level.gain.linearRampToValueAtTime(loudness, at + length * 0.4);
  level.gain.linearRampToValueAtTime(0, at + length);
  level.connect(context.destination);
  const source = context.createBufferSource();
  source.buffer = grain;
  source.connect(filter(context, "highpass", 2500)).connect(filter(context, "lowpass", 12000)).connect(level);
  source.start(at, Math.random() * 2.5);
  source.stop(at + length + 0.02);
}

// The pencil's voice: looping noise through the graphite (900Hz up, a +5dB
// sheen at 11.5kHz 1.2 octaves wide, rolled off past 15kHz) and the body (a
// wide band, Q 0.7, around 550Hz, 12dB up), into a level that starts silent.
function graphite(context: AudioContext, grain: AudioBuffer) {
  const source = context.createBufferSource();
  source.buffer = grain;
  source.loop = true;
  const level = context.createGain();
  level.gain.value = 0;

  const sheen = filter(context, "highpass", 900);
  source
    .connect(sheen)
    .connect(filter(context, "peaking", 11500, 1.17, 5))
    .connect(filter(context, "lowpass", 15000))
    .connect(level);

  const body = context.createGain();
  body.gain.value = 4;
  source.connect(filter(context, "bandpass", 550, 0.7)).connect(body).connect(level);

  level.connect(context.destination);
  return { source, sheen, level };
}

/** A check mark: a short stroke down, then a longer, quicker one up. */
const CHECK_STROKES = [
  { at: 0, length: 0.05, peak: 0.6 },
  { at: 0.065, length: 0.11, peak: 1 },
];
const CHECK_LOUDNESS = 0.06;

export const pencilSound = {
  /** Picking the pencil up: it slides off the desk, then a light, high tick
      as it leaves the wood. About 0.1s. */
  pickUp() {
    const a = audio();
    if (!a) return;
    const at = a.context.currentTime + 0.01;
    slide(a.context, a.grain, at, 0.07, 0.03);
    tap(a.context, a.grain, at + 0.06, 2900, 0.7);
  },

  /** Putting it down: "tk-tok" as one end lands and then the other, then a
      little rattle as it rolls to a stop. About 0.25s. */
  putDown() {
    const a = audio();
    if (!a) return;
    const at = a.context.currentTime + 0.01;
    tap(a.context, a.grain, at, 2100, 0.5);
    tap(a.context, a.grain, at + 0.065, 1700, 0.65);
    [0.13, 0.17, 0.2].forEach((after, i) => tap(a.context, a.grain, at + after, 2500, 0.18 - i * 0.05));
  },

  /** Pencil touches the paper. */
  start() {
    const a = audio();
    if (!a) return;
    pencilSound.stop();
    ctx = a.context;

    const { source, sheen, level } = graphite(ctx, a.grain);
    source.start(0, Math.random() * 2.5);
    voice = { source, sheen, level };
  },

  /** Pencil moved to (`x`, `y`) at `speed` px per ms, `pressure` 0 to 1
      (0.5 for a mouse). Each stroke sounds like a stroke of the check mark
      (`check()`): when the hand turns a corner (a new stroke of a letter or a
      scribble) the sound dips, swells past the hand's level and settles,
      while the graphite brightens; a long stroke eases down to 60%. Between
      corners it follows the speed. */
  move(speed: number, pressure: number, x: number, y: number) {
    if (!ctx || !voice) return;
    const now = ctx.currentTime;
    // Strokes are timed on the page clock: the audio clock stands still
    // while the context is still waking up.
    const wall = performance.now() / 1000;
    const pace = Math.min(speed / FULL_SPEED, 1);
    const target = LOUDNESS * pace ** 0.7 * (0.6 + pressure * 0.8);

    let turned = false;
    if (!stroke) {
      stroke = { x, y, headings: [], start: wall, settle: 0 };
      turned = true;
    } else if (Math.hypot(x - stroke.x, y - stroke.y) >= HEADING_PX) {
      // Against the heading two steps back: a sharp corner often falls
      // across two samples, half the turn in each, while a gentle curve
      // (the loop of an "o") still stays under the threshold.
      const heading = Math.atan2(y - stroke.y, x - stroke.x);
      const before = stroke.headings[0];
      if (before !== undefined) {
        let turn = Math.abs(heading - before);
        if (turn > Math.PI) turn = 2 * Math.PI - turn;
        turned = turn > TURN && wall - stroke.start > 0.04;
      }
      stroke.headings = turned ? [] : [...stroke.headings, heading].slice(-2);
      stroke.x = x;
      stroke.y = y;
    }

    const { level, sheen } = voice;
    if (turned) {
      stroke.start = wall;
      stroke.settle = wall + 0.045;
      hold(level.gain, now);
      level.gain.linearRampToValueAtTime(target * 0.15, now + 0.012);
      level.gain.linearRampToValueAtTime(target * 1.2, now + 0.045);
      level.gain.setTargetAtTime(target * 0.7, now + 0.045, 0.08);
      hold(sheen.frequency, now);
      sheen.frequency.linearRampToValueAtTime(1000, now + 0.012);
      sheen.frequency.linearRampToValueAtTime(750, now + 0.11);
    } else if (wall >= stroke.settle) {
      const age = wall - stroke.start;
      level.gain.setTargetAtTime(target * (0.6 + 0.4 * Math.exp(-age / 0.12)), now, 0.03);
    }

    // No move events while the hand holds still: go quiet after a beat.
    clearTimeout(restTimer);
    restTimer = setTimeout(pencilSound.rest, 70);
  },

  /** Pencil paused on the paper: fade to silence but keep the voice. */
  rest() {
    // Moving again after a pause starts a fresh stroke.
    stroke = null;
    if (!ctx || !voice) return;
    voice.level.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
  },

  /** Erase: a rubber eraser scrubbing the page, duller and lower than the
      pencil (band-pass 1 to 1.5kHz, nothing past 4kHz, a rubbery body at
      280Hz). The band slides up on one rub and down on the next, so the
      strokes read as back and forth. About 0.4s. */
  erase() {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const source = context.createBufferSource();
    source.buffer = grain;
    source.loop = true;
    const level = context.createGain();
    level.gain.value = 0;

    const band = filter(context, "bandpass", 1200, 0.8);
    source.connect(band).connect(filter(context, "lowpass", 4000)).connect(level);
    const body = context.createGain();
    body.gain.value = 2;
    source.connect(filter(context, "bandpass", 280, 1)).connect(body).connect(level);
    level.connect(context.destination);

    const t0 = context.currentTime + 0.01;
    RUBS.forEach((weight, i) => {
      const t = t0 + i * (RUB_S + RUB_GAP_S);
      const [from, to] = i % 2 ? [1500, 1000] : [1000, 1500];
      level.gain.setValueAtTime(0, t);
      level.gain.linearRampToValueAtTime(ERASE_LOUDNESS * weight, t + RUB_S * 0.3);
      level.gain.setTargetAtTime(0, t + RUB_S * 0.65, RUB_S * 0.2);
      band.frequency.setValueAtTime(from, t);
      band.frequency.linearRampToValueAtTime(to, t + RUB_S);
    });
    source.start(t0, Math.random() * 2.5);
    source.stop(t0 + RUBS.length * (RUB_S + RUB_GAP_S) + 0.15);
  },

  /** Ticking something off (Copy email): the pencil draws a quick check
      mark, two strokes about 0.18s in all. Call `prepare()` first, inside the
      click, if the tick itself only plays after an await. */
  check() {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const { source, sheen, level } = graphite(context, grain);
    const t0 = context.currentTime + 0.01;
    for (const stroke of CHECK_STROKES) {
      const t = t0 + stroke.at;
      level.gain.setValueAtTime(0, t);
      level.gain.linearRampToValueAtTime(CHECK_LOUDNESS * stroke.peak, t + stroke.length * 0.35);
      level.gain.linearRampToValueAtTime(0, t + stroke.length);
      // Each stroke speeds up as it goes, so the graphite opens a little.
      sheen.frequency.setValueAtTime(1000, t);
      sheen.frequency.linearRampToValueAtTime(750, t + stroke.length);
    }
    const end = CHECK_STROKES.at(-1)!;
    source.start(t0, Math.random() * 2.5);
    source.stop(t0 + end.at + end.length + 0.05);
  },

  /** Wake the audio inside a user gesture, for a sound that follows later. */
  prepare() {
    audio();
  },

  /** Pencil lifted. */
  stop() {
    clearTimeout(restTimer);
    stroke = null;
    if (!ctx || !voice) return;
    const { source, level } = voice;
    voice = null;
    level.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    source.stop(ctx.currentTime + 0.2);
  },
};
