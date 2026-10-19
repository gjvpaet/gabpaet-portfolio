"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { writtenName } from "@/lib/written-name";
import { SPLASH_HOLD_MS, SPLASH_LIFT_MS, SPLASH_PORTRAIT, SPLASH_SIGN_MS } from "@/lib/splash";

/** The pen touches down this long after first paint (s), once the portrait
    has started shading in. */
const SIGN_START = 0.3;
const SIGN_DRAW = SPLASH_SIGN_MS / 1000 - SIGN_START;
const TOTAL_LENGTH = writtenName.strokes.reduce((sum, s) => sum + s.length, 0);

// Each stroke starts where the previous one ends and gets a share of the
// signing time in proportion to its length, so the pen moves at an even pace.
const STROKES = writtenName.strokes.reduce<Array<{ d: string; delay: number; duration: number }>>((acc, s) => {
  const prev = acc.at(-1);
  const delay = prev ? prev.delay + prev.duration : SIGN_START;
  acc.push({ d: s.d, delay, duration: (SIGN_DRAW * s.length) / TOTAL_LENGTH });
  return acc;
}, []);

// The portrait's traced ink (scripts/trace-illustrations.py), and the
// pencil that shades it in: one loose zigzag of thick hatch strokes from top
// to bottom, drawn as an SVG mask over the ink.
const { w: PW, h: PH } = SPLASH_PORTRAIT;
const HATCH = Array.from({ length: 16 }, (_, i) => {
  const y = -0.06 * PH + i * 0.072 * PH;
  return i % 2 ? `${Math.round(1.06 * PW)} ${Math.round(y + 0.14 * PH)}` : `${Math.round(-0.06 * PW)} ${Math.round(y)}`;
}).join("L");

// The splash (spec 6.15): a sheet of paper, Gabriel's sketched portrait is
// shaded in by a few fast pencil hatches while the pen writes his name in
// cursive under it (lib/written-name.ts, Sacramento), stroke by stroke, and
// holds it a beat. Then the name becomes the logo: the paper and the
// portrait fade to the hero underneath while the name shrinks and glides
// into the nav's "gp" mark, whose ring draws in as it lands. The lift waits
// for the last stroke to finish (not a fixed timer, which cut the writing
// short when the first paint was slow), with a fallback in case it never
// reports. The exit is still called "lift" in code. A short intro, not a
// loading screen: the page renders under it from the first paint, and any
// input skips it.
export function SplashName() {
  const [phase, setPhase] = useState<"sign" | "lift" | "gone">("sign");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastStroke = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // The hatching waits for the portrait's ink to load (it is preloaded
  // before first paint), so it never shades in an empty page.
  const [inked, setInked] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("splash")) {
      setPhase("gone");
      return;
    }

    // Where the name flies: the centre of the nav's "gp" mark, scaled
    // to about the ring's width. Without a mark it just fades in place.
    const aim = () => {
      const svg = svgRef.current;
      const mark = document.querySelector('header a[href="/"]');
      if (!svg || !mark) return;
      const from = svg.getBoundingClientRect();
      const to = mark.getBoundingClientRect();
      if (!from.width || !to.width) return;
      svg.style.setProperty("--fly-x", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
      svg.style.setProperty("--fly-y", `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
      svg.style.setProperty("--fly-s", String((to.width * 1.1) / from.width));
    };

    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      timers.current.forEach(clearTimeout);
      aim();
      setPhase("lift");
      // The hero's pen starts drawing as the paper fades. `splash` stays on
      // <html>: it holds the nav ring's later start (globals.css), and
      // removing it mid-draw would make the ring jump.
      html.classList.remove("splash-signing");
      timers.current = [setTimeout(() => setPhase("gone"), SPLASH_LIFT_MS)];
      events.forEach((type) => window.removeEventListener(type, lift));
    };
    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    events.forEach((type) => window.addEventListener(type, lift, { passive: true }));

    const portrait = new Image();
    portrait.src = SPLASH_PORTRAIT.src;
    const ink = () => setInked(true);
    portrait.decode().then(ink, ink);
    timers.current.push(setTimeout(ink, 600));

    // Lift once the last stroke has drawn, plus a beat to see it whole.
    // `finished` also resolves if it was done before this effect ran.
    const animation = lastStroke.current?.getAnimations?.()[0];
    animation?.finished.then(() => {
      timers.current.push(setTimeout(lift, SPLASH_HOLD_MS));
    }, () => {});
    // Fallback: never hold the page longer than this.
    timers.current.push(setTimeout(lift, SPLASH_SIGN_MS + SPLASH_HOLD_MS + 1500));

    return () => {
      timers.current.forEach(clearTimeout);
      events.forEach((type) => window.removeEventListener(type, lift));
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div aria-hidden="true" data-phase={phase} className="splash-sheet print:hidden">
      <div className="splash-paper" />
      <div className="splash-art">
        <svg viewBox={`0 0 ${PW} ${PH}`} data-inked={inked || undefined} className="splash-portrait text-ink" focusable="false">
          <defs>
            <mask id="splash-hatch" maskUnits="userSpaceOnUse" x={-0.2 * PW} y={-0.2 * PH} width={1.4 * PW} height={1.4 * PH}>
              <path d={`M${HATCH}`} pathLength={1} strokeWidth={0.16 * PW} className="splash-hatch" />
            </mask>
            {/* The crop at mid-chest trails off instead of stopping hard. */}
            <linearGradient id="splash-fade-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.74" stopColor="#fff" />
              <stop offset="0.88" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="splash-fade" maskUnits="userSpaceOnUse" x="0" y="0" width={PW} height={PH}>
              <rect width={PW} height={PH} fill="url(#splash-fade-gradient)" />
            </mask>
            <mask id="splash-ink" maskUnits="userSpaceOnUse" x="0" y="0" width={PW} height={PH} style={{ maskType: "alpha" }}>
              {/* Only once it has loaded: the sheet is in every page's markup,
                  and pages without a splash should not fetch it. */}
              {inked ? <image href={SPLASH_PORTRAIT.src} width={PW} height={PH} /> : null}
            </mask>
          </defs>
          <g mask="url(#splash-hatch)">
            <g mask="url(#splash-fade)">
              <rect width={PW} height={PH} fill="currentColor" mask="url(#splash-ink)" />
            </g>
          </g>
        </svg>
        <svg ref={svgRef} viewBox={writtenName.viewBox} className="splash-name text-pen" focusable="false">
          {STROKES.map((s, i) => (
            <path
              key={s.d}
              ref={i === STROKES.length - 1 ? lastStroke : undefined}
              d={s.d}
              pathLength={1}
              strokeWidth={writtenName.strokeWidth}
              className="splash-stroke"
              style={{ "--d": `${s.delay}s`, "--dur": `${s.duration}s` } as CSSProperties}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
