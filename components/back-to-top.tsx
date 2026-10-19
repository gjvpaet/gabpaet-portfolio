"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { usePencil } from "@/lib/pencil";

// Spec 6.17 (after aahil-khan.xyz): a round-cornered paper button that rises
// into the bottom-right corner of the screen once the first screen has
// scrolled away, and takes the page back to the top. No scroll listener: an
// IntersectionObserver watches a one-screen-tall marker at the top of the
// document. It stays fixed in the corner down to the very end; the footer
// keeps a strip of empty paper under its last row (FOOTER_CLEARANCE in
// footer.tsx) so the button never sits over a footer link. Hidden while the
// pencil is out (the bar owns the bottom of the screen then).
export function BackToTop() {
  const marker = useRef<HTMLDivElement>(null);
  const [far, setFar] = useState(false);
  const pencilOut = usePencil();

  useEffect(() => {
    const el = marker.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setFar(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function toTop() {
    // Smooth unless reduced motion (scroll-behavior in globals.css).
    window.scrollTo({ top: 0 });
    // Keyboard users land where they asked to go: the first link up top.
    document.querySelector<HTMLElement>('header a[href="/"]')?.focus({ preventScroll: true });
  }

  const shown = far && !pencilOut;

  return (
    <>
      <div ref={marker} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-svh w-px" />
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        title="Back to top"
        tabIndex={shown ? 0 : -1}
        aria-hidden={!shown}
        className={cn(
          "lift fixed right-[clamp(1rem,3vw,2rem)] bottom-[max(clamp(1rem,3vw,2rem),env(safe-area-inset-bottom))] z-[var(--z-nav)] grid size-11 cursor-pointer place-items-center rounded-control border-2 border-ink bg-sheet text-ink print:hidden",
          shown ? "opacity-100" : "pointer-events-none translate-y-2.5 opacity-0",
        )}
        // Inline, so it carries the lift's own transform transition too.
        style={{ transition: "transform 0.25s var(--ease-out), opacity 0.26s var(--ease-out), translate 0.26s var(--ease-out)" }}
      >
        <ArrowUp aria-hidden="true" size={22} weight="bold" />
      </button>
    </>
  );
}
