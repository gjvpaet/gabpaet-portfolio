import type { ReactNode } from "react";

import { InkSvg } from "@/components/ink/ink-svg";

// A hidden margin note (spec 5.2): a short handwritten aside that writes
// itself next to its anchor on hover or keyboard focus. Desktop only, where
// there is room beside the anchor and a pointer that hovers. Decorative: it
// never says anything the page needs.
export function HiddenNote({ note, children }: { note: string; children: ReactNode }) {
  return (
    <span className="hidden-note-host relative inline-flex">
      {children}
      <span
        aria-hidden="true"
        className="hidden-note type-hand pointer-events-none absolute top-1/2 left-full ml-3 hidden -translate-y-1/2 items-center gap-1.5 whitespace-nowrap text-pen lg:flex print:hidden"
      >
        <InkSvg name="arrowLeft" draw={false} rough="b" />
        <span>{note}</span>
      </span>
    </span>
  );
}
