import type { ReactNode } from "react";

import { InkUnderline } from "@/components/ink/ink-underline";
import { cn } from "@/lib/cn";

// Spec 6.11: a left-aligned h2, optionally with a pen underline under part
// of it, and an optional one-line intro below. No eyebrows, no numbering,
// no side-floating explainer.
export function SectionHeading({
  id,
  children,
  description,
  underline = true,
  className,
}: {
  /** Used by the section's aria-labelledby. */
  id: string;
  children: ReactNode;
  description?: ReactNode;
  underline?: boolean;
  className?: string;
}) {
  return (
    // The underline hangs 1rem below the heading box, hence the wider gap.
    <div className={cn("grid", underline ? "gap-8" : "gap-4", className)}>
      <h2 id={id} className="type-h2">
        {underline ? <InkUnderline>{children}</InkUnderline> : children}
      </h2>
      {description ? <p className="max-w-[65ch] text-ink-soft">{description}</p> : null}
    </div>
  );
}
