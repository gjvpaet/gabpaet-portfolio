import { Tape } from "@/components/ink/tape";
import { cn } from "@/lib/cn";

// Spec 6.6: a scrap of paper taped to the page, holding one hand-traced
// logo. Below md it fills its column in the hero's one-line row (60px at
// most); 80px from md.
export function stickerClasses(className?: string): string {
  return cn("paper relative grid aspect-square w-full place-items-center text-ink md:size-20", className);
}

/** The strip of tape across a sticker's top edge, 80% of its width. */
export function StickerTape() {
  return (
    <Tape
      className="-top-2 left-1/2 -ml-[40%] h-4 w-[80%] sm:-top-2.5 sm:h-5 md:-ml-7 md:w-14"
      style={{ rotate: "4deg" }}
    />
  );
}
