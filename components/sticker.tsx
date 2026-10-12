import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StickerFill = "mint" | "yellow" | "surface" | "ink";

const FILLS: Record<StickerFill, string> = {
  mint: "tone-accent bg-mint",
  yellow: "tone-accent bg-yellow",
  surface: "bg-surface text-ink",
  ink: "bg-ink text-bg",
};

// Spec 6.4: an outlined tile with a hard shadow. 64px on phones, 88px from md.
export function stickerClasses(fill: StickerFill, className?: string): string {
  return cn(
    "grid size-16 place-items-center rounded-control border-3 border-ink shadow-brut-md md:size-[88px] md:shadow-brut-lg",
    FILLS[fill],
    className,
  );
}

// Static sticker (404 page). The hero's draggable ones live in
// components/home/sticker-board.tsx and share stickerClasses.
export function Sticker({
  fill,
  rotate,
  children,
  className,
}: {
  fill: StickerFill;
  /** Resting tilt in degrees. */
  rotate: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden="true" style={{ rotate: `${rotate}deg` }} className={stickerClasses(fill, className)}>
      {children}
    </span>
  );
}
