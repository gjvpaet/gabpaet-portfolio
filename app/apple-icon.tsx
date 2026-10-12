import { renderMonogram } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: full-bleed mint square. iOS rounds the corners itself,
// so an outline here would be clipped unevenly.
export default function AppleIcon() {
  return renderMonogram({ size: 180, fontSize: 76, radius: 0, border: 0 });
}
