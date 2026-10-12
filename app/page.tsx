import type { Metadata } from "next";

import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Spec 7: one scroll, each section a different layout family
// (split, timeline, bento, column + panel, full-width block).
export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-[1200px] px-4 md:px-8">
      <Hero />
      <Experience />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
