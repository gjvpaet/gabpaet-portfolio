"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { InkSvg } from "@/components/ink/ink-svg";
import { CLICK_MARKS } from "@/lib/ink";
import { pencil } from "@/lib/pencil";
import { INTERACTIVE, NATIVE } from "@/lib/pointer-targets";

type Mark = {
  id: number;
  x: number;
  y: number;
  name: (typeof CLICK_MARKS)[number];
  pen: boolean;
  rotate: number;
  /** Dropped on the sticky nav: drawn in the fixed layer, so it stays there. */
  onNav: boolean;
};

const MAX_MARKS = 6;
const MARK_LIFE_MS = 2600;
/** Half a mark's 52px box, to centre it on the pointer. */
const HALF = 26;
/** How far a mark reaches from its centre at its widest tilt (px). */
const REACH = 34;
/** A press that moves further than this (px) is a drag, not a tap. */
const TAP_SLOP = 8;
/** Never paper: controls, fields, stickers. */
const NOT_PAPER = `${INTERACTIVE}, ${NATIVE}, .sticker-drop`;
/** The site nav, the only <header> directly in <body>. */
const NAV = "body > header";

// The whole site as paper you can mark (spec 5.2). Tapping or clicking
// empty paper anywhere (not a control, field or sticker; not while the
// pencil is out, the splash is up, text is selected or the mobile menu is
// open) drops a hand-drawn star, check, scribble or burst that draws in and
// fades away. Marks sit on the page and scroll with it, like the pencil's
// doodles; one dropped on the sticky nav stays on the nav. A new page starts
// clean.
export function PaperMarks() {
  const pathname = usePathname();
  const [marks, setMarks] = useState<Mark[]>([]);
  const count = useRef(0);

  useEffect(() => {
    setMarks([]);
  }, [pathname]);

  useEffect(() => {
    // A tap, from pointer events: iOS sends no click for a tap on plain
    // paper, and by click time an onClick may already have re-rendered the
    // target away. Everything is decided at pointerdown, in the capture
    // phase (before the nav's own listener closes the menu).
    let down: { x: number; y: number; onNav: boolean } | null = null;

    const onPointerDown = (e: PointerEvent) => {
      down = null;
      if (!e.isPrimary || e.button !== 0 || pencil.get()) return;
      const target = e.target;
      if (!(target instanceof Element) || target.closest(NOT_PAPER)) return;
      // The mobile menu is open: this press closes it, or lands in it.
      if (document.querySelector(`${NAV} [aria-expanded="true"]`)) return;
      // The splash: still writing (this press will skip it), or lifting.
      if (document.documentElement.classList.contains("splash-signing") || document.querySelector(".splash-sheet")) return;
      down = { x: e.clientX, y: e.clientY, onNav: target.closest(NAV) !== null };
    };

    const onPointerUp = (e: PointerEvent) => {
      const start = down;
      down = null;
      // A drag (a sticker pulled past its edge, a press slid off a button)
      // is not a tap.
      if (!start || !e.isPrimary || Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_SLOP) return;
      // Selecting text (to copy from the résumé, say) is not a mark.
      if (window.getSelection()?.isCollapsed === false) return;

      const id = ++count.current;
      const mark: Mark = {
        id,
        x: (start.onNav ? e.clientX : e.pageX) - HALF,
        // Never past the end of the page, which would lengthen it.
        y: (start.onNav ? e.clientY : Math.min(e.pageY, document.documentElement.scrollHeight - REACH)) - HALF,
        name: CLICK_MARKS[id % CLICK_MARKS.length],
        pen: id % 2 === 1,
        rotate: ((id * 37) % 40) - 20,
        onNav: start.onNav,
      };
      setMarks((all) => [...all, mark].slice(-MAX_MARKS));
      setTimeout(() => setMarks((all) => all.filter((m) => m.id !== id)), MARK_LIFE_MS);
    };

    const onPointerCancel = () => {
      down = null;
    };

    // Ctrl-click or a long-press opened a context menu: not a tap.
    const onContextMenu = () => {
      down = null;
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("pointercancel", onPointerCancel, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("pointercancel", onPointerCancel, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
    };
  }, []);

  if (marks.length === 0) return null;

  const draw = (m: Mark) => (
    <InkSvg
      key={m.id}
      name={m.name}
      tone={m.pen ? "pen" : "ink"}
      draw={false}
      className="ink-mark absolute size-13"
      style={{ left: m.x, top: m.y, rotate: `${m.rotate}deg` }}
    />
  );
  const pageMarks = marks.filter((m) => !m.onNav);
  const navMarks = marks.filter((m) => m.onNav);

  return (
    <>
      {pageMarks.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-[var(--z-pencil)] w-full overflow-x-clip print:hidden">
          {pageMarks.map(draw)}
        </div>
      ) : null}
      {navMarks.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[var(--z-mobile-menu)] print:hidden">
          {navMarks.map(draw)}
        </div>
      ) : null}
    </>
  );
}
