import { getProject, projects } from "@/content/projects";
import { OG_SIZE, renderShareCard } from "@/lib/og";

export const alt = "Project case study by Gabriel Joshua Paet";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Same card as the home page, with the project name and summary.
export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  return renderShareCard({
    title: project?.name ?? "Project",
    subtitle: project?.summary ?? "",
    chip: "Case study",
  });
}
