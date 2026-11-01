"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";
import { Tape } from "@/components/ink/tape";
import { cn } from "@/lib/cn";
import { TOUR_STORAGE_KEY } from "@/lib/notebook";

type Place = "center" | "zoom" | "dock" | "toolbar";

// Written out in full: Tailwind only generates classes it can read whole.
const PLACE: Record<Place, string> = {
  // Under the toolbar, in the empty paper above the name: centred on
  // phones (the name is centred below it), top left from md (the first view
  // opens About beside the name).
  center:
    "top-[calc(max(0.75rem,env(safe-area-inset-top))_+_4.5rem)] left-1/2 -translate-x-1/2 md:top-[calc(max(0.75rem,env(safe-area-inset-top))_+_5rem)] md:left-4 md:translate-x-0",
  // From lg up the base offset also clears the dock's right-hand buttons,
  // which this note would otherwise overlap between about 1024 and 1380px.
  zoom: "right-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))_+_5rem)] md:max-lg:bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))_+_10rem)]",
  dock: "bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))_+_6.5rem)] left-1/2 -translate-x-1/2",
  // Below the toolbar and the pencil's Erase button (desk-pencil.tsx), which
  // step 4 asks the visitor to use.
  toolbar: "top-[calc(max(0.75rem,env(safe-area-inset-top))_+_8.25rem)] left-1/2 -translate-x-1/2",
};

// VERIFY: all copy.
const STEPS: { title: string; body: string; touch: string; place: Place }[] = [
  {
    title: "This is a notebook, not a page.",
    body: "Drag the paper to move around.",
    touch: "Drag with one finger to move around.",
    place: "center",
  },
  {
    title: "Scroll or pinch to zoom.",
    body: "Fit all brings everything back into view.",
    touch: "Pinch to zoom. Fit brings everything back.",
    place: "zoom",
  },
  {
    title: "The tabs open pages.",
    body: "Drag a card by its title. × puts it away.",
    touch: "Tap a tab to read it. Swipe it down to put it away.",
    place: "dock",
  },
  {
    title: "The pencil is in the toolbar.",
    body: "Doodle anywhere on the paper. Erase clears it.",
    touch: "Doodle anywhere on the paper. Erase clears it.",
    place: "toolbar",
  },
];

// Focus is on the tour note, or on nothing (<body>).
function isTourFocus(note: HTMLElement | null) {
  const now = document.activeElement;
  return now === null || now === document.body || (note?.contains(now) ?? false);
}

// The first-visit tour (notebook spec 7): four taped notes, one at a time,
// each beside what it describes. Shown once per browser; storage that
// throws just means it shows again next time. The desk stays usable while a
// note is up. Esc skips while focus is on the note (or on nothing).
export function Tour({ desktop }: { desktop: boolean }) {
  const [step, setStep] = useState<number | null>(null);
  const note = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(TOUR_STORAGE_KEY) === "seen";
    } catch {
      // Storage blocked: show the tour.
    }
    if (!seen) setStep(0);
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "seen");
    } catch {
      // Storage blocked: it shows again next visit.
    }
    // Back to the desk, unless something else has already taken focus.
    const hand = isTourFocus(note.current);
    setStep(null);
    if (hand) document.querySelector<HTMLElement>("[data-desk]")?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (step === null) return;
    // The first note takes focus only from <body>, so a keyboard visitor
    // who has already started tabbing keeps their place. Later notes follow
    // a click inside the note, so they always take it.
    const now = document.activeElement;
    if (step > 0 || now === null || now === document.body) note.current?.focus({ preventScroll: true });
    // One Esc does one thing, innermost first: the desk's card put-away
    // (notebook.tsx), the phone sheet (sheet.tsx), the pencil
    // (desk-pencil.tsx), then this. It acts only on a press none of those
    // took, and only while focus is on the note or on nothing.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || !isTourFocus(note.current)) return;
      e.preventDefault();
      finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, finish]);

  if (step === null) return null;
  const current = STEPS[step];
  const last = step === STEPS.length - 1;
  // Phones have no zoom control to point at.
  const place = !desktop && current.place === "zoom" ? "center" : current.place;

  // Keyed by step: each step remounts the note, so its entrance replays and
  // focus moves to the new note. A non-modal dialog that takes focus, not a
  // status region: the spec moves focus to it, and a status region's change
  // is often not announced.
  return (
    <motion.div
      key={step}
      ref={note}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-h"
      aria-describedby="tour-b"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "paper fixed z-[var(--z-desk-tour)] w-[min(320px,calc(100vw_-_2rem))] px-5 pt-6 pb-4 outline-none print:hidden",
        PLACE[place],
      )}
    >
      <Tape className="-top-3 left-1/2 h-6 w-16 -ml-8" style={{ rotate: "-3deg" }} />
      <div className="flex items-center justify-between">
        <p className="type-meta text-ink-soft">
          {step + 1} of {STEPS.length}
        </p>
        <button
          type="button"
          onClick={finish}
          className="type-meta -mr-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-2 text-ink-soft underline underline-offset-4 hover:text-ink"
        >
          Skip
        </button>
      </div>
      <h2 id="tour-h" className="mt-1 text-lg leading-tight font-bold">
        {current.title}
      </h2>
      <p id="tour-b" className="mt-1.5 text-ink-soft">
        {desktop ? current.body : current.touch}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div aria-hidden="true" className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={cn("h-1.5 rounded-full", i === step ? "w-4 bg-pen" : "w-1.5 bg-ink/25")} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish() : setStep(step + 1))}
          className={buttonClasses("primary", undefined, "sm")}
        >
          {last ? "Got it" : "Next"}
        </button>
      </div>
    </motion.div>
  );
}
