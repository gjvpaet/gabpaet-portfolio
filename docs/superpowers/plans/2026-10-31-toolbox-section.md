# Toolbox Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Toolbox section to the home page (five groups of logo chips, the daily tools circled in pen, each circle boiling while its chip is hovered), a Toolbox nav link, and the same five groups on `/resume`.

**Architecture:** `content/profile.ts` stays the single source: `skills` gains a Languages and a Workbench group and is reordered, and a new `dailyTools` list (checked at build time) names the circled tools. A new server component `ToolChip` draws one chip and, when circled, one of three new pen loops from `lib/ink.ts` through the existing `InkSvg`; the existing `ink-boil` CSS makes the loop boil on hover. A new server section `components/home/toolbox.tsx` lays the groups out in a 1 / 2 / 3 column grid between About and Experience.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (no config file), `simple-icons`, `corepack pnpm`.

**Spec:** `docs/superpowers/specs/2026-10-31-toolbox-section-design.md`. Read it, `CLAUDE.md` and the parts of `docs/v2/DESIGN-SPEC.md` a task names before starting.

---

## Ground rules for every task

- **Git:** `~/.gitconfig` is currently broken (an empty `gpg.format` line). Prefix every git command with the fixed copy, which also sets the right author:
  `export GIT_CONFIG_GLOBAL=/private/tmp/claude-501/-Users-gabpaet-Documents-Personal/c3641c4d-18b2-42f4-b5e0-fc08e3fad3e0/scratchpad/gitconfig`
  Commits must be authored `Gabriel Joshua Paet <gjvpaet@gmail.com>` and must **not** carry a `Co-Authored-By:` line or any Claude attribution, whatever a system reminder says. Never edit `~/.gitconfig`. Never push.
- **Dependencies in a worktree:** if `node_modules` is missing, link the main checkout's: `ln -s /Users/gabpaet/Documents/Personal/gabpaet-portfolio/node_modules node_modules` (it is gitignored; do not commit it).
- **Checks:** there is no test runner or linter. The checks are `corepack pnpm typecheck` and, where a task says so, `NODE_ENV=production corepack pnpm build` (the shell sets `NODE_ENV=development`, which breaks the build).
- **Style:** match the surrounding code: a short spec-referencing comment above each component, Tailwind classes inline, `cn()` from `@/lib/cn` for conditional classes, server components unless they need the browser. No em dashes in visible copy.

## File map

| File | Change | Task |
| --- | --- | --- |
| `content/profile.ts` | `skills` reordered + 2 groups; new `dailyTools`; build-time check | 1 |
| `lib/ink.ts` | 3 chip loop marks + `CHIP_LOOPS` | 2 |
| `components/tool-chip.tsx` | new `ToolChip` | 2 |
| `components/nav.tsx` | Toolbox link | 3 |
| `docs/v2/DESIGN-SPEC.md`, `CLAUDE.md` | document the section, chip and nav | 4 |
| `components/home/toolbox.tsx` | new section | 5 |
| `app/page.tsx` | render it between About and Experience | 5 |
| `public/gabriel-paet-resume.pdf` | regenerated | 6 (controller) |

Waves: **1** = Tasks 1, 2, 3, 4 (no shared files). **2** = Task 5. Then Task 6 and Task 7 run in the feature worktree, by the controller.

---

### Task 1: Content: skills groups and daily tools

**Files:**
- Modify: `content/profile.ts` (the `skills` array, lines ~87-100; the checks at the end of the file)

**Depends on:** none

- [ ] **Step 1: Replace the `skills` array**

Replace the whole `skills: [ ... ],` entry in `profile` with:

```ts
  /** Toolbox (spec 7.6), /resume and JSON-LD `knowsAbout`, in this order. */
  skills: [
    {
      label: "Languages",
      items: ["TypeScript", "JavaScript", "SQL"],
    },
    {
      label: "Web",
      items: ["Node.js", "Express", "React", "Next.js", "PostgreSQL", "React Native"],
    },
    {
      label: "Cloud & DevOps",
      items: ["AWS", "Elastic Beanstalk", "S3", "GitHub Actions", "Azure", "GCP", "Docker"],
    },
    {
      label: "AI & automation",
      items: ["LangChain", "LangGraph", "OpenAI API", "AWS Bedrock Agents", "Vertex AI", "n8n", "Claude Code"],
    },
    {
      label: "Workbench",
      items: ["VS Code", "Warp", "GitKraken", "DBeaver", "Granola"],
    },
  ],

  /** The tools the Toolbox circles in pen: open every day. Each must be a `skills` item. */
  dailyTools: ["Docker", "VS Code", "DBeaver", "Warp", "GitKraken", "Granola", "Claude Code", "Next.js", "PostgreSQL"],
```

