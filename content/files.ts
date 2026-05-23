import type { ComponentType } from "react";

import AboutBody from "./about";
import WorkBody from "./work";
import ContactBody from "./contact";
import WritingBody from "./writing";
import PackageJsonBody from "./package-json";
import ZshrcBody from "./zshrc";
import ProjectsPageTsxBody from "./projects/gabpaet-dev/page-tsx";
import ProjectsReadmeBody from "./projects/gabpaet-dev/readme";

export type FileId =
  | "about.md"
  | "work.md"
  | "contact.md"
  | "writing.md"
  | "projects/gabpaet-dev/page.tsx"
  | "projects/gabpaet-dev/README.md"
  | "package.json"
  | ".zshrc";

export type IconKind = "md" | "ts" | "json" | "sh" | "rs" | "go";

export interface FileEntry {
  id: FileId;
  name: string;
  route: string;
  path: string;
  icon: IconKind;
  lang: string;
  lines: number;
  hidden?: boolean;
  Body: ComponentType;
}

export const FILES: Record<FileId, FileEntry> = {
  "about.md": {
    id: "about.md",
    name: "about.md",
    route: "/about",
    path: "~ › portfolio",
    icon: "md",
    lang: "Markdown",
    lines: 36,
    Body: AboutBody,
  },
  "work.md": {
    id: "work.md",
    name: "work.md",
    route: "/work",
    path: "~ › portfolio",
    icon: "md",
    lang: "Markdown",
    lines: 78,
    Body: WorkBody,
  },
  "contact.md": {
    id: "contact.md",
    name: "contact.md",
    route: "/contact",
    path: "~ › portfolio",
    icon: "md",
    lang: "Markdown",
    lines: 28,
    Body: ContactBody,
  },
  "writing.md": {
    id: "writing.md",
    name: "writing.md",
    route: "/writing",
    path: "~ › portfolio",
    icon: "md",
    lang: "Markdown",
    lines: 12,
    hidden: true,
    Body: WritingBody,
  },
  "projects/gabpaet-dev/page.tsx": {
    id: "projects/gabpaet-dev/page.tsx",
    name: "page.tsx",
    route: "/projects/gabpaet-dev/page-tsx",
    path: "~ › projects › gabpaet.dev",
    icon: "ts",
    lang: "TypeScript JSX",
    lines: 42,
    Body: ProjectsPageTsxBody,
  },
  "projects/gabpaet-dev/README.md": {
    id: "projects/gabpaet-dev/README.md",
    name: "README.md",
    route: "/projects/gabpaet-dev/readme",
    path: "~ › projects › gabpaet.dev",
    icon: "md",
    lang: "Markdown",
    lines: 24,
    Body: ProjectsReadmeBody,
  },
  "package.json": {
    id: "package.json",
    name: "package.json",
    route: "/package",
    path: "~ › portfolio",
    icon: "json",
    lang: "JSON",
    lines: 28,
    Body: PackageJsonBody,
  },
  ".zshrc": {
    id: ".zshrc",
    name: ".zshrc",
    route: "/zshrc",
    path: "~",
    icon: "sh",
    lang: "Shell",
    lines: 32,
    Body: ZshrcBody,
  },
};

// Order used by the sidebar and command palette.
export const FILE_ORDER: FileId[] = [
  "about.md",
  "work.md",
  "writing.md",
  "contact.md",
  "projects/gabpaet-dev/page.tsx",
  "projects/gabpaet-dev/README.md",
  "package.json",
  ".zshrc",
];

// Default open tabs on first load (matches prototype state.openTabs).
export const DEFAULT_OPEN_TABS: FileId[] = [
  "about.md",
  "work.md",
  "projects/gabpaet-dev/page.tsx",
  ".zshrc",
];
