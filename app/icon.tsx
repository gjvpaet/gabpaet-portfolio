import { renderIconMark } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: a handwritten "gp" in a purple pen ring, on paper (spec 13).
export default function Icon() {
  return renderIconMark({ size: 32, fontSize: 17, ringStroke: 9 });
}
