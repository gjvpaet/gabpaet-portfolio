"use client";

import { X } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useIsPresent,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { useEffect, useRef } from "react";

import { CardIcon } from "@/components/notebook/card-icon";
import { useCardBody } from "@/components/notebook/desk-context";
import { CARD_TITLES, type CardId } from "@/lib/notebook";

/** How far (px) a downward swipe on the grab bar must go to close the sheet. */
const SWIPE_DISTANCE = 100;
/** Or how fast (px/s) it must be going when it is let go. */
const SWIPE_SPEED = 500;

/**
 * Where the panel comes from and goes to, for both enter and exit: its own
 * height plus its bottom offset (5.25rem plus max(0.75rem, the bottom
 * inset), so 8rem covers insets up to 2rem and more), so it starts and ends
 * fully below the screen's edge, never over the dock. No env() here: Motion
 * mixes calc() strings term by term, so an env() term would survive at rest.
 * Both ends share one template so they mix cleanly.
 */
const OFF_SCREEN = "calc(100% + 8rem)";
const ON_SCREEN = "calc(0% + 0rem)";

// Hands focus back once a panel leaves, but only if focus is still in that
// panel or on nothing (<body>), and not on a swap, where the new panel takes
// focus itself. What had focus before it opened gets it back; if that was
// <body>, or is gone, the card's dock button takes it, as on the desk.
function handBack(panel: HTMLElement | null, before: Element | null, card: CardId) {
  const now = document.activeElement;
  const mine = now === null || now === document.body || (panel?.contains(now) ?? false);
  const swapped = Array.from(document.querySelectorAll("[data-sheet-live]")).some((n) => n !== panel);
  if (!mine || swapped) return;
  const back =
    before instanceof HTMLElement && before !== document.body && before.isConnected && !before.closest("[data-sheet]")
      ? before
      : document.querySelector<HTMLElement>(`[data-card="${card}"]`);
  back?.focus({ preventScroll: true });
}

// The phone's bottom sheet (notebook spec 6): under 768px a card opens here
// instead of on the desk. It sits just above the dock, which stays usable
// (tapping another tab swaps the sheet). It closes with ×, a swipe down on
// the grab bar, Esc, or a tap on the bare desk (notebook.tsx). Focus moves
// to its close button and returns where it was (or to its dock button).
export function Sheet({ card, onClose }: { card: CardId | null; onClose: () => void }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <AnimatePresence>
      {card ? <Panel key={card} card={card} onClose={onClose} reduce={reduce} /> : null}
    </AnimatePresence>
  );
}

function Panel({ card, onClose, reduce }: { card: CardId; onClose: () => void; reduce: boolean }) {
  const body = useCardBody(card);
  const controls = useDragControls();
  const panel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const before = useRef<Element | null>(null);
  const close = useRef(onClose);
  // False while AnimatePresence plays this panel's exit (a close, or a swap
  // to another card, where the old panel lingers beside the new one).
  const present = useIsPresent();
  const title = CARD_TITLES[card];

  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  // Focus goes to the close button on open, and back (handBack) as soon as
  // the panel stops being present: `inert` blurs the × then, and focus
  // would otherwise sit on <body> for the whole exit. Unmounting hands it
  // back too, in case nothing else did.
  useEffect(() => {
    const node = panel.current;
    before.current = document.activeElement;
    closeButton.current?.focus({ preventScroll: true });
    return () => handBack(node, before.current, card);
  }, [card]);

  useEffect(() => {
    if (!present) handBack(panel.current, before.current, card);
  }, [present, card]);

  // Esc closes only the live panel, never one that is on its way out (its
  // onClose is stale: it would close the wrong card). One Esc does one
  // thing, innermost first: the desk's card put-away (notebook.tsx; there
  // are no desk cards on phones, so listening in the capture phase cannot
  // jump ahead of it), this sheet, the pencil (desk-pencil.tsx), then the
  // tour (tour.tsx). It skips a press already taken and marks the one it
  // takes, so the pencil and the tour leave it alone.
  useEffect(() => {
    if (!present) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      close.current();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [present]);

  // The section slides in and out; the paper inside it is what a swipe
  // drags. They are two elements because Motion's drag adds pixels to the
  // value at rest, which must stay a number, while the slide needs calc().
  // Height: at most 70% of the screen, and never taller than the room
  // between the dock (the bottom offset) and the toolbar (its top offset
  // plus its 3.5rem), less a 0.75rem gap. The paper's vh max-height stands
  // in where dvh is unknown (the height is then dropped and the panel fits
  // its body).
  return (
    <motion.section
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`sheet-${card}-h`}
      data-sheet=""
      data-sheet-live={present ? "" : undefined}
      inert={!present}
      initial={reduce ? { opacity: 0 } : { y: OFF_SCREEN }}
      animate={reduce ? { opacity: 1 } : { y: ON_SCREEN }}
      exit={reduce ? { opacity: 0 } : { y: OFF_SCREEN }}
      transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-2 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))_+_5.25rem)] z-[var(--z-desk-sheet)] h-[min(70dvh,calc(100dvh_-_max(0.75rem,env(safe-area-inset-bottom))_-_5.25rem_-_max(0.75rem,env(safe-area-inset-top))_-_3.5rem_-_0.75rem))] print:hidden${present ? "" : " pointer-events-none"}`}
    >
      <motion.div
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 1 }}
        onDragEnd={(_, info: PanInfo) => {
          // An exiting panel's onClose is stale: it would close the new card.
          if (!present) return;
          if (info.offset.y > SWIPE_DISTANCE || info.velocity.y > SWIPE_SPEED) close.current();
        }}
        className="flex h-full max-h-[calc(100vh_-_11rem)] flex-col rounded-control border-2 border-ink bg-sheet shadow-lift"
      >
        <div
          aria-hidden="true"
          onPointerDown={(e) => controls.start(e)}
          className="grid h-7 shrink-0 cursor-grab touch-none place-items-center"
        >
          <span className="h-1 w-10 rounded-full bg-ink/30" />
        </div>
        <header className="mx-5 flex items-center gap-2.5 border-b-2 border-ink pb-1.5">
          <CardIcon id={card} />
          <h2 id={`sheet-${card}-h`} className="flex-1 text-[1.1875rem] leading-tight font-bold">
            {title}
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={() => close.current()}
            aria-label={`Put away ${title}`}
            className="group -mr-1 grid size-11 cursor-pointer place-items-center"
          >
            <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-sheet text-ink group-hover:bg-wash">
              <X aria-hidden="true" size={16} weight="bold" />
            </span>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-6">{body}</div>
      </motion.div>
    </motion.section>
  );
}
