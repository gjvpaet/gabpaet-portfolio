import type { SimpleIcon } from "simple-icons";

import { BrandIcon } from "@/components/brand-icon";
import { InkSvg } from "@/components/ink/ink-svg";
import { cn } from "@/lib/cn";
import { CHIP_LOOPS } from "@/lib/ink";

// Spec 6.18. One Toolbox entry: a bigger chip than Chip (6.9), with the
// tool's logo when Simple Icons has one. A static label, not a control.
// `loop` circles it in pen (a tool Gabriel opens every day) with the n-th
// chip loop; hovering the chip boils the loop (`ink-boil`, globals.css).
export function ToolChip({
  name,
  icon,
  loop,
  delay = 0,
}: {
  name: string;
  icon?: SimpleIcon;
  /** Which chip loop circles it, counting across the Toolbox; omit for none. */
  loop?: number;
  /** Seconds before the loop draws in once the group reveals. */
  delay?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9.5 items-center gap-2 whitespace-nowrap rounded-pill border-[1.5px] border-ink bg-sheet pr-3.5 text-[0.9375rem] leading-none font-[550] text-ink",
        icon ? "pl-2.5" : "pl-3.5",
        loop !== undefined && "ink-boil",
      )}
    >
      {icon ? <BrandIcon icon={icon} size={18} decorative /> : null}
      {name}
      {loop !== undefined ? (
        <InkSvg
          name={CHIP_LOOPS[loop % CHIP_LOOPS.length]}
          delay={delay}
          stretch
          className="absolute -top-2.25 -left-3 h-[calc(100%+1.125rem)] w-[calc(100%+1.5rem)]"
        />
      ) : null}
    </span>
  );
}
