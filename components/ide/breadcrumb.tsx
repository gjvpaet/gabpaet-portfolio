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
    <nav
      aria-label="Breadcrumb"
      className="breadcrumb flex flex-shrink-0 items-center border-b border-[var(--border)] bg-[var(--bg)] px-4.5 py-[5px] text-[11px] text-[var(--fg-dim)]"
    >
      <ol className="flex items-center gap-1.5">
        {parts.map((p, i) => {
          const isLast = i === parts.length - 1;
          const isHome = p === "~";
          const accent = isLast || isHome;
          return (
            <Fragment key={`${p}-${i}`}>
              <li className="breadcrumb-crumb inline-flex items-center gap-1.5">
                <span
                  className={accent ? "text-[var(--accent)]" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {p}
                </span>
              </li>
              {!isLast && (
                <li aria-hidden="true" className="breadcrumb-sep text-[var(--fg-dim-2)]">
                  ›
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
      <span className="breadcrumb-meta ml-auto">· {file.lines} lines</span>
    </nav>
  );
}
