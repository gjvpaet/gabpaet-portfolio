import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

// A strip of masking tape (spec 4.4). Position, size and angle come from the
// caller; the parent must be positioned.
export function Tape({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden="true" className={cn("tape print:hidden", className)} style={style} />;
}
