"use client";

import Link from "next/link";

import { FILES } from "@/content/files";
import { useTabs } from "@/context/tabs-provider";
import { FileIcon } from "./file-icon";

export function Tabs() {
  const { openTabs, activeId, closeTab } = useTabs();

  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="tabs flex flex-shrink-0 overflow-x-auto border-b border-[var(--border)] bg-[var(--side)] [&::-webkit-scrollbar]:h-0"
    >
      {openTabs.map((id) => {
        const file = FILES[id];
        if (!file) return null;
        const isActive = id === activeId;

        return (
          <div
            key={id}
            className={[
              "tab group relative flex flex-shrink-0 select-none items-center border-r border-[var(--border)] text-[12.5px] transition-colors",
              isActive
                ? "bg-[var(--bg)] text-[var(--fg-bright)]"
                : "text-[var(--fg-dim)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[var(--accent)]"
              />
            )}
            <Link
              href={file.route}
              aria-current={isActive ? "page" : undefined}
              className="flex items-center gap-2 py-2.5 pl-3.5"
            >
              <FileIcon icon={file.icon} />
              <span className="leading-none">{file.name}</span>
            </Link>
            <button
              type="button"
              onClick={() => closeTab(id)}
              aria-label={`Close ${file.name}`}
              className="tab-close ml-1.5 mr-3.5 inline-flex h-4 w-4 items-center justify-center rounded-[3px] text-[14px] leading-none text-[var(--fg-dim)] transition-colors hover:bg-white/10 hover:text-[var(--fg-bright)]"
            >
              {isActive ? (
                <>
                  <span
                    aria-hidden="true"
                    className="tab-close-dot inline-block h-[7px] w-[7px] rounded-full bg-[var(--accent)] group-hover:hidden group-focus-within:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="tab-close-x hidden group-hover:inline group-focus-within:inline"
                  >
                    ×
                  </span>
                </>
              ) : (
                <span aria-hidden="true">×</span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
