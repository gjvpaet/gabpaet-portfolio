// Single source of facts for the home page, /resume, JSON-LD, metadata and
// OG images (docs/v2/DESIGN-SPEC.md section 10). Never copy these values
// into components; import them.
//
// New draft strings carry a `// VERIFY` comment until Gabriel confirms or
// rewrites them (`grep -rn VERIFY content/`). Everything here is confirmed.

import { numberWord, yearsSince } from "@/lib/dates";

/** "YYYY-MM" */
export type YearMonth = `${number}-${number}`;

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export type RoleTitle = {
  title: string;
  from: YearMonth;
  /** Omitted while the title is current. */
  to?: YearMonth;
};

export type Role = {
  company: string;
  companyNote?: string;
  /** Promotion history at this company, newest first. */
  titles: RoleTitle[];
  mode: WorkMode;
  location?: string;
  /** The home page shows the first two; /resume shows all. */
  highlights: string[];
  /** The home page shows the first six; /resume shows all. */
  stack: string[];
  current?: boolean;
  /** Rendered as a one-line row on the home page (no chips, no note). */
  compact?: boolean;
  /** The one sentence the home page shows for this role (spec 7.2). */
  homeLine: string;
  /** The phrase in `homeLine` that gets the highlighter. Must occur in it. */
  mark?: string;
  /**
   * Handwritten margin note, 8 words or fewer (spec 6.2). `{promotion}` and
   * `{tenure}` are filled from `titles` by lib/dates.ts, so they never drift.
   */
  note?: string;
};

export const HOME_HIGHLIGHT_COUNT = 2;
/** Chips per role on the home page (spec 6.9); /resume shows them all. */
export const HOME_CHIP_COUNT = 4;

// Years since the first full-time role (Volenday Group, 2017-05), worked out
// at build time so the hero, meta description and bio never go stale.
const yearsShipping = yearsSince("2017-05");

