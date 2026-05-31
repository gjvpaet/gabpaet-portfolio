"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { FILES, FILE_ORDER, type FileId } from "@/content/files";
import { useSidebar } from "@/context/sidebar-provider";
import { FileIcon } from "./file-icon";

const PORTFOLIO_IDS: FileId[] = ["about.md", "work.md", "contact.md"];
const ROOT_IDS: FileId[] = ["package.json", ".zshrc"];
const PROJECT_IDS: FileId[] = [
  "projects/gabpaet-dev/page.tsx",
  "projects/gabpaet-dev/README.md",
];

export function Sidebar() {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const { isOpen } = useSidebar();

  const visiblePortfolio = PORTFOLIO_IDS.filter((id) => FILE_ORDER.includes(id) && !FILES[id].hidden);
  const visibleRoot = ROOT_IDS.filter((id) => !FILES[id].hidden);

  return (
    <aside
      id="ide-sidebar"
      aria-label="File explorer"
      className={`sidebar row-start-2 flex flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--side)] py-3.5 pb-5.5 ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="mb-4">
        <h2 className="flex select-none items-center gap-1.5 px-3.5 pb-1.5 text-[10.5px] font-normal uppercase tracking-[1.5px] text-[var(--fg-dim)]">
          <span aria-hidden="true" className="inline-block">▾</span> Explorer
        </h2>
      </div>

      <div className="mb-4">
        <h2 className="flex select-none items-center gap-1.5 px-3.5 pb-1.5 text-[10.5px] font-normal uppercase tracking-[1.5px] text-[var(--fg-dim)]">
          <span aria-hidden="true" className="inline-block">▾</span> portfolio
          <span aria-hidden="true" className="ml-auto text-[10px] text-[var(--fg-dim-2)]">
            {visiblePortfolio.length}
          </span>
        </h2>
        {visiblePortfolio.map((id) => (
          <SidebarItem key={id} id={id} active={pathname === FILES[id].route} />
        ))}
      </div>

      <div className="mb-4">
        <h2 className="flex select-none items-center gap-1.5 px-3.5 pb-1.5 text-[10.5px] font-normal uppercase tracking-[1.5px] text-[var(--fg-dim)]">
          <span aria-hidden="true" className="inline-block">▾</span> projects/
          <span aria-hidden="true" className="ml-auto text-[10px] text-[var(--fg-dim-2)]">
            {PROJECT_IDS.length}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setProjectsOpen((v) => !v)}
          aria-expanded={projectsOpen}
          aria-controls="sidebar-project-children"
          className="flex w-full select-none items-center gap-2.5 border-l-2 border-transparent py-[var(--side-item-pad)] pl-6 pr-3.5 text-left text-[13px] leading-[1.4] text-[var(--fg)] transition-colors hover:bg-[var(--hover)]"
        >
          <span
            aria-hidden="true"
            className="inline-block w-3 text-center text-[var(--fg-dim)] transition-transform"
            style={{ transform: projectsOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
          >
            ▾
          </span>
          <FileIcon icon="ts" />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            gabpaet.dev
          </span>
        </button>
        <div id="sidebar-project-children">
          {projectsOpen &&
            PROJECT_IDS.map((id) => (
              <SidebarItem
                key={id}
                id={id}
                active={pathname === FILES[id].route}
                indent={2}
              />
            ))}
        </div>
      </div>

      <div className="mb-4">
        {visibleRoot.map((id) => (
          <SidebarItem key={id} id={id} active={pathname === FILES[id].route} />
        ))}
      </div>

      <div className="mt-auto border-t border-[var(--border)] px-3.5 pt-3.5 text-[11px] leading-[1.7] text-[var(--fg-dim)]">
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="sidebar-pulse-dot" />
          <span className="text-[var(--orange)]">currently @ lumora</span>
        </div>
        <div className="mt-1.5">v 1.0.0 · pasay · utc+8</div>
      </div>
    </aside>
  );
}

function SidebarItem({
  id,
  active,
  indent = 0,
}: {
  id: FileId;
  active: boolean;
  indent?: number;
}) {
  const file = FILES[id];
  const paddingLeft = indent === 0 ? 24 : indent === 1 ? 38 : 52;
  return (
    <Link
      href={file.route}
      aria-current={active ? "page" : undefined}
      className={[
        "flex select-none items-center gap-2.5 border-l-2 py-[var(--side-item-pad)] pr-3.5 text-[13px] leading-[1.4] transition-colors",
        active
          ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--fg-bright)]"
          : "border-transparent text-[var(--fg)] hover:bg-[var(--hover)]",
      ].join(" ")}
      style={{ paddingLeft }}
    >
      <FileIcon icon={file.icon} />
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {file.name}
      </span>
    </Link>
  );
}
