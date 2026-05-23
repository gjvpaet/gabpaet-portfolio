"use client";

import { usePathname } from "next/navigation";

import { getFileByRoute } from "@/lib/files";

export function StatusBar() {
  const pathname = usePathname();
  const file = getFileByRoute(pathname);
  const lang = file?.lang ?? "";
  const spaces =
    file?.icon === "json" || file?.icon === "rs" || file?.icon === "go" ? 4 : 2;

  return (
    <div className="col-span-2 row-start-3 flex items-center gap-4 bg-[var(--accent)] px-3.5 text-[11px] font-medium text-[var(--accent-ink)]">
      <span className="flex items-center gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-[11px] w-[11px]"
        >
          <circle cx="6" cy="6" r="2" />
          <path d="M6 8v9" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M11 6h4a3 3 0 0 1 3 3v7" />
        </svg>
        main
      </span>
      <span>↑ 0 ↓ 0</span>
      <span>✓ no errors</span>
      <span>⚠ 0</span>
      <span className="ml-auto flex gap-4">
        <span>Ln 1, Col 1</span>
        <span>Spaces: {spaces}</span>
        <span>UTF-8</span>
        <span>{lang}</span>
        <span>● pasay city · @ lumora capital</span>
      </span>
    </div>
  );
}
