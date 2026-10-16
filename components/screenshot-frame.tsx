import Image from "next/image";
import type { CSSProperties } from "react";

import { Tape } from "@/components/ink/tape";
import type { Screenshot } from "@/content/projects";
import { cn } from "@/lib/cn";

// Spec 6.12: a real screenshot taped into the notebook. 2px ink frame,
// 12px radius, paper lift, a slight tilt and tape across two corners. The
// frame reserves its aspect ratio so images never shift layout. Captions
// sit under the frame in the pen, never on the image.
export function ScreenshotFrame({
  shot,
  sizes,
  priority = false,
  caption,
  rotate = 0,
  tape = true,
  className,
}: {
  shot: Screenshot;
  sizes: string;
  priority?: boolean;
  /** Handwritten, 8 words or fewer. */
  caption?: string;
  /** Degrees, between -1 and 1. */
  rotate?: number;
  tape?: boolean;
  className?: string;
}) {
  const frame = (
    <div
      className={cn("relative rotate-(--tilt) print:rotate-0", !caption && className)}
      style={{ "--tilt": `${rotate}deg` } as CSSProperties}
    >
      {tape && (
        <>
          <Tape className="-top-3 -left-3.5 z-[1] h-6.5 w-[84px]" style={{ rotate: "-32deg" }} />
          <Tape className="-right-4 -bottom-2.5 z-[1] h-6.5 w-[84px]" style={{ rotate: "-32deg" }} />
        </>
      )}
      <div
        className={cn(
          "relative max-w-full overflow-hidden rounded-control border-2 border-ink bg-sheet shadow-lift",
          shot.kind === "phone" ? "aspect-[9/19.5]" : "aspect-[16/10]",
        )}
      >
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );

  if (!caption) return frame;

  return (
    <figure className={cn("grid gap-5", className)}>
      {frame}
      <figcaption className="type-hand text-pen">{caption}</figcaption>
    </figure>
  );
}
