import type { MetadataRoute } from "next";

/**
 * Emits /robots.txt. Allow everything; the sitemap points crawlers at the
 * canonical route list (which is itself driven by content/files.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://gabpaet.dev/sitemap.xml",
    host: "https://gabpaet.dev",
  };
}
