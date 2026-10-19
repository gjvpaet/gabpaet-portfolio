import { audio, filter } from "@/lib/sound";

// The desk lamp's pull-cord switch (spec 6.7): a sharp plastic-and-metal
// click as the cord is pulled, a faint jingle of the bead chain, and a
// lighter click as the cord springs back. Switching off sits a little lower
// than switching on. About 0.15s. Synthesized like the pencil (lib/sound.ts).

/** Peak gain of the pull click (about -17dBFS); the rest scale from it. */
const LOUDNESS = 0.55;

// One click: a 1ms burst of noise rung through two narrow bands (the switch
// housing), with a short tock of the plastic underneath.
function click(context: AudioContext, grain: AudioBuffer, at: number, pitch: number, loudness: number) {
  const level = context.createGain();
  level.gain.setValueAtTime(0, at);
  level.gain.linearRampToValueAtTime(loudness, at + 0.001);
  level.gain.setTargetAtTime(0, at + 0.001, 0.006);
  level.connect(context.destination);

  const source = context.createBufferSource();
  source.buffer = grain;
  const housing = filter(context, "highpass", 1500);
  source.connect(housing);
  housing.connect(filter(context, "bandpass", pitch, 8)).connect(level);
  housing.connect(filter(context, "bandpass", pitch * 1.7, 6)).connect(level);
  source.start(at, Math.random() * 2.5);
  source.stop(at + 0.06);

  const tock = context.createOscillator();
  tock.frequency.value = pitch / 4;
  const tockLevel = context.createGain();
  tockLevel.gain.setValueAtTime(0, at);
  tockLevel.gain.linearRampToValueAtTime(loudness * 0.05, at + 0.001);
  tockLevel.gain.setTargetAtTime(0, at + 0.001, 0.008);
  tock.connect(tockLevel).connect(context.destination);
  tock.start(at);
  tock.stop(at + 0.06);
}

// A bead of the chain touching the next: a tiny, very high tick.
function tick(context: AudioContext, grain: AudioBuffer, at: number, pitch: number, loudness: number) {
  const level = context.createGain();
  level.gain.setValueAtTime(0, at);
  level.gain.linearRampToValueAtTime(loudness, at + 0.0005);
  level.gain.setTargetAtTime(0, at + 0.0005, 0.003);
  level.connect(context.destination);
  const source = context.createBufferSource();
  source.buffer = grain;
  source.connect(filter(context, "bandpass", pitch, 10)).connect(level);
  source.start(at, Math.random() * 2.5);
  source.stop(at + 0.03);
}

export const lampSound = {
  /** `on`: the lamp lights (light mode); off is the night page. */
  pull(on: boolean) {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const pitch = on ? 1 : 0.85;
    const at = context.currentTime + 0.005;
    click(context, grain, at, 3200 * pitch, LOUDNESS);
    [0.02, 0.045, 0.07].forEach((after, i) =>
      tick(context, grain, at + after, 6500 * pitch * (1 + i * 0.06), LOUDNESS * (0.28 - i * 0.08)),
    );
    click(context, grain, at + 0.11, 2600 * pitch, LOUDNESS * 0.75);
  },
};
