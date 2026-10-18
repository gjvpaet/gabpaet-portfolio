import { renderIconMark } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: a handwritten "gp" in a purple pen ring (spec 13). Transparent
// outside the ring, so the tab shows the circle, not a paper square.
export default function Icon() {
  return renderIconMark({ size: 32, fontSize: 17, ringStroke: 9, cutout: true });
}
