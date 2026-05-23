import type { IconKind } from "@/content/files";
import { ICON_TEXT } from "@/lib/files";

const STYLE: Record<IconKind, { bg: string; fg: string }> = {
  md: { bg: "var(--blue)", fg: "#0a1a26" },
  rs: { bg: "var(--orange)", fg: "#2a0e00" },
  ts: { bg: "#3178c6", fg: "#fff" },
  go: { bg: "#00add8", fg: "#00282e" },
  json: { bg: "var(--yellow)", fg: "#1a1100" },
  sh: { bg: "#6cc04a", fg: "#061a00" },
};

export function FileIcon({ icon }: { icon: IconKind }) {
  const { bg, fg } = STYLE[icon];
  return (
    <span
      className="inline-flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-[3px] text-[8px] font-bold leading-none"
      style={{ background: bg, color: fg }}
    >
      {ICON_TEXT[icon]}
    </span>
  );
}
