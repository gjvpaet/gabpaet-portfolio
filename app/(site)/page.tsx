import type { Metadata } from "next";

import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { NotebookTeaser } from "@/components/home/notebook-teaser";
import { Projects } from "@/components/home/projects";
import { Toolbox } from "@/components/home/toolbox";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Spec 7: one scroll, each section a different layout family (split hero,
// lead + pinned note, labelled chips, margin-note rows, napkin vs shipped,
// giant type), and a closing note that opens the notebook.
export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-[1200px] px-5 md:px-10">
      <Hero />
      <About />
      <Toolbox />
      <Experience />
      <Projects />
      <Contact />
      <NotebookTeaser />
    </main>
  );
}
