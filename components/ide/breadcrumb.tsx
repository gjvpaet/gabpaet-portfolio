"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { getFileByRoute } from "@/lib/files";

export function Breadcrumb() {
  const pathname = usePathname();
  const file = getFileByRoute(pathname);
  if (!file) return null;

  const parts = [...file.path.split(" › "), file.name];

  return (
    <div className="flex flex-shrink-0 items-center gap-1.5 border-b border-[var(--border)] bg-[var(--bg)] px-4.5 py-[5px] text-[11px] text-[var(--fg-dim)]">
      {parts.map((p, i) => {
        const isLast = i === parts.length - 1;
        const isHome = p === "~";
        const accent = isLast || isHome;
        return (
          <Fragment key={`${p}-${i}`}>
            <span className="inline-flex items-center gap-1.5">
              <span className={accent ? "text-[var(--accent)]" : ""}>{p}</span>
            </span>
            {!isLast && <span className="text-[var(--fg-dim-2)]">›</span>}
          </Fragment>
        );
      })}
      <span className="ml-auto">· {file.lines} lines</span>
    </div>
  );
}
