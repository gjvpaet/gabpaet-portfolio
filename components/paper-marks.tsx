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
/** Never paper: controls, fields, stickers. */
const NOT_PAPER = `${INTERACTIVE}, ${NATIVE}, .sticker-drop`;
/** The site nav, the only <header> directly in <body>. */
const NAV = "body > header";

// The whole site as paper you can mark (spec 5.2). Clicking empty paper
// anywhere (not a control, field or sticker; not while the pencil is out,
// the splash is up, text is selected or the mobile menu is open) drops a
// hand-drawn star, check, scribble or burst that draws in and fades away.
// Marks sit on the page and scroll with it, like the pencil's doodles; one
// dropped on the sticky nav stays on the nav. A new page starts clean.
export function PaperMarks() {
  const pathname = usePathname();
  const [marks, setMarks] = useState<Mark[]>([]);
  const count = useRef(0);

  useEffect(() => {
    setMarks([]);
  }, [pathname]);

  useEffect(() => {
    // Was the mobile menu open when this click started? Then the click
    // closes it, or lands in it, and leaves no mark. Read at pointerdown, in
    // the capture phase, before the nav's own listener closes the menu.
    let menuWasOpen = false;
    const onPointerDown = () => {
      menuWasOpen = document.querySelector(`${NAV} [aria-expanded="true"]`) !== null;
    };

    const onClick = (e: MouseEvent) => {
      if (menuWasOpen || pencil.get()) return;
      // The splash: still writing, or lifting after a click skipped it.
      if (document.documentElement.classList.contains("splash-signing") || document.querySelector(".splash-sheet")) return;
      const target = e.target;
      if (!(target instanceof Element) || target.closest(NOT_PAPER)) return;
      // Selecting text (to copy from the résumé, say) is not a mark.
      if (window.getSelection()?.isCollapsed === false) return;

      const onNav = target.closest(NAV) !== null;
      const id = ++count.current;
      const mark: Mark = {
        id,
        x: (onNav ? e.clientX : e.pageX) - HALF,
        y: (onNav ? e.clientY : e.pageY) - HALF,
        name: CLICK_MARKS[id % CLICK_MARKS.length],
        pen: id % 2 === 1,
        rotate: ((id * 37) % 40) - 20,
        onNav,
      };
      setMarks((all) => [...all, mark].slice(-MAX_MARKS));
      setTimeout(() => setMarks((all) => all.filter((m) => m.id !== id)), MARK_LIFE_MS);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick);
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
  const onPage = marks.filter((m) => !m.onNav);
  const onNav = marks.filter((m) => m.onNav);

  return (
    <>
      {onPage.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-[var(--z-pencil)] w-full print:hidden">
          {onPage.map(draw)}
        </div>
      ) : null}
      {onNav.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[var(--z-mobile-menu)] print:hidden">
          {onNav.map(draw)}
        </div>
      ) : null}
    </>
  );
}
