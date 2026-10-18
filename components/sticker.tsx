import { Tape } from "@/components/ink/tape";
import { cn } from "@/lib/cn";

// Spec 6.6: a scrap of paper taped to the page, holding one hand-traced
// logo. 60px on phones, 80px from md.
export function stickerClasses(className?: string): string {
  return cn("paper relative grid size-15 place-items-center text-ink md:size-20", className);
}

/** The strip of tape across a sticker's top edge. */
export function StickerTape() {
  return <Tape className="-top-2.5 left-1/2 h-5 w-12 -ml-6 md:w-14 md:-ml-7" style={{ rotate: "4deg" }} />;
}
