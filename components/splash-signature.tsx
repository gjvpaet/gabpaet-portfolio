"use client";

import { useEffect, useRef, useState } from "react";

import { profile } from "@/content/profile";
import { SPLASH_LIFT_MS, SPLASH_SIGN_MS } from "@/lib/splash";

// The splash (spec 6.15): a sheet of paper, the pen signs the name, the sheet
// lifts away to the hero underneath. A short intro, not a loading screen: the
// page renders under it from the first paint, any input skips it, and it is
// gone from the DOM after at most 1.25s.
//
// PLACEHOLDER signature: the name in Shantell, revealed by a left-to-right
// wipe. Swap for the traced path in lib/signature.ts once Gabriel's photo
// arrives (build checklist step 16).
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
      <p className="splash-name type-hand text-pen">{profile.shortName}</p>
    </div>
  );
}
