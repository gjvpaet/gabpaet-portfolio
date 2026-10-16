import { ArrowLeft, ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { ChipList } from "@/components/chip";
import { Reveal } from "@/components/reveal";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { getProject, projects } from "@/content/projects";

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

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" aria-labelledby={id} className="grid gap-5">
      <h2 id={id} className="type-h3">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

// Spec 8: back link, title + buttons, screenshots, then four short blocks.
export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const desktop = project.screenshots.find((s) => s.kind === "desktop");
  const phone = project.screenshots.find((s) => s.kind === "phone");

  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-14 px-4 pt-10 pb-16 md:gap-20 md:px-8 md:pt-14 md:pb-24">
      <header className="grid gap-6">
        <Link
          href="/#projects"
          className="type-body-sm inline-flex w-fit items-center gap-1.5 font-semibold underline decoration-2 underline-offset-4"
        >
          <ArrowLeft aria-hidden="true" size={16} weight="bold" />
          All projects
        </Link>
        <h1 className="type-h2">{project.name}</h1>
        <p className="max-w-[60ch] text-[1.1875rem] leading-normal">{project.summary}</p>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href={project.liveUrl} variant="primary" icon={<ArrowUpRight size={20} weight="bold" />}>
            Live site
          </ButtonLink>
          {project.codeUrl ? (
            <ButtonLink href={project.codeUrl} icon={<GithubLogo size={20} weight="bold" />}>
              Code
            </ButtonLink>
          ) : null}
        </div>
      </header>

      {/* Desktop and phone frames share a height on md+: the phone column is
          (10/16) * (9/19.5) ≈ 0.29 of the desktop column's width. */}
      <div className="grid items-start gap-8 md:grid-cols-[100fr_29fr] md:gap-6">
        {desktop ? (
          <ScreenshotFrame shot={desktop} priority sizes="(min-width: 768px) 820px, 100vw" />
        ) : null}
        {phone ? (
          <ScreenshotFrame
            shot={phone}
            sizes="(min-width: 768px) 240px, 260px"
            className="w-full max-w-[260px] md:max-w-none"
          />
        ) : null}
      </div>

      <div className="grid max-w-[820px] gap-14 md:gap-16">
        <Block id="what-it-is" title="What it is">
          <p className="max-w-[65ch]">{project.whatItIs}</p>
        </Block>

        <Block id="how-its-built" title="How it's built">
          <ChipList items={project.stack} />
          <ArchitectureDiagram nodes={project.architecture} label={`${project.name} architecture`} />
        </Block>

        <Block id="hard-problems" title="Hard problems">
          <div className="grid gap-5">
            {project.hardProblems.map((problem) => (
              <Card key={problem.title} as="article" className="grid gap-2">
                <h3 className="font-bold">{problem.title}</h3>
                <p className="type-body-sm">{problem.body}</p>
              </Card>
            ))}
          </div>
        </Block>

        <Block id="whats-next" title="What's next">
          <p className="max-w-[65ch]">{project.whatsNext}</p>
        </Block>

        {project.credits ? <p className="type-body-sm text-ink-muted">{project.credits}</p> : null}
      </div>
    </main>
  );
}
