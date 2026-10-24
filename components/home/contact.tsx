import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { CopyEmailButton } from "@/components/copy-email-button";
import { Illustration } from "@/components/illustration";
import { InkUnderline } from "@/components/ink/ink-underline";
import { MarginNote } from "@/components/margin-note";
import { Reveal } from "@/components/reveal";
import { profile } from "@/content/profile";

// Spec 7.5: a giant "Say hi.", the address with a pen underline, the copy
// and profile buttons, and the availability as a margin note. No form. From
// lg the paper plane (illustration #4) loops off beside the heading.
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="pt-16 pb-20 md:pt-24 md:pb-24">
      <Reveal className="relative">
        <Illustration name="plane" className="absolute top-6 right-0 hidden w-[min(40vw,440px)] lg:block" />
        <h2 id="contact-h" className="type-display-xl">
          Say hi.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
          <a
            id="contact-email"
            href={`mailto:${profile.email}`}
            className="text-[clamp(1.625rem,3.4vw,2.625rem)] leading-tight font-[650] tracking-[-0.02em] break-all no-underline"
          >
            <InkUnderline variant="full">{profile.email}</InkUnderline>
          </a>
          {/* Full-width stack on phones, a row from sm. */}
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <CopyEmailButton email={profile.email} selectTargetId="contact-email" />
            <ButtonLink href={profile.links.linkedin} icon={<LinkedinLogo size={20} weight="bold" />}>
              LinkedIn
            </ButtonLink>
            <ButtonLink href={profile.links.github} icon={<GithubLogo size={20} weight="bold" />}>
              GitHub
            </ButtonLink>
          </div>
        </div>
        <MarginNote arrow="up-right" className="mt-7">
          {profile.status.toLowerCase()}
        </MarginNote>
      </Reveal>
    </section>
  );
}
