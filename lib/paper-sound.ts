import { audio, filter } from "@/lib/sound";

// The notebook desk's paper sounds (notebook spec 9): a soft slide as a card
// is laid down or put away, and a short press as a dragged card is taped
// back down. Synthesized like the lamp and the pencil (lib/sound.ts), no
// audio files. Gabriel judges sound by ear: expect to tune these by ear.

/** Peak gain of the slide; the press scales from it. */
const LOUDNESS = 0.32;

export const paperSound = {
  /** A sheet sliding over paper: band-passed noise whose pitch falls as it
      slows, about 0.22s. `out` (putting a card away) sits a little lower. */
  slide(out = false) {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const at = context.currentTime + 0.005;
    const length = 0.22;

    const level = context.createGain();
    level.gain.setValueAtTime(0, at);
    level.gain.linearRampToValueAtTime(LOUDNESS, at + length * 0.35);
    level.gain.setTargetAtTime(0, at + length * 0.35, length * 0.22);
    level.connect(context.destination);

    const band = filter(context, "bandpass", out ? 1700 : 2300, 0.9);
    band.frequency.setValueAtTime(out ? 1700 : 2300, at);
    band.frequency.linearRampToValueAtTime(out ? 1100 : 1400, at + length);

    const source = context.createBufferSource();
    source.buffer = grain;
    source.connect(filter(context, "highpass", 500)).connect(band).connect(level);
    source.start(at, Math.random() * 2.5);
    source.stop(at + length + 0.2);
  },

  /** A card pressed back onto the desk: a low thump and a little crackle of
      tape, about 0.1s. */
  press() {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const at = context.currentTime + 0.005;

    const thump = context.createOscillator();
    thump.frequency.setValueAtTime(150, at);
    thump.frequency.exponentialRampToValueAtTime(70, at + 0.08);
    const thumpLevel = context.createGain();
    thumpLevel.gain.setValueAtTime(0, at);
    thumpLevel.gain.linearRampToValueAtTime(LOUDNESS * 0.9, at + 0.004);
    thumpLevel.gain.setTargetAtTime(0, at + 0.004, 0.025);
    thump.connect(thumpLevel).connect(context.destination);
    thump.start(at);
    thump.stop(at + 0.15);

    const crackle = context.createGain();
    crackle.gain.setValueAtTime(0, at + 0.01);
    crackle.gain.linearRampToValueAtTime(LOUDNESS * 0.35, at + 0.014);
    crackle.gain.setTargetAtTime(0, at + 0.014, 0.018);
    crackle.connect(context.destination);
    const source = context.createBufferSource();
    source.buffer = grain;
    source.connect(filter(context, "highpass", 3500)).connect(crackle);
    source.start(at + 0.01, Math.random() * 2.5);
    source.stop(at + 0.12);
  },
};
