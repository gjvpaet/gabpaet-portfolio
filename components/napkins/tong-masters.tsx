import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { ink } from "@/lib/ink";

const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

// Shared stroke for every drawn shape on this napkin.
const line = "ink-draw fill-none stroke-current";

// The Tong Masters napkin (spec 7.3): the first sketch of the game. A rough
// oval table, three seats, the stock pile, a patch for melds and two pencil
// labels. One SVG, so the parts keep their places at any width.
export function TongMastersNapkin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      role="img"
      aria-label="Rough sketch of a Tong-its table: three players around an oval table, a stock pile in the middle and a spot for melds."
      className={cn("block h-auto w-full overflow-visible text-ink", className)}
    >
      <text x="12" y="30" className="font-hand fill-current text-[24px] font-semibold">
        tong-its, but online?
      </text>
      <ellipse cx="220" cy="180" rx="150" ry="82" pathLength={1} strokeWidth={2.4} className={cn(line, "ink-a")} style={d(0.1)} />
      <circle cx="220" cy="78" r="20" pathLength={1} strokeWidth={2.2} className={cn(line, "ink-b")} style={d(0.4)} />
      <circle cx="58" cy="236" r="20" pathLength={1} strokeWidth={2.2} className={cn(line, "ink-a")} style={d(0.5)} />
      <circle cx="382" cy="236" r="20" pathLength={1} strokeWidth={2.2} className={cn(line, "ink-b")} style={d(0.6)} />
      <rect x="196" y="160" width="34" height="46" rx="3" pathLength={1} strokeWidth={2} className={cn(line, "ink-a fill-sheet")} style={d(0.8)} />
      <rect x="203" y="155" width="34" height="46" rx="3" pathLength={1} strokeWidth={2} className={cn(line, "ink-b fill-sheet")} style={d(0.9)} />
      <rect x="268" y="168" width="64" height="30" rx="4" className="fill-wash" />
      <text x="276" y="189" className="font-hand fill-current text-[15px]">
        melds
      </text>
      <g className="text-ink-soft">
        <text x="22" y="122" className="font-hand fill-current text-[17px]">
          3 players
        </text>
        <text x="70" y="308" className="font-hand fill-current text-[17px]">
          draw from the stock, or fight
        </text>
        {[...ink.napkinTmSeats.strokes, ...ink.napkinTmStock.strokes].map((path, i) => (
          <path
            key={path}
            d={path}
            pathLength={1}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={line}
            style={d(1.2 + i * 0.3)}
          />
        ))}
      </g>
    </svg>
  );
}
