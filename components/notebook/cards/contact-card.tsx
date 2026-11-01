import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";
import { useId } from "react";

import { ButtonLink } from "@/components/button";
import { CopyEmailButton } from "@/components/copy-email-button";
import { profile } from "@/content/profile";

// Notebook card: Contact (notebook spec 3). The address, the copy button
// (with its pen tick), the two profiles and the availability.
export function ContactCard() {
  const emailId = useId();
  return (
    <div className="grid gap-4">
      <a
        id={emailId}
        href={`mailto:${profile.email}`}
        className="text-2xl leading-tight font-[650] tracking-[-0.02em] break-all"
      >
        {profile.email}
      </a>
      <div className="grid gap-2.5">
        <CopyEmailButton email={profile.email} selectTargetId={emailId} />
        <div className="grid grid-cols-2 gap-2.5">
          <ButtonLink href={profile.links.github} icon={<GithubLogo size={20} weight="bold" />}>
            GitHub
          </ButtonLink>
          <ButtonLink href={profile.links.linkedin} icon={<LinkedinLogo size={20} weight="bold" />}>
            LinkedIn
          </ButtonLink>
        </div>
      </div>
      <p className="type-meta text-ink-soft">{profile.status}.</p>
    </div>
  );
}
