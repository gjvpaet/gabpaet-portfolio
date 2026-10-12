# gabpaet.dev v2: Design Spec

Status: **approved for build** (decisions settled 2026-10-12). Branch: `v2`.
This file is the design source of truth for v2. Where it conflicts with `portfolio.html`, `DESIGN.md`, `PRODUCT.md` or `HANDOFF.md`, this file wins; those describe v1.

**Design read:** personal portfolio for recruiters and hiring managers (with a developer audience second), in a controlled neo-brutalist language, built on native CSS + Tailwind v4 + Motion. No component library.

**Dials:** `DESIGN_VARIANCE 6` · `MOTION_INTENSITY 5` · `VISUAL_DENSITY 4`.

Reference: Kristina Volchek, "Personal Website Redesign for a Product Designer (NeoBrutalism)", Dribbble shot 21066046. We take its **rules** (dark outlines, solid offset shadows with no blur, flat fills, rounded geometry, wide heavy type, sticker motifs). We do **not** take its layout, candy palette, portrait, cursor/name-tag motif or design-tool stickers.

---

## 1. Goals

1. A recruiter skimming for 30 seconds learns: name, role, focus areas, years, current employer, and finds the resume in one click.
2. Side projects (Tong Masters, portfolio v1) give an engineering audience something concrete to click into.
3. The site is memorable without fighting the content. Personality comes from one moment: the draggable sticker cluster.

### Non-goals / retired from v1

- The IDE metaphor: file tabs, sidebar tree, breadcrumb, gutter, status bar, title bar.
- The command palette (⌘K/⌘P), the Tweaks panel (accent and density pickers).
- The joke pages `package.json` and `.zshrc`, the fake `page.tsx` source page.
- The hidden `writing.md` page. No writing section, no placeholder.
- The public mobile number.

---

## 2. Branching and v1 preservation

Done 2026-10-12:

1. Tag `v1` on `fbbd17f` (last v1 commit on `main`), created on GitHub with the "Portfolio v1" release. The portfolio-v1 case study's Code link points at `github.com/gjvpaet/gabpaet-portfolio/tree/v1`.
2. Vercel project **`gabpaet-portfolio-v1`**, deployed from a `git archive` of the `v1` tag with the CLI (`vercel deploy --prod`, with a deploy-only `vercel.json` setting `"framework": "nextjs"`). It is deliberately **not** connected to git, so v1 stays frozen. Live at `https://gabpaet-portfolio-v1.vercel.app`.
3. Domain `v1.gabpaet.dev` is attached to that project, with a Porkbun CNAME `v1` → `c3dfe16e6bb95f14.vercel-dns-017.com`. Verified by Vercel; serves v1 over HTTPS.
4. Main domain: **`gabpaet.dev` is primary**. `www.gabpaet.dev` 308-redirects to it (path kept), matching the canonical URLs, sitemap and share images. Before this, the apex 307-redirected to `www`, so every v1 canonical pointed at a redirect.
5. Build v2 on `v2`; merge to `main` when the launch checklist (section 15) passes. The existing `gabpaet-portfolio` project then deploys v2.

## 3. Stack

Keep: Next.js 16 App Router, React 19, TypeScript, Tailwind v4 via `@tailwindcss/postcss`, pnpm, Vercel, `@vercel/analytics`, `@vercel/speed-insights`.

Add:

```bash
pnpm add motion @phosphor-icons/react simple-icons
```

