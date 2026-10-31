# Toolbox section: design

Date: 2026-10-31. Approved by Gabriel the same day, after two rounds of browser mockups.

## Goal

A home page section listing the tools Gabriel builds with, grouped, with logos, after the Toolbox on aahil-khan.xyz, redrawn in the notebook style (memory: borrow Aahil's ideas, never copy them). The pen circles the tools he opens every day, and a circle wobbles (boils) while its chip is hovered.

## Decisions

| Question | Answer |
| --- | --- |
| Layout | "Labelled chips" (option B of 3), in three columns (option 1 of 2; label rows were too close to Experience) |
| Content | Reuse `profile.skills`, plus a Languages group and a Workbench group, on the home page **and** the résumé |
| Group order | Languages, Web, Cloud & DevOps, AI & automation, Workbench |
| Languages | TypeScript, JavaScript, SQL |
| Workbench | VS Code, Warp, GitKraken, DBeaver, Granola (Claude Code stays in AI & automation) |
| Circled | Docker, VS Code, DBeaver, Warp, GitKraken, Granola, Claude Code, Next.js, PostgreSQL (all nine) |
| No logo | Name only, no icon |
| Nav | A Toolbox link after About |
| Hover | The ring boils (the site's existing `ink-boil`) |

## 1. Content: `content/profile.ts`

`skills` becomes, in this order:

- **Languages:** TypeScript, JavaScript, SQL
- **Web:** Node.js, Express, React, Next.js, PostgreSQL, React Native
- **Cloud & DevOps:** AWS, Elastic Beanstalk, S3, GitHub Actions, Azure, GCP, Docker
- **AI & automation:** LangChain, LangGraph, OpenAI API, AWS Bedrock Agents, Vertex AI, n8n, Claude Code
- **Workbench:** VS Code, Warp, GitKraken, DBeaver, Granola

The existing three groups keep their items and item order; only the group order changes and two groups are added.

New field `dailyTools`: the nine circled tools above. A build-time check next to the existing `bioMark` and `mark` checks throws if a `dailyTools` entry is not an item of some `skills` group, so a typo fails the dev server and the build instead of silently dropping a circle.

`/resume` (which maps `profile.skills`) and JSON-LD `knowsAbout` (which flattens it) pick up the change with no code edits.

Logos are presentation, so they stay out of the content file (section 2).

## 2. Section: `components/home/toolbox.tsx`

A server component, `<section id="toolbox" aria-labelledby="toolbox-h">`, rendered in `app/page.tsx` between `<About />` and `<Experience />`, with the same vertical padding as its neighbours (`py-16 md:py-24`).

- `SectionHeading` "Toolbox" (pen underline) with the description "What I build with, day to day."
- A grid of the five groups: one column on phones, 2 from `sm`, 3 from `lg`, wide gaps (about 44px rows, 40px columns at `lg`). Each group is an `h3` label (Bricolage 700, about 19px) over a 2px `--ink` rule, then its chips in a wrapping flex row (12px row gap, 10px column gap).
- The legend, a hand note "circled = open every day" (`--pen`, rotated about -2deg), is the grid's last item. With 5 groups it fills the empty sixth cell at 2 and 3 columns (bottom-aligned there); on phones it comes after Workbench. It is pen layer (commentary, hidden in print) but stays readable text for screen readers, since it explains the circles.
- Groups reveal with `Reveal`, staggered by `index`, like the other sections.
- Logos: a name-to-icon map in the component (Simple Icons, as `sticker-board.tsx` does): TypeScript, JavaScript, Node.js, Express, React, Next.js, PostgreSQL, React Native (the React mark), GitHub Actions, GCP (Google Cloud), Docker, LangChain, LangGraph, n8n, Claude Code (Claude), Warp, GitKraken, DBeaver. Tools without an entry (SQL, AWS, Elastic Beanstalk, S3, Azure, OpenAI API, AWS Bedrock Agents, Vertex AI, VS Code, Granola) render name only. Simple Icons has no licensed mark for them; never draw one.

## 3. `ToolChip`

A new small component (in `components/chip.tsx` next to `Chip`, or its own file), since the existing `Chip` is a 26px label used four to a role in Experience and on `/resume`:

- 38px tall, full pill radius, 1.5px `--ink` border, `--sheet` fill, Bricolage 15px weight 550, no wrap; 14px side padding, 10px on the left when there is a logo.
- Logo: `BrandIcon` at 18px, `decorative` (the name is right beside it), `currentColor` ink. Clean structure layer: no sticker filter.
- A static label: not a link, not focusable.
- `circled` prop: renders a pen loop around the chip (section 4) and adds `ink-boil` to the chip so hovering it boils the loop.

## 4. Rings and the wobble

- Three new marks in `lib/ink.ts` (`chipLoopA`, `chipLoopB`, `chipLoopC`; viewBox `0 0 100 40`, stroke about 2.4), hand loops that overshoot a pill, taken from the approved mockup. Circled chips use them in turn so nine rings do not look stamped. The hero's `circle` (300×80) would squash on a small chip, hence new marks.
- Each ring is an `InkSvg` (`stretch`, `tone="pen"`, a roughness filter), absolutely positioned about 9px above and below and 12px past each side of the chip, `pointer-events: none`, hidden in print (InkSvg already does both).
- The rings draw in when their group reveals, staggered slightly (about 0.08s apart within a group).
- **Hover:** the chip carries `ink-boil`, so while the pointer is over a circled chip its ring cycles the three roughness filters at about 10fps (the existing `ink-boil` rules in `globals.css`). Nothing else changes on hover.
- Reduced motion: the rings show already drawn and never boil (the existing CSS gates both). Touch: no hover, so the rings stay still. Nothing loops on its own.

## 5. Nav: `components/nav.tsx`

`SECTIONS` gains `{ id: "toolbox", label: "Toolbox" }` after About, so the desktop row and the phone menu read About / Toolbox / Experience / Projects / Contact, and the active-section underline follows it like the others. Check the `lg` row still fits on one line at 1024px.

## 6. Résumé and PDF

`/resume` shows the five groups in the new order with the existing small `Chip`s (no logos, no circles). Regenerate `public/gabriel-paet-resume.pdf` from a production build (`portfolio-prod`, port 3300), then rebuild. Check the PDF's page count and that the Skills section does not split badly.

## 7. Docs

- `docs/v2/DESIGN-SPEC.md`: a `ToolChip` entry in section 6; a Toolbox entry in section 7 (and the page outline and nav link list); the two new copy lines.
- `CLAUDE.md`: `simple-icons` is for sticker and toolbox logos.
- `.gitignore`: `.superpowers/` (the mockup server's files).

## 8. Verification

- `corepack pnpm typecheck` and `NODE_ENV=production corepack pnpm build`.
- In Chrome (Claude in Chrome), at desktop width: the section sits between About and Experience, three columns, legend in the sixth cell, rings drawn, a circled chip's ring boils on hover and stops on leave, the nav's Toolbox link scrolls to it and underlines.
- Narrow widths (built-in pane emulation, since the Chrome window cannot resize): 2 columns at 640 to 1023px, one column on phones, no horizontal scroll at 320, 375, 768, 1024, 1280; the rings do not overlap neighbouring chips or get clipped.
- Dark mode (lamp toggle): chips, logos and rings read on the night page.
- Reduced motion: rings static.
- The résumé page and its PDF.

## Out of scope

Links from chips, filtering, proficiency levels, tooltips, logos for tools Simple Icons lacks.
