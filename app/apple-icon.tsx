import { renderIconMark } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: the same mark, full-bleed paper. iOS rounds the corners
// itself, so the ring sits well inside the edge.
export default function AppleIcon() {
  return renderIconMark({ size: 180, fontSize: 84, ringStroke: 6 });
}
