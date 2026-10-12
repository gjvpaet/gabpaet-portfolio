import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = {
  /** "current" is the mint card for the role Gabriel holds now. */
  variant?: "default" | "current";
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

// Spec 6.3. Static card: no press physics (clickable tiles add `press`).
export function Card({ variant = "default", as: Tag = "div", children, className }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-card border-3 border-ink p-6 shadow-brut-md md:p-7",
        variant === "current" ? "tone-accent bg-mint" : "bg-surface",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
