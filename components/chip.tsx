import { ChatCircleDots } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

// Spec 6.9. A tech chip is a static label: thin ink outline, pill, no lift.
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "type-chip inline-flex h-6.5 items-center whitespace-nowrap rounded-pill border-[1.5px] border-ink px-3 text-ink",
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

// LEGACY: the brutalist hero's availability chip. The sketch hero drops it
// (the status moves to a contact margin note); delete in build step 8.
export function StatusChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[34px] w-fit items-center gap-2 rounded-pill bg-wash px-3.5",
        "text-sm font-semibold",
        className,
      )}
    >
      <ChatCircleDots aria-hidden="true" size={18} weight="bold" />
      {children}
    </span>
  );
}
