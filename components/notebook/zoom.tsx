"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { useReactFlow, useViewport } from "@xyflow/react";
import { useReducedMotion } from "motion/react";
import { useCallback } from "react";

import { EASE_OUT, ZOOM, clampZoom, zoomLabel } from "@/lib/notebook";

const BUTTON =
  "grid size-11 cursor-pointer place-items-center rounded-control text-ink hover:bg-wash aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-transparent";

/** Zooms the desk by `step` (±ZOOM.step), clamped to its range; does
    nothing at a limit. Shared by the zoom buttons and the desk's +/- keys. */
export function useZoomBy() {
  const flow = useReactFlow();
  const reduce = useReducedMotion();
  return useCallback(
    (step: number) => {
      const { zoom } = flow.getViewport();
      const next = clampZoom(zoom + step);
      if (Math.abs(next - zoom) < 0.001) return;
      void flow.zoomTo(next, { duration: reduce ? 0 : 200, ease: EASE_OUT });
    },
    [flow, reduce],
  );
}

// Zoom controls, desktop only (notebook spec 4): −, the zoom in whole
// percent, +, in steps of 0.1 within the desk's range. Below lg (a portrait
// tablet) the full-width dock reaches the corner, so the control sits above
// it. At a limit the button is aria-disabled, not disabled, so it keeps
// focus; the readout is a plain span, not a live region that would announce
// every wheel frame.
export function Zoom() {
  const { zoom } = useViewport();
  const zoomBy = useZoomBy();
  const atMin = zoom <= ZOOM.min + 0.001;
  const atMax = zoom >= ZOOM.max - 0.001;

  return (
    <div
      role="group"
      aria-label="Zoom"
      className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[var(--z-desk-ui)] flex items-center rounded-control border-2 border-ink bg-sheet p-0.5 md:max-lg:bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))_+_5.75rem)] print:hidden"
    >
      <button
        type="button"
        aria-label="Zoom out"
        aria-disabled={atMin}
        onClick={() => zoomBy(-ZOOM.step)}
        className={BUTTON}
      >
        <Minus aria-hidden="true" size={16} weight="bold" />
      </button>
      <span className="w-12 text-center text-sm font-semibold tabular-nums">{zoomLabel(zoom)}</span>
      <button
        type="button"
        aria-label="Zoom in"
        aria-disabled={atMax}
        onClick={() => zoomBy(ZOOM.step)}
        className={BUTTON}
      >
        <Plus aria-hidden="true" size={16} weight="bold" />
      </button>
    </div>
  );
}