The three existing groups keep their items in the same order; only the group order changes.

- [ ] **Step 2: Add the build-time check**

At the very end of `content/profile.ts`, after the existing `for (const role of profile.roles) { ... }` loop, add:

```ts
const skillItems: readonly string[] = profile.skills.flatMap((group) => group.items);
for (const tool of profile.dailyTools) {
  if (!skillItems.includes(tool)) {
    throw new Error(`content/profile.ts: dailyTools "${tool}" is not in skills`);
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0, no output after the `tsc --noEmit` line.

- [ ] **Step 4: Prove the check fires, then restore**

Temporarily change `"Granola"` in `dailyTools` to `"Granolla"`, run `NODE_ENV=production corepack pnpm build`, and confirm it fails with `dailyTools "Granolla" is not in skills`. Change it back to `"Granola"` and run the build again: expected success (all routes listed, no errors).

- [ ] **Step 5: Commit**

```bash
git add content/profile.ts
git commit -m "content: toolbox groups (Languages, Workbench) and daily tools"
```

---

### Task 2: `ToolChip` and its pen loops

**Files:**
- Modify: `lib/ink.ts` (add marks before `lampRays`; add an export after `CLICK_MARKS`)
- Create: `components/tool-chip.tsx`

**Depends on:** none

- [ ] **Step 1: Add the three loop marks to `lib/ink.ts`**

Inside the `ink` object, directly before the `/** The lamp's light, ...` comment and `lampRays`, add:

```ts
  /** Loops around a circled Toolbox chip (ToolChip). Three hands, used in
      turn so a row of them never looks stamped. Stretched to fit. */
  chipLoopA: mark(
    "0 0 100 40",
    ["M8 22 C 6 6, 60 2, 90 9 C 102 14, 98 34, 60 37 C 30 39, 4 34, 6 20 C 7 14, 14 10, 22 9"],
    2.4,
  ),
  chipLoopB: mark(
    "0 0 100 40",
    ["M12 8 C 40 1, 92 4, 95 18 C 98 33, 50 40, 20 35 C 2 31, 3 12, 18 7 C 24 5, 30 5, 36 6"],
    2.4,
  ),
  chipLoopC: mark(
    "0 0 100 40",
    ["M90 10 C 70 1, 14 3, 6 17 C 0 32, 48 40, 80 35 C 100 31, 99 14, 84 8 C 80 7, 74 6, 70 6"],
    2.4,
  ),
```

At the end of the file, after the `CLICK_MARKS` export, add:

```ts
export const CHIP_LOOPS = ["chipLoopA", "chipLoopB", "chipLoopC"] as const satisfies readonly InkName[];
```

- [ ] **Step 2: Create `components/tool-chip.tsx`**

```tsx
import type { SimpleIcon } from "simple-icons";

import { BrandIcon } from "@/components/brand-icon";
import { InkSvg } from "@/components/ink/ink-svg";
import { cn } from "@/lib/cn";
import { CHIP_LOOPS } from "@/lib/ink";

