import { Illustration } from "@/components/illustration";
import { Highlight } from "@/components/ink/highlight";
import { Tape } from "@/components/ink/tape";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/content/profile";

// The bio's first sentence becomes the lead, with `bioMark` highlighted; the
// rest follows as body copy.
function splitBio() {
  const end = profile.bio.indexOf(". ") + 1;
  const lead = profile.bio.slice(0, end);
  const [before, after] = lead.split(profile.bioMark);
  return { before, after, rest: profile.bio.slice(end).trim() };
}

// Spec 7.4: a lead paragraph, then the desk lamp (illustration #3) over a
// pinned lavender note. Personal; never
// mentions the current employer.
export function About() {
  const { before, after, rest } = splitBio();

  return (
    <section id="about" aria-labelledby="about-h" className="py-16 md:py-24">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
        <Reveal>
          <SectionHeading id="about-h">About</SectionHeading>
          <p className="mt-8 max-w-[36ch] text-[clamp(1.375rem,2.3vw,1.75rem)] leading-[1.45] tracking-[-0.01em]">
            {before}
            <Highlight>{profile.bioMark}</Highlight>
            {after}
          </p>
          <p className="mt-6 max-w-[60ch] text-ink-soft">{rest}</p>
        </Reveal>
        <Reveal index={1} as="aside" aria-label="Motto" className="lg:pt-6">
          <Illustration name="lamp" className="mb-8 w-[200px] lg:w-full" />
          <div className="relative rotate-[2.5deg] rounded-paper bg-note px-5 pt-6 pb-6 text-on-note shadow-lift print:rotate-0">
            <Tape className="-top-3 left-1/2 h-6.5 w-20 -ml-10" style={{ rotate: "-4deg" }} />
            <p className="type-hand-lg">{profile.motto}</p>
            <p className="type-hand mt-3">my motto, for what it&apos;s worth</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
