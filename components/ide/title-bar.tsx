"use client";

import { usePathname } from "next/navigation";

import { usePalette } from "@/context/palette-provider";
import { useSidebar } from "@/context/sidebar-provider";
import { useTweaks } from "@/context/tweaks-provider";
import { getFileByRoute } from "@/lib/files";

export function TitleBar() {
  const pathname = usePathname();
  const file = getFileByRoute(pathname);
  const { open } = usePalette();
  const sidebar = useSidebar();
  const { theme, toggleTheme } = useTweaks();

  return (
    <div className="titlebar col-span-2 row-start-1 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--side)] px-3.5 text-[12px] text-[var(--fg-dim)]">
      <button
        type="button"
        onClick={sidebar.toggle}
        aria-label="Toggle file explorer"
        aria-expanded={sidebar.isOpen}
        aria-controls="ide-sidebar"
        className="menu-toggle"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div className="dots flex gap-1.5">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f56]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#ffbd2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#27c93f]" />
      </div>
      <div className="path-label ml-3 text-[12px] text-[var(--fg)]">
        <span className="text-[var(--accent)]">~</span>/portfolio ·{" "}
        <span className="text-[var(--accent)]">{file?.name ?? ""}</span>
      </div>

      <button
        type="button"
        onClick={open}
        className="palette-trigger ml-auto flex min-w-[240px] items-center gap-2.5 rounded-[5px] border border-[var(--border)] bg-[var(--hover)] px-2.5 py-[3px] font-mono text-[11px] text-[var(--fg-dim)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
      >
        <span className="opacity-60">⌕</span>
        <span className="palette-trigger-label flex-1 text-left">
          Search files… (type to filter)
        </span>
        <kbd className="rounded-[3px] border border-[var(--border)] bg-[var(--hover)] px-1.5 py-[1px] text-[10px] text-[var(--fg-dim)]">
          ⌘K
        </kbd>
      </button>

      <div className="top-right flex items-center gap-3.5 text-[11px] text-[var(--fg-dim)]">
        <div className="item flex items-center gap-1.5">
          <span className="text-[var(--accent)]">●</span> main
        </div>
        <div className="item">UTF-8</div>
        <div className="item">LF</div>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={theme === "light"}
          title="toggle theme"
          className="theme-toggle inline-flex h-6 w-[26px] flex-shrink-0 items-center justify-center rounded-[5px] border border-[var(--border)] bg-[var(--hover)] text-[var(--fg-dim)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg-bright)]"
        >
          {theme === "light" ? (
            // sun
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[13px] w-[13px]"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            // moon
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[13px] w-[13px]"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
