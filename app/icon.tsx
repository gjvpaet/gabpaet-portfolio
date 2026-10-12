import { renderMonogram } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: "GP" on mint, 2px ink outline, rounded 6px (spec 13).
export default function Icon() {
  return renderMonogram({ size: 32, fontSize: 14, radius: 6, border: 2 });
}
