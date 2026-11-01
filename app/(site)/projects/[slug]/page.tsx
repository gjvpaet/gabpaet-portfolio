import { ArrowLeft, ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/button";
import { ChipList } from "@/components/chip";
import { DrawnLink } from "@/components/drawn-link";
import { InkBox } from "@/components/ink/ink-box";
import { InkSvg } from "@/components/ink/ink-svg";
import { MarginNote } from "@/components/margin-note";
import { ProjectNapkin } from "@/components/napkins/project-napkin";
import { PaperCard } from "@/components/paper-card";
import { Reveal } from "@/components/reveal";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { WhiteboardDiagram } from "@/components/whiteboard-diagram";
import { Illustration, type IllustrationName } from "@/components/illustration";
import { getProject, projects, type Project, type ProjectSlug } from "@/content/projects";

type Params = { slug: string };

// Only the slugs in content/projects.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const path = `/projects/${project.slug}`;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: { title: project.name, description: project.summary, url: path },
  };
}

// One block of the spread: a plain h2 and its content, revealed on scroll
// (which also starts its pen marks drawing).
function Block({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal as="section" aria-labelledby={id} className={className}>
      <h2 id={id} className="type-h3">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </Reveal>
  );
}

// "What's next" as a to-do list with hand-drawn boxes. The tick is decoration;
// the state is in the text for screen readers.
function TodoList({ items }: { items: Project["whatsNext"] }) {
  return (
    <ul className="grid max-w-[65ch] gap-4">
      {items.map((item, i) => (
        <li key={item.text} className="grid grid-cols-[22px_minmax(0,1fr)] items-start gap-3.5">
          <span className="relative mt-[3px] size-5" aria-hidden="true">
            <InkBox rough={i % 2 ? "b" : "a"} delay={0.1 + i * 0.15} className="size-5" />
            {item.done ? (
              <InkSvg name="check" delay={0.35 + i * 0.15} rough={false} className="absolute -top-1 left-0.5 size-6" />
            ) : null}
          </span>
          <span className={item.done ? "text-ink-soft" : undefined}>
            {item.done ? <span className="sr-only">Done: </span> : null}
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Header art beside the title on lg+ (spec 8): Tong Masters gets the
// hands fanning cards. Projects without one keep the plain header.
const HEADER_ART: Partial<Record<ProjectSlug, IllustrationName>> = {
  "tong-masters": "cards",
};

const CAPTION: Record<"desktop" | "phone", string> = {
  desktop: "on a big screen",
  phone: "and in your pocket",
};

// Spec 8: a notebook spread. The napkin it started on, what it is, how it's
// built, the screenshots taped in, the hard problems with notes in the
// margin, and what's next as a to-do list.
export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const desktop = project.screenshots.find((s) => s.kind === "desktop");
  const phone = project.screenshots.find((s) => s.kind === "phone");
  const headerArt = HEADER_ART[project.slug];

  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-20 px-5 pt-8 pb-20 md:gap-24 md:px-10 md:pt-12 md:pb-28">
      <header className="grid items-end gap-x-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-[820px]">
          <DrawnLink href="/#projects" tone="ink" className="gap-1.5">
            <ArrowLeft aria-hidden="true" size={16} weight="bold" />
            All projects
          </DrawnLink>
          <h1 className="type-h2 mt-6">{project.name}</h1>
          <p className="type-lead mt-5 max-w-[48ch] text-ink-soft">{project.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <ButtonLink href={project.liveUrl} variant="primary" icon={<ArrowUpRight size={20} weight="bold" />}>
              Live site
            </ButtonLink>
            {project.codeUrl ? (
              <ButtonLink href={project.codeUrl} icon={<GithubLogo size={20} weight="bold" />}>
                Code
              </ButtonLink>
            ) : null}
          </div>
        </div>
        {headerArt ? <Illustration name={headerArt} className="hidden w-[380px] lg:block xl:w-[440px]" /> : null}
      </header>

      {/* The napkin, then what it became. */}
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* Capped below lg, where it would otherwise fill the column. */}
        <Reveal as="figure" className="max-w-[520px] lg:max-w-none">
          <PaperCard rotate={-1.6} tape="top" className="ink-boil px-5.5 pt-6 pb-4">
            <ProjectNapkin slug={project.slug} />
          </PaperCard>
          <figcaption className="type-hand mt-6 text-pen">the napkin</figcaption>
        </Reveal>
        <Block id="what-it-is" title="What it is">
          <p className="max-w-[60ch]">{project.whatItIs}</p>
        </Block>
      </div>

      <Block id="how-its-built" title="How it's built">
        <ChipList items={project.stack} />
        <div className="mt-8">
          <WhiteboardDiagram nodes={project.architecture} label={`${project.name} architecture`} />
        </div>
      </Block>

      <Block id="what-shipped" title="What shipped">
        {/* Desktop and phone frames share a height on md+: the phone column is
            (10/16) * (9/19.5) ≈ 0.29 of the desktop column's width. */}
        <div className="grid items-start gap-12 md:grid-cols-[100fr_29fr] md:gap-8">
          {desktop ? (
            <ScreenshotFrame shot={desktop} rotate={-0.6} caption={CAPTION.desktop} sizes="(min-width: 768px) 860px, 100vw" />
          ) : null}
          {phone ? (
            <ScreenshotFrame
              shot={phone}
              rotate={1}
              caption={CAPTION.phone}
              sizes="(min-width: 768px) 250px, 200px"
              className="w-full max-w-[200px] md:max-w-none"
            />
          ) : null}
        </div>
      </Block>

      <Block id="hard-problems" title="Hard problems">
        <ol className="grid gap-12">
          {project.hardProblems.map((problem) => (
            <li key={problem.title} className="grid gap-3 lg:grid-cols-[minmax(0,62ch)_230px] lg:gap-x-10">
              <div className="max-w-[65ch]">
                <h3 className="text-xl font-bold tracking-[-0.01em]">{problem.title}</h3>
                <p className="mt-2 text-ink-soft">{problem.body}</p>
              </div>
              {problem.note ? <MarginNote className="lg:pt-1">{problem.note}</MarginNote> : null}
            </li>
          ))}
        </ol>
      </Block>

      <Block id="whats-next" title="What's next">
        <TodoList items={project.whatsNext} />
      </Block>
    </main>
  );
}
