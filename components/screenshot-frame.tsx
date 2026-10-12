import Image from "next/image";

import type { Screenshot } from "@/content/projects";
import { cn } from "@/lib/cn";

// Spec 6.10. The frame reserves its aspect ratio so images never shift layout.
// Captions sit under the frame, never on the image.
export function ScreenshotFrame({
  shot,
  sizes,
  priority = false,
  caption,
  className,
}: {
  shot: Screenshot;
  sizes: string;
  priority?: boolean;
  caption?: string;
  className?: string;
}) {
  const frame = (
    <div
      className={cn(
        "relative max-w-full overflow-hidden rounded-card border-3 border-ink bg-surface shadow-brut-md",
        shot.kind === "phone" ? "aspect-[9/19.5]" : "aspect-[16/10]",
        !caption && className,
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    </div>
  );

  if (!caption) return frame;

  return (
    <figure className={cn("grid gap-3", className)}>
      {frame}
      <figcaption className="type-body-sm text-ink-muted">{caption}</figcaption>
    </figure>
  );
}
