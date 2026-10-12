"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { siClaude, siDocker, siNextdotjs, siNodedotjs, siPostgresql, type SimpleIcon } from "simple-icons";

import { BrandIcon } from "@/components/brand-icon";
import { stickerClasses, type StickerFill } from "@/components/sticker";
import { cn } from "@/lib/cn";
import { z } from "@/lib/z";

type StickerSpec = {
  key: string;
  fill: StickerFill;
  rotate: number;
  /** Desktop position on the board, in % of its width/height. */
  at: { left: number; top: number };
} & ({ icon: SimpleIcon } | { keycap: true });

// Spec 6.4: neighbours never share a fill.
const STICKERS: StickerSpec[] = [
  { key: "claude", icon: siClaude, fill: "mint", rotate: -8, at: { left: 4, top: 6 } },
  { key: "next", icon: siNextdotjs, fill: "surface", rotate: 6, at: { left: 40, top: 0 } },
  { key: "keycap", keycap: true, fill: "ink", rotate: -4, at: { left: 72, top: 12 } },
  { key: "node", icon: siNodedotjs, fill: "yellow", rotate: 10, at: { left: 12, top: 44 } },
  { key: "postgres", icon: siPostgresql, fill: "surface", rotate: -6, at: { left: 46, top: 38 } },
  { key: "docker", icon: siDocker, fill: "mint", rotate: 4, at: { left: 70, top: 64 } },
];

const FINE_POINTER = "(pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Spec 5 + 6.4. Desktop (md+): a loose cluster on a bounded board, draggable
// with a mouse or trackpad and springing home on release. Touch screens and
// reduced motion get static stickers, so dragging never fights scrolling.
export function StickerBoard({ tools }: { tools: string }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
  const canDrag = finePointer && !reduce;

  return (
    <div ref={boardRef} className="relative flex flex-wrap gap-4 md:block md:h-[420px]">
      <p className="sr-only">{tools}</p>
      {STICKERS.map((s, i) => (
        <motion.span
          key={s.key}
          aria-hidden="true"
          drag={canDrag}
          dragConstraints={boardRef}
          dragElastic={0.2}
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
          whileDrag={{ scale: 1.06, rotate: 0, zIndex: z.stickerDragging }}
          style={{
            rotate: s.rotate,
            zIndex: z.sticker,
            // Board position (md+) and entrance stagger, read by CSS.
            ...({ "--left": `${s.at.left}%`, "--top": `${s.at.top}%`, "--i": i } as Record<string, string | number>),
          }}
          className={stickerClasses(
            s.fill,
            cn(
              "sticker-drop select-none md:absolute md:top-[var(--top)] md:left-[var(--left)]",
              canDrag && "sticker-grab",
            ),
          )}
        >
          {"icon" in s ? (
            <BrandIcon icon={s.icon} decorative className="pointer-events-none size-8 md:size-11" />
          ) : (
            <span className="pointer-events-none font-mono text-xl font-semibold md:text-[1.75rem]">&gt;_</span>
          )}
        </motion.span>
      ))}
    </div>
  );
}
