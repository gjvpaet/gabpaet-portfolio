"use client";

import { PencilSimple } from "@phosphor-icons/react";

import { cn } from "@/lib/cn";
import { pencil, usePencil } from "@/lib/pencil";

// The nav's pencil (spec 6.10): picks the pencil up so visitors can doodle
// anywhere on the page. Its fill turns to the highlighter wash while it is out.
export function PencilButton({ className }: { className?: string }) {
  const active = usePencil();
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label="Pick up the pencil"
      title={active ? "Put the pencil down" : "Pick up the pencil and doodle on the page"}
      onClick={() => pencil.toggle()}
      className={cn(
        "lift grid size-11 shrink-0 cursor-pointer place-items-center rounded-control border-2 border-ink text-ink",
        active ? "bg-wash" : "bg-sheet",
        className,
      )}
    >
      <PencilSimple aria-hidden="true" size={22} weight="bold" />
    </button>
  );
}
