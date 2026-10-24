import type { ReactNode } from "react";
import { InkArrow } from "@/components/ink/ink-arrow";
import { cn } from "@/lib/cn";

export type MarginNoteArrow = "left" | "up-right" | "down-right" | "none";

// A handwritten note in the purple pen with an arrow at its subject
// (spec 6.2). 8 words or fewer, and never the only place a fact lives.
//
// arrow "left": the note sits in a right-hand margin column from lg and
// points back left; below lg the caller stacks it under its subject, so the
// arrow turns to point up at it.
export function MarginNote({
  children,
  arrow = "left",
  delay = 0,
  className,
}: {
  children: ReactNode;
  arrow?: MarginNoteArrow;
  delay?: number;
  className?: string;
}) {
  return (
    <p className={cn("type-hand flex items-start gap-2 text-pen print:hidden", className)}>
      {arrow === "left" && (
        <>
          <InkArrow dir="left" delay={delay} className="mt-1 hidden lg:block" />
          <InkArrow dir="up-right" delay={delay} className="-mt-2 lg:hidden" />
        </>
      )}
      {(arrow === "up-right" || arrow === "down-right") && (
        <InkArrow dir={arrow} delay={delay} className={arrow === "up-right" ? "-mt-2" : "mt-1"} />
      )}
      {/* Only the margin column is narrow; notes elsewhere stay on one line.
          Balanced, so a wrapped note never leaves one word on its last line. */}
      <span className={cn("text-balance", arrow === "left" && "max-w-[24ch]")}>{children}</span>
    </p>
  );
}
