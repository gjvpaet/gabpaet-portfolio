// Single source of facts for the home page, /resume, JSON-LD, metadata and
// OG images (docs/v2/DESIGN-SPEC.md section 10). Never copy these values
// into components; import them.
//
// Strings marked `// VERIFY` are drafts. Gabriel confirms or rewrites each
// one before launch (build checklist step 14): `grep -rn VERIFY content/`.

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
  /** Rendered as a one-line card on the home page (no chips). */
  compact?: boolean;
};

export const HOME_HIGHLIGHT_COUNT = 2;
export const HOME_CHIP_COUNT = 6;

const yearsShipping = 9; // first full-time role: 2017-05

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

  heroLine: `Senior programmer building AI agents, workflow automation, and the cloud infrastructure that runs them. ${yearsShipping} years shipping.`,

  // VERIFY (voice): personal, and must not mention Lumora or the current role.
  bio: "I love building things that interest me, whether it's a tool that makes a tedious job disappear or a weekend idea that turns into something real. Tong Masters started that way: I wanted an online Tong-its game so friends and family could play together, so I built one. I'd rather see a thing all the way through, from the first rough version to something people actually use. Nine years of building web and mobile apps later, that's still the part I enjoy most.",

  motto: "Always view problems as an opportunity.",

  contactLine: "Not actively looking, but always happy to talk about AI, automation or web work.",

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
      highlights: [
        "Building Centra, Lumora's proprietary loan origination and servicing system.",
        // VERIFY
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
      highlights: [
        // VERIFY
        "Shipped LLM features with LangChain, LangGraph, OpenAI, AWS Bedrock Agents and Vertex AI.",
        // VERIFY
        "Built web and mobile apps across Next.js, React Native and Flutter.",
      ],
      stack: [
        "LangChain", "LangGraph", "AWS Bedrock Agents", "Next.js", "React Native", "Supabase",
        "OpenAI API", "Google Vertex AI", "Flutter", "React", "Node.js", "JavaScript", "PostgreSQL", "SQL",
        "GCP", "Vercel", "DigitalOcean", "AWS S3", "Azure File Share", "Docker", "Git",
      ],
    },
    {
      company: "Volenday Group",
      titles: [{ title: "Programmer", from: "2017-05", to: "2024-01" }],
      mode: "Remote",
      highlights: [
        "Built a React Native app with Danish and Norwegian language support, plus its REST API.",
        "Led a team as scrum master for a web app serving offshore employees, and migrated it to Azure with MSSQL and Azure File Share for faster deploys.",
        "Ran the app's Azure CI/CD pipeline and managed sprints in Jira.",
      ],
      stack: [
        "React Native", "Node.js", "Next.js", "Azure", "MSSQL", "MongoDB",
        "React", "SQL", "NoSQL", "Azure File Share", "AWS S3", "GCP", "Docker", "Git",
      ],
    },
    {
      company: "Hewlett Packard Enterprise",
      titles: [{ title: "Intern", from: "2015-11", to: "2016-04" }],
      mode: "On-site",
      location: "Taguig City",
      compact: true,
      highlights: ["Built a C# (MVVM) app to track employee FTE allocations and requirements across projects."],
      stack: ["C#", "OOP", "LINQ", "MVVM"],
    },
  ] satisfies Role[] as Role[],
} as const;

export type Profile = typeof profile;
