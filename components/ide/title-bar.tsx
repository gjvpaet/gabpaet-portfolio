"use client";

import { usePathname } from "next/navigation";
import { getFileByRoute } from "@/lib/files";
import { usePalette } from "@/context/palette-provider";

export function TitleBar() {
  const pathname = usePathname();
  const file = getFileByRoute(pathname);
  const { open } = usePalette();

  return (
    <div className="col-span-2 row-start-1 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--side)] px-3.5 text-[12px] text-[var(--fg-dim)]">
      <div className="flex gap-1.5">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f56]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#ffbd2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#27c93f]" />
      </div>
      <div className="ml-3 text-[12px] text-[var(--fg)]">
        <span className="text-[var(--accent)]">~</span>/portfolio ·{" "}
        <span className="text-[var(--accent)]">{file?.name ?? ""}</span>
      </div>

      <button
        type="button"
        onClick={open}
        className="ml-auto flex min-w-[240px] items-center gap-2.5 rounded-[5px] border border-[var(--border)] bg-white/[.03] px-2.5 py-[3px] font-mono text-[11px] text-[var(--fg-dim)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
      >
        <span className="opacity-60">⌕</span>
        <span className="flex-1 text-left">Search files… (type to filter)</span>
        <kbd className="rounded-[3px] border border-[var(--border)] bg-white/[.06] px-1.5 py-[1px] text-[10px] text-[var(--fg-dim)]">
          ⌘K
        </kbd>
      </button>

      <div className="flex gap-3.5 text-[11px] text-[var(--fg-dim)]">
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--accent)]">●</span> main
        </div>
        <div>UTF-8</div>
        <div>LF</div>
      </div>
    </div>
  );
}
