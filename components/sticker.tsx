import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StickerFill = "mint" | "yellow" | "surface" | "ink";

const FILLS: Record<StickerFill, string> = {
  mint: "tone-accent bg-mint",
  yellow: "tone-accent bg-yellow",
  surface: "bg-surface text-ink",
  ink: "bg-ink text-bg",
};

// Spec 6.4: an outlined tile with a hard shadow, tilted a few degrees.
// Decorative; the board around it carries a text equivalent.
export function Sticker({
  fill,
  rotate,
  children,
  className,
  style,
}: {
  fill: StickerFill;
  /** Resting tilt in degrees. */
  rotate: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ ...style, rotate: `${rotate}deg` }}
      className={cn(
        "grid size-16 place-items-center rounded-control border-3 border-ink shadow-brut-md md:size-[88px] md:shadow-brut-lg",
        FILLS[fill],
        className,
      )}
    >
      {children}
    </span>
  );
}
