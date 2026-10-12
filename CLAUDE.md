# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Branch `v2` is a from-scratch rebuild of gabpaet.dev as a neo-brutalist single-scroll portfolio. **`docs/v2/DESIGN-SPEC.md` is the design source of truth**: tokens, components, sections, copy, motion, SEO and the ordered build checklist (section 15, with done items ticked). Read it before building anything.

v1 (the VS Code-themed site) is preserved on the git tag `v1` and is meant to stay live at `v1.gabpaet.dev`. Its code is gone from this branch; do not resurrect it here.

## Commands

Package manager is **pnpm**. It is not on PATH on this machine; use `corepack pnpm`.

- `corepack pnpm dev` (or the `portfolio` preview config, port 3200)
- `corepack pnpm build`
- `corepack pnpm typecheck` (`tsc --noEmit`; there is no lint or test setup). If it reports missing `app/(ide)` modules, `.next/dev/types` is stale from an old v1 dev run: delete `.next/dev`. The Turbopack dev cache in `.next/dev` can also keep serving old CSS after `globals.css` changes (a production build is correct); stop the dev server, delete `.next/dev`, restart.

Global git config on this machine has a broken `gpg.format`; commit with `GIT_CONFIG_GLOBAL=/dev/null git -c user.name="Gabriel Joshua Paet" -c user.email="gjvpaet@gmail.com" commit ...`. Never add Co-Authored-By trailers.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 (via `@tailwindcss/postcss`, no `tailwind.config.*`), `motion` (import from `motion/react`), `@phosphor-icons/react` (always `weight="bold"`), `simple-icons` (hero sticker logos only), Vercel Analytics + Speed Insights.

## Where things live

- **Tokens:** `app/globals.css` defines every color, radius, outline, shadow and z-index as CSS variables. Light values sit on `:root`; dark values are repeated in `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and `:root[data-theme="dark"]`. `@theme inline` exposes them to Tailwind (`bg-surface`, `text-ink-muted`, `border-ink`, `rounded-card`, `shadow-brut-md`, ...). Type roles are `@utility` classes (`type-display`, `type-h2`, `type-h3`, `type-body-sm`, `type-button`, `type-meta`, `type-chip`).
- **Hex mirror:** `lib/tokens.ts` repeats the hex values for `next/og` images and the viewport `themeColor`. Change it together with `globals.css`.
- **Theme:** no stored value means "follow the OS" (pure CSS). The toggle stores `"light" | "dark"` under `THEME_STORAGE_KEY` in `lib/theme.ts`; `THEME_INIT_SCRIPT` (same file, injected in `app/layout.tsx` `<head>`) applies it before first paint. Both read the key from that one constant.
- **Components:** `components/` holds the spec section 6 primitives (`Button`/`ButtonLink`, `Chip`/`ChipList`/`StatusChip`, `Card`, `BrandIcon`, `SectionHeading`, `ScreenshotFrame`, `ThemeToggle`, `CopyEmailButton`). Server components import Phosphor from `@phosphor-icons/react/ssr`; client components (`"use client"`) from `@phosphor-icons/react`.
- **Utilities in `globals.css`:** `press` / `press-lg` (hover lift, press into shadow) and `tone-accent` (put on a mint/yellow element: it keeps the page outline and shadow, while its text and children switch to dark ink on light surfaces).
- **z-index:** only the values in `lib/z.ts` (mirrored as `--z-*` in `globals.css`).
- **Fonts:** `app/layout.tsx` loads Archivo (variable, with the `wdth` axis; width is set with `font-stretch: 110%` / `125%`) as `--font-archivo` and JetBrains Mono as `--font-jetbrains-mono`.
- **Content:** `content/profile.ts` and `content/projects.ts` (spec section 10) are the single source of facts for the home page, `/resume`, JSON-LD, metadata and OG images. Never hardcode those facts elsewhere. Draft strings carry a `// VERIFY` comment until Gabriel confirms them.
- **Canonical URLs:** set per page via `metadata.alternates.canonical`, never in the root layout.
- **Resume PDF:** `public/gabriel-paet-resume.pdf` is a printout of `/resume`. After any change to `content/profile.ts` or `content/projects.ts`, regenerate it from a production build (`portfolio-prod` preview config, port 3300), never the dev server. Then rebuild before checking it locally: `next start` only serves `public/` files that existed at build time. Print styles live at the bottom of `globals.css`; components hide themselves on paper with `print:hidden`.

## Rules that are easy to break

- Mint (`--mint`) is a fill, never text on the light background (1.5:1). Use `--mint-text` for mint-colored text.
- Outlines are 2px or 3px `--ink`; shadows are solid `--ink`, zero blur, offset down-right. No gradients, glows or blurred shadows.
- Radius rule: cards/panels 16px, controls 12px, chips/pills full.
- Every animation honours `prefers-reduced-motion`; no scroll listeners, no marquee.
- No em dashes in visible copy. Copy marked VERIFY in the spec must not ship until Gabriel confirms it.
- Share images and icons (`app/**/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`) render through `lib/og.tsx` with the static fonts in `assets/fonts/` and hex values from `lib/tokens.ts`. They cannot use CSS variables or the variable Archivo.
- Old v1 URLs redirect (308) via `next.config.ts`; keep that list when touching routes.
