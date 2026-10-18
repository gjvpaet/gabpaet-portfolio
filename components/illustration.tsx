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
  nap: { w: 2579, h: 1047, layers: ["ink", "pen"] },
} satisfies Record<string, { w: number; h: number; layers: Layer[] }>;

export type IllustrationName = keyof typeof ART;

const PAINT: Record<Layer, string> = {
  fill: "bg-sheet",
  ink: "bg-ink",
  pen: "bg-pen",
};

// Spec 6.14. A div, so callers own its display and position; the layers
// stack inside it. Hovering art with a pen layer animates it
// (globals.css). Decorative unless given a label. Below-the-fold
// art skips rendering (and so fetching its masks) until it nears the
// viewport. That `content-visibility` also clips painting to its box, so it
// sits on a box larger than the art (12px each side, 24px above and below)
// with the layers inset back to the art: the bobbing plane and the drifting
// z stay whole, and the art at a 20px page gutter still fits on a phone.
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
      data-art={name}
      className={cn("illustration print:hidden", className)}
      style={{ aspectRatio: `${art.w} / ${art.h}`, ...style }}
    >
      <div className="relative size-full">
        <div className="absolute -inset-x-3 -inset-y-6 [content-visibility:auto]">
          {art.layers.map((layer) => (
            <span
              key={layer}
              className={cn("illustration-layer", `illustration-${layer}`, PAINT[layer])}
              style={{ "--art": `url(/illustrations/${name}-${layer}.svg)` } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
