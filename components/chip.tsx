import { ChatCircleDots } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

// Spec 6.2. A tech chip is a static label (no shadow, no press).
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "type-chip inline-flex h-7 items-center whitespace-nowrap rounded-pill border-2 border-ink bg-surface px-2.5 text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ChipList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

// The availability chip: the page's one eyebrow.
export function StatusChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "tone-accent inline-flex h-[34px] w-fit items-center gap-2 rounded-pill border-2 border-ink bg-yellow px-3.5",
        "text-sm font-semibold shadow-brut-sm",
        className,
      )}
    >
      <ChatCircleDots aria-hidden="true" size={18} weight="bold" />
      {children}
    </span>
  );
}
