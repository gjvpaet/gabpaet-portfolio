import type { MetadataRoute } from "next";

const BASE = "https://gabpaet.dev";

// v2 routes. /resume and /projects/* are added as they are built
// (docs/v2/DESIGN-SPEC.md section 13).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
