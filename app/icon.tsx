import { renderIconMark } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: a handwritten "gp" in a purple pen ring (spec 13), on a paper
// tile with rounded corners so it sits in a browser tab like an app icon.
export default function Icon() {
  return renderIconMark({ size: 32, fontSize: 17, ringStroke: 9, rounded: true });
}
