import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { InkSvg } from "./ink-svg";

// A crossed-out first draft (spec 5.2): "Full-stack ninja" above the hero
// title. Real <s> plus visually hidden text, so screen readers hear that it
// is crossed out. The whole draft stays off paper.
export function InkStrike({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block print:hidden", className)}>
      <s className="no-underline">{children}</s>
      <span className="sr-only"> (crossed out)</span>
      <InkSvg
        name="strike"
        tone="ink"
        delay={delay}
        stretch
        className="absolute top-0.5 -left-1.5 h-full w-[calc(100%+0.75rem)]"
      />
    </span>
  );
}
