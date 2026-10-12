import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { CopyEmailButton } from "@/components/copy-email-button";
import { Reveal } from "@/components/reveal";
import { profile } from "@/content/profile";

// Spec 7.5: one full-width mint block. No form, no phone number.
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="py-16 md:py-24">
      <Reveal>
        <div className="tone-accent grid gap-5 rounded-card border-3 border-ink bg-mint p-8 shadow-brut-lg md:p-16">
          <h2 id="contact-h" className="type-h2">
            Get in touch
          </h2>
          <p className="max-w-[60ch]">{profile.contactLine}</p>
          <a
            id="contact-email"
            href={`mailto:${profile.email}`}
            // -my-2 py-2: a 44px tap target with no change to the spacing around it.
            className="type-h3 -my-2 w-fit break-all py-2 underline decoration-3 underline-offset-[6px]"
          >
            {profile.email}
          </a>
          <div className="mt-2 flex flex-wrap gap-4">
            <CopyEmailButton email={profile.email} selectTargetId="contact-email" />
            <ButtonLink href={profile.links.linkedin} icon={<LinkedinLogo size={20} weight="bold" />}>
              LinkedIn
            </ButtonLink>
            <ButtonLink href={profile.links.github} icon={<GithubLogo size={20} weight="bold" />}>
              GitHub
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
