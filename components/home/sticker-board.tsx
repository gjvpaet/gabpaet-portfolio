import { siClaude, siDocker, siNextdotjs, siNodedotjs, siPostgresql, type SimpleIcon } from "simple-icons";

import { BrandIcon } from "@/components/brand-icon";
import { Sticker, type StickerFill } from "@/components/sticker";

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

// Desktop (md+): a loose cluster on a bounded board. Below md: one wrapping
// row under the buttons. Static here; build step 8 makes them draggable.
export function StickerBoard({ tools }: { tools: string }) {
  return (
    <div className="relative flex flex-wrap gap-4 md:block md:h-[420px]">
      <p className="sr-only">{tools}</p>
      {STICKERS.map((s) => (
        <Sticker
          key={s.key}
          fill={s.fill}
          rotate={s.rotate}
          className="md:absolute md:left-[var(--left)] md:top-[var(--top)]"
          style={{ ["--left" as string]: `${s.at.left}%`, ["--top" as string]: `${s.at.top}%` }}
        >
          {"icon" in s ? (
            <BrandIcon icon={s.icon} decorative className="size-8 md:size-11" />
          ) : (
            <span className="font-mono text-xl font-semibold md:text-[1.75rem]">&gt;_</span>
          )}
        </Sticker>
      ))}
    </div>
  );
}
