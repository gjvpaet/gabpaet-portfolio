# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Three nested client providers wrap every IDE page

`context/providers.tsx`: `TweaksProvider` → `PaletteProvider` → `TabsProvider`.

- **TweaksProvider** — accent color + density. Persists to `localStorage["portfolio.tweaks.v1"]`. Writes CSS custom properties on `document.documentElement` (`--accent`, `--accent-ink`, `--doc-fs`, `--doc-lh`, `--doc-pad-y`, `--doc-pad-x`, `--side-item-pad`, `--gutter-pad-y`).
- **PaletteProvider** — ⌘K / ⌘P / Ctrl+K / Ctrl+P / Esc global key handler + open/close state for the command palette modal.
- **TabsProvider** — open-tabs list. Persists to `localStorage["portfolio.tabs.v1"]`. The active tab is derived from the route, not stored; when the route changes to a file not already in `openTabs`, it appends; when the active tab is closed, it `router.push`es to the neighboring tab (or falls back to `about.md`).

### FOUC-prevention script — keep in sync

`app/layout.tsx` contains an inline `<Script strategy="beforeInteractive">` (`FOUC_SCRIPT`) that reads `portfolio.tweaks.v1` from localStorage and sets the accent/density CSS variables **before** React hydrates, to avoid a flash on first paint.

This script duplicates three pieces of data that also live in `lib/tweaks.ts`:

- The five accent → accent-ink color pairs (`ACCENT_OPTIONS`)
- The density → `[fs, lh, padY, padX, side, gut]` tuple (`DENSITY_MAP`)
- The storage key (`TWEAKS_STORAGE_KEY = "portfolio.tweaks.v1"`)

If you change accent colors, density values, or the storage key, update **both** `lib/tweaks.ts` and `FOUC_SCRIPT` in `app/layout.tsx`, otherwise the pre-hydration paint will diverge from the React state.

### Design tokens & "markdown-like" doc styles

`app/globals.css` defines all design tokens as CSS custom properties on `:root`, then re-exposes them as Tailwind colors via `@theme inline` (so utilities like `bg-side`, `text-fg-dim`, `border-border-2` work). Density-driven tokens (`--doc-fs`, `--doc-lh`, etc.) are rewritten at runtime by the tweaks provider.

The doc body uses a set of scoped CSS classes (`.doc .h1`, `.doc .h2`, `.doc .grid`, `.doc .quote`, `.doc .row-table`, `.doc .qa`, `.doc .stack-chip`, `.doc .cb`, `.tk-*` for syntax tokens, etc.) rather than MDX or a markdown processor. Content files in `content/` are plain React components that compose with these classes. The README still mentions an `.mdx` plan — it was the original proposal; the actual codebase uses `.tsx` content files.

## Reference files (read once, don't ship)

- `portfolio.html` — original single-file HTML/CSS/JS prototype. It's the **design source of truth** (copy text and visuals from it verbatim), but it's not built or deployed. Don't link to it from the app.
- `HANDOFF.md` — the original design-handoff brief. Architecturally accurate on intent and design tokens; outdated on stack version, MDX vs `.tsx`, and the proposed `(files)` route group name (actual is `(ide)`).
- `README.md` — the user-facing project README. Lives alongside `HANDOFF.md`; describes the shipped codebase rather than the original brief.
