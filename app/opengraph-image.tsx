import { profile } from "@/content/profile";
import { OG_SIZE, renderShareCard } from "@/lib/og";

export const alt = `${profile.name}, ${profile.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

// Prerendered at build time as a static PNG (spec 13).
export default function OpenGraphImage() {
  return renderShareCard({
    title: profile.name,
    subtitle: `${profile.role}, ${profile.location}`,
    chip: profile.status,
  });
}
