"use client";

import { usePathname } from "next/navigation";

import { getFileByRoute } from "@/lib/files";

export function Gutter() {
  const pathname = usePathname();
  const file = getFileByRoute(pathname);
  const lines = file?.lines ?? 1;

  return (
    <div
      className="overflow-hidden border-r border-[var(--border)] bg-[var(--bg)] text-right text-[12px] leading-[1.85] text-[var(--fg-dim-2)] select-none"
      style={{ padding: "var(--gutter-pad-y) 0" }}
    >
      {Array.from({ length: Math.max(lines, 1) }, (_, i) => {
        const n = i + 1;
        const isCur = n === 1;
        return (
          <span
            key={n}
            className={[
              "block pr-3.5",
              isCur ? "text-[var(--accent)] bg-[rgba(46,229,180,0.06)]" : "",
            ].join(" ")}
          >
            {n}
          </span>
        );
      })}
    </div>
  );
}
