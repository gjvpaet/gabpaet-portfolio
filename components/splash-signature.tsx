"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { signature } from "@/lib/signature";
import { SPLASH_HOLD_MS, SPLASH_LIFT_MS, SPLASH_SIGN_MS } from "@/lib/splash";

/** The pen touches down this long after first paint (s). */
const SIGN_START = 0.15;
const SIGN_DRAW = SPLASH_SIGN_MS / 1000 - SIGN_START;
const TOTAL_LENGTH = signature.strokes.reduce((sum, s) => sum + s.length, 0);

// Each stroke starts where the previous one ends and gets a share of the
// signing time in proportion to its length, so the pen moves at an even pace.
const STROKES = signature.strokes.reduce<Array<{ d: string; delay: number; duration: number }>>((acc, s) => {
  const prev = acc.at(-1);
  const delay = prev ? prev.delay + prev.duration : SIGN_START;
  acc.push({ d: s.d, delay, duration: (SIGN_DRAW * s.length) / TOTAL_LENGTH });
  return acc;
}, []);

// The splash (spec 6.15): a sheet of paper, the pen signs Gabriel's
// signature (lib/signature.ts) stroke by stroke and holds it a beat. Then
// the signature becomes the logo: the paper fades to the hero underneath
// while the signature shrinks and glides into the nav's "gp" mark, whose
// ring draws in as it lands. The lift waits for the last
// stroke to finish (not a fixed timer, which cut the signature short when
// the first paint was slow), with a fallback in case it never reports. The
// exit is still called "lift" in code. A
// short intro, not a loading screen: the page renders under it from the
// first paint, and any input skips it.
export function SplashSignature() {
  const [phase, setPhase] = useState<"sign" | "lift" | "gone">("sign");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastStroke = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("splash")) {
      setPhase("gone");
      return;
    }

    // Where the signature flies: the centre of the nav's "gp" mark, scaled
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
      <svg ref={svgRef} viewBox={signature.viewBox} className="splash-signature text-pen" focusable="false">
        {STROKES.map((s, i) => (
          <path
            key={s.d}
            ref={i === STROKES.length - 1 ? lastStroke : undefined}
            d={s.d}
            pathLength={1}
            strokeWidth={signature.strokeWidth}
            className="splash-stroke"
            style={{ "--d": `${s.delay}s`, "--dur": `${s.duration}s` } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
