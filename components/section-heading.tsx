import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

// Spec 6.7: a left-aligned h2 with an optional line under it.
// No eyebrows, no numbering, no side-floating explainer.
export function SectionHeading({
  id,
  children,
  description,
  className,
}: {
  /** Used by the section's aria-labelledby. */
  id: string;
  children: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", className)}>
      <h2 id={id} className="type-h2">
        {children}
      </h2>
      {description ? <p className="max-w-[65ch] text-ink-muted">{description}</p> : null}
    </div>
  );
}
