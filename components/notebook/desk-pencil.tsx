"use client";

import { Eraser } from "@phosphor-icons/react";
import { ViewportPortal, useReactFlow, useStore } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";
import { pencil, usePencil } from "@/lib/pencil";
import { pencilSound } from "@/lib/pencil-sound";
import { toPath, type StrokePoint } from "@/lib/stroke";

// The toolbar's Pencil button (toolbar.tsx).
function focusPencilButton() {
  document.querySelector<HTMLElement>('[role="toolbar"] [aria-label="Pencil"]')?.focus({ preventScroll: true });
}

// The pencil on the desk (notebook spec 8). While it is out, a press on bare
// paper (React Flow's pane, never a card) draws; points are kept in desk
// coordinates and drawn inside React Flow's viewport, so a doodle stays on
// the paper as it pans and zooms. A second pointer drops the live stroke.
// On touch screens the desk holds still while the pencil is out (put it
// down to pinch): with drag-panning off, React Flow ignores every touch
// start, pinches included. The scratch only sounds while the desk's
// Sound is on. Doodles last until Erase or leaving the page; nothing is
// saved. The live stroke is written straight to its <path>, so drawing never
// re-renders React.
export function DeskPencil({ soundOn }: { soundOn: boolean }) {
  const active = usePencil();
  const flow = useReactFlow();
  const domNode = useStore((s) => s.domNode);
  const [strokes, setStrokes] = useState<string[]>([]);
  const livePath = useRef<SVGPathElement>(null);
  const sound = useRef(soundOn);
  const eraseButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    sound.current = soundOn;
  }, [soundOn]);

  // Leaving the desk puts the pencil down, quietly.
  useEffect(
    () => () => {
      pencilSound.stop();
      pencil.set(false, true);
    },
    [],
  );

  // Esc puts the pencil down. One Esc does one thing, innermost first: the
  // desk's card put-away (notebook.tsx), the phone sheet (sheet.tsx, window
  // capture), then the pencil, then the tour (tour.tsx). Each skips a press
  // an earlier one took (defaultPrevented) and marks the press it takes.
  // This listens on document, not window: it still runs after React's
  // handlers (registered on the root at start-up), and document's bubble
  // listeners always run before window's, so the pencil comes before the
  // tour whichever of the two was registered first.
  useEffect(() => {
    if (!active) {
      pencilSound.stop();
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      // The Erase button is about to unmount with the pencil: keep focus
      // in the toolbar rather than letting it fall to <body>.
      if (document.activeElement === eraseButton.current) focusPencilButton();
      pencil.set(false, !sound.current);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    if (!active || !domNode) return;
    let live: StrokePoint[] | null = null;
    let pointerId: number | null = null;
    let last = { x: 0, y: 0, t: 0 };

    const point = (e: PointerEvent): StrokePoint => {
      const p = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY }, { snapToGrid: false });
      return [p.x, p.y, e.pointerType === "pen" ? e.pressure : 0.5];
    };
    const draw = () => livePath.current?.setAttribute("d", live ? toPath(live) : "");

    function down(e: PointerEvent) {
      if (pointerId !== null) {
        // A second pointer drops the live stroke. It does not pinch: with
        // drag-panning off React Flow ignores touch starts, so the desk
        // holds still until the pencil is put down.
        live = null;
        pointerId = null;
        draw();
        pencilSound.stop();
        return;
      }
      if (e.button !== 0 || !(e.target instanceof Element)) return;
      // Nodes are DOM descendants of the pane, so exclude them explicitly.
      if (!e.target.closest(".react-flow__pane") || e.target.closest(".react-flow__node")) return;
      // Drawing across a card must not select its text.
      e.preventDefault();
      pointerId = e.pointerId;
      live = [point(e)];
      draw();
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      if (sound.current) pencilSound.start();
    }

    function move(e: PointerEvent) {
      if (e.pointerId !== pointerId || !live) return;
      live.push(point(e));
      draw();
      const dt = e.timeStamp - last.t;
      if (dt > 0) {
        if (sound.current) {
          const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
          pencilSound.move(speed, e.pointerType === "pen" ? e.pressure : 0.5, e.clientX, e.clientY);
        }
        last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      }
    }

    function up(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      pencilSound.stop();
      const d = live ? toPath(live) : "";
      live = null;
      pointerId = null;
      draw();
      if (d) setStrokes((all) => [...all, d]);
    }

    domNode.addEventListener("pointerdown", down, true);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      domNode.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      pencilSound.stop();
      livePath.current?.setAttribute("d", "");
    };
  }, [active, domNode, flow]);

  return (
    <>
      {active || strokes.length > 0 ? (
        <ViewportPortal>
          <svg
            aria-hidden="true"
            focusable="false"
            width={1}
            height={1}
            className="pointer-events-none absolute top-0 left-0 overflow-visible text-ink print:hidden"
          >
            {strokes.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
            <path ref={livePath} fill="currentColor" />
          </svg>
        </ViewportPortal>
      ) : null}
      {active && strokes.length > 0 ? (
        <button
          ref={eraseButton}
          type="button"
          onClick={(e) => {
            if (sound.current) pencilSound.erase();
            // The button unmounts with the last stroke: hand its focus to
            // the toolbar's Pencil rather than letting it fall to <body>.
            const hadFocus = document.activeElement === e.currentTarget;
            setStrokes([]);
            if (hadFocus) focusPencilButton();
          }}
          className={buttonClasses(
            "secondary",
            "fixed top-[calc(max(0.75rem,env(safe-area-inset-top))_+_4.5rem)] left-1/2 z-[var(--z-desk-ui)] -translate-x-1/2 print:hidden",
            "sm",
          )}
        >
          <Eraser aria-hidden="true" size={20} weight="bold" />
          Erase
        </button>
      ) : null}
    </>
  );
}
