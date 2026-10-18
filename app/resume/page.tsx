import { DownloadSimple } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/button";
import { ChipList } from "@/components/chip";
import { MarginNote } from "@/components/margin-note";
import { PrintButton } from "@/components/print-button";
import { profile, type Role } from "@/content/profile";
import { projects } from "@/content/projects";
import { formatMonth, roleNote } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.role.toLowerCase()} in ${profile.location}.`,
  alternates: { canonical: "/resume" },
};

// "linkedin.com/in/gjvpaet": readable on paper, where links can't be clicked.
function bare(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

// The formal column, plus a right margin for handwritten notes from lg. On
// paper the margin is gone and the column takes the full width.
const COLUMNS = "grid gap-x-12 lg:grid-cols-[minmax(0,760px)_230px] print:block";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-7 print:gap-3">
      <h2 id={id} className="max-w-[760px] border-b-2 border-ink pb-2 text-[1.5rem] font-bold tracking-[-0.015em] print:pb-1 print:text-[1.25rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function RoleEntry({ role }: { role: Role }) {
  const note = roleNote(role);
  return (
    <article className={`${COLUMNS} break-inside-avoid`}>
      <div className="grid gap-3 print:gap-1.5">
        <div>
          <h3 className="text-[1.25rem] font-bold tracking-[-0.01em]">
            {role.company}
            {role.companyNote ? <span className="font-normal text-ink-soft">, {role.companyNote}</span> : null}
          </h3>
          <ul className="mt-1 grid gap-0.5">
            {role.titles.map((t) => (
              <li key={t.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-semibold">{t.title}</span>
                <span className="text-base text-ink-soft tabular-nums">
                  {formatMonth(t.from)} to {t.to ? formatMonth(t.to) : "now"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-base text-ink-soft">{[role.mode, role.location].filter(Boolean).join(", ")}</p>
        </div>
        <ul className="grid list-disc gap-1.5 pl-5 marker:text-ink-soft">
          {role.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ChipList items={role.stack} />
      </div>
      {note ? <MarginNote className="mt-3 lg:mt-1">{note}</MarginNote> : null}
    </article>
  );
}

// Spec 9: the complete record from content/profile.ts. The structure layer
// only, plus one handwritten note per role on screen; paper and the PDF get
// no pen at all.
export default function ResumePage() {
  return (
    <main id="main" className="mx-auto grid max-w-[1100px] gap-16 px-5 pt-10 pb-20 md:px-10 md:pt-14 md:pb-28 print:max-w-none print:gap-6 print:p-0">
      <header className="grid max-w-[760px] gap-4">
        <h1 className="type-h2">{profile.name}</h1>
        <p className="text-[1.25rem] font-semibold">
          {profile.role}, {profile.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-base">
          <li>
            <a href={`mailto:${profile.email}`} className="underline decoration-ink-soft decoration-[1.5px] underline-offset-4">
              {profile.email}
            </a>
          </li>
          {[profile.links.linkedin, profile.links.github, profile.site].map((url) => (
            <li key={url}>
              <a href={url} className="underline decoration-ink-soft decoration-[1.5px] underline-offset-4">
                {bare(url)}
              </a>
            </li>
          ))}
        </ul>
        <p className="max-w-[65ch] text-ink-soft">{profile.heroLine}</p>
        <div className="mt-2 flex flex-wrap gap-3.5 print:hidden">
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
        <div className="grid gap-10 print:gap-4">
          {profile.roles.map((role) => (
            <RoleEntry key={role.company} role={role} />
          ))}
        </div>
      </Section>

      <Section id="resume-skills" title="Skills">
        <div className="grid max-w-[760px] gap-5 print:gap-2">
          {profile.skills.map((group) => (
            <div key={group.label} className="grid gap-2 break-inside-avoid">
              <h3 className="font-semibold">{group.label}</h3>
              <ChipList items={group.items} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="resume-projects" title="Projects">
        <ul className="grid max-w-[760px] gap-4">
          {projects.map((p) => (
            <li key={p.slug} className="break-inside-avoid">
              <p>
                <span className="font-bold">{p.name}</span>
                <span className="text-ink-soft">, {bare(p.liveUrl)}</span>
              </p>
              <p className="text-ink-soft">{p.summary}</p>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
