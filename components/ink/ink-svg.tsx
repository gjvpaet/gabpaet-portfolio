import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { ink, type InkName } from "@/lib/ink";

export type InkTone = "pen" | "ink" | "soft";
export type InkRough = "a" | "b" | "c" | false;

const TONE: Record<InkTone, string> = {
  pen: "text-pen",
  ink: "text-ink",
  soft: "text-ink-soft",
};

/** Seconds between the strokes of one mark (an arrow's shaft, then its head). */
const STROKE_STAGGER = 0.35;

export type InkSvgProps = {
  name: InkName;
  tone?: InkTone;
  /** Draw in on first paint, or when the enclosing Reveal is shown. */
  draw?: boolean;
  /** Seconds before the first stroke starts drawing. */
  delay?: number;
  /** Which roughness filter (spec 4.4); false for a clean line. */
  rough?: InkRough;
  /** Override the mark's stroke width (viewBox units). */
  strokeWidth?: number;
  /** "none" stretches the mark to its box (circles, underlines, strikes). */
  stretch?: boolean;
  className?: string;
  style?: CSSProperties;
};

// One mark from lib/ink.ts as a decorative SVG (spec 6.1). Always
// aria-hidden and gone on paper: the pen layer never carries a fact.
export function InkSvg({
  name,
  tone = "pen",
  draw = true,
  delay = 0,
  rough = "a",
  strokeWidth,
  stretch = false,
  className,
  style,
}: InkSvgProps) {
  const m = ink[name];
  return (
    <svg
      viewBox={m.viewBox}
      width={stretch ? undefined : m.width}
      height={stretch ? undefined : m.height}
      preserveAspectRatio={stretch ? "none" : undefined}
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none shrink-0 overflow-visible print:hidden", TONE[tone], className)}
      style={style}
    >
      {m.strokes.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth ?? m.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(draw && "ink-draw", rough && `ink-${rough}`)}
          style={draw ? ({ "--d": `${delay + i * STROKE_STAGGER}s` } as CSSProperties) : undefined}
        />
      ))}
    </svg>
  );
}
