import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type Layer = "fill" | "ink" | "pen";

// Traced from Gabriel's ChatGPT drawings (spec 10.3). Each layer is a
// one-colour SVG in public/illustrations, used as a CSS mask so the theme
// re-inks it: `ink` is the drawing, `pen` one element in purple, `fill` an
// opaque silhouette for art that overlaps something (the hero hand sits on
// the napkin card). `w`/`h` are the shared viewBox, which fixes the box's
// aspect ratio before anything loads.
const ART = {
  hand: { w: 937, h: 1280, layers: ["fill", "ink"] },
  cards: { w: 2616, h: 1795, layers: ["ink"] },
  lamp: { w: 1934, h: 2380, layers: ["ink", "pen"] },
  plane: { w: 1427, h: 424, layers: ["ink", "pen"] },
} satisfies Record<string, { w: number; h: number; layers: Layer[] }>;

export type IllustrationName = keyof typeof ART;

const PAINT: Record<Layer, string> = {
  fill: "bg-sheet",
  ink: "bg-ink",
  pen: "bg-pen",
};

// Spec 6.14. A div, so callers own its display and position; the layers
// stack in one grid cell. Decorative unless given a label. Below-the-fold
// art skips rendering (and so fetching its masks) until it nears the
// viewport.
export function Illustration({
  name,
  label,
  className,
  style,
}: {
  name: IllustrationName;
  /** Only for art that carries meaning; otherwise it is hidden from AT. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const art = ART[name];
  return (
    <div
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={cn("print:hidden", className)}
      style={{ aspectRatio: `${art.w} / ${art.h}`, ...style }}
    >
      <div className="grid size-full [content-visibility:auto]">
        {art.layers.map((layer) => (
          <span
            key={layer}
            className={cn("illustration-layer", PAINT[layer])}
            style={{ "--art": `url(/illustrations/${name}-${layer}.svg)` } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
