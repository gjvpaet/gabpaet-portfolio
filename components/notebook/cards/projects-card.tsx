import { DrawnLink } from "@/components/drawn-link";
import { projects } from "@/content/projects";

// Notebook card: Projects (notebook spec 3). One row per side project, in
// content order: the way into its case study and to the live thing.
export function ProjectsCard() {
  return (
    <ul className="grid">
      {projects.map((project) => (
        <li key={project.slug} className="grid gap-1 border-t-2 border-ink py-4 first:border-t-0 first:pt-0">
          <h3 className="text-lg leading-tight font-bold">{project.name}</h3>
          <p className="text-ink-soft">{project.summary}</p>
          <div className="flex flex-wrap gap-x-5">
            <DrawnLink href={`/projects/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
              Case study
            </DrawnLink>
            <DrawnLink href={project.liveUrl} tone="ink" aria-label={`Live: ${project.name}`}>
              Live
            </DrawnLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
