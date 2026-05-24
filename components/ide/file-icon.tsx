import type { IconKind } from "@/content/files";
import { ICON_TEXT } from "@/lib/files";

// Background is set inline (it's a token that auto-shifts in light mode via
// CSS vars). The glyph color lives on a class so the light-mode override in
// globals.css (`:root[data-theme="light"] .file-icon-md { color: #fff }`)
// can actually win — inline style would beat that selector.
const BG: Record<IconKind, string> = {
  md: "var(--blue)",
  rs: "var(--orange)",
  ts: "#3178c6",
  go: "#00add8",
  json: "var(--yellow)",
  sh: "#6cc04a",
};

const FG_CLASS: Record<IconKind, string> = {
  md: "file-icon-md text-[#0a1a26]",
  rs: "file-icon-rs text-[#2a0e00]",
  ts: "file-icon-ts text-white",
  go: "file-icon-go text-[#00282e]",
  json: "file-icon-json text-[#1a1100]",
  sh: "file-icon-sh text-[#061a00]",
};

export function FileIcon({ icon }: { icon: IconKind }) {
  return (
    <span
      className={`inline-flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-[3px] text-[8px] font-bold leading-none ${FG_CLASS[icon]}`}
      style={{ background: BG[icon] }}
    >
      {ICON_TEXT[icon]}
    </span>
  );
}
