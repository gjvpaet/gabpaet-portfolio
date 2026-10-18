import { DrawnLink } from "@/components/drawn-link";
import { HiddenNote } from "@/components/hidden-note";
import { TongMastersNapkin } from "@/components/napkins/tong-masters";
import { PaperCard } from "@/components/paper-card";
import { Reveal } from "@/components/reveal";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { SectionHeading } from "@/components/section-heading";
import { projects, type Project } from "@/content/projects";

// The featured project, told as a two-up: the napkin it started on, and the
// thing that shipped.
function NapkinVsShipped({ project }: { project: Project }) {
  const desktop = project.screenshots.find((s) => s.kind === "desktop");

  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Reveal as="figure">
        <PaperCard rotate={-1.8} tape="top" className="ink-boil px-5.5 pt-6 pb-4">
          <TongMastersNapkin />
        </PaperCard>
        <figcaption className="type-hand mt-6 text-pen">the napkin</figcaption>
      </Reveal>

      <Reveal index={1} className="min-w-0">
        {desktop ? (
          <ScreenshotFrame shot={desktop} rotate={0.8} sizes="(min-width: 1024px) 620px, 100vw" />
        ) : null}
        <p className="type-hand mt-8 text-pen">the thing that shipped</p>
        <h3 className="type-h3 mt-2">{project.name}</h3>
        <p className="mt-2 max-w-[46ch] text-ink-soft">{project.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-6">
          <DrawnLink href={`/projects/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
            Read the case study
          </DrawnLink>
          {project.playNote ? (
            <HiddenNote note={project.playNote}>
              <DrawnLink href={project.liveUrl} tone="ink" aria-label={`Play ${project.name}`}>
                Play it
              </DrawnLink>
            </HiddenNote>
          ) : (
            <DrawnLink href={project.liveUrl} tone="ink" aria-label={`Play ${project.name}`}>
              Play it
            </DrawnLink>
          )}
        </div>
      </Reveal>
    </div>
  );
}

// Smaller projects: one line each under a rule.
function ProjectRow({ project }: { project: Project }) {
  return (
    <Reveal className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t-2 border-ink pt-6">
      <p className="max-w-[60ch]">
        <strong className="font-bold">{project.name}.</strong> <span className="text-ink-soft">{project.summary}</span>
      </p>
      <div className="flex flex-wrap gap-x-6">
        <DrawnLink href={`/projects/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
          Read the case study
        </DrawnLink>
        <DrawnLink href={project.liveUrl} tone="ink" aria-label={`Visit ${project.name}`}>
          Visit {project.slug === "portfolio-v1" ? "v1" : "the site"}
        </DrawnLink>
      </div>
    </Reveal>
  );
}

// Spec 7.3: from napkin to production.
export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" aria-labelledby="projects-h" className="py-16 md:py-24">
      <Reveal>
        <SectionHeading
          id="projects-h"
          description="Every project starts as a scribble. Here's the scribble, and here's what shipped."
        >
          From napkin to production
        </SectionHeading>
      </Reveal>
      <div className="mt-14 grid gap-18">
        {featured.map((project) => (
          <NapkinVsShipped key={project.slug} project={project} />
        ))}
        {rest.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
