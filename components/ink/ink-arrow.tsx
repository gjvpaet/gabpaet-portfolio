import type { InkName } from "@/lib/ink";
import { InkSvg, type InkRough, type InkTone } from "./ink-svg";

const DIR = {
  left: "arrowLeft",
  "down-right": "arrowDownRight",
  "up-right": "arrowUpRight",
  right: "arrowRight",
  down: "arrowDown",
} as const satisfies Record<string, InkName>;

export type InkArrowDir = keyof typeof DIR;

// A hand-drawn arrow at its natural size (spec 6.1). The loop arrow under
// the how-I-build sketch is stretched, so it uses InkSvg directly.
export function InkArrow({
  dir,
  tone = "pen",
  delay = 0,
  rough = "b",
  className,
}: {
  dir: InkArrowDir;
  tone?: InkTone;
  delay?: number;
  rough?: InkRough;
  className?: string;
}) {
  return <InkSvg name={DIR[dir]} tone={tone} delay={delay} rough={rough} className={className} />;
}
