# gabpaet.dev

Personal portfolio for **Gabriel Joshua Paet**, senior programmer.

This branch (`v2`) is a neo-brutalist rebuild: one scrolling home page (experience, projects, about, contact), short case-study pages for side projects, and a printable `/resume`. The design spec lives in [`docs/v2/DESIGN-SPEC.md`](docs/v2/DESIGN-SPEC.md).

The previous IDE-themed version is preserved on the `v1` tag.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com), tokens as CSS variables in `app/globals.css`
- [Motion](https://motion.dev) for interaction and reveal animations
- [Phosphor Icons](https://phosphoricons.com) and [Simple Icons](https://simpleicons.org)
- Archivo and JetBrains Mono via `next/font`
- pnpm, deployed on Vercel

## Local development

```sh
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm typecheck  # tsc --noEmit
```
