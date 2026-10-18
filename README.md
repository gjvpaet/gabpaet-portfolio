# gabpaet.dev

Personal portfolio for **Gabriel Joshua Paet**, senior programmer.

This branch (`v2`) is a rebuild styled as a working engineering notebook (clean type with a hand-drawn pen layer): one scrolling home page (experience, projects, about, contact), short case-study pages for side projects, and a printable `/resume`. The design spec lives in [`docs/v2/DESIGN-SPEC.md`](docs/v2/DESIGN-SPEC.md).

The previous IDE-themed version is preserved on the `v1` tag, and an earlier neo-brutalist take on v2 on the `v2-brutalist` tag.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com), tokens as CSS variables in `app/globals.css`
- [Motion](https://motion.dev) for interaction and reveal animations
- [Phosphor Icons](https://phosphoricons.com) and [Simple Icons](https://simpleicons.org)
- Bricolage Grotesque and Shantell Sans via `next/font`; [perfect-freehand](https://github.com/steveruizok/perfect-freehand) for the pencil
- pnpm, deployed on Vercel

## Local development

```sh
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm typecheck  # tsc --noEmit
```
