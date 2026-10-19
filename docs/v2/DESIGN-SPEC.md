# gabpaet.dev v2: Design Spec

Status: **approved for build** (sketch direction settled 2026-10-17). Branch: `v2`.
This file is the design source of truth for v2. It replaces the neo-brutalist spec of 2026-10-12, which is preserved, together with its finished build, on the git tag `v2-brutalist`. Where this file conflicts with anything on the `v1` tag, this file wins.

**Design read:** personal portfolio for recruiters and hiring managers (developers second), in a **conceptual sketch** language: a working engineering notebook. Clean, confident type and layout carry every fact; a hand-drawn layer (pen annotations, napkin sketches, margin notes) carries the personality. Built on native CSS + Tailwind v4 + Motion. No component library.

**Dials:** `DESIGN_VARIANCE 7` · `MOTION_INTENSITY 6` · `VISUAL_DENSITY 3`.

**Visual reference:** the "Portfolio sketch directions" canvas, artboard **A** with the purple accent (https://claude.ai/artifact/YXFHmmRFcXkGyfeyvQ8jMK), and the style sheet (https://claude.ai/artifact/EAyMLR1pzPucMff9nit5rg). Where they disagree with this file, this file wins (for example, the canvas hero's button labels predate 7.1).

**Why this direction:** Koddi Evangelista's site (koddievangelista.com) already ships a neo-brutalist mixtape concept (Archivo Black, red / royal blue / yellow / lime, numbered "tracks"), and the two of them share three employers. v2 must differ in concept, type, palette and content shape, not only in color.

Mood references: the "conceptual sketch" boards Gabriel shared (Cool Cat Jazz Club, House Party, Dia dos Namorados, Notion's "Software should be beautiful"), Notion's homepage, Basecamp's Shape Up, Excalidraw+, Ellipsus (dark mode). The pattern we take from all of them: **a clean typeface paired with loose ink drawing and handwritten notes, on paper, with one spot color.**

---

## 1. Goals

1. A recruiter skimming for 30 seconds learns name, role, focus areas, years and current employer, and finds the resume in one click.
2. Side projects give an engineering audience something concrete to click into, told as "from napkin to production".
3. The site is memorable without fighting the content. Personality lives in the drawn layer and a handful of easter eggs (section 5.2), never in the facts.
4. Experience reads like notes from each job, not like a resume. The formal version is one click away on `/resume` and its PDF.

### The two-layer rule (the core of the aesthetic)

| Layer | What | Rules |
|---|---|---|
| **Structure** | Type, grid, headings, body copy, buttons, nav, screenshots, every fact | Clean. Bricolage Grotesque. Straight edges. Never wobbles. |
| **Pen** | Circles, underlines, arrows, strike-throughs, margin notes, napkin sketches, illustrations, stickers | Hand-drawn. Shantell Sans for handwriting. Commentary only: it may repeat or point at a fact, never be the only place a fact lives. |

About 80% of what you see is structure, 20% pen. The hero is allowed to lean further toward pen.

### Non-goals / retired

- Everything retired in v1 stays retired: the IDE metaphor, ⌘K palette, Tweaks panel, joke pages, `writing.md`, the phone number.
- From the neo-brutalist v2: solid offset shadows, 3px outlines everywhere, mint and yellow, Archivo, JetBrains Mono, the status chip eyebrow, the mint contact block.
- A "Working on" section (decided 2026-10-17: add it later, only once there is something real to show).
- A fully sketched UI (wobbly borders on every box, handwriting for headings and buttons). Tested as artboard C and rejected: at recruiter speed it reads as an unfinished wireframe.

---

## 2. Branching and preservation

1. `v1` tag, `gabpaet-portfolio-v1` Vercel project and `v1.gabpaet.dev`: done 2026-10-12 and unchanged. `gabpaet.dev` is primary; `www` 308-redirects to it.
2. Tag **`v2-brutalist`** on `4911a4a` (the last neo-brutalist commit) before the first sketch commit. It is not deployed anywhere.
3. Build the sketch direction on `v2`. Merge to `main` when the checklist (section 15) passes; the existing `gabpaet-portfolio` project then deploys it.

## 3. Stack

Keep: Next.js 16 App Router, React 19, TypeScript, Tailwind v4 via `@tailwindcss/postcss`, pnpm (`corepack pnpm`), Vercel Analytics + Speed Insights, `motion` (`motion/react`), `@phosphor-icons/react`, `simple-icons`.

Add:

```bash
corepack pnpm add perfect-freehand
```

- `perfect-freehand` (1.2.3, MIT, maintained): tapered pen strokes for the pencil doodle layer (5.2).
- **Not used:** Rough.js (last release 2023) and rough-notation (last release 2020). Every pen mark is a static SVG path from `lib/ink.ts`, roughened by a shared SVG filter (4.4). That keeps SSR deterministic (no `Math.random()`, no hydration mismatch), costs no JavaScript, and survives resize without re-measuring.
- Icons: Phosphor, `weight="bold"`, for UI only (`Lamp`, `PencilSimple`, `Eraser`, `Copy`, `Check`, `ArrowRight`, `ArrowUpRight`, `DownloadSimple`, `Printer`, `List`, `X`, `GithubLogo`, `LinkedinLogo`). Icons stay clean (structure layer); they never get the rough filter.
- Brand marks for the stickers come from `simple-icons` path data through `<BrandIcon>`, never redrawn.

Fonts via `next/font/google` (self-hosted, `display: "swap"`):

- **Bricolage Grotesque**, variable, `axes: ["opsz"]` (weight is variable by default; `wdth` is left out because nothing uses it and it doubles the file). Variable `--font-bricolage`.
- **Shantell Sans**, variable, `axes: ["INFM"]` (`BNCE` left out for size). Variable `--font-shantell`.
- JetBrains Mono and Archivo are removed (and their TTFs in `assets/fonts/`, once the share images are redone).

---

## 4. Design tokens

All tokens are CSS custom properties on `:root` in `app/globals.css`, repeated for dark mode under `:root[data-theme="dark"]` (light is the default whatever the OS prefers), and exposed to Tailwind via `@theme inline`. Hex values are mirrored in `lib/tokens.ts` for `next/og` and `themeColor`. **Change both together.**

### 4.1 Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F2F2EE` | `#1A1B19` | Page background (cool off-white, not cream) |
| `--sheet` | `#FBFBF8` | `#242622` | Taped-in paper: napkin cards, stickers, secondary buttons |
| `--ink` | `#1D1D1B` | `#ECEDE6` | Text, outlines, sketches |
| `--ink-soft` | `#57574F` | `#A6A79C` | Secondary text, pencil labels inside sketches |
| `--pen` | `#5A2D91` | `#B79CF0` | **The second pen:** circles, underlines, arrows, margin notes, handwritten dates, link underlines |
| `--btn` | `#4B2380` | `#B79CF0` | Primary button fill |
| `--on-btn` | `#FBFBF8` | `#1A1B19` | Text and icons on `--btn` |
| `--wash` | `rgb(124 77 200 / 0.20)` | `rgb(183 156 240 / 0.24)` | Highlighter swipe behind key phrases, active pencil button |
| `--note` | `#E6DDF3` | `#3A2E52` | Pinned lavender note paper (the motto) |
| `--on-note` | `#1D1D1B` | `#ECEDE6` | Text on `--note` |
| `--tape` | `rgb(205 207 196 / 0.72)` | `rgb(150 152 140 / 0.45)` | Masking-tape strips |
| `--dot` | `rgb(29 29 27 / 0.13)` | `rgb(236 237 230 / 0.10)` | Dot-grid paper pattern |
| `--lift` | `rgb(29 29 27 / 0.22)` | `rgb(0 0 0 / 0.55)` | Paper-lift shadow color |

Measured contrast (WCAG 2):

| Pair | Light | Dark |
|---|---|---|
| ink on paper | 15.0 | 14.7 |
| ink-soft on paper | 6.5 | 7.1 |
| ink-soft on sheet | 7.0 | 6.3 |
| pen on paper | 8.4 | 7.4 |
| pen on sheet | 9.1 | 6.6 |
| on-btn on btn | 10.9 | 7.4 |
| ink on wash (over paper) | 11.5 | 9.3 |
| on-note on note | 12.9 | 10.5 |

Rules:

- **One accent: purple.** No other hues anywhere, except inside real screenshots and real brand marks (which render in `currentColor`, so they are ink too).
- Purple is a **pen**, not a highlighter. Dark purple never sits behind text; behind text use `--wash`.
- `--pen` text is always handwriting (Shantell). Structure text is `--ink` or `--ink-soft`.
- No gradients, glows or pure `#000`/`#FFF`. The only shadow is the paper lift (4.4).
- Paper texture: CSS dot grid (`radial-gradient(var(--dot) 1.1px, transparent 1.4px)`, 22px) plus a static grain. The grain is a tiny `feTurbulence` SVG used as a **fixed, `pointer-events: none` pseudo-element** (`body::after`) at 6% opacity (5% dark), with no blend mode. Never on scrolling containers, never animated, no paper photos.

### 4.2 Typography

| Role | Family | Settings | Size | Leading | Tracking |
|---|---|---|---|---|---|
| Display (hero name, "Say hi.") | Bricolage | `wght 750`, `opsz 96` | hero `clamp(3.5rem, 7.4vw, 6.5rem)`; contact `clamp(4rem, 11vw, 10rem)` | 0.94 | -0.035em |
| H2 (section) | Bricolage | `wght 750`, `opsz 72` | `clamp(2.5rem, 5vw, 4rem)` | 1.0 | -0.03em |
| H3 (company, project) | Bricolage | `wght 700` | `clamp(1.75rem, 2.6vw, 2.125rem)` | 1.1 | -0.02em |
| Lead (hero subtext, about lead) | Bricolage | `wght 400` | `1.3125rem` (about: `clamp(1.375rem, 2.3vw, 1.75rem)`) | 1.45 | -0.01em |
| Body | Bricolage | `wght 400` | `1.125rem` | 1.55 | 0 |
| Meta (title line, mode) | Bricolage | `wght 500` | `1.0625rem`, `--ink-soft` | 1.4 | 0 |
| Button | Bricolage | `wght 650` | `1.0625rem` | 1 | 0 |
| Chip | Bricolage | `wght 500` | `0.875rem` | 1 | 0 |
| **Hand** (notes, dates, captions) | Shantell Sans | `wght 400`, `INFM 70` | `1.125rem` to `1.25rem`, never below `1.0625rem` | 1.3 | 0 |
| **Hand title** (napkin headings) | Shantell Sans | `wght 600`, `INFM 70` | `1.6875rem` | 1.2 | 0 |

- Handwriting runs **8 words or fewer** per note, and never carries body copy, nav, buttons or headings.
- Body max width `65ch`; the about lead `36ch`.
- Emphasis inside structure text is the `--wash` highlighter on a phrase, never a second family.
- One `<h1>` per page; real `h2`/`h3`.

### 4.3 Shape

| Element | Radius |
|---|---|
| Paper (napkin cards, notes, stickers) | 3px: real paper is nearly square |
| Buttons, icon buttons, screenshot frames | 12px |
| Chips | 999px |
| Drawn boxes inside sketches | `rx 4` |

Highlighter swipes use an uneven radius (`3px 9px 4px 8px`) so they read as a marker stroke.

### 4.4 Lines, marks and the paper lift

- **Structure lines:** 2px solid `--ink` (buttons, screenshot frames, the footer rule); chips 1.5px. One rule above a group, never a hairline under every row.
- **Paper lift** (only on taped-in paper and screenshots): `box-shadow: 0 22px 44px -22px var(--lift), 0 2px 0 var(--lift)`. Paper is also rotated -2deg to 2deg, and taped with 1 or 2 `--tape` strips (84 to 96 × 26 to 28px, rotated ±3 to 8deg, or -32deg across a corner).
- **Pen marks:** SVG paths from `lib/ink.ts` (6.1), `fill: none`, `stroke: var(--pen)` (or `--ink` / `--ink-soft` inside sketches), round caps and joins. Widths: annotations 2 to 2.4px; circles and underlines 3.5 to 5px.
- **Roughness:** one shared filter set, rendered once in the root layout inside an `aria-hidden` 0×0 SVG (not `display: none`; Firefox drops filters there):
  - `#ink-a`: `feTurbulence fractalNoise baseFrequency 0.035 numOctaves 2 seed 3` → `feDisplacementMap scale 3`
  - `#ink-b`: same with `baseFrequency 0.05 seed 11`
  - `#ink-c`: same with `baseFrequency 0.04 seed 23`

  Applied to pen paths only, never to text or a whole section (it blurs text and is CPU-heavy). Sticker logos get `scale 1.5`.

### 4.5 Spacing and layout

- Container `max-w-[1200px] mx-auto px-5 md:px-10`.
- Section padding `py-16 md:py-24`; hero `pt-10 md:pt-14`, never above `pt-24`.
- Breakpoints: Tailwind defaults. Every multi-column layout collapses to one column below `lg` (1024), as v2 learned on tablets.

### 4.6 Z-index scale (`lib/z.ts`, mirrored as `--z-*`)

`base 0` · `sticker 10` · `sticker-dragging 20` · `pencil 30` · `nav 40` · `mobile-menu 50` · `toast 60` · `grain 65` · `splash 70` · `cursor 80`.

The grain sits above everything but the splash (it is click-through), so taped-in paper and the nav carry the same texture as the page. It has no blend mode: a blended fixed layer would repaint what is under it on every scroll.

---

## 5. Motion

Every animated component is a `"use client"` leaf, or plain CSS. Everything collapses to static under `prefers-reduced-motion: reduce`. Motion's `reducedMotion="user"` only stops transforms, so draw-ins (`stroke-dashoffset`) and boil (`filter`) are gated with `@media (prefers-reduced-motion: no-preference)` explicitly.

### 5.1 Core motion

| Interaction | Spec | Why |
|---|---|---|
| **Draw-in** | Pen paths carry `pathLength="1"` and class `ink-draw`: `stroke-dasharray 1; stroke-dashoffset 1 → 0`, 0.9s `cubic-bezier(.65,0,.35,1)`, per-path delay via `--d`. Above the fold it runs on first paint (CSS only); in other sections it runs when the section's `Reveal` sets `data-shown` (IntersectionObserver, `rootMargin 0px 0px -15% 0px`, once). Hidden only under the `.js` class, so no-JS visitors see every mark fully drawn. | Storytelling: notes get written as you read. |
| **Section reveal** | Structure content: `opacity 0, translate 0 16px` → rest, 0.5s `cubic-bezier(.16,1,.3,1)`, once, same observer; siblings stagger 0.06s. | Reading order. |
| **Boil on hover** | Interactive pen marks (drawn link underlines, stickers, the napkin card) cycle `filter: url(#ink-a) → (#ink-b) → (#ink-c)` with `steps(1)` at about 10fps while hovered or focused. Never runs on its own. | Feedback: the ink comes alive under your hand. |
| **Lift** (buttons, stickers, paper links) | Hover `translateY(-2px) rotate(-0.6deg)`; active `translateY(1px) scale(.98)`; 0.25s `cubic-bezier(.16,1,.3,1)`; hover only under `(hover: hover)`. | Tactile feedback. |
| **Copy email** | Label "Copy email" → "Copied" with a 150ms crossfade; reverts after 2s. | State change. |

Banned: marquees, scroll listeners, parallax, infinite loops, GSAP, animating grain or any full-section filter.

### 5.2 Easter eggs

| Egg | Spec |
|---|---|
| **Splash signature** | See 6.15. |
| **Ink marks** | Clicking empty paper in the hero (not a link or button, and not while the pencil is out) drops a hand-drawn mark at the pointer: a star, check, scribble or burst, in rotation, alternating `--pen` and `--ink`, rotated -20 to 20deg, 52px. It draws in 0.35s, fades after 1.6s and is removed at 2.6s. At most 6 on screen. Reduced motion: it appears without drawing, then fades. Marks are `aria-hidden`. |
| **The pencil** | Nav button (`PencilSimple`, `aria-pressed`, label "Pick up the pencil"). See `PencilLayer` (6.10). |
| **Crossed-out draft** | Above the hero title, "Full-stack ninja" in handwriting with a zigzag strike drawn through it (`<s>` in the DOM). |
| **Taped stickers** | Six hand-traced logo stickers taped around the napkin card, draggable (6.6). |
| **Hidden margin notes** | At most 2 on the whole site: a short handwritten aside that appears (draws in) on hover or focus of its anchor. Draft: on the Tong Masters "Play it" link, "bring two friends". VERIFY. |
| **Desk lamp** | The theme toggle is a desk lamp (6.7). |

### 5.3 Pen cursor (`components/pen-cursor.tsx`, client)

Added 2026-10-19 (option A of the cursor playground; inspired by aahil-khan.xyz, which uses a plain dot and circle).

- **Who gets it:** mouse and trackpad only (`(hover: hover) and (pointer: fine)` and a `pointerType` of `mouse`). The component adds `html.has-pen-cursor` on the first mouse move, and only then does CSS hide the system cursor, so touch, pen, keyboard and no-JS visitors never lose it. Leaving the window hides the dot; it reappears where the pointer comes back.
- **Resting:** an 8px `--pen` dot with a 1.5px `--paper` halo (visible over ink buttons and screenshots). It eases after the pointer (exponential follow, 45ms time constant, written straight to `transform` in a `requestAnimationFrame` loop that stops once it catches up; never React state).
- **Over a link or button** (`a[href]`, `button`, `[role=button]`, `summary`, `label[for]`): the dot shrinks away and the "gp" mark's `ring` (`lib/ink.ts`, rough `#ink-a`, 40px) draws around the pointer in 0.35s, and undraws on the way out. On a control filled with the pen's own purple (the primary buttons, `--btn`), where a purple ring would vanish, the ring is drawn in the button's label colour `--on-btn` instead: near-white in light mode (black was tried first and was still hard to see on the dark purple), the night paper in dark, edged with a hairline `--btn` drop shadow so the part past the button's edge still shows on the paper (2026-10-19); the component checks the nearest opaque background when the pointer reaches a new element.
- **Over text** (an element with words of its own): the dot becomes a 2px caret, its height 1.15 × the element's font size (14 to 56px).
- **Pressing:** the dot scales to 0.7 and the ring to 0.88.
- **System cursor instead:** fields, `select`, `contenteditable`, draggable stickers (`grab` / `grabbing`), disabled controls (`not-allowed`), while the pencil is out (on the whole page: the crosshair over the drawing layer and a normal pointer over its bar, so Erase and "Put the pencil down" stay visible; fixed 2026-10-19), and while the splash signs.
- **Reduced motion:** the dot sits exactly on the pointer, and every state change is instant.
- `z cursor`, `aria-hidden`, `pointer-events: none`, hidden in print.

---

## 6. Components

Folder `components/` (flat). Pen components live in `components/ink/`. Server components by default; client leaves marked.

### 6.1 Pen primitives (`components/ink/*`, server)

All are `aria-hidden` SVGs that inherit color from a `tone` prop (`pen` default, `ink`, `soft`), take `draw` (boolean, default true) and `delay` (seconds), and pull path data from `lib/ink.ts`. The path library is small and fixed, and is reviewed on the style sheet; never invent a one-off path inline.

| Component | Use | Geometry |
|---|---|---|
| `InkCircle` | Circles a phrase (hero title) | Overshooting ellipse, absolutely positioned around its child with -8 to -10px insets, `preserveAspectRatio="none"` |
| `InkUnderline` | Under headings, the email, drawn links | One slightly bowed stroke; `variant="link"` is 3px and boils on hover |
| `InkArrow` | Margin notes to their subject | Curved shaft + 2-stroke head; `dir` = `left`, `down`, `down-right`, `up-right`, `loop` |
| `InkStrike` | The crossed-out draft | Two loose lines through the text, so it stays readable |
| `InkBox` | Boxes in napkin sketches | Rough rect, `rx 4` |
| `Highlight` | Highlighter swipe | A `<mark>` with `--wash`, uneven radius, `box-decoration-break: clone` (no SVG) |
| `Tape` | Tape strips on paper | A `<span>` with `--tape` (no SVG) |

### 6.2 `MarginNote` (server)

A handwritten note (`--pen`, Hand role) with an optional `InkArrow` pointing at its subject. On `lg+` it sits in the right-hand margin column; below `lg` it drops under its subject, the arrow turns to `up-right`, and it gets `margin-top: 8px`. Text ≤ 8 words.

### 6.3 `PaperCard` (server)

Taped-in paper: `--sheet`, 3px radius, paper lift, `rotate` prop (-2 to 2deg), `tape` prop (`top`, `top-pair`, `corners`). Children are usually a napkin sketch.

### 6.4 `NapkinSketch` (server)

Per-project sketches drawn in SVG with pen primitives plus `<text>` labels in Shantell (`--ink-soft`) and a single `--wash` patch. Each one is a component in `components/napkins/` (`tong-masters.tsx`, `portfolio-v1.tsx`, `how-i-build.tsx`), `role="img"` with an `aria-label` that says what is drawn. Strokes draw in with staggered `--d`.

### 6.5 `Button` / `ButtonLink`

- `primary`: `--btn` fill, `--on-btn` text, 2px `--ink` border, 12px radius. `secondary`: `--sheet` fill, `--ink` text, same border.
- Heights 52px (`md`) / 44px (`sm`), 44×44 (`icon`). Lift motion. Optional Phosphor icon (20px, bold).
- `focus-visible`: `outline: 3px solid var(--pen); outline-offset: 4px`.
- Disabled: 50% opacity, no lift.

### 6.6 `Sticker` (client) and `StickerBoard`

- Paper scrap: `--sheet`, 3px radius, paper lift, one tape strip across the top, 80px square (60px on phones), brand mark 40px in `--ink` with the rough filter at scale 1.5. The `>_` keycap is Shantell 600 30px.
- Set and rest rotation, clustered around the napkin card's top and right edges: Claude -8deg, Next.js 6deg, `>_` -4deg, Node.js 10deg, PostgreSQL -6deg, Docker 4deg.
- Drag (from v2): `drag`, `dragConstraints` = hero board, `dragElastic 0.2`, `dragSnapToOrigin`, spring `{stiffness 300, damping 20}`; `whileDrag` scale 1.06, rotate 0, `z sticker-dragging`. Enabled only under `(pointer: fine)` with motion allowed. Boils while hovered.
- `aria-hidden`, plus a visually hidden sentence: "Tools I use daily: Claude, Next.js, Node.js, PostgreSQL and Docker."
- Phones: a static wrapping row under the hero buttons.

### 6.7 `LampToggle` (client)

- A 44×44 icon button: 2px ink border, 12px radius, `--sheet` fill, Phosphor `Lamp` (bold). In light mode two short pen "rays" under the shade are drawn; in dark mode they're gone (lamp off).
- `role="switch"`, `aria-checked` = dark, `aria-label="Dark mode"`, `title` "Turn the lamp off" / "Turn the lamp on".
- Light by default for every visitor, whatever the OS prefers (changed 2026-10-18; it used to follow the OS). A click stores `"light" | "dark"` under `THEME_STORAGE_KEY` (`gabpaet.theme.v2`) from `lib/theme.ts`; `THEME_INIT_SCRIPT` applies it before paint.
- Switching themes crossfades `background-color` and `color` for 0.4s (reduced motion: instant).
- **Sound** (`lib/lamp-sound.ts`, added 2026-10-19): a pull-cord switch, synthesized like the pencil sounds (shared plumbing in `lib/sound.ts`). A sharp click as the cord is pulled (1ms noise burst rung through bands at 3.2kHz, Q 8, and 5.4kHz, Q 6, over a short plastic tock; peak about -17dBFS), three tiny bead-chain ticks around 6.5kHz, then a lighter click at 2.6kHz 110ms later as the cord springs back. Switching off plays everything at 0.85 of the pitch. About 0.15s; played straight from the click.

### 6.8 `Nav` (client for the menu)

- Sticky, 72px, `--paper` fill. No bottom rule while scrolling, so it never competes with the progress line; a 2px ink rule shows only while the phone menu sheet is open. (Until 2026-10-18 the rule appeared once the hero left the view.)
- Scroll progress: a 3px `--pen` line (the `progress` wave in `lib/ink.ts`, stretched to the full width) draws along the bar's bottom edge from 0 at the top of the page to full at the bottom. Pure CSS: a scroll-driven animation (`animation-timeline: scroll(root block)`) on its `stroke-dashoffset`, behind `@supports`, so there is no scroll listener. Where unsupported (Firefox without the flag) or on a page that cannot scroll, the line stays hidden. Hidden in print.
- Left: the "gp" mark linking to `/`, the same as the favicon: a 48px `--pen` `ring` (draws in on load, boils on hover) around "gp" in Shantell 700, 22px, `--ink`. `aria-label` "Gabriel Paet, home"; the focus ring is round. (It replaced the "Gabriel Paet" wordmark on 2026-10-18.)
- Right on `lg+`: links **Experience / Projects / About / Contact** (16px, 500). The active section gets a 3px `--pen` drawn underline. Then `PencilButton`, `LampToggle` and `ButtonLink secondary sm` **"Résumé"** → `/resume`.
- Below `lg`: the mark, pencil, lamp, menu button (`List` / `X`). The menu is the v2 sheet (focus trap, Esc, closes on navigation), restyled as taped-in paper, with the links in Bricolage 32px and the Résumé button.

### 6.9 `Chip`

Tech label: 1.5px `--ink` border, pill, padding `3px 12px`, Chip type, static. The home page shows 4 per role; the full lists live on `/resume`.

### 6.10 `PencilLayer` (client) and `PencilButton`

- `PencilButton` in the nav toggles pencil mode (`aria-pressed`; its fill becomes `--wash` while active).
- While active, a document-height absolute layer (`z pencil`, above content, below the nav) captures `pointerdown/move/up` and records points in page coordinates. Each finished stroke goes through `getStroke()` from perfect-freehand (`size 4, thinning 0.6, smoothing 0.5, streamline 0.5`) and renders as a filled `--ink` path. The live stroke renders through the same function.
- A pinned bar at the bottom center (`fixed`, `z pencil`, taped paper, 48px buttons) holds **"Put the pencil down"** and, once something is drawn, **"Erase"**. Esc also puts it down.
- Phones: while the pencil is out the layer sets `touch-action: none`, so the page does not scroll; the pinned bar is the way out. The bar itself carries the Hand hint "pencil's out. draw anywhere." (from `sm` up; phones show just the buttons).
- Doodles stay on the page after the pencil goes down, until Erase or the next page. The live stroke is written to its `<path>` through a ref, so drawing never re-renders React.
- Nothing is saved. Doodles are cleared on navigation. `aria-hidden` layer; the buttons are real buttons.
- Reduced motion does not disable it (the visitor's own drawing is not motion).
- **Scratch sound** (`lib/pencil-sound.ts`, added 2026-10-19): while the pointer is down, a soft pencil-on-paper "shhh" synthesized with Web Audio (no file), fitted third-octave by third-octave to a recording of a pencil writing that Gabriel picked (within 0.8dB on average from 160Hz to 14kHz, checked with the browser's own filter responses). White noise whose loudness wanders between 0.45 and 1.1 every 25 to 60ms (the recording flutters like that even mid-stroke), split into the graphite (Butterworth high-pass 900Hz, a +5dB peak at 11.5kHz with Q 1.17, low-pass 15kHz) and the body (band-pass 550Hz, Q 0.7, gain 4). Two earlier takes failed by ear: a 2 to 5kHz band sounded like scraping paper, and a flat "shhh" with a body at 160 to 400Hz was not close enough. Level follows the hand: silent when still (fades 70ms after the last move), up to gain 0.05 at 1.4px/ms (`pace^0.7`); a stylus's pressure scales it. **Strokes are articulated like the copy-email tick** (Gabriel preferred its sound, 2026-10-19): when the hand turns more than about 55deg (heading measured every 6px, compared with the heading two steps back, so a sharp corner split across samples still counts and the loop of an "o" does not), or moves again after a pause, the level dips to 15% in 12ms, swells to 120% of the hand's level by 45ms and settles toward 70%, while the high-pass sweeps 1kHz to 750Hz over 110ms; a long stroke then eases down to 60%. Checked headless: a six-stroke zigzag gives 6 strokes, a circle 1, a shaky straight line 1. Stroke timing uses the page clock, not the audio clock. The AudioContext is created on the first stroke (a user gesture), so nothing plays or loads before someone draws. It stops on pointer up, when the pencil goes down and on leaving the page. No mute control: it only plays while the visitor is drawing.
- **Erase sound** (same file, `pencilSound.erase()`, added 2026-10-19): clicking Erase plays a rubber eraser scrubbing the page, about 0.4s: three rubs of 110ms with 25ms gaps, each lighter (1, 0.8, 0.55 of gain 0.07), using the pencil's noise through a band-pass at 1 to 1.5kHz (Q 0.8, sliding up on one rub and down on the next, so it reads as back and forth), a 4kHz low-pass and a rubbery body at 280Hz (gain 2). Duller and lower than the pencil.
- **Pick-up and put-down sounds** (same file, `pickUp()` / `putDown()`, played from `pencil.set` in `lib/pencil.ts` so every way in and out sounds the same: the nav button, the bar, Esc and a new page). A wooden tap is a noise click rung through a narrow band-pass (Q 5) over a short sine thump at a ninth of its pitch, falling to a fourteenth. Pick up (about 0.1s): a 70ms brush of the pencil's high band, then one light tap at 2.9kHz (peak about -18dBFS). Put down (about 0.25s): "tk-tok" at 2.1kHz then 1.7kHz 65ms apart, then three fading rattle taps at 2.5kHz as it rolls to a stop (peak about -16dBFS).

### 6.11 `SectionHeading`

`<h2>` at H2 scale with an optional `InkUnderline` under part of it (in `--pen`, 5px, about 60% width). No eyebrows, numbers or right-floating explainers. An optional one-line `--ink-soft` intro below.

### 6.12 `ScreenshotFrame`

`next/image` in a 2px ink border, 12px radius, paper lift, slight rotation (0.5 to 1deg), 1 or 2 tape strips across the corners. Fixed aspect ratio (16:10 desktop, 9:19.5 phone). Captions sit below in Hand (`--pen`), never on the image.

### 6.13 `CopyEmailButton` (client)

v2 behaviour (Clipboard API, select-text fallback "Press ⌘C to copy", `aria-live`), restyled as `secondary`.

**Sound** (added 2026-10-19): when the copy succeeds, the pencil ticks it off: `pencilSound.check()` (`lib/pencil-sound.ts`) draws a check mark in the pencil's own voice, a short stroke down (50ms) and a longer one up (110ms, starting 65ms later), each swelling and fading, peak gain 0.06, with the graphite opening as the stroke speeds up. About 0.18s. The audio wakes inside the click (`prepare()`), since the tick only plays after the Clipboard API answers. No sound for the "Press ⌘C" fallback.

### 6.14 `Illustration` (server)

- Traced ink illustrations (section 10.3) are rendered as **CSS masks**: each layer is a span with `mask: url(/illustrations/<name>-<layer>.svg) center / contain no-repeat` and a token background, so they re-ink in dark mode and stay cacheable. Layers: `ink` (`--ink`, always), `pen` (`--pen`, one element: the lamp's rays, the plane's dotted path) and `fill` (`--sheet`, an opaque silhouette for art that overlaps something: the hero hand). The layers stack in one grid cell, so the root is a plain `div` that callers position freely.
- Hover easter egg (pointer only; off under reduced motion): when the pointer moves onto the art, its `pen` layer plays once and ends on the finished drawing (`animation-fill-mode: both`), so it never blinks out; hovering again replays it. (A first version looped, and the restart left the trail and the z hidden for a moment.) `content-visibility: auto` also clips painting to its box, which cut off the plane's nose mid-bob and the z as it drifted up, so the masks paint on a box 12px wider and 24px taller than the art on each side (`-inset-x-3 -inset-y-6`, layers inset back). Keep any new hover motion inside that margin. Lamp: the rays switch on with a flicker and spread out from the bulb. Plane: the dotted trail redraws from its tail, then the plane bobs. Nap: the "z" drifts up and fades and a new one appears. The pen layer is a mask, so the reveals intersect it with a gradient mask driven by the registered `--art-reveal` property; the z is a transform. It never loops, so "nothing loops on its own" holds.
- Decorative (`aria-hidden`) unless given a `label`. Fixed aspect ratio from the shared viewBox (no CLS); below-the-fold ones are lazy via `content-visibility: auto`, which also defers fetching their masks.
- **Every layout must work without its illustration.** Until the art arrives, the slot renders nothing.

### 6.15 `SplashSignature` (client)

A short intro, not a loading screen.

- **When:** only on `/`, only on the first home view of a browser session (`sessionStorage["gabpaet.splash.v2"]`), and never when the URL has a hash, under reduced motion, without JS, or in print. The pre-paint script in `<head>` decides and sets `html.splash`; CSS shows the overlay only under that class, so nothing flashes and no-JS visitors never see it.
- **What:** a fixed full-screen `--paper` sheet (dot grid, grain) with the signature centered. A `--pen` pen signs Gabriel's signature (0.15s → 1.5s), stroke by stroke: each of its five strokes starts as the previous one ends and gets a share of the time in proportion to its length, eased `cubic-bezier(.45,0,.55,1)` like a pen that speeds up and settles. Width `min(78vw, 520px)`. The finished signature holds for 0.25s, then **the signature becomes the logo** (0.7s): the paper (`.splash-paper`) fades to the hero underneath while the signature shrinks and glides into the nav's "gp" mark (the component measures the mark and sets `--fly-x`, `--fly-y`, `--fly-s`; `cubic-bezier(.65,0,.25,1)`), fading as it lands, and the mark's ring draws in (`html.splash` adds 0.3s to the nav's draw-in delays so it starts as the signature arrives; the class stays on `<html>` afterwards so the ring never jumps). Without a nav mark the signature just fades in place. (Until 2026-10-18 the sheet slid up and away; a page turn was tried and dropped.) **The lift waits for the last stroke to finish** (its Web Animations `finished` promise), not a fixed timer: a timer cut the signature short when the browser painted late (seen in Safari on 2026-10-18). A fallback lifts it at 3.25s regardless. The hero's own draw-ins are paused while `html.splash-signing` is set and start as the paper fades. **About 2.5s in all** (it was 1.2s, which proved too fast to read the signature); any input still skips it at once.
- **Skip:** any `pointerdown`, `keydown`, `wheel` or `touchmove` lifts the sheet immediately.
- **Never blocks:** the page renders underneath from the first paint, so LCP is the real hero; the overlay is `aria-hidden` and has no focusable content. Focus stays on the document.
- **Signature source:** Gabriel's real signature, traced into centerline strokes in `lib/signature.ts` (10.4) and drawn with `stroke-dashoffset` (`pathLength=1`).
- `z splash`. Removed from the DOM once lifted.

### 6.16 `Footer`

Above the rule, right-aligned, the sign-off (`components/footer-nap.tsx`): illustration #5 (asleep at the desk, Bella asleep beside the laptop; 260px, 340px from `md`) with a Hand note "that's all for today. / Bella agrees." to its left (above it on phones). Every page except `/resume`, which stays a clean document; hidden in print. Then a 2px ink rule. Left: "© 2026 Gabriel Joshua Paet" (`--ink-soft`). Right: links **Résumé**, **GitHub**, **LinkedIn**, **v1 of this site**, each at least 44px tall. Stacks on phones. `print:hidden`.

---

## 7. Home page `/`

Single scroll. Every section uses a different layout family. No eyebrows: handwritten notes do the labelling.

```
Nav
Hero         split: name + title + buttons | napkin card + stickers + illustration #1
Experience   margin-note rows: date margin | entry | note
Projects     napkin vs shipped two-up, then a v1 row
About        lead paragraph | pinned lavender note + illustration #3
Contact      giant "Say hi." + email + note + illustration #4
Footer
```

### 7.1 Hero (`<section aria-labelledby="hero-name">`)

- Left column (`lg`: 1.15fr):
  1. Hand note **"hi, I'm"** (`--pen`, rotated -3deg) with a small `InkArrow down-right` toward the name.
  2. **H1:** `profile.name` ("Gabriel Joshua Paet") at Display. It wraps naturally ("Gabriel / Joshua Paet" at 1280 and on phones).
  3. Title row: `profile.heroDraft` ("Full-stack ninja") in Hand `--ink-soft` with `InkStrike`, then **`profile.role`** ("Software Developer", changed from "Senior Programmer" on 2026-10-19; the job titles under Experience stay as they were, Bricolage 650, 28px) with `InkCircle` in `--pen`.
  4. Lead: **"I build web and mobile applications, workflow automation, and the cloud infrastructure that runs them. 9 years shipping."** (18 words; years from `yearsShipping`, which `yearsSince("2017-05")` in `lib/dates.ts` works out at build time; the bio spells the same number with `numberWord`), `--ink-soft`, `max-w-[34ch]`.
  5. Buttons: `primary` **"Résumé"** (`FileText`) → `/resume`; `secondary` **"See projects"** (`ArrowDown`) → `/#projects`.
- Right column: `PaperCard` (rotate 1.4deg, tape pair) holding `NapkinSketch how-i-build`: a Hand title "how I like to build", then three `InkBox`es "rough idea" → "first version" → "people use it" (the last on `--wash`), a loop arrow back, and "then make it better. repeat." Stickers are taped around it (6.6). Illustration #1 (the hand with a pencil, cut out of its own napkin) sits on the card's lower right with its pencil just under "repeat.", as if it had written it; its arm runs off the card's bottom edge and fades out (a gradient mask). From `md` the card gets extra bottom padding to make room; hidden below `md`.
- Under the card, Hand caption "click the paper, it leaves a mark", right-aligned on phones and left-aligned from `md` (clear of the hand's arm).
- From `lg` the two columns are bottom-aligned, so the caption lines up with the buttons, and the right column has `pt-12` so the top stickers clear the sticky nav.
- Fits the first viewport at 1280×720 and 375×812 with buttons visible. Phones: single column, card below the buttons, stickers a static row.

### 7.2 Experience (`#experience`)

- H2 **"Where I've built things"** with an `InkUnderline`.
- One row per role, `lg+` grid `170px | minmax(0,1fr) | 230px`, gap 32px, rows 56px apart; below `lg`, one column (date, entry, note).
  - **Margin:** handwritten dates (`--pen`, rotated -3deg), for example "May 2026 → now".
  - **Entry:** company (H3); a Meta line with the title and mode; **one** `homeLine` sentence with one `Highlight`ed phrase; up to 4 `Chip`s.
  - **Note:** a `MarginNote` with an `InkArrow left` (`role.note`).
- HPE is a single compact row (dates, "Hewlett Packard Enterprise, intern. A C# app for tracking FTE allocations."), with the **"Full résumé"** drawn link in its note column.

| Role | `homeLine` (highlight in **bold**) | Note | Chips |
|---|---|---|---|
| Lumora Capital, Senior Programmer, hybrid | Building **Centra**, Lumora's proprietary loan origination and servicing system, and automating manual operations with n8n and agent tooling. VERIFY (second half) | "Claude Code is part of my daily workflow here" VERIFY | Next.js, Node.js, PostgreSQL, n8n |
| ahaStudio, Senior Programmer, a Volenday Group studio | Shipped **LLM features** with LangChain, LangGraph, OpenAI, AWS Bedrock Agents and Vertex AI, across web and mobile apps. VERIFY | "Programmer to Senior in 8 months" (computed from `titles`) | LangGraph, Bedrock Agents, Next.js, React Native |
| Volenday Group, Programmer, remote | Built a React Native app in Danish and Norwegian with its REST API, then **led the team** as scrum master on a web app we moved to Azure. | "my first full-time job. 6 years, 8 months" (duration computed) VERIFY | React Native, Azure, MSSQL, Node.js |

Computed notes come from a helper (`lib/dates.ts`) so they can never drift from `titles`.

### 7.3 Projects (`#projects`)

- H2 **"From napkin to production"**, intro "Every project starts as a scribble. Here's the scribble, and here's what shipped."
- Tong Masters two-up (`lg+` `1fr | 1.1fr`, stacked below):
  - Left: `PaperCard` (rotate -1.8deg) with `NapkinSketch tong-masters`: a Hand title "tong-its, but online?", a rough oval table, three seats, a stock pile, a `--wash` "melds" patch, and the labels "3 players" and "draw from the stock, or fight". Hand caption "the napkin".
  - Right: `ScreenshotFrame` (desktop shot, taped corners), Hand caption "the thing that shipped", H3 "Tong Masters", summary, then drawn links **"Read the case study"** → `/projects/tong-masters` and **"Play it"** → live site (the "Play it" link carries the hidden margin note, 5.2).
- Below it, after a 2px rule: the **Portfolio v1** row: "**Portfolio v1.** The site before this one, built to look and work like VS Code." plus drawn links "Read the case study" and "Visit v1".

### 7.4 About (`#about`)

- `lg+` grid `minmax(0,1fr) | 300px`, stacked below.
- Left: H2 **"About"**, then the bio lead (`profile.bio`, first sentence) at Lead size with `profile.bioMark` ("I love building things that interest me") highlighted, then the rest of the bio in Body `--ink-soft`. **Never mentions Lumora or the current role.** Bio VERIFY.
- Under the bio, in the left column: a pinned `--note` card (rotate -2deg, max 360px, indented 48px from `sm`): Hand "always view problems as an opportunity." and a smaller Hand line "my motto, for what it's worth".
- Right: illustration #3 (desk lamp over a notebook, rays in `--pen`), level with the bio from `lg`; on phones 200px wide, right-aligned under the note.

### 7.5 Contact (`#contact`)

- H2 **"Say hi."** at the contact Display size.
- `hello@gabpaet.dev` (`mailto:`), 42px Bricolage 650, with a 5px `--pen` `InkUnderline`; next to it `CopyEmailButton`, then `secondary` buttons LinkedIn and GitHub.
- `MarginNote` with an `InkArrow up-right`: **"not actively looking, open to a chat"** (from `profile.status`).
- Illustration #4 (paper plane with a looping dotted path in `--pen`) at the top right on `lg+`, beside "Say hi.", `min(40vw, 440px)` wide.

---

## 8. Project case studies `/projects/[slug]`

Static routes from `content/projects.ts`, a **notebook spread** from top to bottom:

1. Drawn back link "All projects" → `/#projects`.
2. H1 (H2 scale), summary, buttons `primary` **"Live site"** (`ArrowUpRight`) and, when public, `secondary` **"Code"** (`GithubLogo`). Tong Masters adds illustration #2 (hands fanning cards) to the right on `lg+`, bottom-aligned with the buttons.
3. **The napkin and what it is**, side by side from `lg`: the project's `NapkinSketch` on a `PaperCard` (boils on hover, Hand caption "the napkin"), and **What it is** (2 to 3 sentences). No napkin margin notes until Gabriel has something true to say there.
4. **How it's built:** stack chips, then `WhiteboardDiagram` (8.1).
5. **What shipped:** desktop `ScreenshotFrame` plus the phone frame beside it from `md` (stacked below), taped in, with Hand captions "on a big screen" and "and in your pocket".
6. **Hard problems:** an annotated list. Each entry is an H3 and 2 sentences, with an optional `MarginNote` (`problem.note`, ≤ 8 words) in the margin column. Entries are separated by space, not boxes.
7. **What's next:** a to-do list. Each item has a hand-drawn checkbox (an `InkBox` 20px, plus an `InkPath` check when `done`), and Body text. Real `<ul>`; the check state is in the text for screen readers ("done:").
8. Credits line (Hand) when contributors exist.

### 8.1 `WhiteboardDiagram`

It replaces `ArchitectureDiagram`. Nodes are `InkBox`es with Bricolage 600 labels and `--ink-soft` details, joined by `InkArrow`s, laid out left to right on `lg+` and top to bottom below. It stays an `<ol>` (reading order = data flow). The Tong Masters engine is named inside both nodes, as in v2.

### 8.2 Content

Unchanged from the 2026-10-12 spec (now in `content/projects.ts`): live URLs, Tong Masters' private repo (no Code button), architecture and screenshots. (The credits line was removed on 2026-10-18 at Gabriel's request.) New fields:

- `hardProblems[].note?: string` (VERIFY drafts).
- `whatsNext: { text: string; done?: boolean }[]`. Tong Masters: two shipped items checked (bots that fill empty seats; the guided tutorial) and two open ones from the old "what's next" line (VERIFY). v1: `[{ text: "Retired in favour of v2, and kept live as a reference", done: true }]`.
- `playNote?: string`: the hidden margin note on the home "Play it" link (5.2). Tong Masters: "bring two friends" (VERIFY).
- The `NapkinSketch` is picked by `slug`; no field needed.
- v1 napkin: a rough sketch of an editor window (sidebar, tabs, a ⌘K box) labelled "a portfolio that's a code editor?".

---

## 9. Resume `/resume`

- Content and structure from v2 (every role and highlight, full chip lists, skills, projects; no phone; no Education until Gabriel supplies it).
- Screen: single column `max-w-[800px]`, structure layer only, plus up to one `MarginNote` per role (the same `role.note`) in a right margin on `lg+`. Buttons `primary` **"Download PDF"** and `secondary` **"Print"**.
- Print and PDF: **no pen layer at all** (`print:hidden` on every pen component, illustration and the grain), light tokens forced, 1px lines, no lift shadows or rotation, A4 with 14mm margins, `break-inside: avoid` per role. Body stays Bricolage.
- The PDF is regenerated from a production build after any content change (CLAUDE.md has the procedure).

---

## 10. Content model and assets

### 10.1 `content/profile.ts` additions

- `heroDraft: "Full-stack ninja"`
- `heroLine`: "I build web and mobile applications, workflow automation, and the cloud infrastructure that runs them. ${yearsShipping} years shipping."
- `Role.homeLine: string` and `Role.mark: string` (the substring to highlight; it must occur in `homeLine`; dev-time assert).
- `Role.note?: string`, 8 words or fewer. The placeholders `{promotion}` ("Programmer to Senior in 8 months") and `{tenure}` ("6 years, 8 months") are filled from `titles` by `roleNote()` in `lib/dates.ts`, which also formats the handwritten dates (`handRange`: "May 2026 → now"; `handYears`: "2015 → 2016").
- `HOME_CHIP_COUNT` is 4, so each role's `stack` lists its home chips first.
- Everything else is unchanged. `profile.ts` stays the single source for the home page, `/resume`, JSON-LD, metadata and share images.

### 10.2 `lib/ink.ts`

The named path library (circle, underline variants, arrow variants, strike, box corner jitter, the four click marks, the check). Each is a `d` string drawn once and reviewed on the style sheet.

### 10.3 Illustrations (ChatGPT, then traced)

- Four illustrations, generated by Gabriel in one ChatGPT conversation from a shared style block (black fine-liner, plain white background, no shading beyond sparse crosshatching, no text). #1 is the style anchor for the rest:
  1. Hero: a hand with a pencil drawing a box-and-arrow napkin, coffee mug alongside (2:3).
  2. Case study: two hands fanning Tong-its cards, stock pile and a meld (4:3).
  3. About: a desk lamp over an open notebook (3:4).
  4. Contact and 404: a paper plane with a looping dotted path (3:2).
  5. Footer (added after the first four): asleep at the desk over a laptop, coffee and notebook, Gabriel's dog Bella asleep beside it, a "z" in `--pen` (3:2 source, cropped to about 2.5:1).
- Pipeline: PNG → threshold → `potrace` to SVG (fill-only, no strokes, optimised with SVGO, target < 30 KB each) → `public/illustrations/<name>-ink.svg` (+ optional `<name>-pen.svg` for one purple element). Reject any generation with wrong hands or stray text.
- As built: the sources live in `assets/illustrations/*.webp` and `scripts/trace-illustrations.py` retraces them (2x upscale, threshold 150, potrace `-t 6 -a 1 -O 0.8`, SVGO at integer precision). Its config holds the hand's cutout polygon, the pen polygons and the fill's closing line, in source pixels. Sizes: hand 8.9 + 1.2 KB, cards 30.2 KB, lamp 30.1 + 0.5 KB, plane 3.6 + 2.2 KB, nap 26.7 + 0.6 KB (about 14 KB gzipped for the largest). The hero hand drops the source's napkin and coffee mug, which would have doubled the real napkin card.

### 10.4 Signature

Gabriel's signature as a transparent PNG (`assets/signature.png`), traced by `scripts/trace-signature.py` into `lib/signature.ts` (generated; do not edit by hand). The script uses the alpha channel as the ink, thins it to a one-pixel skeleton (Zhang-Suen), builds a graph of edges between junctions, prunes spurs under 30px, then chains edges into the five pen strokes in writing order (G; the o, tall loop and descender; the a and its hump; the t stem and loop; the crossbar). The order lives in the script as a start point plus one point on each edge, so it survives retracing; `--debug out.png` draws the numbered edges to plan a new one. Strokes are smoothed along their length (Gaussian), simplified and written as Catmull-Rom cubics: 5 strokes, viewBox 1185 × 903, stroke width 13, about 5 KB. `autotrace --centerline` was the plan; it leaves unordered fragments, which a draw-in cannot use.

---

## 11. Dark mode: "night page"

- Token swap only (4.1): charcoal paper, chalk-white ink, light violet pen. Illustrations re-ink through their masks. Screenshots are untouched; their frame and tape carry the theme.
- The lamp toggle is the only control: the night page appears only when a visitor switches the lamp off, and stays for their later visits. The toggle also sets `<meta name="theme-color">` to the page's paper. Both themes are tested for every component.

## 12. Accessibility

- Landmarks, skip link, a single `h1`, and the mobile-menu focus trap, as in v2.
- Focus ring on every interactive element: `3px solid var(--pen)`, offset 4px.
- Pen layer: every SVG is `aria-hidden`; no fact exists only in handwriting or only in a drawing. Napkin sketches and illustrations that carry meaning have `role="img"` and an `aria-label`.
- Strike-through draft: the `<s>` element plus visually hidden text "(crossed out)".
- Hit targets ≥ 44×44, including drawn links (padding, not the visible underline).
- Contrast (4.1) passes AA everywhere and AAA for body.
- Reduced motion: no splash, no draw-ins (marks render drawn), no boil, no lift, no reveal movement. The ink marks and the pencil stay.
- The pencil and stickers are optional toys; nothing requires them.

## 13. SEO, metadata, redirects

Unchanged from v2 and already built: `metadataBase`, title and description from `profile`, per-page canonicals, sitemap, robots, JSON-LD `Person` + `WebSite`, and the 8 permanent redirects in `next.config.ts`. Section IDs stay `#experience`, `#projects`, `#about` and `#contact` so those redirects still land.

**Share images and icons (redo):**

- `app/opengraph-image.tsx` (1200×630) through `lib/og.tsx`: `--paper` with the dot grid as an SVG pattern (Satori ignores repeating CSS gradients); a Hand "hi, I'm" in pen; `profile.name` in Bricolage ExtraBold (100px, two lines); "Senior Programmer" circled in pen (the `circle` path, unfiltered: Satori has no SVG filters, and it is sized from the text because Satori cannot size an SVG to its parent); the location; and the how-I-build napkin taped at the right, rotated 3deg, its boxes drawn with the `ogBox` path. Per-project images reuse it with a "case study" note, the project name and its summary.
- `app/icon.tsx` (32×32): a handwritten "gp" in Shantell 700, `--ink` on `--paper`, inside a `--pen` hand-drawn ring (the `ring` path, inset 4% so it never touches the edge). On a paper tile with rounded corners (`rounded`, radius 22% of the size), transparent only at the corners, so it sits in a browser tab like an app icon. (A circle cut out to the ring was tried first.) `app/apple-icon.tsx` (180×180): full-bleed `--paper` with the same mark.
- Fonts: static TTF instances from Google Fonts' CSS2 API (Satori cannot read variable axes): `BricolageGrotesque-ExtraBold.ttf` (opsz 96, wght 800), `BricolageGrotesque-Medium.ttf` (opsz 24, wght 500), `ShantellSans-SemiBold.ttf` and `ShantellSans-Bold.ttf` (the API does not instance Shantell's custom INFM/BNCE axes, so these are the default, slightly neater, letterforms). All OFL, in `assets/fonts/`. The Archivo and JetBrains Mono TTFs are gone.

## 14. States and edge cases

- **404:** a Hand note "this one flew off" with an `up-right` arrow, H1 "Page not found" at Display size, the line "That page moved or never existed.", `primary` "Back home". Illustration #4 (the paper plane) flies off above the note, its dotted trail starting where the arrow points; hidden below `sm`. On the right from `lg` (below the button on phones), a taped `PaperCard` `<nav aria-label="Other pages">`: Hand title "or try one of these", then a to-do list of links (Experience, Projects, Résumé, Contact), each with a one-line description and an `InkBox`; hovering or focusing a row ticks its box (`.todo-check`, instant under reduced motion), so no part of the screen sits empty.
- **No JS:** fully readable. Every mark is drawn, there's no splash, stickers are static, and the pencil button does nothing (acceptable; it is a toy).
- **Illustrations missing:** the slots collapse; nothing else moves.
- **Long text in handwriting:** never happens by rule (≤ 8 words).
- **Copy email failure:** v2 fallback.

---

## 15. Build checklist

Order matters; each step leaves the site buildable. Reuse v2 code wherever the behaviour is unchanged (content, routes, SEO, redirects, resume pipeline, theme logic, reveal observer, sticker drag, menu, copy email).

1. [x] Tag `v2-brutalist` on `4911a4a` (annotated tag created locally 2026-10-17; Gabriel pushes it, or creates it from a GitHub release on that commit).
2. [x] Fonts: swap Archivo and JetBrains Mono for Bricolage Grotesque and Shantell Sans; `corepack pnpm add perfect-freehand`.
3. [x] Tokens: rewrite `globals.css` (4.1 to 4.6, type utilities, grain, dot grid, ink filters, draw-in, boil, lift, print), `lib/tokens.ts`, `lib/z.ts`. The ink filters render from `components/ink/ink-filters.tsx` in the root layout. Old token names (`bg-surface`, `bg-mint`, `shadow-brut-md`, `press`, `tone-accent`, ...) survive as marked legacy aliases in `globals.css` so unrestyled components keep rendering; delete each alias once steps 5 to 8 stop using it. `lib/og.tsx` reads `legacyTokens` until step 13.
4. [x] `lib/ink.ts` + pen primitives (6.1) + `MarginNote`, `PaperCard`, `Highlight`, `Tape`. `InkSvg` (`components/ink/ink-svg.tsx`) renders any named mark; the wrappers are `InkCircle`, `InkUnderline`, `InkStrike`, `InkArrow`, `InkBox`. The strike is two loose lines rather than a zigzag, so the crossed-out joke stays readable.
5. [x] Restyle the primitives: Button, Chip, ScreenshotFrame, SectionHeading, CopyEmailButton, Footer; `LampToggle` replaces ThemeToggle. Also added `DrawnLink` (`components/drawn-link.tsx`, the pen-underlined text link that boils on hover). The lamp's light is two pen strokes (`lampRays` in `lib/ink.ts`) left of Phosphor `Lamp`'s stem. `StatusChip` is kept, restyled as a wash pill, only until the hero rebuild drops it (step 8).
6. [x] Content: `profile.ts` additions (10.1), `projects.ts` additions (8.2), `lib/dates.ts` for the computed notes. New drafts carry `// VERIFY`.
7. [x] Nav (pencil + lamp + Résumé), mobile menu restyle. Pencil state lives in `lib/pencil.ts` (a tiny shared store; `PencilButton` toggles it, the layer arrives in step 10). The GP monogram component is gone.
8. [x] Home sections in order: Hero (with `how-i-build` napkin and stickers), Experience, Projects (Tong Masters napkin), About, Contact.
9. [x] Motion: draw-in, reveal, boil, lift; reduced-motion pass. Boil runs on drawn links, both napkin cards and the stickers (their logos cycle three gentler filters, `#ink-sticker`, `-b`, `-c`). Checked headless in both motion modes (2026-10-18): normally every mark finishes drawn and stays drawn while boiling, links/napkins/stickers boil on hover, buttons lift, below-fold reveals wait, stickers drag; under reduced motion nothing animates, marks are fully drawn, reveals are visible, buttons do not lift and stickers do not drag.
10. [x] Easter eggs: ink marks, `PencilLayer`, hidden margin note, `SplashSignature` (placeholder signature). Components: `components/home/hero-paper.tsx` (the hero section as markable paper), `components/pencil-layer.tsx` (rendered in the root layout, pencil state from `lib/pencil.ts`), `components/hidden-note.tsx` (on the Tong Masters "Play it" link, from `project.playNote`), `components/splash-signature.tsx` with its pre-paint decision in `lib/splash.ts` (the placeholder, a Shantell wipe of the name, was replaced in step 16). Checked headless (2026-10-18): the splash shows on a first home visit and is gone by 1.6s, never on reload, `#hash` links, `/resume` or reduced motion, and a click lifts it within about 0.35s; clicks on empty hero paper leave marks that clear by 2.6s; the pencil draws, Erase clears, Esc puts it down; the hidden note appears only on hover or focus; no console errors and no sideways scroll.
11. [x] Case studies: notebook spread, `WhiteboardDiagram`, v1 napkin, annotated hard problems, to-do list.
12. [x] `/resume` restyle with screen-only margin notes; regenerate the PDF. Dates read "May 2017 to Jan 2024"; highlights are a plain bulleted list; all print lines (frames, chips, section rules) are 1px. PDF regenerated 2026-10-18 from the production build: 2 A4 pages, no pen marks on paper (checked with `pdftotext`). The skip link moved to the purple button style too.
13. [x] Share images, icon and apple icon (13); swap the fonts in `assets/fonts/`. `legacyTokens` is gone from `lib/tokens.ts`.
14. [x] 404 restyle. Until illustration #4 lands, the Hand note's arrow points at open sky. The legacy color aliases and the `press`, `press-lg`, `tone-accent` and `type-body-sm` utilities are deleted (nothing used them any more), along with the static `Sticker`. Also fixed: at 1024 to 1100px the stickers taped over the napkin's right edge made the home page scroll sideways by about 30px; the hero's right column now keeps `lg:pr-10` until `xl`, and `body` has `overflow-x: clip` as a safety net for dragged stickers. Checked on the production build at 375 to 1440px: no sideways scroll on any page, stickers on screen.
15. [x] Illustrations: Gabriel generates #1 to #4; trace, add, place (10.3). Traced with `scripts/trace-illustrations.py` and placed: hand on the hero card (`md+`), cards beside the Tong Masters title (`lg+`; Portfolio v1 keeps a plain header), lamp above the About note, plane beside "Say hi." (`lg+`) and over the 404 note (`sm+`). Checked in both themes at 375, 800, 1024 and 1280.
16. [x] Signature: Gabriel sends the photo; trace and swap in for the placeholder (10.4). Traced from his transparent PNG with `scripts/trace-signature.py`; the splash draws the five strokes in 0.15 → 0.95s and lifts (later slowed to 1.5s, with the lift waiting for the last stroke; see 6.15). Checked headless at 1280 (light) and 375 (dark): complete by 1s, sheet gone by 1.35s, the hero's pen waits for the lift.
17. [x] Gabriel verifies every VERIFY string (`grep -rn VERIFY content/`), including those carried over from the brutalist build. All 19 confirmed on 2026-10-18; the only rewrite was the bio, which lost its Tong Masters sentence. The markers are gone. The résumé PDF did not change (none of the edits touch `/resume`; a fresh print differed only in its timestamp), so the committed one stands.
18. [ ] QA on a production build: 4 pages × 375/768/1280 × light/dark; keyboard pass; 44px targets; reduced motion; splash rules (first visit only, skip, deep links, hash, no-JS); pencil on a phone (scroll lock and exit); print and PDF have no pen layer; contrast; Lighthouse (target mobile perf ≥ 90 with the splash on); redirects 308; zero em dashes.
    - **Pre-asset pass, 2026-10-18** (before steps 15 to 17; re-run after them). Production build, headless Chrome:
      - 5 pages (home, both case studies, résumé, 404) × 375 / 768 / 1280 × light / dark: no console errors (only the Vercel Analytics and Speed Insights scripts 404, which exist only on Vercel), no sideways scroll; nav 66px phones, 74px from md.
      - Contrast floor 6.27:1 across every visible text element, both themes; no failures.
      - Keyboard: 24 stops on home, Skip to content first, every one with a visible pen focus ring and at least 44 × 44.
      - Pencil on a phone (touch): `touch-action: none` while out, the page does not scroll under a stroke, the pinned bar sits inside the screen with 44px buttons, and "Put the pencil down" restores scrolling.
      - Splash, ink marks, hidden note, boil, lift and reduced motion: as in steps 9 and 10.
      - Redirects: all 8 return 308 to the right place. Em and en dashes in visible copy: 0.
      - Lighthouse 12 (mobile / desktop, perf/a11y/best/SEO): home 89/100/96/100 and 99/100/96/100; résumé 91/100/96/100 and 100/100/96/100; Tong Masters 89/100/96/100 and 100/100/96/100. Mobile LCP 3.5 to 3.8s is the font bytes (Bricolage 75KB + Shantell 142KB woff2).
      - Fixed during the pass: Bricolage loads without the unused `wdth` axis (167KB → 75KB) and Shantell without `BNCE`; the hero `rise` starts at 1% opacity so the name counts as painted on the first frame; the pencil bar's Erase is icon-only on phones so the bar keeps its gutter.
      - Open: home and case-study mobile performance sit at 89, one point under target. The remaining lever is a self-hosted Shantell pinned at INFM 70 and subset to Latin.
    - **Post-asset pass, 2026-10-18** (after steps 15 to 17, the hero/About/404/case-study layout fixes, the footer nap and the hover easter eggs). Production build, headless Chrome:
      - Same 5 pages × 375 / 768 / 1280 × light / dark: no console errors beyond the Vercel scripts, no sideways scroll, contrast floor 6.27:1, no failures.
      - Keyboard: 24 stops, all with a visible ring and at least 44 × 44. Phone pencil: as before.
      - Splash (now the traced signature): first home visit only, gone by about 1.3s, skipped by a click in about 0.35s, never on reload, `#hash`, `/resume` or reduced motion. Ink marks, pencil, Erase, Esc and the hidden note all pass.
      - Redirects: all 8 return 308. Em and en dashes: 0 on every page. No VERIFY text anywhere.
      - Lighthouse 12 (mobile / desktop): home 88/100/96/100 and 99/100/96/100; résumé 90/100/96/100 and 100/100/96/100; Tong Masters 89/100/96/100 and 100/100/96/100. CLS 0 everywhere. Home mobile moved 89 → 88, within run-to-run noise; the hero hand adds two small mask files above the fold. Best practices 96 is the local 404 on the Vercel scripts.
      - Still open: mobile performance on home and the case study, 1 to 2 points under 90 (same font lever as above).
19. [x] Merge `v2` → `main`. Merged by Gabriel on 2026-10-18 (merge commit `7799ad9`); the neo-brutalist take stays on the `v2-brutalist` tag.

---

## 16. Pre-flight (re-check before merge)

- One accent (purple), used as a pen; nothing purple behind text except `--wash`.
- Two-layer rule: no fact lives only in handwriting; handwriting ≤ 8 words per note; no handwriting in nav, buttons, headings or body.
- Pen marks come only from `lib/ink.ts`; no filter on text or whole sections; nothing loops on its own.
- Radius rule (4.3); structure lines 2px; the only shadow is the paper lift.
- Hero: buttons visible without scrolling at 1280×720 and 375×812; lead ≤ 20 words.
- No eyebrows, section numbers, scroll cues, marquees, decorative dots or labels on images.
- No duplicate CTA intent: "Résumé" (resume, nav and hero), "See projects", "Read the case study", "Play it" / "Live site" / "Visit v1" (live), "Code", "Copy email".
- Each home section uses a distinct layout family.
- Splash about 2.5s and only after the signature is complete, ending with the signature flying into the nav mark, skippable, once per session, home only; never on reduced motion, hash links or no-JS.
- Copy self-audit: no em dashes, no invented metrics, every VERIFY resolved.
- Both themes, reduced motion and print tested.
