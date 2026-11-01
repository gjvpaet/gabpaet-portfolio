# Notebook desk (`/notebook`): design

Date: 2026-11-01. Approved by Gabriel section by section the same day, after browser mockups of the desk direction and the layout.

## Goal

A separate, playful half of the site where visitors move around a desk instead of scrolling a page, after the `/canvas` on aahil-khan.xyz, redrawn as Gabriel's notebook (borrow Aahil's ideas, never copy them). The home page stays the recruiter-speed version; `/notebook` is where the notebook's loose pages lie on an endless sheet of dot-grid paper that you can pan, zoom, rearrange and doodle on.

This spec is the first of possibly several. Games (an arcade) and live, backend-backed cards (visitors, guestbook, contributions) are out of scope and would each get their own spec. Hidden notes far out on the desk are also out of scope for now.

## Decisions

| Question | Answer |
| --- | --- |
| Scope | Desk + content cards (not hidden notes, games or live cards) |
| Look | A: the endless notebook page (option A of 3: not a desk surface, not index cards) |
| Route and entry | `/notebook`, linked from a closing note after Contact on the home page; not in the nav |
| Phones and tablets | Touch works: one finger pans, pinch zooms, cards open as a bottom sheet under 768px |
| Extras | Pencil on the desk, first-visit tour, paper sounds, top toolbar with the lamp |
| First view | Name in the centre with About open beside it |
| Memory | Fresh desk every visit; only the "tour seen" flag is stored |
| Engine | React Flow (`@xyflow/react`), chosen over a hand-rolled desk and `@use-gesture` |
| Tests | Add Vitest, for pure `lib/` functions only |

## 1. Routing and chrome

- `/notebook` is a new route at `app/notebook/page.tsx` (server component): metadata title "Notebook", `alternates.canonical: "/notebook"`, the site's default OG image. It renders the client desk and hands it the six card bodies as server-rendered children.
- The page chrome moves out of the root layout into a route group, `app/(site)/layout.tsx`: `Nav`, `Footer`, `BackToTop`, `PaperMarks` and `PencilLayer`. `app/page.tsx`, `app/projects/` and `app/resume/` move into `app/(site)/`. URLs do not change; the v1 redirects in `next.config.ts` and the section IDs stay as they are.
- The root layout keeps `<html>`/`<body>`, the fonts, `THEME_INIT_SCRIPT`, `SPLASH_INIT_SCRIPT`, JSON-LD, `InkFilters`, `PenCursor`, `SplashName` (it only ever shows on `/`), the skip link, Analytics and Speed Insights.
- `app/not-found.tsx` stays at the root and renders `Nav` and `Footer` itself, so the 404 keeps its chrome.
- `@xyflow/react` is imported only under `components/notebook/`, so its weight never reaches `/`, `/projects/*` or `/resume`.
- `app/sitemap.ts` gains `/notebook`. The 404 page's link list gains Notebook.
- On `/notebook` the page's `main#main` wraps the desk, so the site's skip link lands on it.

## 2. The desk

- React Flow fills the viewport (`100dvh`, no page scroll). Background: React Flow's dots background, gap 18, colour `--dot`, on `--paper`.
- Gestures: drag on empty paper pans; wheel and trackpad pinch zoom around the pointer; on touch, one finger pans and two fingers pinch. Zoom range 0.4 to 1.5; the zoom readout rounds to whole percent.
- Nodes:
  - `name` node, at the origin, not draggable, not deletable: the "gp" pen ring (existing ring mark from `lib/ink.ts`), `profile.shortName` in display type, `profile.role` and `profile.location` in `--ink-soft`, and a handwritten hint under it, "drag the paper around →" (pen layer, 8 words or fewer). The hint is hidden on touch devices in favour of the tour's touch wording.
  - `card` nodes, one per open card, ids `about`, `projects`, `experience`, `toolbox`, `contact`, `resume`.
