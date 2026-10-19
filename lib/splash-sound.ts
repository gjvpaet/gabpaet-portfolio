import { graphite, hold } from "@/lib/pencil-sound";
import { audio } from "@/lib/sound";

// The splash's pencil (spec 6.15): quick back-and-forth sketching while the
// portrait is shaded in, then the pen's stroke-by-stroke writing (the same
// swelling strokes as the pencil and the copy tick, lib/pencil-sound.ts)
// while the name is written. Timed from the animations' own delays, so each
// sound sits on its stroke.
//
// Browsers only let a page play sound after the visitor has interacted with
// the site, and the splash plays on a first visit, before any input (which
// skips it). So this is best effort: it plays when the browser allows it
// (say, a visitor who came to the home page from another page of the site)
// and stays silent otherwise. Strokes already past when the audio wakes are
// skipped, never played late.

/** Level of a hatch stroke at full speed: texture under the drawing. */
const SKETCH_LOUDNESS = 0.045;
/** Level of a written stroke, as loud as the pencil's. */
const WRITE_LOUDNESS = 0.05;

type Stroke = { delay: number; duration: number };
type Voice = ReturnType<typeof graphite>;

let voices: Voice[] = [];
let stopped = false;
let woken: ReturnType<typeof audio> = null;

// The time fraction at which a CSS cubic-bezier easing has covered
// `progress` of the way.
function easedTime(x1: number, y1: number, x2: number, y2: number, progress: number) {
  const b = (a: number, c: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * c * s * s * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (b(y1, y2, mid) < progress) lo = mid;
    else hi = mid;
  }
  return b(x1, x2, (lo + hi) / 2);
}

export const splashSound = {
  /** Wake the audio as the splash appears, so it is ready (where allowed)
      by the time the portrait starts shading in; waking takes long enough
      to miss the first hatch stroke otherwise. */
  prepare() {
    woken = audio();
  },

  /** Called as the portrait starts shading in, `startedAt` on the page clock
      (ms). `shade`: the hatching's delay and length (s), its stroke count and
      easing; `name`: each written stroke's delay and length (s). */
  play(
    startedAt: number,
    shade: { delay: number; duration: number; strokes: number; ease: [number, number, number, number] },
    name: Stroke[],
  ) {
    stopped = false;
    const a = woken ?? audio();
    if (!a) return;
    const { context, grain } = a;

    const go = () => {
      if (stopped) return;
      // Page time (s since the clocks started) to audio time.
      const now = context.currentTime;
      const elapsed = (performance.now() - startedAt) / 1000;
      const at = (t: number) => now + (t - elapsed);
      const ahead = (t: number) => at(t) > now + 0.01;

      // Sketching: one brush per hatch stroke, the graphite's sheen sliding
      // up on one and down on the next, so they read as back and forth. The
      // middle strokes are the fastest (the hatching's easing) and loudest.
      const sketch = graphite(context, grain);
      voices.push(sketch);
      let end = now;
      for (let i = 0; i < shade.strokes; i++) {
        const t0 = shade.delay + shade.duration * easedTime(...shade.ease, i / shade.strokes);
        const t1 = shade.delay + shade.duration * easedTime(...shade.ease, (i + 1) / shade.strokes);
        if (!ahead(t0)) continue;
        const length = t1 - t0;
        // 1 at the easing's top speed, about 1.6 times its average.
        const pace = Math.min(1, shade.duration / shade.strokes / length / 1.6);
        const start = at(t0);
        sketch.level.gain.setValueAtTime(0, start);
        sketch.level.gain.linearRampToValueAtTime(SKETCH_LOUDNESS * (0.55 + 0.45 * pace), start + length * 0.35);
        sketch.level.gain.linearRampToValueAtTime(0, start + length * 0.95);
        const [from, to] = i % 2 ? [1100, 800] : [800, 1100];
        sketch.sheen.frequency.setValueAtTime(from, start);
        sketch.sheen.frequency.linearRampToValueAtTime(to, start + length);
        end = start + length;
      }
      sketch.source.start(now, Math.random() * 2.5);
      sketch.source.stop(end + 0.05);

      // Writing: each stroke of the name swells and settles like a pen
      // stroke (its own easing speeds up and slows down), the graphite
      // opening a little as it goes.
      const pen = graphite(context, grain);
      voices.push(pen);
      end = now;
      for (const stroke of name) {
        if (!ahead(stroke.delay)) continue;
        const start = at(stroke.delay);
        const length = stroke.duration;
        pen.level.gain.setValueAtTime(0, start);
        pen.level.gain.linearRampToValueAtTime(WRITE_LOUDNESS, start + length * 0.3);
        pen.level.gain.linearRampToValueAtTime(WRITE_LOUDNESS * 0.7, start + length * 0.8);
        pen.level.gain.linearRampToValueAtTime(0, start + length);
        pen.sheen.frequency.setValueAtTime(1000, start);
        pen.sheen.frequency.linearRampToValueAtTime(750, start + length);
        end = start + length;
      }
      pen.source.start(now, Math.random() * 2.5);
      pen.source.stop(end + 0.05);
    };

    // Not allowed yet: wait for the browser to let it run rather than asking
    // again (each refused ask logs a console warning).
    if (context.state === "running") go();
    else {
      const wake = () => {
        if (context.state !== "running") return;
        context.removeEventListener("statechange", wake);
        go();
      };
      context.addEventListener("statechange", wake);
    }
  },

  /** The splash lifted (or was skipped): hush anything still sounding. */
  stop() {
    stopped = true;
    const a = voices.length ? audio() : null;
    if (a) {
      const now = a.context.currentTime;
      for (const { source, level } of voices) {
        hold(level.gain, now);
        level.gain.setTargetAtTime(0, now, 0.02);
        try {
          source.stop(now + 0.1);
        } catch {
          // Not started (the audio never woke): nothing to stop.
        }
      }
    }
    voices = [];
  },
};
