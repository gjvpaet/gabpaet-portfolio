import { ChipList } from "@/components/chip";
import { DrawnLink } from "@/components/drawn-link";
import { Highlight } from "@/components/ink/highlight";
import { MarginNote } from "@/components/margin-note";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { HOME_CHIP_COUNT, profile, type Role } from "@/content/profile";
import { handRange, handYears, roleNote } from "@/lib/dates";

// Three columns from lg: handwritten dates in the margin, the entry, a note.
const ROW = "grid gap-2.5 lg:grid-cols-[190px_minmax(0,1fr)_230px] lg:gap-x-8";

// The role's one sentence, with its `mark` phrase under the highlighter.
function HomeLine({ role }: { role: Role }) {
  if (!role.mark) return <>{role.homeLine}</>;
  const [before, after] = role.homeLine.split(role.mark);
  return (
    <>
      {before}
      <Highlight>{role.mark}</Highlight>
      {after}
    </>
  );
}

function MarginDate({ children }: { children: string }) {
  return <p className="type-hand origin-top-left -rotate-3 whitespace-nowrap text-pen lg:mt-2">{children}</p>;
}

function RoleRow({ role }: { role: Role }) {
  const note = roleNote(role);
  // "Senior Programmer, hybrid" / "Senior Programmer, a Volenday Group studio"
  const meta = `${role.titles[0].title}, ${role.companyNote ?? role.mode.toLowerCase()}`;

  return (
    <article className={ROW}>
      <MarginDate>{handRange(role)}</MarginDate>
      <div className="min-w-0">
        <h3 className="type-h3">{role.company}</h3>
        <p className="type-meta mt-1 text-ink-soft">{meta}</p>
        <p className="mt-4 max-w-[58ch]">
          <HomeLine role={role} />
        </p>
        <ChipList items={role.stack.slice(0, HOME_CHIP_COUNT)} className="mt-4.5" />
      </div>
      {note ? <MarginNote className="mt-2 lg:mt-0 lg:pt-13">{note}</MarginNote> : <span />}
    </article>
  );
}

// The internship: one line, and the way to the full résumé in its margin.
function CompactRow({ role }: { role: Role }) {
  return (
    <div className={`${ROW} lg:items-baseline`}>
      <p className="type-hand text-pen">{handYears(role)}</p>
      <p className="type-meta text-ink-soft">
        <strong className="font-[650] text-ink">{role.company}</strong>, {role.titles[0].title.toLowerCase()}.{" "}
        {role.homeLine}
      </p>
      <DrawnLink href="/resume" className="w-fit">
        Full résumé
      </DrawnLink>
    </div>
  );
}

// Spec 7.2: notes from each job, not a résumé. One sentence and one
// highlighted phrase per role; the formal version lives on /resume.
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-h" className="py-16 md:py-24">
      <Reveal>
        <SectionHeading id="experience-h">Where I&apos;ve built things</SectionHeading>
      </Reveal>
      <ol className="mt-14 grid gap-14">
        {profile.roles.map((role) => (
          <li key={role.company}>
            <Reveal>{role.compact ? <CompactRow role={role} /> : <RoleRow role={role} />}</Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