- Each card has a home position in desk coordinates around the name node, defined in `lib/notebook.ts`, laid out so all six open at once do not overlap at 100%. Opening a card places it at its home position (or where it was last dropped during this visit), brings it to the front, and glides the view to it (`fitView` on that node, 400ms, `--ease-out`; instant under reduced motion).
- First view: the `name` node and the About card, fitted to the viewport with padding, unless `?card=` asks for something else (see 5).
- Cards are dragged by their title bar only (React Flow `dragHandle`). While dragged a card lifts (the paper lift deepens, tilt goes to 0); on drop it settles back to its own tilt (between -1.5 and 1.5 degrees, fixed per card in `lib/notebook.ts`). The last dragged or opened card is on top.
- React Flow's own controls, minimap, attribution badge (`proOptions.hideAttribution`), handles, edges and selection box are all off. No connections are possible.

## 3. Cards

A card is a taped-in sheet (`--sheet`, `--r-paper`, `--shadow-lift`, one piece of tape on the top edge): a title bar (Bricolage, 2px `--ink` rule under it, the card's Phosphor icon, and a round × button labelled "Put away <card>"), then the body. Width 360px; bodies taller than 440px scroll inside the card, and the body carries React Flow's `nowheel` and `nodrag` classes so the wheel scrolls the card and text can be selected.

Every fact comes from `content/profile.ts` and `content/projects.ts` (or is computed by `lib/dates.ts`); nothing is typed into the card components.

| Card | Icon | Body |
| --- | --- | --- |
| About | `User` | `profile.bio`, with `profile.bioMark` highlighted (the existing `Highlight` mark). `profile.motto` taped on as a small `--note` sticky with its handwritten caption. `profile.location` and `profile.status` at the foot. |
| Projects | `Folders` | One row per project in `projects` order: name, its one-line summary, a **Case study** link to `/projects/[slug]`, and a **Live** link to `liveUrl`. (No year: `content/projects.ts` has none, and a fact is never typed into a component.) |
| Experience | `Briefcase` | One row per role in `profile.roles`: company, current title, date range and work mode (from `lib/dates.ts`), and its `homeLine`. Ends with a "Full history on the résumé →" link to `/resume`. |
| Toolbox | `Wrench` | The five `profile.skills` groups as `ToolChip`s, `profile.dailyTools` circled in pen, as on the home page. The logo map and loop order move from `components/home/toolbox.tsx` into `lib/toolbox.ts`, shared by both. |
| Contact | `EnvelopeSimple` | `profile.email` with the existing `CopyEmailButton` (and its pen tick), GitHub and LinkedIn from `profile.links`, and `profile.status`. |
| Résumé | `FileText` | One line, "The formal version, with the full history." (VERIFY; the PDF is two pages), and two buttons: **Open résumé** (`/resume`) and **Download PDF** (`profile.resumePdf`). |

Two-layer rule: card text, rows, links and buttons are structure. Tape, the motto sticky, the "gp" ring, the hint under the name and pencil doodles are the pen layer.

## 4. Toolbar, dock and zoom

- **Toolbar** (top centre, `--sheet`, 2px `--ink` border, `--r-control`): **Fit all** (fits every open card and the name), **Tidy up** (closes everything and returns to the first view, clearing `?card=`), a divider, **Pencil** (toggle, `aria-pressed`), **Sound** (toggle, `aria-pressed`, off on arrival), the lamp toggle (icon only, a borderless variant of `LampToggle`), a divider, **← Back to the site** (`/`). Under 768px the toolbar is Fit, Pencil, Sound, Lamp, Back, icon-only except Fit and Back, with `aria-label`s. Tidy up is left out on phones because cards never land on the desk there (section 6).
- **Dock** (bottom centre, same frame): six buttons in the order About, Projects, Experience, Toolbox, Contact, Résumé, each a Phosphor icon over a label, `aria-pressed` reflecting whether its card is open. An open card's button gets a `--wash` fill and a small `--pen` dot under the label. Clicking a closed card's button opens it (section 2); clicking an open one puts it away. Under 768px the dock spans the screen with smaller labels, and Experience reads **Work** so six fit at 375px.
- **Zoom** (bottom right, desktop only): −, the current zoom as a percentage, +. Steps of 0.1, clamped to the zoom range.
- New z-index entries in `lib/z.ts`, mirrored as `--z-*` in `globals.css`: `deskUi: 40` (toolbar, dock, zoom; the nav that uses 40 elsewhere is absent here), `deskSheet: 50` (the phone sheet) and `deskTour: 55` (tour notes), all below `toast` (60) and the pen cursor (80). The pencil's capture layer lives inside React Flow's viewport and needs no global z.

## 5. Links (`?card=`)

- On load, `?card=<id>` (one of the six ids) opens that card instead of About and glides to it. An unknown value is ignored (first view as normal).
- Opening a card writes `?card=<id>` with `history.replaceState` (no new history entries); closing a card writes the most recently opened card that is still open, or removes the parameter when none is.
- Parsing and writing live in `lib/notebook.ts` as pure functions.

## 6. Phones (under 768px)

- The desk, gestures and the name node work the same way.
- Tapping a dock button opens that card as a **bottom sheet** instead of a desk node: it slides up over the desk (about 70% of the height, `--sheet`, top corners 12px, a grab bar), holds the same card body, and closes with ×, a downward swipe on the grab bar, a tap on the bare desk (React Flow's pane click), or Esc. It sits just above the dock, which stays usable. One sheet at a time; tapping another dock button swaps it. The open sheet's card sets `?card=`.
- On load with `?card=`, the sheet opens for that card. About is not opened on arrival on phones (the name node alone is the first view), so the sheet never covers the desk before the visitor has seen it.
- Crossing 768px (rotation, resize) resets the desk to that size's first view: any sheet or desk cards close, and the view re-fits.

## 7. Tour

- Four small taped notes, one at a time, each anchored next to what it describes, with **Skip** and **Next** (the last says **Got it**) and four progress dots:
  1. "This is a notebook, not a page." Drag the paper to move around. (Touch: drag with one finger.)
  2. "Scroll or pinch to zoom." Fit all brings everything back. (Touch: pinch to zoom.)
  3. "The tabs open pages." Drag a card by its title; × puts it away. (Touch: tap a tab to read it.)
  4. "The pencil is in the toolbar." Doodle anywhere; Erase clears it.
- Note titles are structure (Bricolage), bodies are structure; no handwriting beyond the tape. Copy is VERIFY.
- Touch or mouse wording is chosen by screen width (the same 48rem split as cards versus sheet), while the name's hint hides on `(hover: none)`; a touch tablet at 48rem or wider therefore gets mouse wording. Accepted.
- Shown once per browser: a `localStorage` key (`gp-notebook-tour`, value `"seen"`) is set on Skip or Got it; reads and writes are wrapped so a blocked storage just shows the tour again next time. It is the only thing `/notebook` stores.
- The tour does not block the desk: it can be panned and zoomed while a note is up. Esc skips. Focus moves to the note when it appears and back to the desk when it closes.

## 8. Pencil

- The toolbar's Pencil button uses the same `pencil` store as the site's nav pencil (`lib/pencil.ts`), so the pen cursor reacts the same way.
- While the pencil is out: panning by drag and card dragging are off (wheel and trackpad-pinch zoom stay on; on touch screens the desk holds still while the pencil is out, since React Flow ignores every touch start when drag-panning is off: put the pencil down to pinch). A press on bare paper (React Flow's pane, not a card) starts a stroke; points are converted with `screenToFlowPosition` and drawn inside `ViewportPortal`, so doodles pan and zoom with the paper. A second pointer cancels the stroke. An **Erase** button appears just under the toolbar while the pencil is out and there are strokes.
- Stroke shape and sound are shared, not copied: `toPath` and the stroke settings move from `components/pencil-layer.tsx` into a new pure module, `lib/stroke.ts`, which both layers import; the scratch comes from `lib/pencil-sound.ts`. `pencil.set` and `pencil.toggle` gain an optional `silent` flag so the desk can pick the pencil up without the pick-up sound while Sound is off.
- Doodles last until Erase or leaving the page. Nothing is saved.
- The scratch sound follows the Sound toggle on `/notebook` (silent while Sound is off). The site's other pages keep their current behaviour.

## 9. Sound

- Off on arrival, every visit. The Sound toggle turns it on for this visit only.
- `lib/paper-sound.ts`, built on `lib/sound.ts` (no audio files): a soft **paper slide** (band-passed noise, short swell) when a card opens or closes, and a short **tape press** (low thump plus a little crackle) when a dragged card is dropped. Gabriel judges sound by ear: tune by listening, and expect a round of adjustments.
- Sounds only start from a user gesture, as the rest of the site's sounds do.

## 10. Keyboard, accessibility, motion, theme

- The page has one `h1` (the name node). Each card is a `section` labelled by its title.
- Tab order: toolbar, the desk, open cards (their contents), dock. React Flow node focus is on; Esc puts away the focused card; when the desk itself has focus, arrow keys pan and `+`/`-` zoom (React Flow's keyboard support, restyled focus ring in `--pen`).
- Dock and toolbar toggles use `aria-pressed`; icon-only buttons have `aria-label`s.
- `prefers-reduced-motion`: view glides are instant, cards do not tilt or lift while dragged, the sheet appears without sliding, and tour notes appear without drawing in.
- Theme: every colour comes from the tokens, so the lamp's night page works on the desk, cards, dots, toolbar and dock. React Flow's base CSS is imported (`@xyflow/react/dist/base.css`), never its default theme.
- Print: `/notebook` is not meant to be printed; a print stylesheet hides the toolbar, dock and zoom and leaves the open cards.

## 11. Home page teaser

- New `components/home/notebook-teaser.tsx`, rendered after `Contact` in `app/(site)/page.tsx`, inside a `Reveal`.
- A taped-in sheet (`PaperCard`, slight tilt), centred, max 520px: heading "This page is the tidy half.", one line "The rest of the notebook is loose pages on a desk: drag them around, zoom out, doodle in the margins.", a `ButtonLink` **Open the notebook →** to `/notebook`, and a handwritten margin note "bring a pencil". All copy is VERIFY. Shown on every screen size.

## 12. Testing and verification

- Add Vitest as a dev dependency with a `test` script (`vitest run`), node environment, no DOM. Tests live next to the code (`lib/*.test.ts`) and cover only pure functions: `lib/notebook.ts` (home positions do not overlap at 100% zoom, `?card=` parsing and writing, the most-recent-open rule) and `toPath` in `lib/stroke.ts`.
- Run tests by file, a few at a time, with one worker.
- Everything visual is verified in the browser, desktop and a 375px phone, light and night: first view, dock open/close, drag and tilt, Fit all and Tidy up, zoom controls, `?card=` deep links, the tour once and only once, pencil strokes staying put while panning, sound on and off, the phone sheet, keyboard paths, reduced motion. Plus `tsc --noEmit` and a production build.
- Home, case study and résumé pages must look and behave exactly as before the route-group move (nav, footer, back-to-top, ink marks, pencil, splash).

## 13. Docs

- `docs/v2/DESIGN-SPEC.md` gets a Notebook section (a summary of this spec) and its build checklist gains the items; section 1's non-goals keep the ⌘K palette retired (the notebook has none).
- `CLAUDE.md` gains a line under "Where things live" for `components/notebook/` and the `(site)` route group, and the Commands section gains `corepack pnpm test`.

## Out of scope (possible later specs)

- Hidden notes far out on the desk and a "found it" count.
- Arcade games and their scores.
- Live cards: visitor count, guestbook, GitHub contributions, "Now".
- Saving a visitor's desk between visits.
- A ⌘K palette (retired in spec section 1).
