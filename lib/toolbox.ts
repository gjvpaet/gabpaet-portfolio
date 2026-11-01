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

import { profile } from "@/content/profile";

// The Toolbox's data (spec 7.6), shared by the home section
// (components/home/toolbox.tsx) and the notebook's Toolbox card.

/** Logos for the tools Simple Icons has a mark for. The rest show their name
    only: never draw a brand mark. */
export const TOOL_ICONS: Record<string, SimpleIcon> = {
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
export const TOOL_GROUPS: readonly { label: string; items: readonly string[] }[] = profile.skills;

const DAILY = new Set<string>(profile.dailyTools);

/** Each circled tool takes the next chip loop, counting across groups, so
    neighbouring circles are drawn by different hands. */
export const LOOP_OF = new Map<string, number>(
  TOOL_GROUPS.flatMap((group) => group.items)
    .filter((item) => DAILY.has(item))
    .map((item, i) => [item, i]),
);

/** The circled tools in page order, as an English list for an sr-only sentence. */
export const DAILY_SENTENCE = new Intl.ListFormat("en", { type: "conjunction" }).format([...LOOP_OF.keys()]);