- `motion` (import from `motion/react`): reveals, press physics, draggable stickers.
- `@phosphor-icons/react`: all UI icons. Use `weight="bold"` everywhere to match the thick outlines. No hand-drawn SVG icons (v1's inline SVGs are removed).
- `simple-icons`: brand marks for the hero stickers (Claude, Next.js, Node.js, PostgreSQL, Docker). Render the package's `path` data inside one `<BrandIcon>` component; never redraw paths by hand.
- GitHub and LinkedIn marks (contact buttons, footer, case-study Code button) use Phosphor `GithubLogo` / `LinkedinLogo` (bold). `simple-icons` v16 no longer ships a LinkedIn mark, so both social marks come from Phosphor to stay one family.

Fonts via `next/font/google` (self-hosted at build, `display: "swap"`):

- **Archivo** variable, `axes: ["wdth"]`, weights 400 to 800. Variable `--font-archivo`.
- **JetBrains Mono** 400, 500, 600. Variable `--font-mono`.

---

## 4. Design tokens

All tokens are CSS custom properties on `:root` in `app/globals.css`, re-pointed under `:root[data-theme="dark"]`, and exposed to Tailwind via `@theme inline`. The same hex values are mirrored in `lib/tokens.ts` for `next/og` images (which cannot read CSS variables). **Change both together.**

### 4.1 Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F6F7F3` | `#121412` | Page background |
| `--surface` | `#FDFDFB` | `#1C1F1B` | Cards, buttons (secondary), stickers |
| `--ink` | `#1B1C1A` | `#F2F3EE` | Text, **all outlines, all shadows** |
| `--ink-muted` | `#55584F` | `#A3A69C` | Secondary text, dates |
| `--mint` | `#2EE5B4` | `#2EE5B4` | Primary accent **fill** |
| `--yellow` | `#FFD23F` | `#FFD23F` | Supporting accent **fill** |
| `--on-accent` | `#1B1C1A` | `#1B1C1A` | Text/icons on mint or yellow (both modes) |
| `--mint-text` | `#0A7A5C` | `#2EE5B4` | Mint used as text or link hover on page bg |

Measured contrast (WCAG):

| Pair | Ratio |
|---|---|
| ink on bg (light) | 15.9 |
| ink-muted on bg (light) | 6.7 |
| on-accent on mint | 10.6 |
| on-accent on yellow | 11.9 |
| mint-text on bg (light) | 4.9 |
| ink on bg (dark) | 16.6 |
| ink-muted on bg (dark) | 7.5 |
| mint on bg (dark) | 11.4 |

Rules:

- **Mint is never text on the light background** (1.5:1). Use `--mint-text`.
- **Mint** is for primary actions and "the important thing": the Resume button, the current-role card, the contact block, the active nav state.
- **Yellow** is for highlights only: the status chip, the Tong Masters tile backdrop, sticker fills, the `::selection` color.
- No other hues anywhere. Brand logos render monochrome in `currentColor`.
- No gradients, no blur shadows, no glows, no pure `#000`/`#FFF`.

### 4.2 Typography

| Role | Family | Settings | Size | Leading | Tracking |
|---|---|---|---|---|---|
| Display (hero name) | Archivo | `wdth 125`, `wght 800`, uppercase | `clamp(3.25rem, 8vw, 6rem)` | 0.92 | -0.02em |
| H2 (section) | Archivo | `wdth 125`, `wght 800` | `clamp(2.25rem, 5vw, 3.5rem)` | 1.0 | -0.015em |
| H3 (card title) | Archivo | `wdth 110`, `wght 700` | 1.375rem | 1.25 | -0.01em |
| Body | Archivo | `wdth 100`, `wght 400` | 1.0625rem | 1.6 | 0 |
| Body small | Archivo | `wdth 100`, `wght 400` | 0.9375rem | 1.55 | 0 |
| Button | Archivo | `wdth 110`, `wght 700` | 1rem | 1 | 0 |
| Meta (dates) | JetBrains Mono | 500 | 0.875rem | 1.4 | 0 |
| Chip | JetBrains Mono | 500 | 0.8125rem | 1 | 0 |

- Body max width `65ch`.
- Emphasis inside headings uses the same family (weight or a mint highlight block), never a second family.
- Every heading is a real `<h1>`/`<h2>`/`<h3>` (fixes v1's `div.h1`). One `<h1>` per page.

### 4.3 Shape

**One radius rule, applied everywhere:**

| Element | Radius |
|---|---|
| Cards, panels, tiles, screenshot frames, contact block | 16px (`--r-card`) |
| Buttons, inputs, stickers, theme toggle | 12px (`--r-control`) |
| Chips, status pill | 999px (`--r-pill`) |

### 4.4 Outline and shadow

Shadows are solid `var(--ink)` blocks offset down-right, zero blur.

| Token | Value | Used on |
|---|---|---|
| `--border` | `3px solid var(--ink)` | Cards, buttons, stickers, frames, nav bottom edge |
| `--border-thin` | `2px solid var(--ink)` | Chips, toggle track |
| `--shadow-sm` | `3px 3px 0 0 var(--ink)` | Chips (interactive only), small controls |
| `--shadow-md` | `5px 5px 0 0 var(--ink)` | Buttons, cards, tiles |
| `--shadow-lg` | `8px 8px 0 0 var(--ink)` | Stickers, featured project tile, contact block |

### 4.5 Spacing and layout

- Container: `max-w-[1200px] mx-auto px-4 md:px-8`.
- Section padding: `py-16 md:py-24`. Hero top padding never exceeds `pt-24`.
- Grid gaps: `gap-6` (cards), `gap-3` (chips).
- Breakpoints: Tailwind defaults (`md 768`, `lg 1024`). Every multi-column layout collapses to one column below `md`.

### 4.6 Z-index scale (`lib/z.ts`)

`base 0` · `sticker 10` · `sticker-dragging 20` · `nav 40` · `mobile-menu 50` · `toast 60`.

---

## 5. Motion

Library: Motion (`motion/react`). Every animated component is a `"use client"` leaf. Everything below collapses to instant/static under `prefers-reduced-motion: reduce` (`useReducedMotion()` in Motion; a `@media` block in CSS).

| Interaction | Spec | Why |
|---|---|---|
| **Press** (buttons, clickable cards, chips that link) | Rest: `--shadow-md`. Hover: `translate(-2px,-2px)`, shadow 7px. Active: `translate(5px,5px)`, shadow 0. CSS transition `transform, box-shadow 120ms cubic-bezier(0.16,1,0.3,1)`. | Feedback: the element physically sinks into its shadow. |
| **Section reveal** | From `opacity 0, translate 0 24px` to rest, 0.5s, ease `[0.16,1,0.3,1]`, once, when any part is 15% above the viewport bottom. Siblings stagger 0.06s (project tiles, about columns). Built as CSS transitions toggled by `components/reveal.tsx` (IntersectionObserver), hidden only under a `.js` class set before paint, so no-JS visitors see everything. Not Motion `whileInView`, whose SSR output would ship the hidden state. | Storytelling: content arrives in reading order. |
| **Hero entrance** | Status chip, name, subtext, buttons rise in (CSS keyframes, 0.5s, 0.08s stagger) on first paint without waiting for JS. Stickers then drop in from 40px above with a small overshoot (`cubic-bezier(0.34,1.56,0.64,1)`), from 320ms, staggered 0.05s. They keep their tilt during the drop (Motion owns `rotate` for dragging). | Hierarchy: who you are first, personality second. |
| **Draggable stickers** | `drag`, `dragConstraints={heroBoardRef}`, `dragElastic 0.2`, `dragSnapToOrigin`, snap-back spring `{stiffness:300, damping:20}`. `whileDrag`: `scale 1.06`, rotate to 0, shadow `--shadow-lg` + 4px, `z sticker-dragging`, `cursor: grabbing`. Enabled only when `(pointer: fine)` and motion is allowed; otherwise static. | Feedback and the site's one playful moment. |
| **Copy email** | Label swaps "Copy email" to "Copied" with a 150ms crossfade, reverts after 2s. | State change. |
| **Theme toggle** | Knob slides 200ms; no page-wide transition (avoid repaint flash). | State change. |

Banned: marquees, scroll listeners (`window.addEventListener("scroll")`), parallax, infinite loops, custom cursors, GSAP.

---

## 6. Components

Folder: `components/` (flat, one component per file). Server components by default; client leaves marked.

### 6.1 `Button` / `ButtonLink`

- Variants: `primary` (mint fill, `--on-accent` text), `secondary` (`--surface` fill, `--ink` text). Both 3px border, `--r-control`, `--shadow-md`, press motion. Height 48px, padding-x 20px, label one line, optional Phosphor icon (20px, bold) on the left.
- `focus-visible`: `outline: 3px solid var(--ink); outline-offset: 4px`.
- Disabled: 50% opacity, no shadow, no press.

### 6.2 `Chip`

- `tech` chip: mono, `--surface` fill, 2px border, `--r-pill`, no shadow (static label). Padding `4px 10px`.
- `status` chip: yellow fill, 2px border, `--shadow-sm`, Archivo 600 0.875rem, Phosphor `ChatCircleDots` icon. Text: **"Not actively looking, open to a chat"**. This is the one eyebrow on the page.

### 6.3 `Card`

`--surface` fill, 3px border, `--r-card`, `--shadow-md`, padding `24px` (`md: 28px`). Variant `current`: mint fill. Clickable cards get the press motion; static cards do not.

### 6.4 `Sticker` (client)

- 88px square desktop (64px mobile), `--r-control`, 3px border, `--shadow-lg`, logo 44px in `currentColor`.
- Set and fills (left to right on the board, fills alternate so no two neighbors match):

| Sticker | Content | Fill | Rest rotation |
|---|---|---|---|
| 1 | Claude logo | mint | -8deg |
| 2 | Next.js logo | surface | 6deg |
| 3 | `>_` keycap (JetBrains Mono 600, 28px) | ink (text `--bg`) | -4deg |
| 4 | Node.js logo | yellow | 10deg |
| 5 | PostgreSQL logo | surface | -6deg |
| 6 | Docker logo | mint | 4deg |

- `aria-hidden="true"` on each sticker; the board has a visually hidden sentence "Tools I use daily: Claude, Next.js, Node.js, PostgreSQL and Docker." The keycap is decorative.
- Desktop: absolutely positioned on a bounded "board" (the right 5 columns of the hero), loosely clustered and overlapping by up to 16px. Mobile: a single wrapping row under the buttons, static, smaller.

### 6.5 `Nav` (client for the mobile menu only)

- Sticky, height 64px (`md: 72px`), `--bg` fill. Gains a 3px bottom border once the hero is out of view (IntersectionObserver on the hero, not a scroll listener).
- Left: `GP` monogram tile (40px, mint, 3px border, `--shadow-sm`) + "Gabriel Paet" (Archivo `wdth 110` 700).
- Right (≥ `lg`, 1024px): links **Experience / Projects / About**, `ThemeToggle`, `ButtonLink secondary` **"Get in touch"** → `/#contact`. Links get a 3px mint underline on hover and when their section is in view.
- Below `lg`: monogram + toggle + menu button (Phosphor `List`; `X` when open). The full row does not fit on one line at 768px, so the menu covers tablets too. The menu opens as a full-width sheet under the nav with 32px links and the "Get in touch" button; focus is trapped, Esc closes, it closes on navigation.
- One line at all widths ≥ `lg`.

### 6.6 `ThemeToggle` (client)

- Chunky switch: 56×32 track, 2px border, `--r-pill`, knob 24px with a Phosphor `Sun` / `Moon` (bold, 14px). `role="switch"`, `aria-checked`, label "Dark mode".
- Behaviour: first visit follows `prefers-color-scheme`. Clicking stores an explicit choice in `localStorage["gabpaet.theme.v2"]` (`"light" | "dark"`). A tiny pre-hydration inline script in `app/layout.tsx` sets `data-theme` before paint (it is the only copy of this logic besides the toggle; keep the storage key in `lib/theme.ts` and import the constant into both).
- `<meta name="theme-color">` has light and dark entries (`#F6F7F3`, `#121412`).

### 6.7 `SectionHeading`

`<h2>` at H2 scale, left-aligned, optional one-line body below at `--ink-muted`, `max-w-[65ch]`. **No eyebrows, no numbering, no right-floating explainer.**

### 6.8 `TimelineItem`

See section 7.2.

### 6.9 `ProjectTile`

See section 7.3. Whole tile is one link (`<a>` wrapping), press motion, `aria-label` with the project name.

### 6.10 `ScreenshotFrame`

`next/image` inside a 3px border, `--r-card`, `--shadow-md`, `overflow-hidden`, fixed aspect ratio (desktop 16:10, phone 9:19.5) so there is no layout shift. Optional caption below the frame (never overlaid), Archivo small, `--ink-muted`.

### 6.11 `CopyEmailButton` (client)

`secondary` button with Phosphor `Copy` icon, label "Copy email". On success: label "Copied", icon `Check`. If the Clipboard API is unavailable or rejects: select the email text in place and show "Press ⌘C to copy" (Ctrl+C on non-Mac) for 3s. Announces via an `aria-live="polite"` region.

### 6.12 `BrandIcon`

`<svg viewBox="0 0 24 24" role="img" aria-label={title}><path d={icon.path} fill="currentColor"/></svg>` from `simple-icons`. Used for the hero stickers only.

### 6.13 `Footer`

3px top border. Left: "© 2026 Gabriel Joshua Paet". Right: text links **Resume**, **GitHub**, **LinkedIn**, **v1 of this site** (→ `https://v1.gabpaet.dev`). Wraps to stacked lines on mobile.

### 6.14 `ArchitectureDiagram` (case studies)

Plain HTML/CSS: outlined boxes (`Card` styling at small scale, mono labels) joined by 3px ink connector lines and Phosphor `ArrowRight` icons. Stacks vertically on mobile. No images, no hand-drawn SVG art.

---

## 7. Home page `/`

Single scroll. Every section uses a different layout. One eyebrow on the page (the hero status chip).

```
Nav
Hero            split: text 7 cols / sticker board 5 cols
Experience      vertical timeline
Projects        2-cell bento
About           bio column + skills panel
Contact         full-width mint block
Footer
```

### 7.1 Hero (`<section aria-labelledby="hero-name">`)

- **Status chip:** "Not actively looking, open to a chat"
- **H1 (display):** full name, one word per line: "Gabriel" / "Joshua" / "Paet" (uppercase via CSS; the DOM text is `profile.name`, "Gabriel Joshua Paet", with the line breaks done in CSS, e.g. each word in a `display: block` span). The longest line ("GABRIEL") must fit the text column without wrapping at every width from 375px up. The nav keeps the short "Gabriel Paet".
- **Subtext (17 words):** "Senior programmer building AI agents, workflow automation, and the cloud infrastructure that runs them. 9 years shipping."
- **Buttons:** `primary` **"Resume"** (Phosphor `FileText`) → `/resume`. `secondary` **"See projects"** (Phosphor `ArrowDown`) → `/#projects`.
- **Right:** sticker board (6.4).
- Fits the first viewport at 1280×720 and 375×812 with buttons visible. Padding `pt-12 md:pt-20 pb-16 md:pb-24`.
- Mobile: single column; stickers become a static row under the buttons.

### 7.2 Experience (`#experience`)

- H2 **"Experience"**. No intro line.
- Vertical timeline: a 3px ink rail on the left (desktop) with a 16px square node per entry, each node a mint or surface fill matching its card. Cards to the right of the rail. Mobile: rail hidden, cards stacked.
- Each card: dates (mono, `--ink-muted`) · H3 title · company (Archivo 600) · work mode · 1 to 2 impact highlights (body small, Phosphor `ArrowRight` bullets) · up to **6** tech chips (full lists live on `/resume`).
- Lumora card uses the `current` (mint) variant.
- ahaStudio renders as one card with both titles (Programmer → Senior Programmer) to show the promotion.
- HPE renders as a compact one-line card (dates, title, company, one highlight, no chips).

Entries and draft copy (from v1 text; **every highlight marked VERIFY must be confirmed by Gabriel before launch; no invented numbers**):

| Dates | Role | Highlights (draft) | Chips (home) |
|---|---|---|---|
| 2026-05 to now | Senior Programmer, **Lumora Capital** · Hybrid | "Building Centra, Lumora's proprietary loan origination and servicing system." (confirmed, from LinkedIn) VERIFY: "Automating manual operations with n8n and agent tooling, including Claude Code in the daily workflow." | Next.js, Node.js, PostgreSQL, n8n, GCP, Docker |
| 2024-01 to 2026-04 | Programmer → Senior Programmer, **ahaStudio** (a Volenday Group studio) · Hybrid | VERIFY: "Shipped LLM features with LangChain, LangGraph, OpenAI, AWS Bedrock Agents and Vertex AI." VERIFY: "Built web and mobile apps across Next.js, React Native and Flutter." | LangChain, LangGraph, Bedrock, Next.js, React Native, Supabase |
| 2017-05 to 2024-01 | Programmer, **Volenday Group** · Remote | "Built a React Native app with Danish and Norwegian language support, plus its REST API." "Led a team as scrum master for a web app serving offshore employees, and migrated it to Azure with MSSQL and Azure File Share for faster deploys." | React Native, Node.js, Next.js, Azure, MSSQL, MongoDB |
| 2015-11 to 2016-04 | Intern, **Hewlett Packard Enterprise** · Taguig | "Built a C# (MVVM) app to track employee FTE allocations and requirements." | none |

### 7.3 Projects (`#projects`)

- H2 **"Projects"**.
- Bento with exactly 2 cells. Desktop: `grid-cols-12`, Tong Masters `col-span-8`, v1 `col-span-4`, equal height. Mobile: stacked.
- **Tong Masters tile** (featured): `--shadow-lg`. Top area: yellow fill with a desktop screenshot in a `ScreenshotFrame`, tilted -2deg, overlapping the tile's bottom edge of that area by 24px. Below: H3 "Tong Masters", one line "Real-time multiplayer Tong-its in the browser, with bots and a guided tutorial.", chips `Next.js` `Cloudflare` `Durable Objects` `TypeScript`, and a row with Phosphor `ArrowUpRight` "Case study". Links to `/projects/tong-masters`.
- **Portfolio v1 tile**: surface fill, v1 screenshot (shows the IDE look, which is visually distinct from v2 and makes a good contrast tile). H3 "Portfolio v1", one line "The previous version of this site, styled as a code editor.", chips `Next.js` `Tailwind`, "Case study". Links to `/projects/portfolio-v1`.

### 7.4 About (`#about`)

- Layout: `grid-cols-12`. Left `col-span-5`: H2 **"About"** + bio. Right `col-span-7`: skills panel. Mobile: stacked.
- **Bio draft (VERIFY voice):** personal, about why he builds. **Must not mention Lumora or his current role**; Experience covers that. "I love building things that interest me, whether it's a tool that makes a tedious job disappear or a weekend idea that turns into something real. Tong Masters started that way: I wanted an online Tong-its game so friends and family could play together, so I built one. I'd rather see a thing all the way through, from the first rough version to something people actually use. Nine years of building web and mobile apps later, that's still the part I enjoy most."
- Pull line under the bio, H3 scale, with a yellow highlight block behind it: "Always view problems as an opportunity."
- **Skills panel:** one `Card`, three labeled rows (label: Archivo 700 1rem; chips wrap below). Rows separated by spacing only, no rules.
  - **AI & automation:** LangChain, LangGraph, OpenAI API, AWS Bedrock Agents, Vertex AI, n8n, Claude Code
  - **Cloud & DevOps:** AWS, Elastic Beanstalk, S3, GitHub Actions, Azure, GCP, Docker
  - **Web:** Node.js, Express, React, Next.js, PostgreSQL, React Native

### 7.5 Contact (`#contact`)

- Full-width block inside the container: mint fill, 3px border, `--r-card`, `--shadow-lg`, padding `48px` (`md: 64px`). Text `--on-accent` (dark in both themes).
- H2 **"Get in touch"**.
- Line: "Not actively looking, but always happy to talk about AI, automation or web work."
- Email `hello@gabpaet.dev` at H3 scale as a `mailto:` link, then a button row: `CopyEmailButton`, `ButtonLink secondary` LinkedIn (Phosphor `LinkedinLogo`), `ButtonLink secondary` GitHub (Phosphor `GithubLogo`). Buttons on mint use `--surface` fill.
- No form. No phone number.

---

## 8. Project case studies `/projects/[slug]`

Static routes generated from `content/projects.ts` (`generateStaticParams`). Target length: about 1.5 screens of reading.

Template:

1. Back link "All projects" → `/#projects`.
2. H1 (H2 scale, it is the page's only h1), one-line summary, buttons: `primary` **"Live site"** (`ArrowUpRight`) and, when public, `secondary` **"Code"** (Phosphor `GithubLogo`).
3. Screenshots: one desktop `ScreenshotFrame` full width, plus one phone frame beside it on desktop (stacked on mobile).
4. **What it is:** 2 to 3 sentences.
5. **How it's built:** stack chips + `ArchitectureDiagram`.
6. **Hard problems:** 2 to 3 entries, each an H3 + 2 sentences. Rendered as a 2-column grid of `Card`s on desktop (or one column if there are 3, to avoid a 3-equal-card row).
7. **What's next:** 2 to 3 sentences.
8. Credits line when contributors exist.

### 8.1 `/projects/tong-masters`

- Live: `https://tongmasters.gabpaet.dev`. Repo is private: **no Code button**.
- Summary: "Real-time multiplayer Tong-its in the browser, with bots and a guided tutorial."
- Architecture (named publicly, approved): Next.js web app on Vercel (runs solo games in the browser) → PartyServer rooms on Cloudflare Durable Objects (server-authoritative online tables) → D1 for guest wallets, chip ledger and play stats. The pure TypeScript rules engine and bot (`packages/engine`, unit tested with Vitest) is a library used by both the web app and the rooms, so the diagram names it inside both nodes instead of drawing it as a step.
- Hard problems (drafts, VERIFY wording): server-authoritative multiplayer with bots filling empty seats; a pure, test-driven rules engine shared by client and server; virtual chips that can never be bought or cashed out, by design.
- Credits: "Built with contributions from Koddi Evangelista." (Add Nicolas Recto only if In Between returns to the home page.)
- Screenshots (captured 2026-10-12, headless Chrome at 2x, saved as WebP in `public/projects/tong-masters/`): desktop 1440×900 of `/solo` mid-hand, and phone 390×844 of the home screen (the table itself is landscape-only on phones, so the portrait phone frame shows the home screen).

### 8.2 `/projects/portfolio-v1`

- Live: `https://v1.gabpaet.dev`. Code: `https://github.com/gjvpaet/gabpaet-portfolio/tree/v1`.
- Summary: "The previous version of this site, styled as a code editor."
- Architecture: `content/files.ts` registry → routes and IDE chrome (pages, sidebar, tabs, command palette, sitemap all read it). Theming is covered under Hard problems, not drawn as a step.
- Hard problems (drafts): one source of truth for an IDE-style navigation; theme and accent switching without a flash on first paint; making an IDE layout usable on a phone.
- What's next: "Retired in favour of v2, kept live as a reference."
- Screenshots (captured 2026-10-12 from `gabpaet.dev/about`, which still served v1; identical to what `v1.gabpaet.dev` will serve): desktop 1440×900 and phone 390×844, saved as WebP in `public/projects/portfolio-v1/`.

---

## 9. Resume `/resume`

- Same content source as the home page (`content/profile.ts`), but complete: every role with all highlights and **full** chip lists, education/internship, skills groups, contact (email, LinkedIn, GitHub, site). No phone.
- Screen view: single column `max-w-[800px]`, neo-brutalist cards like the home page, plus a `primary` button **"Download PDF"** (`DownloadSimple`) → `/gabriel-paet-resume.pdf` and a `secondary` "Print".
- Print stylesheet (`@media print`): hide nav, footer, buttons and theme toggle; force light tokens; remove shadows; borders 1px; A4 and Letter safe margins (`@page { margin: 14mm }`); avoid breaking inside a role (`break-inside: avoid`).
- The PDF in `public/gabriel-paet-resume.pdf` is produced by printing `/resume` from a **production** build (the dev server's overlay would print) and committing it: Chrome Print → Save as PDF, or headless Chrome `page.pdf({ preferCSSPageSize: true })`, which picks up the `@page` A4 size and 14mm margins. Regenerate whenever `content/profile.ts` or `content/projects.ts` changes (checklist item).
- Sections: header (name, role and location, contact links shown as bare URLs so they read on paper, hero line), Experience (every role, every highlight, full chip list), Skills, Projects (name, URL, summary). No Education section until Gabriel supplies education details.

---

## 10. Content model (`content/profile.ts`)

Single typed source for the home page, `/resume`, JSON-LD, the OG image and `metadata`.

```ts
export type Role = {
  company: string;
  companyNote?: string;            // "a Volenday Group studio"
  titles: { title: string; from: string; to?: string }[]; // promotion history, newest first
  mode: "Remote" | "Hybrid" | "On-site";
  location?: string;
  highlights: string[];            // first 2 shown on home
  stack: string[];                 // first 6 shown on home
  current?: boolean;
  compact?: boolean;               // HPE
};

export type Project = {
  slug: "tong-masters" | "portfolio-v1";
  name: string;
  summary: string;
  liveUrl: string;
  codeUrl?: string;
  stack: string[];
  featured?: boolean;
  screenshots: { src: string; alt: string; kind: "desktop" | "phone" }[];
  whatItIs: string;
  architecture: { label: string; detail?: string }[];
  hardProblems: { title: string; body: string }[];
  whatsNext: string;
  credits?: string;
};

export const profile = {
  name: "Gabriel Joshua Paet",
  shortName: "Gabriel Paet",
  role: "Senior Programmer",
  location: "Pasay City, Philippines",
  yearsShipping: 9,                 // first full-time role 2017-05
  status: "Not actively looking, open to a chat",
  email: "hello@gabpaet.dev",
  links: { github: "https://github.com/gjvpaet", linkedin: "https://www.linkedin.com/in/gjvpaet/" },
  heroLine: "Senior programmer building AI agents, workflow automation, and the cloud infrastructure that runs them. 9 years shipping.",
  bio: "...",
  motto: "Always view problems as an opportunity.",
  skills: { "AI & automation": [...], "Cloud & DevOps": [...], Web: [...] },
  roles: [/* Role[] newest first */],
} as const;
```

`heroLine` interpolates `yearsShipping` so the number exists once.

---

## 11. Dark mode

- `data-theme="light" | "dark"` on `<html>`; default from `prefers-color-scheme`; manual override persisted (6.6).
- Token swap only (table 4.1). Outlines and shadows become `#F2F3EE`. Mint and yellow fills are identical in both modes and always carry dark text (`--on-accent`).
- Screenshots get no dark treatment; their 3px border carries the theme.
- Test every section in both modes before calling a component done.

---

## 12. Accessibility

- Semantic landmarks: `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<footer>`; one `<h1>` per page; logical h2/h3.
- "Skip to content" link, first focusable element, visible on focus (mint fill, 3px border).
- Focus ring on every interactive element: `outline 3px solid var(--ink)`, `offset 4px`. Never removed.
- All text pairs from table 4.1 pass AA; body text passes AAA in both modes.
- Hit targets ≥ 44×44px.
- Stickers are `aria-hidden` with a visually hidden equivalent sentence; dragging is never required for anything.
- Mobile menu: focus trap, Esc to close, `aria-expanded` on the trigger.
- Reduced motion: all of section 5 collapses to static.
- Images: meaningful `alt` on screenshots ("Tong Masters game table on desktop, three players mid-hand").

---

## 13. SEO, metadata, redirects

- `metadataBase: https://gabpaet.dev`. Title default "Gabriel Joshua Paet, Senior Programmer"; template "%s | Gabriel Joshua Paet". Description from `profile`.
- **Canonical per page** (fixes v1, where every page pointed to `/`): `/`, `/resume`, `/projects/tong-masters`, `/projects/portfolio-v1`. Do not set `alternates.canonical` in the root layout.
- `app/sitemap.ts`: those four URLs. `app/robots.ts`: allow all.
- JSON-LD `Person`: `name`, `jobTitle`, `worksFor` (Lumora Capital), `address` (Pasay City, PH), `email`, `url`, `sameAs` **GitHub and LinkedIn** (v1 missed LinkedIn), `knowsAbout` from `skills`. Plus `WebSite`.
- Permanent redirects in `next.config.ts`:

| From | To |
|---|---|
| `/about` | `/#about` |
| `/work` | `/#experience` |
| `/contact` | `/#contact` |
| `/projects/gabpaet-dev/readme` | `/projects/portfolio-v1` |
| `/projects/gabpaet-dev/page-tsx` | `/projects/portfolio-v1` |
| `/package` | `/` |
| `/zshrc` | `/` |
| `/writing` | `/` |

- **OG image** (`app/opengraph-image.tsx`, 1200×630, static): `--bg` light background, 6px ink border inset 32px with 12px shadow; full name from `profile.name`, stacked one word per line like the hero ("GABRIEL" / "JOSHUA" / "PAET", about 104px, leading 0.92, left-aligned), in Archivo Expanded ExtraBold; role line in Archivo; yellow status chip; two stickers (Claude, `>_`) tilted at the right. Colors from `lib/tokens.ts`. Fonts: static TTF instances in `assets/fonts/` (`Archivo-Expanded-ExtraBold.ttf` = wdth 125 / wght 800, `Archivo-Medium.ttf`, `JetBrainsMono-SemiBold.ttf`, all OFL, fetched from Google Fonts' static instances) since Satori does not read variable axes. The renderer lives in `lib/og.tsx`; the title shrinks below 104px only when its longest word would not fit beside the stickers. Per-project OG images (`app/projects/[slug]/opengraph-image.tsx`) reuse it with the project name, summary and a "Case study" chip.
- **Favicon:** `app/icon.tsx` (32×32): "GP" in Archivo Expanded ExtraBold, ink on mint, rounded 6px tile with a 2px ink border. `app/apple-icon.tsx` (180×180) is a full-bleed mint square with no outline, because iOS rounds the corners itself and would clip an outline unevenly. `app/favicon.ico` is deleted.
- **Meta description and title** come from `profile.metaDescription` and `profile.name` / `profile.role`; JSON-LD is built from `profile` (current employer from the `current` role, `knowsAbout` from the skill groups).

---

## 14. States and edge cases

- **404** (`app/not-found.tsx`): H1 "Page not found", one line "That page moved or never existed.", `primary` button "Back home". A single tilted `>_` sticker.
- **Copy email failure:** see 6.11.
- **No JS:** page fully readable; theme follows the system setting; stickers static. The mobile menu button does nothing without JS, which is acceptable because the home page is a single scroll and every section is reachable by scrolling; the footer links cover Resume, GitHub, LinkedIn and v1.
- **Images:** fixed aspect-ratio frames, `next/image` with `sizes`; hero has no images, so LCP is the H1 text.
- **Long names in chips:** chips wrap as whole units, never mid-word.

---

## 15. Build checklist

Order matters; each step should leave the site buildable.

1. [x] On `v2`: remove v1 IDE code (`app/(ide)`, `components/ide/*`, `context/*`, `lib/tweaks.ts`, `lib/files.ts`, `content/*.tsx`, v1 tokens in `globals.css`). Move v1 reference docs out of the way (`portfolio.html`, `HANDOFF.md`, `DESIGN.md`, `PRODUCT.md` are preserved on the `v1` tag; delete or replace them on `v2`).
2. [x] Install `motion`, `@phosphor-icons/react`, `simple-icons`. Wire Archivo (wdth axis) + JetBrains Mono via `next/font`.
3. [x] Tokens: `globals.css` (light + dark), `lib/tokens.ts`, `lib/z.ts`, `lib/theme.ts`, pre-hydration theme script.
4. [x] `content/profile.ts` and `content/projects.ts` with draft copy from sections 7 to 8.
5. [x] Primitives: Button, Chip, Card, BrandIcon, ScreenshotFrame, SectionHeading, ThemeToggle, CopyEmailButton.
6. [x] Nav + Footer + skip link + `not-found`.
7. [x] Home sections in order: Hero (static first), Experience, Projects, About, Contact.
8. [x] Motion layer: press, reveals, hero entrance, draggable stickers. Verify reduced motion.
9. [x] Capture screenshots (both projects; v1 from gabpaet.dev while it still served v1) as WebP into `public/projects/<slug>/`.
10. [x] Case study pages + ArchitectureDiagram.
11. [x] `/resume` + print stylesheet; generate and commit the PDF.
12. [x] Metadata, canonicals, JSON-LD, sitemap, robots, redirects, OG images, icons.
13. [x] v1 preservation (section 2): tag, Vercel project, `v1.gabpaet.dev`, apex made primary.
14. [ ] Gabriel verifies every VERIFY string.
15. [ ] QA: `pnpm typecheck`, `pnpm build`; both themes; 375px, 768px, 1280px; keyboard-only pass; reduced motion; Lighthouse (Performance ≥ 90, Accessibility ≥ 95, SEO 100); all redirects return 308 to the right anchor; zero em dashes in visible copy.
16. [ ] Merge `v2` → `main`.

---

## 16. Pre-flight (design rules to re-check before merge)

- One accent (mint) + one supporting (yellow); no other hues; mint never as text on light bg.
- Radius rule (4.3) holds everywhere; every outline is 2 or 3px ink; every shadow is solid, zero blur, down-right.
- Hero: 4 text elements max, name stacked on exactly 3 lines (one word each, nothing wraps mid-line), subtext ≤ 20 words, buttons visible without scrolling at 1280×720 and 375×812.
- One eyebrow on the page (status chip). No section numbers, no scroll cues, no marquee, no decorative dots, no labels on images.
- No duplicate CTA intent: "Resume" (resume), "See projects" (projects), "Get in touch" (contact), "Copy email" (copy), "Live site" / "Code" (project links).
- Each home section uses a distinct layout family (split, timeline, bento, column + panel, full-width block).
- Copy self-audit: no em dashes, no invented metrics, every VERIFY resolved.
- Both themes and reduced motion tested.
