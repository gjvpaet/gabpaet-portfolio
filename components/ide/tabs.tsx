"use client";

import Link from "next/link";
import { type MouseEvent } from "react";

import { FILES } from "@/content/files";
import { useTabs } from "@/context/tabs-provider";
import { FileIcon } from "./file-icon";

export function Tabs() {
  const { openTabs, activeId, closeTab } = useTabs();

  return (
    <div className="tabs flex flex-shrink-0 overflow-x-auto border-b border-[var(--border)] bg-[var(--side)] [&::-webkit-scrollbar]:h-0">
      {openTabs.map((id) => {
        const file = FILES[id];
        if (!file) return null;
        const isActive = id === activeId;

        const handleClose = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          closeTab(id);
        };

        return (
          <Link
            key={id}
            href={file.route}
            className={[
              "tab group relative flex flex-shrink-0 select-none items-center gap-2 border-r border-[var(--border)] px-3.5 py-2.5 text-[12.5px] transition-colors",
              isActive
                ? "bg-[var(--bg)] text-[var(--fg-bright)]"
                : "text-[var(--fg-dim)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {isActive && (
              <span className="absolute left-0 right-0 top-0 h-px bg-[var(--accent)]" />
            )}
            <FileIcon icon={file.icon} />
            <span className="leading-none">{file.name}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={handleClose}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  closeTab(id);
                }
              }}
              className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-[3px] text-[14px] leading-none text-[var(--fg-dim)] hover:bg-white/10 hover:text-[var(--fg-bright)]"
            >
              {isActive ? (
                <>
                  <span className="inline-block h-[7px] w-[7px] rounded-full bg-[var(--accent)] group-hover:hidden" />
                  <span className="hidden group-hover:inline">×</span>
                </>
              ) : (
                <span>×</span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
