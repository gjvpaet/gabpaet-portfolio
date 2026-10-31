import {
  siClaude,
  siDbeaver,
  siDocker,
  siExpress,
  siGithubactions,
  siGitkraken,
  siGooglecloud,
  siJavascript,
  siLangchain,
  siLanggraph,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTypescript,
  siWarp,
  type SimpleIcon,
} from "simple-icons";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ToolChip } from "@/components/tool-chip";
import { profile } from "@/content/profile";

// Logos for the tools Simple Icons has a mark for. The rest show their name
// only: never draw a brand mark.
const ICONS: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "Node.js": siNodedotjs,
  Express: siExpress,
  React: siReact,
  "Next.js": siNextdotjs,
  PostgreSQL: siPostgresql,
  "React Native": siReact,
  "GitHub Actions": siGithubactions,
  GCP: siGooglecloud,
  Docker: siDocker,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  n8n: siN8n,
  "Claude Code": siClaude,
  Warp: siWarp,
  GitKraken: siGitkraken,
  DBeaver: siDbeaver,
};

// `profile` is `as const`, so widen once here instead of mapping a union of tuples.
const GROUPS: readonly { label: string; items: readonly string[] }[] = profile.skills;
const DAILY = new Set<string>(profile.dailyTools);

// Each circled tool takes the next chip loop, counting across groups, so
// neighbouring circles are drawn by different hands.
const LOOP_OF = new Map<string, number>(
  GROUPS.flatMap((group) => group.items)
    .filter((item) => DAILY.has(item))
    .map((item, i) => [item, i]),
);

// The circled tools in page order, as an English list for the sr-only sentence.
const DAILY_SENTENCE = new Intl.ListFormat("en", { type: "conjunction" }).format([...LOOP_OF.keys()]);

// Spec 7.6: the tools, grouped, as logo chips under ruled labels; the ones
// opened every day circled in pen. One column on phones, 2 from sm, 3 from lg,
// with the pen's legend in the grid's last cell.
export function Toolbox() {
  return (
    <section id="toolbox" aria-labelledby="toolbox-h" className="py-16 md:py-24">
      <Reveal>
        <SectionHeading id="toolbox-h" description="What I build with, day to day.">
          Toolbox
        </SectionHeading>
      </Reveal>
      {/* The circles are pen only, so say which tools they mark. */}
      <p className="sr-only">{`Open every day: ${DAILY_SENTENCE}.`}</p>
      <div className="mt-11 grid gap-y-11 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
        {GROUPS.map((group, g) => (
          <Reveal key={group.label} index={g + 1}>
            <h3 className="border-b-2 border-ink pb-2.5 text-[1.1875rem] leading-tight font-bold">{group.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-2.5 gap-y-3">
              {group.items.map((item, i) => (
                <li key={item}>
                  {/* The loop's delay mirrors Reveal's 60ms stagger, so it draws after its group fades in. */}
                  <ToolChip
                    name={item}
                    icon={ICONS[item]}
                    loop={LOOP_OF.get(item)}
                    delay={0.2 + (g + 1) * 0.06 + i * 0.08}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal index={GROUPS.length + 1} className="sm:self-end">
          <p aria-hidden="true" className="type-hand -rotate-2 text-pen print:hidden">
            circled = open every day
          </p>
        </Reveal>
      </div>
    </section>
  );
}
