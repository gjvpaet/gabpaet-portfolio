import { ArrowRight } from "@phosphor-icons/react/ssr";

import { Card } from "@/components/card";
import { ChipList } from "@/components/chip";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { HOME_CHIP_COUNT, HOME_HIGHLIGHT_COUNT, profile, type Role } from "@/content/profile";
import { cn } from "@/lib/cn";

// "2017-05 to 2024-01", spanning every title held at the company.
function dateRange(role: Role): string {
  const from = role.titles[role.titles.length - 1].from;
  const to = role.titles[0].to ?? "now";
  return `${from} to ${to}`;
}

// Oldest to newest, so a promotion reads left to right.
function titleLine(role: Role): string {
  return role.titles
    .map((t) => t.title)
    .reverse()
    .join(" → ");
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="type-body-sm grid gap-2">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[20px_minmax(0,1fr)] gap-2">
          <ArrowRight aria-hidden="true" size={16} weight="bold" className="mt-[3px]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RoleCard({ role }: { role: Role }) {
  const meta = `${dateRange(role)} · ${role.mode}`;

  if (role.compact) {
    return (
      <Card as="article" className="grid gap-2 p-5 md:p-6">
        <p className="type-meta text-ink-muted">{meta}</p>
        <h3 className="type-h3">
          {titleLine(role)}, <span className="font-semibold [font-stretch:100%]">{role.company}</span>
        </h3>
        <p className="type-body-sm">{role.highlights[0]}</p>
      </Card>
    );
  }

  return (
    <Card as="article" variant={role.current ? "current" : "default"} className="grid gap-4">
      <div className="grid gap-1">
        <p className="type-meta text-ink-muted">{meta}</p>
        <h3 className="type-h3">{titleLine(role)}</h3>
        <p className="font-semibold">
          {role.company}
          {role.companyNote ? <span className="font-normal text-ink-muted">, {role.companyNote}</span> : null}
        </p>
      </div>
      <Highlights items={role.highlights.slice(0, HOME_HIGHLIGHT_COUNT)} />
      <ChipList items={role.stack.slice(0, HOME_CHIP_COUNT)} />
    </Card>
  );
}

// Spec 7.2: vertical timeline. A 3px rail with a square node per role on
// md+; plain stacked cards on phones.
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-h" className="py-16 md:py-24">
      <Reveal>
        <SectionHeading id="experience-h">Experience</SectionHeading>
      </Reveal>
      <ol className="relative mt-10 grid gap-7 md:mt-12 md:pl-12 md:before:absolute md:before:top-2 md:before:bottom-2 md:before:left-[7px] md:before:w-[3px] md:before:bg-ink">
        {profile.roles.map((role) => (
          <li key={role.company} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-7 -left-12 hidden size-[17px] border-3 border-ink md:block",
                role.current ? "bg-mint" : "bg-surface",
              )}
            />
            <Reveal>
              <RoleCard role={role} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
