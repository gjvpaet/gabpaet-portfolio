import type { MetadataRoute } from "next";

import { FILES, FILE_ORDER } from "@/content/files";

/**
 * Emits /sitemap.xml at build time. Source of truth is content/files.ts —
 * any FileEntry that isn't `hidden` is listed. The root path (/) is also
 * included since app/page.tsx redirects there to /about.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gabpaet.dev";
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  for (const id of FILE_ORDER) {
    const file = FILES[id];
    if (file.hidden) continue;
    routes.push({
      url: `${base}${file.route}`,
      lastModified: now,
      changeFrequency: "monthly",
      // /about is the de-facto landing page (root redirects to it).
      priority: file.route === "/about" ? 0.9 : 0.7,
    });
  }

  return routes;
}
