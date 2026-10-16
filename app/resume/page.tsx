import { ArrowRight, DownloadSimple } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/button";
import { ChipList } from "@/components/chip";
import { PrintButton } from "@/components/print-button";
import { profile, type Role } from "@/content/profile";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.role.toLowerCase()} in ${profile.location}.`,
  alternates: { canonical: "/resume" },
};

// "linkedin.com/in/gjvpaet": readable on paper, where links can't be clicked.
function bare(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-5 print:gap-3">
      <h2 id={id} className="type-h3 border-b-3 border-ink pb-2 print:pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function RoleEntry({ role }: { role: Role }) {
  return (
    <article className="grid gap-3 rounded-card border-3 border-ink bg-surface p-6 shadow-brut-md break-inside-avoid print:gap-2 print:p-4">
      <div className="grid gap-1">
        <p className="font-bold">
          {role.company}
          {role.companyNote ? <span className="font-normal text-ink-muted">, {role.companyNote}</span> : null}
        </p>
        <ul className="grid gap-0.5">
          {role.titles.map((t) => (
            <li key={t.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="type-h3 text-[1.125rem]">{t.title}</span>
              <span className="type-meta text-ink-muted">
                {t.from} to {t.to ?? "now"}
              </span>
            </li>
          ))}
        </ul>
        <p className="type-meta text-ink-muted">{[role.mode, role.location].filter(Boolean).join(", ")}</p>
      </div>
      <ul className="type-body-sm grid gap-1.5">
        {role.highlights.map((h) => (
          <li key={h} className="grid grid-cols-[20px_minmax(0,1fr)] gap-2">
            <ArrowRight aria-hidden="true" size={16} weight="bold" className="mt-[3px]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <ChipList items={role.stack} />
    </article>
  );
}

// Spec 9: the complete record from content/profile.ts, on screen and on paper.
export default function ResumePage() {
  return (
    <main id="main" className="mx-auto grid max-w-[800px] gap-12 px-4 pt-10 pb-16 md:px-8 md:pt-14 md:pb-24 print:max-w-none print:gap-6 print:p-0">
      <header className="grid gap-4">
        <h1 className="type-h2">{profile.name}</h1>
        <p className="type-h3 text-[1.125rem]">
          {profile.role}, {profile.location}
        </p>
        <ul className="type-body-sm flex flex-wrap gap-x-5 gap-y-1">
          <li>
            <a href={`mailto:${profile.email}`} className="underline decoration-2 underline-offset-4">
              {profile.email}
            </a>
          </li>
          {[profile.links.linkedin, profile.links.github, profile.site].map((url) => (
            <li key={url}>
              <a href={url} className="underline decoration-2 underline-offset-4">
                {bare(url)}
              </a>
            </li>
          ))}
        </ul>
        <p className="max-w-[65ch]">{profile.heroLine}</p>
        <div className="flex flex-wrap gap-4 print:hidden">
          <ButtonLink
            href={profile.resumePdf}
            variant="primary"
            download="Gabriel-Joshua-Paet-Resume.pdf"
            icon={<DownloadSimple size={20} weight="bold" />}
          >
            Download PDF
          </ButtonLink>
          <PrintButton />
        </div>
      </header>

      <Section id="resume-experience" title="Experience">
        <div className="grid gap-5 print:gap-3">
          {profile.roles.map((role) => (
            <RoleEntry key={role.company} role={role} />
          ))}
        </div>
      </Section>

      <Section id="resume-skills" title="Skills">
        <div className="grid gap-4 print:gap-2">
          {profile.skills.map((group) => (
            <div key={group.label} className="grid gap-2 break-inside-avoid">
              <h3 className="font-bold">{group.label}</h3>
              <ChipList items={group.items} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="resume-projects" title="Projects">
        <ul className="grid gap-3">
          {projects.map((p) => (
            <li key={p.slug} className="break-inside-avoid">
              <p>
                <span className="font-bold">{p.name}</span>
                <span className="text-ink-muted">, {bare(p.liveUrl)}</span>
              </p>
              <p className="type-body-sm">{p.summary}</p>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
