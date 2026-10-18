import type { CSSProperties, ElementType, ReactNode } from "react";
import { Tape } from "@/components/ink/tape";
import { cn } from "@/lib/cn";

export type TapeLayout = "top" | "top-pair" | "corners" | "none";

const TAPES: Record<Exclude<TapeLayout, "none">, Array<{ className: string; style: CSSProperties }>> = {
  top: [{ className: "-top-3 left-1/2 h-7 w-24 -ml-12", style: { rotate: "3deg" } }],
  "top-pair": [
    { className: "-top-3 left-7 h-7 w-[92px]", style: { rotate: "-7deg" } },
    { className: "-top-2.5 right-7.5 h-7 w-[84px]", style: { rotate: "6deg" } },
  ],
  corners: [
    { className: "-top-3 -left-3.5 z-[1] h-6.5 w-[84px]", style: { rotate: "-32deg" } },
    { className: "-right-4 -bottom-2.5 z-[1] h-6.5 w-[84px]", style: { rotate: "-32deg" } },
  ],
};

// Taped-in paper (spec 6.3): sheet fill, paper lift, a slight tilt and
// masking tape. Holds napkin sketches and notes. On paper (print) it lies
// flat with no shadow.
export function PaperCard({
  as: Tag = "div",
  rotate = 0,
  tape = "top-pair",
  className,
  children,
}: {
  as?: ElementType;
  /** Degrees, between -2 and 2 (spec 4.4). */
  rotate?: number;
  tape?: TapeLayout;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn("paper relative rotate-(--tilt) print:rotate-0", className)}
      style={{ "--tilt": `${rotate}deg` } as CSSProperties}
    >
      {tape !== "none" &&
        TAPES[tape].map((t, i) => <Tape key={i} className={t.className} style={t.style} />)}
      {children}
    </Tag>
  );
}
