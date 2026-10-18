import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Highlighter swipe behind a key phrase (spec 6.1). A real <mark>, so the
// emphasis survives without CSS; in print the wash is transparent.
export function Highlight({ children, className }: { children: ReactNode; className?: string }) {
  return <mark className={cn("highlight", className)}>{children}</mark>;
}