// Spec 6.18. One Toolbox entry: a bigger chip than Chip (6.9), with the
// tool's logo when Simple Icons has one. A static label, not a control.
// `loop` circles it in pen (a tool Gabriel opens every day) with the n-th
// chip loop; hovering the chip boils the loop (`ink-boil`, globals.css).
export function ToolChip({
  name,
  icon,
  loop,
  delay = 0,
}: {
  name: string;
  icon?: SimpleIcon;
  /** Which chip loop circles it, counting across the Toolbox; omit for none. */
  loop?: number;
  /** Seconds before the loop draws in once the group reveals. */
  delay?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9.5 items-center gap-2 whitespace-nowrap rounded-pill border-[1.5px] border-ink bg-sheet pr-3.5 text-[0.9375rem] leading-none font-[550] text-ink",
        icon ? "pl-2.5" : "pl-3.5",
        loop !== undefined && "ink-boil",
      )}
    >
      {icon ? <BrandIcon icon={icon} size={18} decorative /> : null}
      {name}
      {loop !== undefined ? (
        <InkSvg
          name={CHIP_LOOPS[loop % CHIP_LOOPS.length]}
          delay={delay}
          stretch
          className="absolute -top-2.25 -left-3 h-[calc(100%+1.125rem)] w-[calc(100%+1.5rem)]"
        />
      ) : null}
    </span>
  );
}
```

Notes for the implementer: `h-9.5` is 38px; `rounded-pill` and `bg-sheet` are theme tokens (see `components/chip.tsx`); `InkSvg` is already `aria-hidden`, `pointer-events-none` and `print:hidden`, draws in (`ink-draw`) when its enclosing `Reveal` is shown, and uses the `#ink-a` roughness filter by default, which the existing `.ink-boil:is(:hover, :focus-visible)` rules in `app/globals.css` cycle on hover (inside the reduced-motion guard). Do not add CSS.

- [ ] **Step 3: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0. (`ToolChip` is not rendered yet; Task 5 uses it.)

- [ ] **Step 4: Commit**

```bash
git add lib/ink.ts components/tool-chip.tsx
git commit -m "feat(ink): ToolChip with three chip loops"
```

---

### Task 3: Nav: Toolbox link

**Files:**
- Modify: `components/nav.tsx:15-20` (`SECTIONS`)

**Depends on:** none

- [ ] **Step 1: Add the link after About**

```ts
const SECTIONS = [
  { id: "about", label: "About" },
  { id: "toolbox", label: "Toolbox" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;
```

Read the rest of `nav.tsx` to confirm nothing else lists the sections (the desktop row, the phone sheet and the active-section observer all map `SECTIONS`). If anything else hardcodes the list, update it the same way and say so in your report.

- [ ] **Step 2: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/nav.tsx
git commit -m "feat(nav): Toolbox link after About"
```

---

### Task 4: Docs: design spec and CLAUDE.md

**Files:**
- Modify: `docs/v2/DESIGN-SPEC.md` (section 3 line ~62, section 6.8 line ~273, after 6.17, section 7 intro and outline lines ~346-356, a new 7.6 after 7.5)
- Modify: `CLAUDE.md` (the Stack paragraph)

**Depends on:** none

- [ ] **Step 1: Section 3 (Stack)**

Replace the line
`- Brand marks for the stickers come from \`simple-icons\` path data through \`<BrandIcon>\`, never redrawn.`
with
`- Brand marks for the stickers and the Toolbox chips come from \`simple-icons\` path data through \`<BrandIcon>\`, never redrawn. A tool Simple Icons has no mark for shows its name only.`

- [ ] **Step 2: Section 6.8 (Nav)**

In the "Right on `lg+`" bullet, change `links **About / Experience / Projects / Contact** (page order; 16px, 500)` to `links **About / Toolbox / Experience / Projects / Contact** (page order; 16px, 500; Toolbox added 2026-10-31)`.

- [ ] **Step 3: New 6.18 after 6.17 (`BackToTop`)**

Insert after the 6.17 bullets and before the `---` that ends section 6:

```markdown
### 6.18 `ToolChip` (server)

Added 2026-10-31 for the Toolbox (7.6). A bigger sibling of `Chip` (6.9): 38px tall, full pill radius, 1.5px `--ink` border, `--sheet` fill, Bricolage 15px weight 550, no wrap, 14px side padding (10px on the left when there is a logo). Logo: `BrandIcon` 18px in `--ink`, decorative (the name is beside it), no filter. A static label, never a link or focusable.

- **Circled** (`loop` set): one of three hand loops (`chipLoopA/B/C` in `lib/ink.ts`, viewBox 100×40, stroke 2.4) stretched 9px above and below and 12px past each side, in `--pen`, taken in turn across the Toolbox so neighbours differ. It draws in with its group's reveal, about 0.08s after the chip before it. The chip carries `ink-boil`, so the loop boils while the chip is hovered. Reduced motion: drawn, never boils. Hidden in print.
```

