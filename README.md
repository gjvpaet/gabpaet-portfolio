# gabpaet.dev

Personal developer portfolio for **Gabriel Joshua Paet** — senior programmer at Lumora Capital. Themed as a code editor: each section of the site (about, work, contact, projects, etc.) is presented as a file in an IDE shell, with a sidebar file tree, tabs, breadcrumb, gutter line numbers, status bar, and a ⌘K command palette.

Live at [gabpaet.dev](https://gabpaet.dev).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — theme tokens declared inline in `app/globals.css` via `@theme inline`; no `tailwind.config.*`
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via `next/font/google`
- pnpm

## Local development

```sh
pnpm install
pnpm dev        # next dev on http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
pnpm typecheck  # tsc --noEmit (the only static check; no lint or tests configured)
```

## How the IDE is wired

Every "page" is a **file** in the editor metaphor. `content/files.ts` is the single source of truth: it defines every file's id, route, language, line count, sidebar icon, and the React component that renders its body. The IDE chrome (sidebar, tabs, breadcrumb, gutter, status bar) reads from this registry by looking up the current `pathname` via `getFileByRoute()` in `lib/files.ts`.

Route group `app/(ide)/` shares the IDE shell layout; `app/page.tsx` redirects `/` → `/about`. Three nested client providers wrap every IDE page (`context/providers.tsx`):

- **TweaksProvider** — accent color + density, persisted to `localStorage["portfolio.tweaks.v1"]`. Writes CSS custom properties on the document root.
- **PaletteProvider** — ⌘K / ⌘P / Ctrl+K / Ctrl+P global keybinds + palette open state.
- **TabsProvider** — open-tabs list, persisted to `localStorage["portfolio.tabs.v1"]`. The active tab is derived from the route.

## Adding a new file

Three changes in lockstep:

1. Body component under `content/` (e.g. `content/notes.tsx`).
2. Route file at `app/(ide)/<slug>/page.tsx` that renders the body.
3. Entry in `FILES` in `content/files.ts` whose `route` matches step 2 exactly, plus inclusion in `FILE_ORDER` (and `DEFAULT_OPEN_TABS` if it should be pre-opened).

Note: a `FileId` (display name) can intentionally differ from its URL slug when Next.js can't route the literal name — `package.json` → `/package`, `projects/gabpaet-dev/page.tsx` → `/projects/gabpaet-dev/page-tsx`.

## Tweaks panel

Bottom-right ⚙ button toggles a panel with two controls:

- **Accent** — 5 swatches (mint, coral, periwinkle, amber, violet).
- **Density** — compact / cozy / spacious. Changes editor font size, line height, and document padding via CSS variables.

A small inline script in `app/layout.tsx` reads the persisted tweaks **before** hydration so a non-default accent or density doesn't flash on first paint.

## Project layout

```
app/
├─ layout.tsx              # Root layout + pre-hydration FOUC script
├─ page.tsx                # Redirects / → /about
└─ (ide)/                  # Route group: every child gets the IDE shell
   ├─ layout.tsx           # 3×2 grid (title-bar / sidebar+main / status-bar)
   ├─ about/page.tsx
   ├─ work/page.tsx
   ├─ contact/page.tsx
   ├─ writing/page.tsx     # built but hidden from sidebar
   ├─ package/page.tsx
   ├─ zshrc/page.tsx
   └─ projects/gabpaet-dev/{page-tsx,readme}/page.tsx

components/ide/            # Title bar, sidebar, tabs, breadcrumb, gutter, status bar, palette, tweaks panel
content/                   # One body component per file + content/files.ts registry
context/                   # Tweaks / palette / tabs providers
lib/                       # files.ts (route lookup), tweaks.ts (accent + density definitions)
```

## Design reference

The original interactive design prototype lives in [`portfolio.html`](portfolio.html) — a self-contained single-file HTML/CSS/JS build of the IDE that you can open in a browser. It's the visual source of truth (colors, spacing, typography, copy) and is **not** shipped with the app.

[`HANDOFF.md`](HANDOFF.md) is the original design-handoff brief that produced this codebase: per-screen specs, design tokens, syntax-highlighting color map, and the rationale behind the IDE metaphor. Keep in mind it predates the build, so a few details have shifted in the actual code:

- Stack version: Next.js 16 (the handoff says 15).
- Route group is named `(ide)`, not `(files)`.
- File bodies are `.tsx` components composing scoped CSS classes (e.g. `.doc .h1`, `.doc .grid`), not MDX.

For implementation notes and the rules a contributor needs to keep things consistent, see [`CLAUDE.md`](CLAUDE.md).

## Deployment

Static export friendly; deployed to [Vercel](https://vercel.com) at [gabpaet.dev](https://gabpaet.dev). No backend or database — all content is in `content/`.
