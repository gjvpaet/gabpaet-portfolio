import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { InkRough, InkTone } from "./ink-svg";

const TONE: Record<InkTone, string> = { pen: "text-pen", ink: "text-ink", soft: "text-ink-soft" };

// A rough hand-drawn box around its content (spec 6.1): boxes in napkin
// sketches, the whiteboard diagram's nodes and the to-do checkboxes. The
// rect is sized in px (no viewBox) so the wobble stays even at any size.
export function InkBox({
  as: Tag = "div",
  children,
  tone = "ink",
  rough = "a",
  draw = true,
  delay = 0,
  strokeWidth = 2,
  className,
}: {
  as?: ElementType;
  children?: ReactNode;
  tone?: InkTone;
  rough?: InkRough;
  draw?: boolean;
  delay?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <Tag className={cn("relative", className)}>
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        className={cn("pointer-events-none absolute inset-0 size-full overflow-visible", TONE[tone])}
      >
        <rect
          x="1"
          y="1"
          width="100%"
          height="100%"
          rx="4"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={cn(draw && "ink-draw", rough && `ink-${rough}`)}
          style={draw ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
        />
      </svg>
    </Tag>
  );
}
