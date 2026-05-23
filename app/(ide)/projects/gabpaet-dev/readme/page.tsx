import type { Metadata } from "next";

import ProjectsReadmeBody from "@/content/projects/gabpaet-dev/readme";

export const metadata: Metadata = {
  title: "README.md",
  description: "README for gabpaet.dev — idea, stack, todo.",
};

export default function ProjectsReadmeRoute() {
  return <ProjectsReadmeBody />;
}
