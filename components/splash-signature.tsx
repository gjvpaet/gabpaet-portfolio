"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { signature } from "@/lib/signature";
import { SPLASH_LIFT_MS, SPLASH_SIGN_MS } from "@/lib/splash";

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
// signature (lib/signature.ts) stroke by stroke, the sheet lifts away to the
// hero underneath. A short intro, not a loading screen: the page renders
// under it from the first paint, any input skips it, and it is gone from the
// DOM after at most 1.25s.
export function SplashSignature() {
  const [phase, setPhase] = useState<"sign" | "lift" | "gone">("sign");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("splash")) {
      setPhase("gone");
      return;
    }

    const lift = () => {
      timers.current.forEach(clearTimeout);
      setPhase("lift");
      timers.current = [setTimeout(() => setPhase("gone"), SPLASH_LIFT_MS)];
      // The hero's pen waited for the sheet; let later visits draw on time.
      setTimeout(() => html.classList.remove("splash"), 4500);
      events.forEach((type) => window.removeEventListener(type, lift));
    };
    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    events.forEach((type) => window.addEventListener(type, lift, { passive: true }));
    timers.current = [setTimeout(lift, SPLASH_SIGN_MS)];

    return () => {
      timers.current.forEach(clearTimeout);
      events.forEach((type) => window.removeEventListener(type, lift));
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div aria-hidden="true" data-phase={phase} className="splash-sheet print:hidden">
      <svg viewBox={signature.viewBox} className="splash-signature text-pen" focusable="false">
        {STROKES.map((s) => (
          <path
            key={s.d}
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
