import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { ChipList } from "@/components/chip";
import { Reveal } from "@/components/reveal";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { SectionHeading } from "@/components/section-heading";
import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

const TILE_CHIP_COUNT = 4;

// Stand-in until build step 9 adds real screenshots to content/projects.ts.
// Same frame and ratio, so the layout does not move when they land.
function ShotPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="grid aspect-[16/10] max-w-full place-items-center rounded-card border-3 border-ink bg-surface text-ink-muted shadow-brut-md [background-image:repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_srgb,var(--ink)_8%,transparent)_10px_11px)]"
    >
      <span className="type-meta">Screenshot</span>
    </div>
  );
}

function ProjectTile({ project }: { project: Project }) {
  const desktop = project.screenshots.find((s) => s.kind === "desktop");

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.name} case study`}
      className={cn(
        "grid h-full overflow-hidden rounded-card border-3 border-ink bg-surface no-underline",
        // Both tiles share a row height. The featured tile is the taller one; the
        // small tile gives its spare height to the media area, not the text.
        project.featured ? "press-lg grid-rows-[auto_1fr]" : "press grid-rows-[1fr_auto]",
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-end border-b-3 border-ink px-6 pt-6 md:px-7 md:pt-7",
          project.featured ? "bg-yellow" : "bg-bg",
        )}
      >
        {/* Overlaps the bottom edge of the media area by 24px. */}
        <div className={cn("-mb-6", project.featured && "-rotate-2")}>
          {desktop ? (
            <ScreenshotFrame
              shot={desktop}
              sizes={project.featured ? "(min-width: 768px) 700px, 100vw" : "(min-width: 768px) 340px, 100vw"}
            />
          ) : (
            <ShotPlaceholder />
          )}
        </div>
      </div>
      <div className="grid content-start gap-3 px-6 pt-10 pb-6 md:px-7 md:pb-7">
        <h3 className="type-h3">{project.name}</h3>
        <p className="type-body-sm text-ink-muted">{project.summary}</p>
        <ChipList items={project.stack.slice(0, TILE_CHIP_COUNT)} />
        <span className="type-button mt-1 inline-flex items-center gap-1.5">
          Case study
          <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
        </span>
      </div>
    </Link>
  );
}

// Spec 7.3: a two-cell bento, Tong Masters featured.
export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-h" className="py-16 md:py-24">
      <Reveal>
        <SectionHeading id="projects-h">Projects</SectionHeading>
      </Reveal>
      {/* Stacked below lg: at tablet width the 4-column tile is too narrow. */}
      <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-12">
        {projects.map((project, i) => (
          <Reveal key={project.slug} index={i} className={project.featured ? "lg:col-span-8" : "lg:col-span-4"}>
            <ProjectTile project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
