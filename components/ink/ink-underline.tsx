import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { InkSvg, type InkTone } from "./ink-svg";

const VARIANT = {
  /** Section headings: a thick pen swipe under part of the heading. */
  heading: { name: "underline", strokeWidth: 5, className: "-bottom-4 h-4 w-3/5" },
  /** The contact email: full width, just under the text. */
  full: { name: "underline", strokeWidth: 5, className: "-bottom-1.5 h-3.5 w-full" },
  /** The nav name. */
  short: { name: "underlineShort", strokeWidth: 3.5, className: "-bottom-1.5 h-2 w-full" },
} as const;

// A hand-drawn underline under its child (spec 6.1). It hangs below the
// text box, so leave at least 1.5rem under a heading that uses it. Drawn
// links use DrawnLink instead, which adds the hover boil and a 44px hit area.
export function InkUnderline({
  children,
  variant = "heading",
  tone = "pen",
  delay = 0,
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  tone?: InkTone;
  delay?: number;
  className?: string;
}) {
  const v = VARIANT[variant];
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <InkSvg
        name={v.name}
        tone={tone}
        strokeWidth={v.strokeWidth}
        delay={delay}
        stretch
        className={cn("absolute left-0", v.className)}
      />
    </span>
  );
}
