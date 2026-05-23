import type { Metadata } from "next";

import ProjectsPageTsxBody from "@/content/projects/gabpaet-dev/page-tsx";

export const metadata: Metadata = {
  title: "page.tsx",
  description: "The portfolio's own page.tsx — meta source view.",
};

export default function ProjectsPageTsxRoute() {
  return <ProjectsPageTsxBody />;
}
