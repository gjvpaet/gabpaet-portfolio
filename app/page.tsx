import { ArrowDown, FileText } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { siClaude, siDocker, siNextdotjs, siNodedotjs, siPostgresql } from "simple-icons";

import { BrandIcon } from "@/components/brand-icon";
import { Button, ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { ChipList, StatusChip } from "@/components/chip";
import { CopyEmailButton } from "@/components/copy-email-button";
import { SectionHeading } from "@/components/section-heading";
import { HOME_CHIP_COUNT, HOME_HIGHLIGHT_COUNT, profile } from "@/content/profile";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Temporary: a token check plus every step-5 primitive, so they can be tested
// in the browser. Replaced by the real home page in build-checklist step 7.
export default function HomePage() {
  const [current, previous] = profile.roles;

  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-16 px-4 py-16 md:px-8 md:py-24">
      <section id="hero" className="grid gap-8" aria-label="Hero preview">
        <StatusChip>{profile.status}</StatusChip>
        <h1 className="type-display">
          {profile.name.split(" ").map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </h1>
        <p className="max-w-[34ch] text-[1.1875rem] leading-normal">{profile.heroLine}</p>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/resume" variant="primary" icon={<FileText size={20} weight="bold" />}>
            Resume
          </ButtonLink>
          <ButtonLink href="#components" icon={<ArrowDown size={20} weight="bold" />}>
            See projects
          </ButtonLink>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section id="components" className="grid gap-8" aria-labelledby="components-h">
        <SectionHeading id="components-h" description="Step 5 primitives, shown with real profile data.">
          Components
        </SectionHeading>

        <div className="flex flex-wrap gap-5">
          {[siClaude, siNextdotjs, siNodedotjs, siPostgresql, siDocker].map((icon) => (
            <span
              key={icon.slug}
              className="grid size-[88px] place-items-center rounded-control border-3 border-ink bg-surface shadow-brut-lg"
            >
              <BrandIcon icon={icon} size={44} />
            </span>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[current, previous].map((role) => (
            <Card key={role.company} as="article" variant={role.current ? "current" : "default"} className="grid gap-3">
              <span className="type-meta text-ink-muted">
                {role.titles[0].from} to {role.titles[0].to ?? "now"} · {role.mode}
              </span>
              <h3 className="type-h3">{role.titles[0].title}</h3>
              <span className="font-semibold">{role.company}</span>
              <ul className="type-body-sm grid gap-1.5">
                {role.highlights.slice(0, HOME_HIGHLIGHT_COUNT).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ChipList items={role.stack.slice(0, HOME_CHIP_COUNT)} />
            </Card>
          ))}
        </div>

        <div className="tone-accent grid gap-5 rounded-card border-3 border-ink bg-mint p-8 shadow-brut-lg md:p-12">
          <h3 className="type-h2">Get in touch</h3>
          <p>{profile.contactLine}</p>
          <a id="contact-email" href={`mailto:${profile.email}`} className="type-h3 w-fit underline decoration-3 underline-offset-[6px]">
            {profile.email}
          </a>
          <div className="flex flex-wrap gap-4">
            <CopyEmailButton email={profile.email} selectTargetId="contact-email" />
            <ButtonLink href={profile.links.github}>GitHub</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
