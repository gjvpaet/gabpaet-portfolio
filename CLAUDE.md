# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Branch `v2` is a from-scratch rebuild of gabpaet.dev, now being restyled into a **conceptual sketch / working-notebook** design. **`docs/v2/DESIGN-SPEC.md` is the design source of truth**: tokens, components, sections, copy, motion, easter eggs, SEO and the ordered build checklist (section 15, done items ticked). Read it before building anything. Visual references: the style sheet (https://claude.ai/artifact/EAyMLR1pzPucMff9nit5rg) and artboard A of the sketch canvas (https://claude.ai/artifact/YXFHmmRFcXkGyfeyvQ8jMK); the spec wins where they differ.

The finished neo-brutalist build that preceded it is preserved on the git tag `v2-brutalist` (`4911a4a`). Most of its plumbing is reused as-is: content model, routes, redirects, SEO, resume PDF pipeline, theme logic, reveal observer, sticker drag, mobile menu, copy email. Its look (mint/yellow, Archivo, solid offset shadows, 3px outlines) is retired.

v1 (the VS Code-themed site) is preserved on the git tag `v1` and stays live at `v1.gabpaet.dev`. Its code is gone from this branch; do not resurrect it here.

## Commands

Package manager is **pnpm**. It is not on PATH on this machine; use `corepack pnpm`.

- `corepack pnpm dev` (or the `portfolio` preview config, port 3200)
- `corepack pnpm build`
- `corepack pnpm typecheck` (`tsc --noEmit`; there is no lint or test setup). If it reports missing `app/(ide)` modules, `.next/dev/types` is stale from an old v1 dev run: delete `.next/dev`. The Turbopack dev cache in `.next/dev` can also keep serving old CSS after `globals.css` changes (a production build is correct); stop the dev server, delete `.next/dev`, restart.

Global git config on this machine has a broken `gpg.format`; commit with `GIT_CONFIG_GLOBAL=/dev/null git -c user.name="Gabriel Joshua Paet" -c user.email="gjvpaet@gmail.com" commit ...`. Never add Co-Authored-By trailers. Pushing needs Gabriel's credentials, so he pushes.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 (via `@tailwindcss/postcss`, no `tailwind.config.*`), `motion` (import from `motion/react`), `@phosphor-icons/react` (always `weight="bold"`, UI icons only), `simple-icons` (sticker logos only), `perfect-freehand` (pencil doodles), Vercel Analytics + Speed Insights. Fonts: Bricolage Grotesque (structure) and Shantell Sans (handwriting) via `next/font`.

## The two-layer rule

Everything belongs to one layer (spec section 1):

- **Structure:** type, grid, buttons, nav, screenshots and every fact. Bricolage, clean, never wobbles.
- **Pen:** circles, underlines, arrows, strikes, margin notes, napkin sketches, stickers, illustrations. Shantell Sans for handwriting, `--pen` purple for marks. Commentary only: no fact may live only in the pen layer.

## Where things live

