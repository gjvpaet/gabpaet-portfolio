import { profile } from "@/content/profile";
import { OG_SIZE, renderShareCard } from "@/lib/og";

export const alt = `${profile.name}, ${profile.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

// Prerendered at build time as a static PNG (spec 13).
export default function OpenGraphImage() {
  return renderShareCard({
    note: "hi, I'm",
    title: profile.name,
    circled: profile.role,
    subtitle: profile.location,
  });
}
