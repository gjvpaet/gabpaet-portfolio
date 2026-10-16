import { cn } from "@/lib/cn";

// The "GP" tile used as the site mark (nav, 404). Decorative: the visible
// name next to it, or the link label, carries the meaning.
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "tone-accent grid size-10 shrink-0 place-items-center rounded-control border-3 border-ink bg-mint shadow-brut-sm",
        "text-[0.95rem] font-extrabold tracking-[-0.02em]",
        className,
      )}
    >
      GP
    </span>
  );
}
