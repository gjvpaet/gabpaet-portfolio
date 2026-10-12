import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";

const BASE = "https://gabpaet.dev";

// v2 routes (docs/v2/DESIGN-SPEC.md section 13). /resume is added in step 11.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
