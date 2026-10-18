"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { siClaude, siDocker, siNextdotjs, siNodedotjs, siPostgresql, type SimpleIcon } from "simple-icons";

import { BrandIcon } from "@/components/brand-icon";
import { StickerTape, stickerClasses } from "@/components/sticker";
import { cn } from "@/lib/cn";
import { z } from "@/lib/z";

type StickerSpec = {
  key: string;
  rotate: number;
  /** md+ position around the napkin card, in % of the card's width/height. */
  at: { left: number; top: number };
} & ({ icon: SimpleIcon } | { keycap: true });

// Spec 6.6: taped around the napkin card's corners and right edge, clear of
// its handwriting.
const STICKERS: StickerSpec[] = [
  { key: "claude", icon: siClaude, rotate: -8, at: { left: -12, top: -16 } },
  { key: "next", icon: siNextdotjs, rotate: 6, at: { left: 83, top: -15 } },
  { key: "keycap", keycap: true, rotate: -4, at: { left: 97, top: 24 } },
  { key: "node", icon: siNodedotjs, rotate: 10, at: { left: 94, top: 62 } },
  { key: "postgres", icon: siPostgresql, rotate: -6, at: { left: -12, top: 66 } },
  { key: "docker", icon: siDocker, rotate: 4, at: { left: 8, top: 94 } },
];

const FINE_POINTER = "(pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Spec 5.2 + 6.6. From md the stickers sit around `children` (the napkin
// card), draggable with a mouse or trackpad and springing home on release.
// Below md they are a static row above the card. Touch screens and reduced
// motion get static stickers, so dragging never fights scrolling.
export function StickerBoard({ tools, children }: { tools: string; children: ReactNode }) {
  const boundsRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
  const canDrag = finePointer && !reduce;

  return (
    <div className="relative grid gap-10 md:block">
      {/* Drag bounds: the card plus a margin all round. */}
      <div ref={boundsRef} aria-hidden="true" className="pointer-events-none absolute -inset-14 hidden md:block" />
      <p className="sr-only">{tools}</p>
      <div className="flex flex-wrap gap-4 md:contents">
        {STICKERS.map((s, i) => (
          <motion.span
            key={s.key}
            aria-hidden="true"
            drag={canDrag}
            dragConstraints={boundsRef}
            dragElastic={0.2}
            dragSnapToOrigin
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            whileDrag={{ scale: 1.06, rotate: 0, zIndex: z.stickerDragging }}
            style={{
              rotate: s.rotate,
              zIndex: z.sticker,
              // Position (md+) and entrance stagger, read by CSS.
              ...({ "--left": `${s.at.left}%`, "--top": `${s.at.top}%`, "--i": i } as Record<string, string | number>),
            }}
            className={stickerClasses(
              cn(
                "sticker-drop ink-boil select-none md:absolute md:top-(--top) md:left-(--left)",
                canDrag && "sticker-grab",
              ),
            )}
          >
            <StickerTape />
            {"icon" in s ? (
              <BrandIcon
                icon={s.icon}
                decorative
                className="sticker-logo pointer-events-none size-7 md:size-9"
              />
            ) : (
              <span className="type-hand pointer-events-none text-2xl font-semibold md:text-[1.875rem]">&gt;_</span>
            )}
          </motion.span>
        ))}
      </div>
      {children}
    </div>
  );
}
