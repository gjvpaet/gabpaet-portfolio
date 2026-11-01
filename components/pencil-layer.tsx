"use client";

import { Eraser } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { buttonClasses } from "@/components/button";
import { Tape } from "@/components/ink/tape";
import { pencil, usePencil } from "@/lib/pencil";
import { pencilSound } from "@/lib/pencil-sound";
import { toPath, type StrokePoint } from "@/lib/stroke";

// The pencil easter egg (spec 5.2, 6.10). While the pencil is out, a layer
// over the whole document catches the pointer and draws ink strokes, with a
// soft scratch that follows the speed of the hand (lib/pencil-sound.ts); a
// pinned bar holds the way out. Doodles stay when the pencil goes down, until Erase
// or the next page. Nothing is saved.
//
// The live stroke is written straight to its <path> through a ref, so drawing
// never re-renders React; only a finished stroke lands in state.
export function PencilLayer() {
  const active = usePencil();
  const pathname = usePathname();
  const [strokes, setStrokes] = useState<string[]>([]);
  const [height, setHeight] = useState(0);
  const live = useRef<StrokePoint[] | null>(null);
  // Where and when the pointer last was, for the scratch's speed.
  const lastMove = useRef({ x: 0, y: 0, t: 0 });
  const livePath = useRef<SVGPathElement>(null);

  // A new page starts clean, with the pencil down.
  useEffect(() => {
    setStrokes([]);
    pencil.set(false);
  }, [pathname]);

  // Cover the whole document, and keep up as it grows (reveals, images).
  useEffect(() => {
    const measure = () => setHeight(document.documentElement.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  // Putting the pencil down (or leaving the page) mid-stroke silences it.
  useEffect(() => {
    if (!active) pencilSound.stop();
  }, [active]);
  // Leaving the site's pages (for /notebook, outside the route group) unmounts
  // this layer before the pathname reset can run, so put the pencil down
  // here too, quietly.
  useEffect(
    () => () => {
      pencilSound.stop();
      pencil.set(false, true);
    },
    [],
  );

  // Esc puts the pencil down.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") pencil.set(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const point = (e: ReactPointerEvent): StrokePoint => [e.pageX, e.pageY, e.pointerType === "pen" ? e.pressure : 0.5];

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    live.current = [point(e)];
    livePath.current?.setAttribute("d", toPath(live.current));
    lastMove.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    pencilSound.start();
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!live.current) return;
    live.current.push(point(e));
    livePath.current?.setAttribute("d", toPath(live.current));
    const last = lastMove.current;
    const dt = e.timeStamp - last.t;
    if (dt > 0) {
      const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
      pencilSound.move(speed, e.pointerType === "pen" ? e.pressure : 0.5, e.clientX, e.clientY);
      lastMove.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    }
  }

  function onPointerUp() {
    pencilSound.stop();
    if (!live.current) return;
    const d = toPath(live.current);
    live.current = null;
    livePath.current?.setAttribute("d", "");
    if (d) setStrokes((all) => [...all, d]);
  }

  if (!active && strokes.length === 0) return null;

  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        onPointerDown={active ? onPointerDown : undefined}
        onPointerMove={active ? onPointerMove : undefined}
        onPointerUp={active ? onPointerUp : undefined}
        onPointerCancel={active ? onPointerUp : undefined}
        className="absolute top-0 left-0 z-[var(--z-pencil)] w-full text-ink print:hidden"
        style={{
          height,
          pointerEvents: active ? "auto" : "none",
          touchAction: active ? "none" : "auto",
          cursor: active ? "crosshair" : undefined,
        }}
      >
        {strokes.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
        <path ref={livePath} fill="currentColor" />
      </svg>

      {active ? (
        <div
          role="toolbar"
          aria-label="Pencil"
          className="paper fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[var(--z-pencil)] flex -translate-x-1/2 items-center gap-3 px-4 pt-4 pb-3 print:hidden"
        >
          <Tape className="-top-3 left-1/2 h-6 w-16 -ml-8" style={{ rotate: "-3deg" }} />
          <p className="type-hand hidden whitespace-nowrap text-pen sm:block">pencil&apos;s out. draw anywhere.</p>
          {strokes.length > 0 ? (
            // Icon-only on phones, so the bar keeps a 16px gutter at 375px.
            <button
              type="button"
              onClick={() => {
                pencilSound.erase();
                setStrokes([]);
              }}
              aria-label="Erase"
              className={buttonClasses("secondary", "max-sm:w-11 max-sm:px-0", "sm")}
            >
              <Eraser aria-hidden="true" size={20} weight="bold" />
              <span className="max-sm:hidden">Erase</span>
            </button>
          ) : null}
          <button type="button" onClick={() => pencil.set(false)} className={buttonClasses("primary", undefined, "sm")}>
            Put the pencil down
          </button>
        </div>
      ) : null}
    </>
  );
}
