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

// Spec 7.4: a lead paragraph with the pinned lavender motto note under it,
// and the desk lamp (illustration #3). From lg the lamp has the right column
// beside the bio; from sm it shares the note's row; on phones it sits just
// under the note. Personal; never mentions the current employer.
export function About() {
  const { before, after, rest } = splitBio();

  return (
    <section id="about" aria-labelledby="about-h" className="py-16 md:py-24">
      <div className="grid items-start gap-x-12 sm:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-14">
        <Reveal className="sm:col-span-2 lg:col-span-1">
          <SectionHeading id="about-h">About</SectionHeading>
          <p className="mt-8 max-w-[36ch] text-[clamp(1.375rem,2.3vw,1.75rem)] leading-[1.45] tracking-[-0.01em]">
            {before}
            <Highlight>{profile.bioMark}</Highlight>
            {after}
          </p>
          <p className="mt-6 max-w-[60ch] text-ink-soft">{rest}</p>
        </Reveal>
        <Reveal index={1} as="aside" aria-label="Motto" className="mt-14 max-w-[360px] sm:ml-12 sm:self-end lg:self-start">
          <div className="relative rotate-[-2deg] rounded-paper bg-note px-6 pt-7 pb-6 text-on-note shadow-lift print:rotate-0">
            <Tape className="-top-3 left-1/2 h-6.5 w-20 -ml-10" style={{ rotate: "-4deg" }} />
            <p className="type-hand-lg">{profile.motto}</p>
            <p className="type-hand mt-3">my motto, for what it&apos;s worth</p>
          </div>
        </Reveal>
        <Reveal
          index={2}
          className="mt-2 w-[170px] justify-self-end sm:col-start-2 sm:row-start-2 sm:mt-0 sm:w-full sm:self-end lg:row-span-2 lg:row-start-1 lg:self-start lg:pt-16"
        >
          <Illustration name="lamp" className="w-full" />
        </Reveal>
      </div>
    </section>
  );
}
