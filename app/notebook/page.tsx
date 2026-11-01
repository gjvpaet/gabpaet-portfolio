import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AboutCard } from "@/components/notebook/cards/about-card";
import { ContactCard } from "@/components/notebook/cards/contact-card";
import { ExperienceCard } from "@/components/notebook/cards/experience-card";
import { ProjectsCard } from "@/components/notebook/cards/projects-card";
import { ResumeCard } from "@/components/notebook/cards/resume-card";
import { ToolboxCard } from "@/components/notebook/cards/toolbox-card";
import { Notebook } from "@/components/notebook/notebook";
import { profile } from "@/content/profile";
import type { CardId } from "@/lib/notebook";

export const metadata: Metadata = {
  title: "Notebook",
  // VERIFY
  description: `The loose pages of ${profile.shortName}'s notebook, on a desk: drag them around, zoom out, doodle in the margins.`,
  alternates: { canonical: "/notebook" },
};

// The six card bodies render here, on the server, and ride into the client
// desk as props (notebook spec 1).
const BODIES: Record<CardId, ReactNode> = {
  about: <AboutCard />,
  projects: <ProjectsCard />,
  experience: <ExperienceCard />,
  toolbox: <ToolboxCard />,
  contact: <ContactCard />,
  resume: <ResumeCard />,
};

// Notebook spec: the playful half of the site. Outside the app/(site)
// group, so no nav or footer; the site's skip link lands on this <main>.
export default function NotebookPage() {
  return (
    <main id="main">
      <Notebook bodies={BODIES} />
    </main>
  );
}
