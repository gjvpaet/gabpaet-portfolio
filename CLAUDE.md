# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## v2 rebuild (branch `v2`): read this first

The site is being rebuilt as a neo-brutalist single-scroll portfolio. **`docs/v2/DESIGN-SPEC.md` is the design source of truth on this branch.** It overrides `portfolio.html`, `HANDOFF.md`, `DESIGN.md` and `PRODUCT.md`, which describe v1 and are slated for removal (they stay preserved on the `v1` tag; v1 stays live at `v1.gabpaet.dev`).

Everything under "Architecture" below describes the **v1 IDE codebase** (file registry, tabs, palette, tweaks). It is being deleted on this branch (spec section 15, step 1). Do not extend it; build v2 per the spec, and rewrite this file once the v1 code is gone.

Key v2 rules worth having in your head while coding:

- `content/profile.ts` is the single source of facts (roles, dates, skills, contact) for the home page, `/resume`, JSON-LD, metadata and OG images. Never copy those values elsewhere.
- Color hex values live in `app/globals.css` **and** `lib/tokens.ts` (for `next/og`). Change both together.
- The theme storage key lives in `lib/theme.ts` and is imported by both the toggle and the pre-hydration script.
- Mint (`#2EE5B4`) is a fill, never text on the light background; use `--mint-text`.
- No em dashes in visible copy. Experience and About copy marked VERIFY in the spec must not ship until the owner confirms it.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`).

- `pnpm dev` — Next.js dev server
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm typecheck` — `tsc --noEmit` (the only static check; there is no lint or test setup)

The stack is **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4** (Tailwind via `@tailwindcss/postcss`; no `tailwind.config.*` — theme tokens are declared inline in `app/globals.css` via `@theme inline`).

## Architecture

This is a personal portfolio themed as a VS-Code-like IDE. Every "page" is one **file** inside the editor metaphor. The interesting structural rule: **`content/files.ts` is the single source of truth** for which files exist, how the sidebar/tabs/palette/breadcrumb/gutter/status-bar describe them, and which React component renders the body.

### Adding or renaming a file requires three things in lockstep

1. A body component under `content/` (e.g. `content/about.tsx`).
2. A route under `app/(ide)/<slug>/page.tsx` that imports and renders that body.
3. An entry in `FILES` in `content/files.ts` whose `route` matches step 2 exactly, plus inclusion in `FILE_ORDER` (and `DEFAULT_OPEN_TABS` if it should be pre-opened).

The `FileId` (display name like `package.json` or `projects/gabpaet-dev/page.tsx`) intentionally differs from the URL slug in two cases — Next.js can't route segments that collide with its own conventions:

- `package.json` → `/package`
- `projects/gabpaet-dev/page.tsx` → `/projects/gabpaet-dev/page-tsx` (the literal `page.tsx` would be a route file, not a segment)

The whole IDE relies on `getFileByRoute(pathname)` (`lib/files.ts`) to map back from the live URL to the `FileEntry`, so the `route` field has to be the exact normalized pathname.

### Route group `(ide)` is the chrome

`app/(ide)/layout.tsx` is a 3×2 CSS grid (title-bar / sidebar+main / status-bar) that wraps every IDE route. `app/page.tsx` just redirects `/` → `/about`. The chrome components (`components/ide/*`) are mostly client components driven by `usePathname()` — they don't take an "active file" prop, they look it up from the route. That's why all per-file metadata (`lang`, `lines`, `icon`, `path`) lives on `FileEntry` rather than in each page.

### Four nested client providers wrap every IDE page

`context/providers.tsx`: `TweaksProvider` → `PaletteProvider` → `SidebarProvider` → `TabsProvider`.

- **TweaksProvider** — accent color + density + theme. Persists to `localStorage["portfolio.tweaks.v1"]`. Writes CSS custom properties on `document.documentElement` (`--accent`, `--accent-ink`, `--doc-fs`, `--doc-lh`, `--doc-pad-y`, `--doc-pad-x`, `--side-item-pad`, `--gutter-pad-y`) **and** sets `data-theme="dark|light"` on `<html>`, which switches the `:root[data-theme="light"]` token block in `globals.css`. When theme is light, the accent shifts to its darker `lightC` companion (and `accent-ink` to `lightInk`) for legibility on paper.
- **PaletteProvider** — ⌘K / ⌘P / Ctrl+K / Ctrl+P / Esc global key handler + open/close state for the command palette modal.
- **SidebarProvider** — drawer open/close for the mobile sidebar (≤900px). Hamburger in the title bar calls `toggle()`, backdrop calls `close()`, and a `useEffect([pathname])` auto-closes the drawer on any navigation. No-op on desktop — the sidebar is laid out by the IDE grid above 900px.
- **TabsProvider** — open-tabs list. Persists to `localStorage["portfolio.tabs.v1"]`. The active tab is derived from the route, not stored; when the route changes to a file not already in `openTabs`, it appends; when the active tab is closed, it `router.push`es to the neighboring tab (or falls back to `about.md`).

### FOUC-prevention script — keep in sync

`app/layout.tsx` contains an inline `<Script strategy="beforeInteractive">` (`FOUC_SCRIPT`) that reads `portfolio.tweaks.v1` from localStorage, sets `data-theme` on `<html>`, and writes the accent/density CSS variables **before** React hydrates, to avoid a flash on first paint.

This script duplicates four pieces of data that also live in `lib/tweaks.ts`:

