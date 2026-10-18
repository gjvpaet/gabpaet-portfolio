import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { ink } from "@/lib/ink";

const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

// Shared stroke for every drawn shape on this napkin.
const line = "ink-draw fill-none stroke-current";

// The Portfolio v1 napkin (spec 8.2): a code-editor window with a file tree,
// tabs, a few lines of "code" and the ⌘K palette floating over it.
export function PortfolioV1Napkin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      role="img"
      aria-label="Rough sketch of a code editor window: a file tree on the left, tabs along the top, lines of text and a command palette box in the middle."
      className={cn("block h-auto w-full overflow-visible text-ink", className)}
    >
      <text x="12" y="30" className="font-hand fill-current text-[22px] font-semibold">
        a portfolio that&apos;s a code editor?
      </text>
      <rect x="40" y="52" width="360" height="220" rx="6" pathLength={1} strokeWidth={2.4} className={cn(line, "ink-a")} style={d(0.1)} />
      {/* Never a perfectly straight line under a filter: its bounding box has
          zero height (or width), so the filter region clips it away. A slight
          bow is truer to a hand-drawn line anyway. */}
      <g strokeWidth={2} strokeLinecap="round">
        <path d="M40 76 Q 220 78, 400 75" pathLength={1} className={cn(line, "ink-b")} style={d(0.4)} />
        <path d="M120 76 Q 122 174, 119 272" pathLength={1} className={cn(line, "ink-a")} style={d(0.5)} />
        <rect x="128" y="82" width="64" height="18" rx="2" className="fill-wash" />
        <rect x="128" y="82" width="64" height="18" rx="2" pathLength={1} className={cn(line, "ink-b")} style={d(0.6)} />
        <rect x="196" y="82" width="64" height="18" rx="2" pathLength={1} className={cn(line, "ink-a")} style={d(0.7)} />
      </g>
      <g strokeWidth={1.8} strokeLinecap="round" className="text-ink-soft">
        {[
          "M52 98 L104 98",
          "M60 114 L100 114",
          "M60 130 L94 130",
          "M52 146 L104 146",
          "M140 124 L330 124",
          "M140 140 L296 140",
          "M140 156 L318 156",
        ].map((path, i) => (
          <path key={path} d={path} pathLength={1} className={line} style={d(0.8 + i * 0.08)} />
        ))}
      </g>
      <rect x="200" y="182" width="140" height="44" rx="6" pathLength={1} strokeWidth={2.2} className={cn(line, "ink-b fill-sheet")} style={d(1.4)} />
      <text x="214" y="210" className="font-hand fill-current text-[16px] font-semibold">
        ⌘K
      </text>
      <path d="M248 204 L326 204" pathLength={1} strokeWidth={1.8} strokeLinecap="round" className={cn(line, "text-ink-soft")} style={d(1.6)} />
      <g className="text-ink-soft">
        <text x="30" y="308" className="font-hand fill-current text-[17px]">
          file tree
        </text>
        <text x="282" y="308" className="font-hand fill-current text-[17px]">
          ⌘K palette
        </text>
        {[...ink.napkinV1Tree.strokes, ...ink.napkinV1Palette.strokes].map((path, i) => (
          <path
            key={path}
            d={path}
            pathLength={1}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={line}
            style={d(1.8 + i * 0.3)}
          />
        ))}
      </g>
    </svg>
  );
}
