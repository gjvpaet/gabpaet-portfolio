"use client";

import { CardIcon } from "@/components/notebook/card-icon";
import { cn } from "@/lib/cn";
import { CARD_IDS, CARD_TITLES, type CardId } from "@/lib/notebook";

// Under 768px six labels must fit 375px.
const PHONE_LABELS: Partial<Record<CardId, string>> = { experience: "Work" };

// The dock (notebook spec 4): one button per card. An open card's button
// takes the wash and a pen dot. Clicking opens or puts away. The full-width
// strip lets the pointer through to the desk; only the frame catches it.
export function Dock({ isOpen, onToggle }: { isOpen: (id: CardId) => boolean; onToggle: (id: CardId) => void }) {
  return (
    <nav
      aria-label="Notebook pages"
      className="pointer-events-none fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[var(--z-desk-ui)] flex justify-center print:hidden"
    >
      <ul className="pointer-events-auto flex gap-1 rounded-control border-2 border-ink bg-sheet p-1.5 max-md:w-full">
        {CARD_IDS.map((id) => {
          const open = isOpen(id);
          return (
            <li key={id} className="max-md:min-w-0 max-md:flex-1">
              <button
                type="button"
                aria-pressed={open}
                data-card={id}
                onClick={() => onToggle(id)}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center gap-1 rounded-control px-3 pt-2 pb-1.5 text-[0.8125rem] font-semibold text-ink hover:bg-wash max-md:px-0.5 max-md:text-[0.6875rem]",
                  open && "bg-wash",
                )}
              >
                <CardIcon id={id} />
                <span className="whitespace-nowrap">
                  <span className="md:hidden">{PHONE_LABELS[id] ?? CARD_TITLES[id]}</span>
                  <span className="max-md:hidden">{CARD_TITLES[id]}</span>
                </span>
                <span aria-hidden="true" className={cn("size-1 rounded-full", open ? "bg-pen" : "bg-transparent")} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