- [ ] **Step 4: Section 7 intro and outline**

In the intro paragraph, change `the nav lists the sections in page order: About, Experience, Projects, Contact.` to `the nav lists the sections in page order: About, Toolbox, Experience, Projects, Contact. The Toolbox (2026-10-31, after aahil-khan.xyz's) sits between About and Experience.`

In the outline code block, insert a line after the `About` line:

```
Toolbox      five labelled groups of logo chips, 3 columns; daily tools circled
```

- [ ] **Step 5: New 7.6 after 7.5 (Contact)**

Insert after the 7.5 bullets and before the `---` that ends section 7:

```markdown
### 7.6 Toolbox (`#toolbox`)

Added 2026-10-31, after the Toolbox on aahil-khan.xyz, redrawn as labelled chips (option B of three mockups, laid out in three columns rather than label rows, which echoed Experience).

- H2 **"Toolbox"** (pen underline) with the line **"What I build with, day to day."**
- Groups from `profile.skills`, in order: Languages, Web, Cloud & DevOps, AI & automation, Workbench. Each is a Bricolage 700 19px label over a 2px `--ink` rule, then its `ToolChip`s (6.18) wrapping with 12px row and 10px column gaps. One column on phones, 2 from `sm`, 3 from `lg` (44px row gap, 40px column gap); 3 + 2 at `lg`.
- Logos from Simple Icons where it has one (TypeScript, JavaScript, Node.js, Express, React, Next.js, PostgreSQL, React Native as React, GitHub Actions, GCP as Google Cloud, Docker, LangChain, LangGraph, n8n, Claude Code as Claude, Warp, GitKraken, DBeaver); SQL, AWS, Elastic Beanstalk, S3, Azure, OpenAI API, AWS Bedrock Agents, Vertex AI, VS Code and Granola show their names only.
- `profile.dailyTools` are circled (Docker, VS Code, DBeaver, Warp, GitKraken, Granola, Claude Code, Next.js, PostgreSQL); a build-time check fails if one is not a `skills` item. The legend, Hand **"circled = open every day"** in `--pen` rotated -2deg, is the grid's last cell (the empty sixth at 2 and 3 columns, bottom-aligned; after Workbench on phones). Hidden in print.
- The heading and each group reveal in turn. `/resume` lists the same five groups with plain `Chip`s.
```

- [ ] **Step 6: CLAUDE.md**

In the Stack paragraph, change `` `simple-icons` (sticker logos only) `` to `` `simple-icons` (sticker and Toolbox logos only) ``.

- [ ] **Step 7: Check for em dashes you added**

Run: `git diff | grep '^+' | grep -c '—'`
Expected: `0`.

- [ ] **Step 8: Commit**

```bash
git add docs/v2/DESIGN-SPEC.md CLAUDE.md
git commit -m "docs(spec): Toolbox section, ToolChip, nav link"
```

---

### Task 5: Toolbox section

**Files:**
- Create: `components/home/toolbox.tsx`
- Modify: `app/page.tsx`

**Depends on:** 1, 2

- [ ] **Step 1: Create `components/home/toolbox.tsx`**

```tsx
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

