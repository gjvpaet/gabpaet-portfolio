# Handoff: Gabriel Joshua Paet — Portfolio (IDE concept)

## Overview

A personal developer-portfolio site for **Gabriel Joshua Paet** (Senior Programmer, Lumora Capital), themed as a code editor. Sections of the portfolio (about, work, contact, projects, etc.) are presented as **files in an IDE** — sidebar file tree, tabs, breadcrumb, gutter line numbers, status bar, ⌘K command palette.

Target domain: `gabpaet.dev`.

---

## About the design files

The HTML file in this folder (`portfolio.html`) is a **design reference**, not production code to ship. It's a working interactive prototype built with vanilla HTML + CSS + inline JS so it can be opened in a browser and clicked around. The handoff task is:

> **Recreate this design as a real Next.js application using the existing stack and conventions of the target codebase. Match it pixel-for-pixel and beat-for-beat for behavior.**

Recommended stack (matches Gabriel's existing comfort zone):

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** (with custom theme tokens) — or vanilla CSS modules if preferred
- **Deploy on Vercel** (or DigitalOcean App Platform)
- **No backend required** — content is static. A small contact form later would call any serverless endpoint.

Do **not** copy `portfolio.html` verbatim into a `public/` folder and link to it. Rebuild as proper React components so the site is crawlable, fast, accessible, and editable file-by-file.

---

## Fidelity

**High-fidelity.** The prototype has the final colors, typography, spacing, interactions, and copy. Implementer should match it pixel-for-pixel.

The one place where you have license to deviate: **routing**. The prototype keeps "open file" in component state. For a real site, prefer **real URLs** (one per file) so links are shareable and SEO-friendly. See the routing section below.

---

## Suggested project architecture (Next.js App Router)

```
app/
├─ layout.tsx                     # Root layout: IDE shell — title bar, sidebar, status bar, tweaks panel
├─ page.tsx                       # Redirects to /about
├─ (files)/                       # Route group; the IDE shell from layout wraps every child
│  ├─ about/page.tsx
│  ├─ work/page.tsx
│  ├─ contact/page.tsx
│  ├─ writing/page.tsx           # Built but hidden — link only when ready
│  ├─ package.json/page.tsx      # Use a slug if Next.js dislikes the dot — e.g. /package
│  ├─ zshrc/page.tsx
│  └─ projects/
│     └─ gabpaet-dev/
│        ├─ page-tsx/page.tsx
│        └─ readme/page.tsx
│
components/
├─ ide/
│  ├─ title-bar.tsx
│  ├─ sidebar/
│  │  ├─ index.tsx
│  │  ├─ file-tree.tsx
│  │  └─ sidebar-footer.tsx
│  ├─ tabs.tsx
│  ├─ breadcrumb.tsx
│  ├─ gutter.tsx
│  ├─ status-bar.tsx
│  ├─ command-palette.tsx        # ⌘K modal
│  └─ tweaks-panel.tsx
├─ doc/
│  ├─ heading.tsx                # h1 with # prefix, h2 with ## prefix
│  ├─ meta-grid.tsx              # the key/value `name: "..."` table
│  ├─ work-row.tsx               # one role
│  ├─ stack-chip.tsx
│  ├─ status-pill.tsx
│  ├─ callout-quote.tsx          # the left-bar accent quote
│  └─ code-block.tsx             # syntax-highlighted source for .rs/.ts/.go/.json/.sh
│
content/
├─ files.ts                       # Single source of truth: file metadata + content
├─ about.mdx                      # one .mdx per "file"
├─ work.mdx
├─ contact.mdx
├─ writing.mdx
├─ projects/
│  └─ gabpaet-dev/
│     ├─ page-tsx.mdx
│     └─ readme.mdx
├─ package.json.mdx
└─ zshrc.mdx
│
lib/
├─ files.ts                       # Helpers: getFile(slug), getFileOrder()
└─ tweaks.ts                      # localStorage-persisted tweak state
│
public/
└─ fonts/                         # Self-host JetBrains Mono (or use next/font/google)
```

Why MDX: lets Gabriel edit `work.mdx` like a normal markdown file and still embed `<StackChip>` and `<WorkRow>` components. Cleanest editing experience.

Alternative: skip MDX, just type the content as plain TS data in `content/files.ts`. Simpler for V1.

---

## Screens (each is one "file")

All screens render inside the same IDE chrome (title bar, sidebar, tabs, breadcrumb, gutter, status bar). The active tab and the doc body are what changes.

### 1. `about.md` (default landing)
- **Purpose**: Hero / intro. Who he is, what he does, current status, focus areas.
- **Sections**:
  - `# Gabriel Joshua Paet` heading with green `#` prefix, blinking caret after name
  - Subline: `senior programmer · pasay city, ph · 9 years shipping`
  - **Status pill** (orange dot, "currently @ Lumora Capital · not actively looking")
  - Pull-quote: `> Always view problems as an opportunity.`
  - **`## about`** with `// the basics` annotation — key/value meta grid (name, role, based_in, years, primary_stack, currently_at)
  - **`## focus`** — bulleted list of AI dev / workflow automation / DevOps / web dev
  - **`## currently`** — left-bar accent quote about Lumora
  - **Quick-action buttons**: `say hello` (→ /contact), `see work` (→ /work), `github` (→ external)

### 2. `work.md`
- **Purpose**: Full work history with skill chips per role.
- **Layout**: `## employment` heading then a vertical timeline. Each role is a row with:
  - **Year column** (100px wide, dim color, monospace tabular): `2026·05 →` etc.
  - **Body column**: title line, optional description, then chip row
- **Five roles** (in order):
  1. Lumora Capital · Senior Programmer · May 2026 → · Philippines · Hybrid · _no description_ · 15 chips
  2. ahaStudio · Senior Programmer · Sep 2024 – Apr 2026 · 1 yr 8 mos · Hybrid · _no description_ · 24 chips (full AI stack)
  3. ahaStudio · Programmer · Jan – Sep 2024 · 9 mos · Remote · short transition note · 19 chips
  4. Volenday Group · Programmer · May 2017 – Jan 2024 · 6 yrs 9 mos · Remote · **three-paragraph description** · 14 chips
  5. Hewlett Packard Enterprise · Intern · Nov 2015 – Apr 2016 · 6 mos · Taguig City · On-site · short FTE-tool description · 4 chips (C#, OOP, LINQ, MVVM)
- **`## shape of the work`** — closing bullets with highlights (long-tenure IC, team lead, Azure CI/CD, production AI)

### 3. `contact.md`
- **Purpose**: Reach-out info.
- **Sections**:
  - `# Contact` heading
  - Pull-quote on plain email being best
  - **`## direct`** — email + mobile (two-column key/value grid)
  - **`## online`** — github, linkedin, portfolio
  - **`## availability`** — left-bar quote restating "not actively looking but happy to chat"
  - **Action buttons**: send mail (mailto link, primary), linkedin (external)
- Real values (verbatim):
  - email: `gjvpaet@gmail.com`
  - mobile: `+63 976 003 6773`
  - github: `https://github.com/gjvpaet`
  - linkedin: `https://www.linkedin.com/in/gjvpaet/`
  - portfolio: `https://gabpaet.dev`

### 4. `projects/gabpaet-dev/page.tsx`
- **Purpose**: Source-code view of the portfolio's actual `page.tsx` (the meta-joke — the portfolio shows its own source).
- **Render as**: syntax-highlighted code block. No prose around it. The code is Next.js JSX assembling the IDE components.

### 5. `projects/gabpaet-dev/README.md`
- **Purpose**: README for the portfolio project itself.
- **Sections**: idea, stack (next.js 15, react 19, tailwind, vercel, repo link), todo list.

### 6. `package.json`
- **Purpose**: JSON view of "Gabriel's identity as a package". Name, version, author, keywords, scripts (`hire`, `linkedin`, `github`, `portfolio`), engines (`coffee >= 1 cup/day`, `sleep >= 7 hrs/night`), availability, license.
- **Render as**: syntax-highlighted JSON code block.

### 7. `.zshrc`
- **Purpose**: His shell config — aliases (`g`, `ni`, `nd`, `gco`, `awl`), nvm bootstrap, helper functions (`mkcd`, `weather`, `port`).
- **Render as**: syntax-highlighted shell code block.

### 8. `writing.md` (placeholder — hide initially)
- **Purpose**: Coming soon. Keep the route in code but don't link it in the sidebar until he has content.

---

## IDE chrome (components, always present)

### Title bar (height 38px)
- Mac-style traffic-light dots (left): red `#ff5f56`, yellow `#ffbd2e`, green `#27c93f` — purely decorative
- Path label: `~ /portfolio · <activeFileName>` — `~` and active filename in accent color
- **Search trigger button** (center-right): `⌕ Search files… (type to filter) ⌘K` — clicking opens the command palette
- Right side: git branch indicator (`● main`), `UTF-8`, `LF` — static text

### Sidebar (width 260px)
- Section headers: small uppercase labels (`EXPLORER`, `portfolio`, `projects/`) with count badges
- File rows:
  - 14×14 colored badge icon (file type — M↓ for markdown blue, Rs for rust orange, Ts for typescript blue, Go for go cyan, `{ }` for json yellow, `Sh` for shell green)
  - File name
  - Hover state: very subtle white-4% background
  - Active state: 8%-accent background + 2px accent left border + bright text
- Folder rows show a chevron + file-type icon + folder name; child files are indented 14px more.
- Footer pinned at the bottom: orange-pulsing dot + "currently @ lumora" + version stamp.

### Tabs row (height ~36px)
- Horizontally scrollable strip across the top of the editor area
- Each tab: file icon + name + close × (becomes a green dot when the tab is the active one)
- Active tab: brighter text, matches editor body bg (not sidebar bg), 1px accent line on top
- Click tab → switch active. Click × → close (if it was active, fall back to the next remaining tab; if none, restore `about.md`).

### Breadcrumb (~26px)
- `~ › portfolio › <active-file>` with separators
- Right side: `· N lines` — derived from the file's `lines` metadata

### Gutter + doc body
- **Gutter** (left, ~50px): right-aligned line numbers, dim color, line 1 highlighted in accent. Number count = the file's `lines` value.
- **Doc body**: the actual markdown-rendered content of the active file.

### Status bar (bottom, height 26px, full width)
- Background: **accent color** (mint by default)
- Ink color: `--accent-ink` (dark teal `#04211a` against mint)
- Left segments: branch icon + `main`, `↑ 0 ↓ 0`, `✓ no errors`, `⚠ 0`
- Right segments: `Ln 1, Col 1`, `Spaces: 2/4` (4 for json/rs/go, 2 otherwise), `UTF-8`, language name (`Markdown` / `Rust` / `JSON` / `Shell` / etc.), `● pasay city · @ lumora capital`

### Command palette (overlay)
- Triggered by **⌘K** (or **Ctrl+K**), **⌘P**, or clicking the title-bar search button
- Modal box: 560px wide, centered, 100px from top. Backdrop `rgba(7,13,21,0.55)` with 2px blur.
- Input at top, file list below
- Each result row: file icon + name + dim path on the right
- Active row: accent background, ink text
- Keys: arrow up/down navigate, Enter opens, Escape closes
- Clicking outside the box also closes it

### Tweaks panel (right-bottom, fixed)
- Toggled via host protocol (`__activate_edit_mode`) — for a standalone deploy, expose a small ⚙ button instead.
- Two controls:
  - **Accent** — five 26×26 swatch chips (mint #2ee5b4, coral #f97070, periwinkle #7a9cff, amber #f2c14e, violet #c084fc). Active swatch: scaled 1.1, white border. Each accent has a matching `--accent-ink` dark counterpart for the status bar text.
  - **Density** — segmented control (compact / cozy / spacious). Changes editor font-size (12 → 14 → 15.5px), line-height (1.55 → 1.85 → 2.1), doc padding (12/20 → 22/28 → 32/40), sidebar item padding (2 → 5 → 8), gutter padding (12 → 22 → 32).
- Both controls show the active value next to the label in accent color.
- Persist to `localStorage` (or whatever your state lib is).

---

## Interactions & behavior

- **Click sidebar file** → set active, ensure tab is open, scroll doc to top
- **Click tab** → set active
- **Click tab ×** → remove tab; if it was active, activate the next one
- **Click folder row** in sidebar → toggle collapsed (visual only since the tree is small)
- **⌘K / ⌘P / Ctrl+K / Ctrl+P** anywhere → open palette
- **Esc** → close palette
- **Arrow up/down in palette input** → move highlight
- **Enter in palette** → open highlighted file
- **Click anywhere outside palette modal** → close
- **In-doc action buttons** (about.md): `say hello` opens `/contact`, `see work` opens `/work`, `github` opens external in new tab
- **All external links** (`gabpaet.dev`, `github.com/gjvpaet`, `linkedin.com/in/gjvpaet`) open in new tab with `rel="noopener"`

Subtle transitions:
- `.doc` padding/font-size/line-height transition 0.2s when density changes
- Sidebar item background and active border transitions 0.1s
- Tab background transitions 0.1s on hover
- Pulse-dot animation (sidebar footer, about.md status pill): 2s ease-in-out infinite

---

## State management

Component / route state:
- `activeFile: string` — which file is open
- `openTabs: string[]` — list of file slugs currently shown as tabs (start with: about, work, projects/gabpaet-dev/page-tsx, .zshrc)
- `paletteOpen: boolean`
- `paletteQuery: string`, `paletteIndex: number`

Tweaks state (persist to localStorage):
- `accent: string` (one of the 5 swatch values)
- `density: "compact" | "cozy" | "spacious"`

When using URL routing, `activeFile` and `openTabs` derive from the route + an in-memory list of recently-opened files. Closing the active tab does a router `push` to the next remaining tab.

---

## Design tokens

### Colors

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d1b2a` | App background |
| `--side` | `#0b1624` | Sidebar / title bar / tabs strip background |
| `--panel` | `#11243a` | Code-block + tweaks-panel background |
| `--hover` | `rgba(255,255,255,0.04)` | Sidebar item hover |
| `--border` | `rgba(255,255,255,0.07)` | Hairline dividers |
| `--border-2` | `rgba(255,255,255,0.12)` | Stronger borders (chips, tweaks panel) |
| `--accent` | `#2ee5b4` *(default mint)* | Brand accent (links, active tab, status bar bg) |
| `--accent-ink` | `#04211a` | Text on accent backgrounds |
| `--fg` | `#dbe4f0` | Body text |
| `--fg-bright` | `#ffffff` | Headings + active sidebar item |
| `--fg-dim` | `#7b8aa3` | Secondary text + breadcrumb |
| `--fg-dim-2` | `#4d5e7a` | Tertiary (line numbers) |
| `--yellow` | `#f2c14e` | JSON file icon, syntax `tk-fn` |
| `--orange` | `#ef8a5b` | Rust file icon, "currently @ lumora" pulse, syntax `tk-str` |
| `--blue` | `#6db4e0` | Markdown / TS file icon, syntax `tk-typ` |
| `--pink` | `#ec9bb3` | (reserved, currently unused) |

**Accent variants** (Tweaks panel):
- mint: `#2ee5b4` / ink `#04211a`
- coral: `#f97070` / ink `#2a0606`
- periwinkle: `#7a9cff` / ink `#08122b`
- amber: `#f2c14e` / ink `#2a1d00`
- violet: `#c084fc` / ink `#1c0a30`

### Typography

- **Font**: `JetBrains Mono` (Google Fonts), weights 400/500/600/700. Self-host via `next/font/google` for best performance.
- **Base size**: 13px (driven by density token; see Density below)
- **Line-height**: 1.85 (cozy default; 1.55 compact, 2.1 spacious)
- **Doc body font size** is controlled by `--doc-fs` (12px / 14px / 15.5px). Headings and other UI scale independently.
- **H1** in doc: 30px, weight 700, letter-spacing -0.5px
- **H2** in doc: 14px, weight 600, accent color, with `##` prefix in `--fg-dim`

### Spacing (density-driven)

| Token | compact | cozy | spacious |
|---|---|---|---|
| `--doc-fs` | 12px | 14px | 15.5px |
| `--doc-lh` | 1.55 | 1.85 | 2.1 |
| `--doc-pad-y` | 12 | 22 | 32 |
| `--doc-pad-x` | 20 | 28 | 40 |
| `--side-item-pad` | 2 | 5 | 8 |
| `--gutter-pad-y` | 12 | 22 | 32 |

### Misc

- Border radius: **3–5px**. Almost nothing is rounded above 8px. The tweaks panel uses 8px, palette uses 8px, buttons use 5–6px. Big rounded corners are off-brand.
- Shadow on palette modal: `0 24px 70px rgba(0,0,0,0.5)`
- Status-bar height: 26px exact
- Title-bar height: 38px exact
- Sidebar width: 260px exact

### Syntax highlighting (for code-block files)

| Class | Color | Use |
|---|---|---|
| `tk-kw` | `#ff7eb6` (pink) | keywords (`pub`, `fn`, `import`, `const`) |
| `tk-fn` | `#f2c14e` (yellow) | function names |
| `tk-str` | `#ef8a5b` (orange) | string literals |
| `tk-num` | `#b5e853` (lime) | numeric literals |
| `tk-cmt` | `#7b8aa3` (dim, italic) | comments |
| `tk-typ` | `#6db4e0` (blue) | types |
| `tk-pun` | `#7b8aa3` (dim) | punctuation |
| `tk-var` | `#dbe4f0` (fg) | variable names |
| `tk-tag` | `#2ee5b4` (accent) | JSX tag names |

You can integrate **Shiki** or **Prism** for real syntax highlighting at build time — or keep the same `tk-*` class approach with a small custom tokenizer if you want exact visual parity. Shiki + a custom theme that maps to the tokens above is the cleanest path.

---

## Assets

- **JetBrains Mono** (Google Fonts) — weights 400/500/600/700. Self-host with `next/font/google` for zero network dependency at render time.
- **No image assets.** The "portrait" / brand glyph from the original LinkedIn idea is intentionally absent — the IDE chrome is the brand.
- All icons are inline SVGs (mail, calendar, github, linkedin, x, files outline, etc.). They live in the buttons and the social row. Copy these straight out of `portfolio.html`.

---

## Content (verbatim, do not paraphrase)

All file content — every line of about/work/contact/projects/etc. — is already in `portfolio.html` inside the `window.FILES` JS object, with each entry shaped as:

```js
{
  name: "about.md",
  path: "~ › portfolio",
  icon: "md",
  lang: "Markdown",
  lines: 36,
  html: `<the full markdown-rendered HTML>`,
}
```

For the rewrite:
- Extract each `html` string into its own `.mdx` (or `.tsx` render function).
- Keep all copy **exactly** as written. Even small word changes ("currently leading" vs "led a team") were deliberate.
- Don't autogenerate the `lines` number — preserve the values from the prototype so the gutter looks right. (Later you can compute it from rendered content if you want.)

---

## Things to add for the real build (not in the prototype)

These are explicitly **future**, not part of this handoff — but worth noting since they shape architecture:

- **Real routes** for every file (URL = file path) so `gabpaet.dev/work` works as a deep link
- **Open-graph + metadata** per route (Next.js `generateMetadata`)
- **Sitemap + RSS** when `writing.md` ships
- **Print-to-PDF CV** that reuses the same content (about + work + contact) without the IDE chrome
- **Search across file contents** (not just filenames) — the prototype palette only filters by filename right now
- **Minimap** on the right edge (real editor metaphor extension)
- **Content-from-repo** — read `.md` / `.tsx` files from the actual repo at build time so the portfolio always reflects the latest source

---

## Files in this handoff

- `portfolio.html` — the full working prototype. Open in a browser to interact. All HTML, CSS, and JS are inlined into one file; `window.FILES` near the bottom of the `<script>` block is the content source-of-truth.
- `README.md` — this document.

---

## How to brief Claude Code

When you start the Claude Code session, paste something like:

> I'm building my personal developer portfolio at `gabpaet.dev`. The design is in `portfolio.html` — a working single-file HTML prototype themed as an IDE. I want to rebuild it as a Next.js 15 (App Router) + TypeScript + Tailwind site, deployed to Vercel.
>
> Follow `README.md` for architecture, components, design tokens, and per-screen specs. The content inside `window.FILES` (in `portfolio.html`) is the source of truth — keep all copy verbatim. Match the design pixel-for-pixel; deviate from the prototype only for the routing (use real URLs per file).
>
> Start by scaffolding the IDE shell (layout + sidebar + tabs + breadcrumb + status bar + gutter) and getting `/about` rendering. Then port the other files one by one.

That gives Claude Code enough context to plan + scaffold without re-asking.