- The five accent records — each `{ ink, lightC, lightInk }` keyed by the dark-mode swatch hex (mirrors `ACCENT_OPTIONS`).
- The density → `[fs, lh, padY, padX, side, gut]` tuple (`DENSITY_MAP`).
- The storage key (`TWEAKS_STORAGE_KEY = "portfolio.tweaks.v1"`).
- The theme branch logic — `data-theme="light|dark"` selection and the `isLight ? lightC : c` / `isLight ? lightInk : ink` accent flip.

If you change accent colors (dark **or** light companions), density values, theme behavior, or the storage key, update **both** `lib/tweaks.ts` and `FOUC_SCRIPT` in `app/layout.tsx`, otherwise the pre-hydration paint will diverge from the React state.

### Design tokens & "markdown-like" doc styles

`app/globals.css` defines all design tokens as CSS custom properties on `:root`, with a sibling `:root[data-theme="light"]` block that re-points the same tokens to their light-mode values. The tokens are re-exposed as Tailwind colors via `@theme inline` (so utilities like `bg-side`, `text-fg-dim`, `border-border-2` work). Density-driven tokens (`--doc-fs`, `--doc-lh`, etc.) and the accent pair (`--accent`, `--accent-ink`) are rewritten at runtime by the tweaks provider.

Syntax-highlight tokens (`--tk-kw`, `--tk-fn`, `--tk-str`, `--tk-num`, etc.) are themed the same way — `.tk-*` classes read from CSS variables, and the light-mode block re-points them to darker hues. Do **not** hardcode token colors in `.tk-*` rules.

### Responsive layout

`globals.css` ports three media-query breakpoints from `portfolio.html`:

- `≤900px` — sidebar becomes a left-edge drawer (transformed off-screen, slides in when `.open` is added), hamburger appears in the title bar, chrome tightens.
- `≤640px` — phone layout: tabs/breadcrumb/gutter shrink, work-rows / proj-rows / contact-grid / key-value grid collapse to one column, status bar hides extra segments, tweaks panel becomes a bottom sheet.
- `≤420px` — gutter hidden entirely, breadcrumb shows only the last crumb.

The chrome components carry semantic class names (`.titlebar`, `.sidebar`, `.main`, `.tabs`, `.tab`, `.breadcrumb`, `.gutter`, `.content`, `.statusbar`, `.menu-toggle`, `.sidebar-backdrop`, `.tweaks-panel`, `.palette-trigger`, `.top-right`) so the media-query overrides in `globals.css` can target them. The overrides use `!important` to beat the per-element Tailwind utilities — that's intentional, not a sign of a bug.

The doc body uses a set of scoped CSS classes (`.doc .h1`, `.doc .h2`, `.doc .grid`, `.doc .quote`, `.doc .row-table`, `.doc .qa`, `.doc .stack-chip`, `.doc .cb`, `.tk-*` for syntax tokens, etc.) rather than MDX or a markdown processor. Content files in `content/` are plain React components that compose with these classes. The README still mentions an `.mdx` plan — it was the original proposal; the actual codebase uses `.tsx` content files.

## SEO & analytics

App Router file conventions in `app/` cover the entire SEO surface — no manual `<link>` tags needed:

- **`app/sitemap.ts`** — emits `/sitemap.xml`, driven by `FILE_ORDER` so any non-hidden FileEntry shows up automatically. Adding a new file via the three-step rule above also adds it to the sitemap on next build.
- **`app/robots.ts`** — emits `/robots.txt` (allow-all + sitemap pointer).
- **`app/opengraph-image.tsx`** — renders a static 1200×630 PNG at build time via `next/og`'s `ImageResponse`. Mimics the IDE chrome (traffic-light dots, breadcrumb, mint accent footer) so social-shared links look on-brand. It's prerendered as a real PNG asset (no edge runtime, no cold start), so the route shows as `○ (Static)` in `next build`.
- **`app/favicon.ico`** — picked up automatically.
- **`app/layout.tsx`** — owns the rest:
  - Per-page `metadata` gets composed via the `title.template` and inherits everything else.
  - Two JSON-LD blocks (`Person` + `WebSite`, schema.org) live in `<head>` so Google can build a knowledge-panel-style result. Update these when work/role/links change.
  - `Viewport.themeColor` is a two-entry array so the address-bar tint matches dark/light mode.
  - `robots`, `formatDetection`, `alternates.canonical`, `authors`, `creator`, `keywords` are all set here.

Analytics is **Vercel Web Analytics** + **Speed Insights**:

- `@vercel/analytics/react` → `<Analytics />` in `<body>` (cookieless page-view tracking).
- `@vercel/speed-insights/next` → `<SpeedInsights />` in `<body>` (Core Web Vitals).
- Both are no-ops outside Vercel — they require **enabling Web Analytics** and **enabling Speed Insights** in the project's Vercel dashboard for data to actually start flowing. There's no env var to set; the components detect the deploy environment automatically.

If you change accent or theme tokens, also revisit `app/opengraph-image.tsx` — it uses literal hex values (`#0d1b2a`, `#2ee5b4`, etc.) since `ImageResponse` doesn't read CSS variables, so it can drift from `globals.css` if you're not careful.

## Reference files (read once, don't ship)

- `portfolio.html` — original single-file HTML/CSS/JS prototype. It's the **design source of truth** (copy text and visuals from it verbatim), but it's not built or deployed. Don't link to it from the app.
- `HANDOFF.md` — the original design-handoff brief. Architecturally accurate on intent and design tokens; outdated on stack version, MDX vs `.tsx`, and the proposed `(files)` route group name (actual is `(ide)`).
- `README.md` — the user-facing project README. Lives alongside `HANDOFF.md`; describes the shipped codebase rather than the original brief.
