import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { InkSvg, type InkTone } from "./ink-svg";

// Circles a phrase in pen (spec 6.1): the hero title. The ellipse overshoots
// its box like a quick hand-drawn loop, so the child gets breathing room.
export function InkCircle({
  children,
  tone = "pen",
  delay = 0,
  className,
}: {
  children: ReactNode;
  tone?: InkTone;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block px-[0.6em] py-[0.25em]", className)}>
      {children}
      <InkSvg
        name="circle"
        tone={tone}
        rough="b"
        delay={delay}
        stretch
        className="absolute -top-2 -left-2.5 h-[calc(100%+1rem)] w-[calc(100%+1.25rem)]"
      />
    </span>
  );
}