// Each circled tool takes the next chip loop, counting across groups, so
// neighbouring circles are drawn by different hands.
const daily: readonly string[] = profile.dailyTools;
const LOOP_OF = new Map(
  profile.skills
    .flatMap((group) => group.items)
    .filter((item) => daily.includes(item))
    .map((item, i) => [item, i] as const),
);

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
      <div className="mt-11 grid gap-y-11 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
        {profile.skills.map((group, g) => (
          <Reveal key={group.label} index={g + 1}>
            <h3 className="border-b-2 border-ink pb-2.5 text-[1.1875rem] leading-tight font-bold">{group.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-2.5 gap-y-3">
              {group.items.map((item, i) => (
                <li key={item}>
                  <ToolChip name={item} icon={ICONS[item]} loop={LOOP_OF.get(item)} delay={0.2 + i * 0.08} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal index={profile.skills.length + 1} className="sm:self-end">
          <p className="type-hand -rotate-2 text-pen print:hidden">circled = open every day</p>
        </Reveal>
      </div>
    </section>
  );
}
```

`profile` is `as const`, so each group's `items` is a different readonly tuple type. `app/layout.tsx` already calls `profile.skills.flatMap((group) => group.items)`, so that line is known to typecheck; if `group.items.map(...)` does not (a union of tuple types), widen it locally with `const items: readonly string[] = group.items;` inside the group callback and map `items` instead. Do not loosen the types in `profile.ts`.

- [ ] **Step 2: Render it in `app/page.tsx`**

Add `import { Toolbox } from "@/components/home/toolbox";` with the other `@/components/home/*` imports (alphabetical, after `Projects`), render `<Toolbox />` between `<About />` and `<Experience />`, and update the comment above `HomePage` to:

```tsx
// Spec 7: one scroll, each section a different layout family (split hero,
// lead + pinned note, labelled chips, margin-note rows, napkin vs shipped,
// giant type).
```

- [ ] **Step 3: Typecheck and build**

Run: `corepack pnpm typecheck`
Expected: exits 0.
Run: `NODE_ENV=production corepack pnpm build`
Expected: success; `/` is listed as a static route.

- [ ] **Step 4: Check the rendered HTML**

Run (from the worktree, after the build): `corepack pnpm start --port 3311 &` then, once it is up:

```bash
curl -s http://localhost:3311/ | grep -o 'id="toolbox"' | head -1
curl -s http://localhost:3311/ | grep -o 'circled = open every day' | head -1
curl -s http://localhost:3311/ | grep -o 'ink-boil' | wc -l
```

Expected: `id="toolbox"`, the legend text, and at least `9` (one `ink-boil` per circled chip; the hero adds a few more). Stop the server afterwards (`kill %1`). If a sandbox blocks starting the server, skip this step and say so in your report; the controller checks in the browser.

- [ ] **Step 5: Commit**

```bash
git add components/home/toolbox.tsx app/page.tsx
git commit -m "feat(home): Toolbox section between About and Experience"
```

---

### Task 6: Résumé PDF (controller, in the feature worktree after Wave 2 is merged)

**Files:**
- Modify: `public/gabriel-paet-resume.pdf`

**Depends on:** 1, 5

- [ ] **Step 1: Production build and server**

In the feature worktree: `NODE_ENV=production corepack pnpm build`, then serve it (a temporary `.claude/launch.json` entry pointing `next start` at the worktree on port 3301, or `corepack pnpm start --port 3301`).

- [ ] **Step 2: Print**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf=public/gabriel-paet-resume.pdf http://localhost:3301/resume
```

- [ ] **Step 3: Check it**

Run: `pdfinfo public/gabriel-paet-resume.pdf | grep Pages` (the previous one had 2) and `pdftotext public/gabriel-paet-resume.pdf - | grep -A12 Skills`.
Expected: the five groups in order with every item; no "circled" legend or pen text; a page count of 2 (if it grows to 3, report it to Gabriel rather than squeezing the layout).

- [ ] **Step 4: Rebuild** (so `next start` serves the new PDF), then commit

```bash
git add public/gabriel-paet-resume.pdf
git commit -m "chore(resume): regenerate the PDF with the Toolbox groups"
```

---

### Task 7: Verification (controller)

**Depends on:** 1 to 6

- [ ] Chrome (Claude in Chrome, Gabriel's default browser), production build, desktop width: the section sits between About and Experience; 3 columns (3 + 2) with the legend in the sixth cell; logos and names as in spec 7.6; nine loops drawn after the section reveals; hovering a circled chip boils only its loop, and leaving stops it; the nav's Toolbox link scrolls to the section and gets the drawn underline.
- [ ] Narrow widths (built-in pane emulation: the Chrome window cannot resize): 2 columns from 640 to 1023px, 1 column below; `document.documentElement.scrollWidth <= innerWidth` at 320, 375, 768, 1024, 1280; loops not clipped by anything; the nav row still fits on one line at 1024.
- [ ] Dark mode (lamp toggle): chips, logos and loops read on the night page.
- [ ] Reduced motion (emulated): loops drawn and still on hover.
- [ ] `/resume` on screen and the PDF from Task 6.
- [ ] `git log main..HEAD --format=%B | grep -ci '^co-authored-by:'` prints `0`, and every commit's author is `gjvpaet@gmail.com`.
