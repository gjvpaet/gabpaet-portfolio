"use client";

import { useEffect, useRef } from "react";

import { ink } from "@/lib/ink";
import { pencil } from "@/lib/pencil";
import { INTERACTIVE, NATIVE } from "@/lib/pointer-targets";

type State = "" | "link" | "text" | "native";

/** Seconds for the dot to close most of the gap to the pointer. */
const FOLLOW = 0.045;

// A colour as [r, g, b, alpha]: "#rrggbb" from a token, "rgb(a)(...)" from
// getComputedStyle.
function rgba(value: string): number[] | null {
  const v = value.trim();
  if (v.startsWith("#") && v.length === 7) {
    return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)).concat(1);
  }
  const n = v.match(/[\d.]+/g)?.map(Number);
  return n && n.length >= 3 ? [n[0], n[1], n[2], n[3] ?? 1] : null;
}

// Does this control sit on the pen's own purple (a primary button)? The
// purple ring would vanish there, so it takes the button's label colour.
function onPenPurple(control: Element): boolean {
  const root = getComputedStyle(document.documentElement);
  const purples = ["--pen", "--btn"].map((name) => rgba(root.getPropertyValue(name)));
  for (let node: Element | null = control; node; node = node.parentElement) {
    const bg = rgba(getComputedStyle(node).backgroundColor);
    if (!bg || bg[3] === 0) continue;
    return purples.some((p) => p && Math.hypot(p[0] - bg[0], p[1] - bg[1], p[2] - bg[2]) < 48);
  }
  return false;
}

// What sits under the pointer decides the cursor's shape (lib/pointer-targets.ts).
function classify(target: EventTarget | null): { state: State; caret?: number; onButton?: boolean } {
  if (!(target instanceof Element)) return { state: "" };
  if (target.closest(NATIVE)) return { state: "native" };
  const control = target.closest(INTERACTIVE);
  if (control) return { state: "link", onButton: onPenPurple(control) };
  // Text: the element holds words of its own, as the browser's I-beam does.
  const hasText = Array.from(target.childNodes).some(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
  );
  if (!hasText || target.closest("svg")) return { state: "" };
  const size = parseFloat(getComputedStyle(target).fontSize) || 16;
  return { state: "text", caret: Math.min(Math.max(size * 1.15, 14), 56) };
}

// The pen cursor (spec 5.3): on a mouse or trackpad the arrow becomes a
// small --pen dot that eases after the pointer. Over a link or button it
// draws the "gp" mark's ring around itself (in the label colour on a purple
// button); over text it becomes a caret sized to the type. Fields, stickers
// and the pencil keep the system cursor (while the pencil is out,
// everywhere).
// Position is written straight to the element each frame, never to React.
export function PenCursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;
    let last = 0;
    let shown = false;

    const place = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW);
      x += (tx - x) * k;
      y += (ty - y) * k;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        x = tx;
        y = ty;
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      place();
    };

    // While the pencil is out the whole page gets the system cursor back:
    // the crosshair over the drawing layer, and a real pointer over its bar.
    const show = (on: boolean) => {
      shown = on;
      const pen = on && !pencil.get();
      html.classList.toggle("has-pen-cursor", pen);
      el.toggleAttribute("data-on", pen);
    };

    // Only when the pointer reaches a new element: classifying reads styles.
    let under: EventTarget | null = null;
    const setState = (target: EventTarget | null) => {
      if (target === under) return;
      under = target;
      const { state, caret, onButton } = classify(target);
      if (el.dataset.state !== state) el.dataset.state = state;
      el.toggleAttribute("data-on-btn", !!onButton);
      if (caret) el.style.setProperty("--caret", `${Math.round(caret)}px`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) {
        if (shown) show(false);
        return;
      }
      tx = e.clientX;
      ty = e.clientY;
      if (!shown || still.matches) {
        // Appear where the pointer is, never slide in from a corner.
        x = tx;
        y = ty;
        place();
        if (!shown) show(true);
      } else if (!frame) {
        frame = requestAnimationFrame(tick);
      }
      setState(e.target);
    };

    // Content scrolled under a resting pointer: the browser re-sends over.
    const onOver = (e: PointerEvent) => {
      if (shown) setState(e.target);
    };
    // Out of the window: hide, and appear again where the pointer comes back.
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && shown) show(false);
    };
    const onDown = () => el.setAttribute("data-down", "");
    const onUp = () => el.removeAttribute("data-down");
    const onPencil = () => {
      if (shown) show(true);
    };
    const onFine = () => {
      if (!fine.matches) show(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onUp);
    fine.addEventListener("change", onFine);
    const unsubscribe = pencil.subscribe(onPencil);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onUp);
      fine.removeEventListener("change", onFine);
      unsubscribe();
      html.classList.remove("has-pen-cursor");
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pen-cursor print:hidden">
      <span className="pen-cursor-dot" />
      <svg viewBox={ink.ring.viewBox} className="pen-cursor-ring" focusable="false">
        <path
          d={ink.ring.strokes[0]}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
          className="ink-a"
        />
      </svg>
    </div>
  );
}