- **Tokens:** `app/globals.css` defines every color, radius, shadow and z-index as CSS variables. Light values sit on `:root`; dark values sit on `:root[data-theme="dark"]` only (there is no `prefers-color-scheme` block: light is the default). `@theme inline` exposes them to Tailwind. Type roles are `@utility` classes.
- **Hex mirror:** `lib/tokens.ts` repeats the hex values for `next/og` images and the viewport `themeColor`. Change it together with `globals.css`.
- **Pen marks:** path data lives only in `lib/ink.ts`; components in `components/ink/`. The roughness filters (`#ink-a`, `#ink-b`, `#ink-c`) are rendered once in the root layout in a 0×0 `aria-hidden` SVG (not `display: none`, which breaks them in Firefox). Napkin sketches live in `components/napkins/`.
- **Theme:** light by default, whatever the OS prefers. The lamp toggle stores `"light" | "dark"` under `THEME_STORAGE_KEY` in `lib/theme.ts`; `THEME_INIT_SCRIPT` (same file, injected in `app/layout.tsx` `<head>`) applies it before first paint, and `SPLASH_INIT_SCRIPT` decides the splash (`html.splash`). The toggle also keeps `<meta name="theme-color">` in step. To test dark mode headless, set `data-theme="dark"` (or store the key); emulating a dark OS no longer changes anything.
- **Components:** server components import Phosphor from `@phosphor-icons/react/ssr`; client components (`"use client"`) from `@phosphor-icons/react`.
- **z-index:** only the values in `lib/z.ts` (mirrored as `--z-*` in `globals.css`).
- **Content:** `content/profile.ts` and `content/projects.ts` are the single source of facts for the home page, `/resume`, JSON-LD, metadata and OG images. Never hardcode those facts elsewhere. Draft strings carry a `// VERIFY` comment until Gabriel confirms them. Computed notes ("Programmer to Senior in 8 months") come from `lib/dates.ts`, never typed by hand.
- **Written name:** `lib/written-name.ts` is generated from `assets/fonts/Sacramento-Regular.ttf` by `scripts/trace-name.py` (Pillow, numpy); never edit the paths by hand. Stroke order is set in the script (spec 10.4). Never put Gabriel's real signature back on the site or in the repo.
- **Illustrations:** traced SVGs in `public/illustrations/` (`<name>-ink`, optional `-pen` and `-fill` layers), rendered as CSS masks by `components/illustration.tsx` so they re-ink with the theme (spec 6.14, 10.3). Sources are in `assets/illustrations/`; retrace with `scripts/trace-illustrations.py` (needs Pillow, numpy, potrace), and keep the viewBox sizes in the component in step with its output. Layouts must work without them.
- **Canonical URLs:** set per page via `metadata.alternates.canonical`, never in the root layout.
- **Resume PDF:** `public/gabriel-paet-resume.pdf` is a printout of `/resume`. After any change to `content/profile.ts` or `content/projects.ts`, regenerate it from a production build (`portfolio-prod` preview config, port 3300), never the dev server. Then rebuild before checking it locally: `next start` only serves `public/` files that existed at build time. Print styles live at the bottom of `globals.css`; every pen component, illustration and the grain hide on paper with `print:hidden`.

## Rules that are easy to break

- One accent: purple, used as a pen. Dark purple never sits behind text; use `--wash` behind text.
- Handwriting is 8 words or fewer per note, and never in nav, buttons, headings or body copy.
- Never invent a one-off SVG path inline; add it to `lib/ink.ts`. SVG filters go on small pen paths only, never on text or whole sections. A perfectly straight horizontal or vertical line disappears under a filter (zero-height bounding box, so a zero-size filter region); give it a slight bow.
- The only shadow is the paper lift, on taped-in paper and screenshots. Structure lines are 2px `--ink`. Radius: paper 3px, controls and frames 12px, chips full.
- Every animation honours `prefers-reduced-motion`; draw-ins and boil are gated explicitly in CSS (Motion's `reducedMotion` does not cover them). Nothing loops on its own; no scroll listeners, no marquee.
- A boil rule that targets a mark which also draws in must keep `ink-draw` in its `animation` list (see `globals.css`). Replacing the list with `ink-boil` alone drops the draw's `forwards` fill and the stroke vanishes on hover.
- The splash shows only on `/`, once per session, never with a hash, under reduced motion, without JS or in print. It lifts only after the last stroke of the name has finished (plus a short hold), never on a bare timer, so a slow first paint cannot cut the writing short; Gabriel's portrait is shaded in first, and the name is written only once it is fully drawn (never both at once); then the name flies into the nav's "gp" mark as the paper and portrait fade; about 4.4s in all, and any input skips it. `html.splash` stays on `<html>` after the splash (it delays the nav ring's draw-in); do not remove it mid-draw.
- No em dashes in visible copy. Copy marked VERIFY must not ship until Gabriel confirms it.
- Share images and icons render through `lib/og.tsx` with static TTFs in `assets/fonts/` and hex values from `lib/tokens.ts`. Satori cannot use CSS variables, variable font axes, SVG filters or repeating CSS gradients (the dot grid is an SVG pattern), and cannot size an SVG to its parent (give it numbers).
- Old v1 URLs redirect (308) via `next.config.ts`, and section IDs (`#experience`, `#projects`, `#about`, `#contact`) are what those redirects land on; keep both when touching routes.