export const profile = {
  name: "Gabriel Joshua Paet",
  shortName: "Gabriel Paet",
  role: "Senior Programmer",
  location: "Pasay City, Philippines",
  address: { locality: "Pasay City", region: "NCR", country: "PH" },
  yearsShipping,
  status: "Not actively looking, open to a chat",
  email: "hello@gabpaet.dev",
  site: "https://gabpaet.dev",
  links: {
    github: "https://github.com/gjvpaet",
    linkedin: "https://www.linkedin.com/in/gjvpaet/",
    v1: "https://v1.gabpaet.dev",
  },
  resumePdf: "/gabriel-paet-resume.pdf",

  /** Search results and link previews. */
  metaDescription: `Senior programmer with ${yearsShipping} years building web and mobile applications, workflow automation and cloud infrastructure. Based in Pasay City, Philippines.`,

  /** Crossed out above the title in the hero (spec 5.2): the joke draft. */
  heroDraft: "Full-stack ninja",

  heroLine: `I build web and mobile applications, workflow automation, and the cloud infrastructure that runs them. ${yearsShipping} years shipping.`,

  // Personal: must not mention Lumora or the current role.
  bio: `I love building things that interest me, whether it's a tool that makes a tedious job disappear or a weekend idea that turns into something real. I'd rather see a thing all the way through, from the first rough version to something people actually use. ${numberWord(yearsShipping)} years of building web and mobile apps later, that's still the part I enjoy most.`,

  /** The phrase in `bio` the About lead highlights (spec 7.4). Must occur in it. */
  bioMark: "I love building things that interest me",

  motto: "Always view problems as an opportunity.",

  skills: [
    {
      label: "AI & automation",
      items: ["LangChain", "LangGraph", "OpenAI API", "AWS Bedrock Agents", "Vertex AI", "n8n", "Claude Code"],
    },
    {
      label: "Cloud & DevOps",
      items: ["AWS", "Elastic Beanstalk", "S3", "GitHub Actions", "Azure", "GCP", "Docker"],
    },
    {
      label: "Web",
      items: ["Node.js", "Express", "React", "Next.js", "PostgreSQL", "React Native"],
    },
  ],

  /** Newest first. */
  roles: [
    {
      company: "Lumora Capital",
      titles: [{ title: "Senior Programmer", from: "2026-05" }],
      mode: "Hybrid",
      location: "Philippines",
      current: true,
      homeLine:
        "Building Centra, Lumora's proprietary loan origination and servicing system, and automating manual operations with n8n and agent tooling.",
      mark: "Centra",
      note: "Claude Code is in my daily workflow",
      highlights: [
        "Building Centra, Lumora's proprietary loan origination and servicing system.",
        "Automating manual operations with n8n and agent tooling, including Claude Code in the daily workflow.",
      ],
      stack: [
        "Next.js", "Node.js", "PostgreSQL", "n8n", "GCP", "Docker",
        "JavaScript", "React", "Express", "Claude Code", "OpenClaw", "DigitalOcean", "Git", "GitHub",
      ],
    },
    {
      company: "ahaStudio",
      companyNote: "a Volenday Group studio",
      titles: [
        { title: "Senior Programmer", from: "2024-09", to: "2026-04" },
        { title: "Programmer", from: "2024-01", to: "2024-09" },
      ],
      mode: "Hybrid",
      homeLine:
        "Shipped LLM features with LangChain, LangGraph, OpenAI, AWS Bedrock Agents and Vertex AI, across web and mobile apps.",
      mark: "LLM features",
      note: "{promotion}",
      highlights: [
        "Shipped LLM features with LangChain, LangGraph, OpenAI, AWS Bedrock Agents and Vertex AI.",
        "Built web and mobile apps across Next.js, React Native and Flutter.",
      ],
      stack: [
        "LangGraph", "AWS Bedrock Agents", "Next.js", "React Native", "LangChain", "Supabase",
        "OpenAI API", "Google Vertex AI", "Flutter", "React", "Node.js", "JavaScript", "PostgreSQL", "SQL",
        "GCP", "Vercel", "DigitalOcean", "AWS S3", "Azure File Share", "Docker", "Git",
      ],
    },
    {
      company: "Volenday Group",
      titles: [{ title: "Programmer", from: "2017-05", to: "2024-01" }],
      mode: "Remote",
      homeLine:
        "Built a React Native app in Danish and Norwegian with its REST API, then led the team as scrum master on a web app we moved to Azure.",
      mark: "led the team",
      note: "my first full-time job. {tenure}",
      highlights: [
        "Built a React Native app with Danish and Norwegian language support, plus its REST API.",
        "Led a team as scrum master for a web app serving offshore employees, and migrated it to Azure with MSSQL and Azure File Share for faster deploys.",
        "Ran the app's Azure CI/CD pipeline and managed sprints in Jira.",
      ],
      stack: [
        "React Native", "Azure", "MSSQL", "Node.js", "Next.js", "MongoDB",
        "React", "SQL", "NoSQL", "Azure File Share", "AWS S3", "GCP", "Docker", "Git",
      ],
    },
    {
      company: "Hewlett Packard Enterprise",
      titles: [{ title: "Intern", from: "2015-11", to: "2016-04" }],
      mode: "On-site",
      location: "Taguig City",
      compact: true,
      homeLine: "A C# app for tracking FTE allocations.",
      highlights: ["Built a C# (MVVM) app to track employee FTE allocations and requirements across projects."],
      stack: ["C#", "OOP", "LINQ", "MVVM"],
    },
  ] satisfies Role[] as Role[],
} as const;

export type Profile = typeof profile;

// A highlighter phrase that is not in its sentence would silently render
// nothing; fail the dev server and the build instead.
if (!profile.bio.includes(profile.bioMark)) {
  throw new Error(`content/profile.ts: bioMark "${profile.bioMark}" is not in bio`);
}
for (const role of profile.roles) {
  if (role.mark && !role.homeLine.includes(role.mark)) {
    throw new Error(`content/profile.ts: mark "${role.mark}" is not in ${role.company}'s homeLine`);
  }
}
