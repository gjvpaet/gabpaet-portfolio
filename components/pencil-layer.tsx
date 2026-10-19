"use client";

import { Eraser } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { getStroke } from "perfect-freehand";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { buttonClasses } from "@/components/button";
import { Tape } from "@/components/ink/tape";
import { pencil, usePencil } from "@/lib/pencil";
import { pencilSound } from "@/lib/pencil-sound";

type Point = [x: number, y: number, pressure: number];

// Spec 6.10: a pencil line, tapered by perfect-freehand.
const STROKE = { size: 4.5, thinning: 0.6, smoothing: 0.5, streamline: 0.5 } as const;

// perfect-freehand returns the outline of a stroke as a polygon; this turns
// it into a smooth closed SVG path (the library's recommended helper).
function toPath(points: Point[]): string {
  const outline = getStroke(points, { ...STROKE, simulatePressure: points.every((p) => p[2] === 0.5) });
  if (outline.length < 2) return "";
  const [first, ...rest] = outline;
  let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)} Q`;
  for (let i = 0; i < rest.length; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = rest[i];
    d += `${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)} `;
  }
  return `${d}Z`;
}

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
  const live = useRef<Point[] | null>(null);
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
  useEffect(() => () => pencilSound.stop(), []);

  // Esc puts the pencil down.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") pencil.set(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const point = (e: ReactPointerEvent): Point => [e.pageX, e.pageY, e.pointerType === "pen" ? e.pressure : 0.5];

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
      pencilSound.move(speed, e.pointerType === "pen" ? e.pressure : 0.5);
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
