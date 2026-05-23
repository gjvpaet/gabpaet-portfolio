import { FILES, FILE_ORDER, type FileEntry, type FileId } from "@/content/files";

export function getFileByRoute(pathname: string): FileEntry | undefined {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return Object.values(FILES).find((f) => f.route === normalized);
}

export function getFileById(id: FileId): FileEntry {
  return FILES[id];
}

export function getOrderedFiles(): FileEntry[] {
  return FILE_ORDER.map((id) => FILES[id]);
}

export function getVisibleFiles(): FileEntry[] {
  return getOrderedFiles().filter((f) => !f.hidden);
}

export const ICON_TEXT: Record<FileEntry["icon"], string> = {
  md: "M↓",
  rs: "Rs",
  ts: "Ts",
  go: "Go",
  json: "{ }",
  sh: "Sh",
};
