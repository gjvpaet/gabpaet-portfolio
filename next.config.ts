import type { NextConfig } from "next";

// v1 URLs (one route per "file") map onto the v2 single scroll and case
// studies. permanent: true sends 308 so search engines move the ranking over.
// See docs/v2/DESIGN-SPEC.md section 13.
const V1_REDIRECTS: Array<[source: string, destination: string]> = [
  ["/about", "/#about"],
  ["/work", "/#experience"],
  ["/contact", "/#contact"],
  ["/projects/gabpaet-dev/readme", "/projects/portfolio-v1"],
  ["/projects/gabpaet-dev/page-tsx", "/projects/portfolio-v1"],
  ["/package", "/"],
  ["/zshrc", "/"],
  ["/writing", "/"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return V1_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
