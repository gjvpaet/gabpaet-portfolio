// Side projects: home page bento tiles and /projects/[slug] case studies
// (docs/v2/DESIGN-SPEC.md sections 7.3 and 8).
// Strings marked `// VERIFY` are drafts awaiting Gabriel's confirmation.

export type ProjectSlug = "tong-masters" | "portfolio-v1";

export type Screenshot = {
  src: string;
  alt: string;
  kind: "desktop" | "phone";
  width: number;
  height: number;
};

export type ArchitectureNode = {
  label: string;
  detail?: string;
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  /** One line, used on the home tile and as the case-study subtitle. */
  summary: string;
  liveUrl: string;
  /** Omitted when the repo is private. */
  codeUrl?: string;
  /** Home tile shows these; the case study shows them all. */
  stack: string[];
  featured?: boolean;
  /** Captured from the live sites (build-checklist step 9). */
  screenshots: Screenshot[];
  whatItIs: string;
  /** Left-to-right flow for the architecture diagram. */
  architecture: ArchitectureNode[];
  /** `note`: an optional handwritten margin aside, 8 words or fewer. */
  hardProblems: { title: string; body: string; note?: string }[];
  /** The case study's to-do list (spec 8, step 8). */
  whatsNext: { text: string; done?: boolean }[];
  /** Hidden margin note on the home "Play it" link (spec 5.2), 8 words or fewer. */
  playNote?: string;
  credits?: string;
};

export const projects: Project[] = [
  {
    slug: "tong-masters",
    name: "Tong Masters",
    summary: "Real-time multiplayer Tong-its in the browser, with bots and a guided tutorial.",
    liveUrl: "https://tongmasters.gabpaet.dev",
    stack: ["Next.js", "Cloudflare", "Durable Objects", "TypeScript", "D1", "Vitest"],
    featured: true,
    screenshots: [
      {
        src: "/projects/tong-masters/desktop.webp",
        alt: "Tong Masters solo game on desktop: two bots and the player mid-hand, with the stock, the discard pile and the player's cards.",
        kind: "desktop",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/tong-masters/phone.webp",
        alt: "Tong Masters home screen on a phone, with buttons to play solo, play online with friends or learn to play.",
        kind: "phone",
        width: 780,
        height: 1688,
      },
    ],
    // VERIFY
    whatItIs:
      "Tong-its is a Filipino rummy game usually played around a table with three people. Tong Masters puts it in the browser: open a room and play with friends, let bots fill the empty seats, or practice solo against bots. A guided tutorial teaches the rules hand by hand.",
    // A real request flow, left to right. The rules engine is a shared library
    // (browser for solo, server for rooms), so it is named inside both nodes.
    architecture: [
      { label: "Next.js web app", detail: "On Vercel. Runs solo games with the shared rules engine" },
      { label: "Game rooms", detail: "PartyServer on Cloudflare Durable Objects. Same engine and bots" },
      { label: "D1 database", detail: "Guest wallets, chip ledger, play stats" },
    ],
    hardProblems: [
      {
        // VERIFY
        title: "Fair multiplayer with bots in the mix",
        body: "Each room runs on a Durable Object that owns the game state, so players only ever see their own hand. Bots take empty seats through the same server rules as people.",
        note: "nobody can peek at your hand",
      },
      {
        // VERIFY
        title: "One rules engine, tested first",
        body: "The rules and the bot live in a pure TypeScript package written test-first with Vitest. The server, solo mode and the tutorial all run the same engine.",
        note: "the tests came before the table",
      },
      {
        // VERIFY
        title: "Chips that are only for fun",
        body: "Virtual chips can never be bought or cashed out, by design. The server keeps the balances and a ledger, so nothing about a player's chips is trusted from the browser.",
        note: "no real money, ever",
      },
    ],
    whatsNext: [
      { text: "Bots that fill empty seats", done: true },
      { text: "A guided tutorial that teaches the rules hand by hand", done: true },
      // VERIFY
      { text: "Open it up to more players beyond friends and family" },
      // VERIFY
      { text: "Add more Filipino card games once the format is right" },
    ],
    // VERIFY
    playNote: "bring two friends",
    credits: "Built with contributions from Koddi Evangelista.",
  },
  {
    slug: "portfolio-v1",
    name: "Portfolio v1",
    summary: "The previous version of this site, styled as a code editor.",
    liveUrl: "https://v1.gabpaet.dev",
    codeUrl: "https://github.com/gjvpaet/gabpaet-portfolio/tree/v1",
    stack: ["Next.js", "Tailwind", "TypeScript"],
    screenshots: [
      {
        src: "/projects/portfolio-v1/desktop.webp",
        alt: "Portfolio v1 on desktop: the about page shown as a markdown file in a code editor, with a file tree, tabs and a status bar.",
        kind: "desktop",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/portfolio-v1/phone.webp",
        alt: "Portfolio v1 on a phone: the about page in the editor layout, with file tabs across the top.",
        kind: "phone",
        width: 780,
        height: 1688,
      },
    ],
    // VERIFY
    whatItIs:
      "The first version of gabpaet.dev presented every page as a file in a VS Code-style editor, with a file tree, tabs, a command palette and a status bar.",
    architecture: [
      { label: "content/files.ts", detail: "One registry of every page" },
      { label: "Routes and IDE chrome", detail: "Pages, sidebar, tabs, palette and sitemap all read it" },
    ],
    hardProblems: [
      {
        // VERIFY
        title: "One source of truth for navigation",
        body: "The sidebar, tabs, command palette, breadcrumb and sitemap all read one registry of files, so adding a page meant one entry instead of five.",
        note: "one entry instead of five",
      },
      {
        // VERIFY
        title: "Theme switching without a flash",
        body: "Accent, density and theme choices were applied by a small script before React loaded, so the first paint already matched the visitor's settings.",
        note: "no flash on first paint",
      },
      {
        // VERIFY
        title: "An editor layout on a phone",
        body: "The file tree became a slide-in drawer and the editor chrome shrank in three steps, so the IDE idea still worked on a small screen.",
        note: "the file tree became a drawer",
      },
    ],
    whatsNext: [{ text: "Retired in favour of v2, and kept live as a reference", done: true }],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
