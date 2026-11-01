# Notebook Desk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/notebook`, a pannable, zoomable desk of dot-grid paper where the site's sections lie as taped-in cards opened from a dock, with a toolbar (Fit all, Tidy up, Pencil, Sound, Lamp, Back), a first-visit tour, paper sounds, pencil doodles that stay on the paper, a phone bottom sheet, and a closing teaser on the home page that links to it.

**Architecture:** The site's chrome (nav, footer, back-to-top, ink marks, pencil) moves from the root layout into an `app/(site)` route group, so `/notebook` renders bare. The desk is a client component built on React Flow (`@xyflow/react`): a `name` node and up to six `card` nodes, whose bodies are server components handed in through context. Pure data (card ids, home positions, `?card=` parsing) lives in `lib/notebook.ts` and the pencil's stroke maths in `lib/stroke.ts`, both unit-tested with Vitest. Everything visual comes from the existing tokens.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (no config file), `@xyflow/react` 12.12.0 (new), `motion` (`motion/react`), `@phosphor-icons/react`, `perfect-freehand`, Vitest 5.0.5 (new), `corepack pnpm`.

**Spec:** `docs/superpowers/specs/2026-11-01-notebook-desk-design.md`. Read it and `CLAUDE.md` before starting any task.

---

## Ground rules for every task

- **Where you work:** the feature worktree the controller gives you (not the main checkout). Every path below is relative to it.
- **Git: do not run git at all.** The controller reviews and commits each task. (`~/.gitconfig` is broken on this machine, and sub-agents cannot use the workaround.) Moving files is done with plain `mv`; git detects the renames when the controller commits.
- **Dependencies:** the worktree has its own `node_modules` (a real install, not a symlink). Only Task 1 runs `corepack pnpm add`. Every other task calls binaries directly: `./node_modules/.bin/tsc`, `./node_modules/.bin/vitest`, `./node_modules/.bin/next`.
- **Checks:**
  - Types: `./node_modules/.bin/tsc --noEmit` (exits 0 silently when clean). Several tasks run at once in the same worktree, so an error in a file **another task owns** is not yours: report it, do not fix it.
  - Tests: one file at a time, one worker: `./node_modules/.bin/vitest run lib/<name>.test.ts --maxWorkers=1`. Never run the whole suite in parallel with anything else.
  - Build, only where a task says so: `NODE_ENV=production ./node_modules/.bin/next build` (the shell sets `NODE_ENV=development`, which breaks the build). Never alongside a test run.
- **Style:** match the surrounding code: a short spec-referencing comment above each component or export, Tailwind classes inline, `cn()` from `@/lib/cn` for conditional classes, server components unless they need the browser, client components import Phosphor from `@phosphor-icons/react` (server ones from `@phosphor-icons/react/ssr`), icons always `weight="bold"`. No em dashes in visible copy. Draft copy carries a `VERIFY` comment.
- **Task list:** before any other work, write a task list of 3 to 7 short steps with your task-list tool (`TodoWrite`, or `TaskCreate` then `TaskUpdate`). Keep exactly one step in progress, tick each off as soon as it is done, add steps if the work grows, and tick everything off before reporting.

## File map

| File | Change | Task |
| --- | --- | --- |
| `package.json`, `pnpm-lock.yaml`, `vitest.config.ts` | `@xyflow/react`, Vitest, `test` script | 1 |
| `lib/stroke.ts`, `lib/stroke.test.ts`, `components/pencil-layer.tsx` | shared `toPath` | 2 |
| `lib/notebook.ts`, `lib/notebook.test.ts` | desk data and `?card=` helpers | 3 |
| `components/site-chrome.tsx`, `app/(site)/layout.tsx`, `app/layout.tsx`, `app/(site)/page.tsx` + `projects/` + `resume/` (moved), `app/not-found.tsx`, `app/sitemap.ts` | route group | 4 |
| `lib/z.ts`, `app/globals.css` (z vars), `lib/paper-sound.ts`, `lib/pencil.ts`, `components/lamp-toggle.tsx` | shared desk plumbing | 5 |
| `lib/toolbox.ts`, `components/home/toolbox.tsx`, `components/notebook/cards/*.tsx` | card bodies | 6 |
| `app/notebook/page.tsx`, `components/notebook/*.tsx` (desk, nodes, dock, toolbar, zoom, context, stubs), `app/globals.css` (desk block), `lib/pointer-targets.ts` | the desk | 7 |
| `components/notebook/desk-pencil.tsx` | pencil on the desk | 8 |
| `components/notebook/sheet.tsx` | phone sheet | 9 |
| `components/notebook/tour.tsx` | first-visit tour | 10 |
| `components/home/notebook-teaser.tsx`, `app/(site)/page.tsx` | home teaser | 11 |
| `docs/v2/DESIGN-SPEC.md`, `CLAUDE.md` | docs | 12 |

**Waves** (a task starts once everything it depends on is reviewed and committed, and no two tasks in a wave share a file):

1. Tasks 1, 4, 5, 6
2. Tasks 2, 3, 11
3. Task 7
4. Tasks 8, 9, 10
5. Task 12

Then the controller verifies in the browser (desktop and phone, light and night) and runs the build.

---

### Task 1: Dependencies and Vitest

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml` (via pnpm), possibly `pnpm-workspace.yaml`
- Create: `vitest.config.ts`

**Depends on:** none

- [ ] **Step 1: Add the packages (exact versions)**

```bash
corepack pnpm add @xyflow/react@12.12.0
corepack pnpm add -D vitest@5.0.5
```

Expected: both install. If pnpm reports ignored build scripts for a package Vitest needs (for example `esbuild`), add it under `allowBuilds:` in `pnpm-workspace.yaml` as `<name>: true`, run `corepack pnpm install` again, and say so in your report.

- [ ] **Step 2: Add the `test` script**

In `package.json`, `scripts` becomes:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for pure lib/ code only: no DOM, no React. Run one file at a
// time: `corepack pnpm test lib/notebook.test.ts --maxWorkers=1`.
export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) }],
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Check Vitest starts with no tests**

Run: `./node_modules/.bin/vitest run --passWithNoTests --maxWorkers=1`
Expected: exits 0, "No test files found" (or similar).

- [ ] **Step 5: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: exits 0.

- [ ] **Step 6: Report** the installed versions and any `pnpm-workspace.yaml` change. Do not commit.

---

### Task 2: Shared stroke helper (`lib/stroke.ts`)

**Files:**
- Create: `lib/stroke.ts`, `lib/stroke.test.ts`
- Modify: `components/pencil-layer.tsx:1-31`

**Depends on:** 1

- [ ] **Step 1: Write the failing test** `lib/stroke.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { toPath, type StrokePoint } from "@/lib/stroke";

const line = (pressure: number): StrokePoint[] =>
  Array.from({ length: 12 }, (_, i) => [i * 10, i * 4, pressure] as StrokePoint);

describe("toPath", () => {
  it("returns an empty path for no points", () => {
    expect(toPath([])).toBe("");
  });

  it("turns a stroke into one closed SVG path of quadratic curves", () => {
    const d = toPath(line(0.5));
    expect(d.startsWith("M")).toBe(true);
    expect(d).toContain(" Q");
    expect(d.endsWith("Z")).toBe(true);
  });

  it("follows real pen pressure instead of simulating it", () => {
    expect(toPath(line(0.9))).not.toBe(toPath(line(0.5)));
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `./node_modules/.bin/vitest run lib/stroke.test.ts --maxWorkers=1`
Expected: FAIL, cannot resolve `@/lib/stroke`.

- [ ] **Step 3: Create `lib/stroke.ts`** (moved verbatim from `components/pencil-layer.tsx`)

```ts
import { getStroke } from "perfect-freehand";

// The pencil's stroke maths, shared by the site's PencilLayer and the
// notebook desk's pencil (components/notebook/desk-pencil.tsx). Pure, so it
// is unit-tested (lib/stroke.test.ts).

export type StrokePoint = [x: number, y: number, pressure: number];

// Spec 6.10: a pencil line, tapered by perfect-freehand.
export const STROKE = { size: 4.5, thinning: 0.6, smoothing: 0.5, streamline: 0.5 } as const;

// perfect-freehand returns the outline of a stroke as a polygon; this turns
// it into a smooth closed SVG path (the library's recommended helper).
// Pressure is simulated unless the points carry real pen pressure.
export function toPath(points: StrokePoint[]): string {
  const outline = getStroke(points, { ...STROKE, simulatePressure: points.every((p) => p[2] === 0.5) });
  if (outline.length < 2) return "";
  const [first, ...rest] = outline;
  let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)} Q`;
  for (let i = 0; i < rest.length; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = rest[i];
    d += `${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)} `;
  }
  return `${d}Z`;
}
```

- [ ] **Step 4: Run the test to see it pass**

Run: `./node_modules/.bin/vitest run lib/stroke.test.ts --maxWorkers=1`
Expected: 3 passed.

- [ ] **Step 5: Point `PencilLayer` at it**

In `components/pencil-layer.tsx`:
- Delete the `import { getStroke } from "perfect-freehand";` line.
- Delete `type Point = ...`, the `STROKE` constant, its comment, the `toPath` function and its comment (lines 13 to 31 today).
- Add `import { toPath, type StrokePoint } from "@/lib/stroke";` after the `@/lib/pencil-sound` import.
- Replace every remaining `Point` type with `StrokePoint` (the `live` ref and the `point` helper).

- [ ] **Step 6: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in `lib/stroke*.ts` or `components/pencil-layer.tsx`.

- [ ] **Step 7: Report.** Do not commit.

---

### Task 3: Desk model (`lib/notebook.ts`)

**Files:**
- Create: `lib/notebook.ts`, `lib/notebook.test.ts`

**Depends on:** 1

- [ ] **Step 1: Write the failing test** `lib/notebook.test.ts`

```ts
import { describe, expect, it } from "vitest";

import {
  CARD_IDS,
  HOME,
  NAME_BOX,
  cardSearch,
  homeRect,
  isCardId,
  overlaps,
  parseCard,
  zoomLabel,
} from "@/lib/notebook";

describe("home positions", () => {
  it("never overlap each other at 100%", () => {
    for (const a of CARD_IDS) {
      for (const b of CARD_IDS) {
        if (a !== b) expect(overlaps(homeRect(a), homeRect(b)), `${a} and ${b}`).toBe(false);
      }
    }
  });

  it("keep clear of the name", () => {
    for (const id of CARD_IDS) expect(overlaps(homeRect(id), NAME_BOX), id).toBe(false);
  });

  it("tilt between -1.5 and 1.5 degrees", () => {
    for (const id of CARD_IDS) expect(Math.abs(HOME[id].tilt)).toBeLessThanOrEqual(1.5);
  });
});

describe("isCardId", () => {
  it("accepts the six ids and nothing else", () => {
    expect(CARD_IDS.every(isCardId)).toBe(true);
    expect(isCardId("arcade")).toBe(false);
    expect(isCardId(null)).toBe(false);
  });
});

describe("parseCard", () => {
  it("reads a known card", () => {
    expect(parseCard("?card=projects")).toBe("projects");
    expect(parseCard("?utm_source=x&card=resume")).toBe("resume");
  });

  it("ignores unknown or missing values", () => {
    expect(parseCard("?card=arcade")).toBeNull();
    expect(parseCard("")).toBeNull();
    expect(parseCard("?card=")).toBeNull();
  });
});

describe("cardSearch", () => {
  it("names the most recently opened card still open", () => {
    expect(cardSearch("", ["about", "projects"])).toBe("?card=projects");
    expect(cardSearch("?card=projects", ["about"])).toBe("?card=about");
  });

  it("drops the parameter when nothing is open", () => {
    expect(cardSearch("?card=about", [])).toBe("");
  });

  it("keeps other parameters", () => {
    expect(cardSearch("?utm_source=x&card=about", [])).toBe("?utm_source=x");
    expect(cardSearch("?utm_source=x", ["toolbox"])).toBe("?utm_source=x&card=toolbox");
  });
});

describe("zoomLabel", () => {
  it("rounds to a whole percent", () => {
    expect(zoomLabel(0.996)).toBe("100%");
    expect(zoomLabel(0.4)).toBe("40%");
    expect(zoomLabel(1.5)).toBe("150%");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `./node_modules/.bin/vitest run lib/notebook.test.ts --maxWorkers=1`
Expected: FAIL, cannot resolve `@/lib/notebook`.

- [ ] **Step 3: Create `lib/notebook.ts`**

```ts
// The notebook desk (/notebook, docs/superpowers/specs/2026-11-01-notebook-desk-design.md).
// Pure data and helpers: which cards exist, where each lies on the desk, and
// how `?card=` is read and written. No React and no DOM, so it is unit-tested
// in node (lib/notebook.test.ts).

export const CARD_IDS = ["about", "projects", "experience", "toolbox", "contact", "resume"] as const;
export type CardId = (typeof CARD_IDS)[number];

export const CARD_TITLES: Record<CardId, string> = {
  about: "About",
  projects: "Projects",
  experience: "Experience",
  toolbox: "Toolbox",
  contact: "Contact",
  resume: "Résumé",
};

export type Point = { x: number; y: number };
export type Rect = Point & { width: number; height: number };

/** Card width in desk units (px at 100% zoom). */
export const CARD_WIDTH = 360;
/** The tallest a card gets: its title bar plus a body capped at 440px. */
export const CARD_MAX_HEIGHT = 540;

/** The name node's box, centred on the desk's origin. */
export const NAME_BOX: Rect = { x: -210, y: -130, width: 420, height: 260 };

/** Where each card lies when first opened (its top-left corner), and its
    settled tilt in degrees. Two columns either side of the name; all six
    open at once never overlap at 100% (lib/notebook.test.ts). */
export const HOME: Record<CardId, { position: Point; tilt: number }> = {
  projects: { position: { x: -660, y: -320 }, tilt: -1.2 },
  experience: { position: { x: -660, y: 260 }, tilt: 0.8 },
  about: { position: { x: 260, y: -300 }, tilt: 1.2 },
  toolbox: { position: { x: 680, y: -300 }, tilt: -0.6 },
  contact: { position: { x: 260, y: 280 }, tilt: -1 },
  resume: { position: { x: 680, y: 280 }, tilt: 1.4 },
};

/** The most room a card can take at its home position. */
export function homeRect(id: CardId): Rect {
  return { ...HOME[id].position, width: CARD_WIDTH, height: CARD_MAX_HEIGHT };
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

export function isCardId(value: unknown): value is CardId {
  return typeof value === "string" && (CARD_IDS as readonly string[]).includes(value);
}

/** The card a `?card=` link asks for, or null for none or an unknown one. */
export function parseCard(search: string): CardId | null {
  const value = new URLSearchParams(search).get("card");
  return isCardId(value) ? value : null;
}

/** The query string for the open cards: `card` names the most recently
    opened one still open, or is dropped when none is. Other parameters are
    kept. Returns "" or "?...". */
export function cardSearch(search: string, open: readonly CardId[]): string {
  const params = new URLSearchParams(search);
  const top = open[open.length - 1];
  if (top) params.set("card", top);
  else params.delete("card");
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** The desk's zoom range and the zoom buttons' step. */
export const ZOOM = { min: 0.4, max: 1.5, step: 0.1 } as const;

/** The zoom readout: 0.996 is "100%". */
export function zoomLabel(zoom: number): string {
  return `${Math.round(zoom * 100)}%`;
}

/** Set to "seen" once the tour is skipped or finished: the only thing /notebook stores. */
export const TOUR_STORAGE_KEY = "gp-notebook-tour";
```

- [ ] **Step 4: Run the test to see it pass**

Run: `./node_modules/.bin/vitest run lib/notebook.test.ts --maxWorkers=1`
Expected: all passed.

- [ ] **Step 5: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in `lib/notebook*.ts`.

- [ ] **Step 6: Report.** Do not commit.

---

### Task 4: Site chrome moves into a route group

**Files:**
- Create: `components/site-chrome.tsx`, `app/(site)/layout.tsx`
- Move: `app/page.tsx` → `app/(site)/page.tsx`, `app/projects/` → `app/(site)/projects/`, `app/resume/` → `app/(site)/resume/`
- Modify: `app/layout.tsx`, `app/not-found.tsx`, `app/sitemap.ts`

**Depends on:** none

- [ ] **Step 1: Move the pages**

```bash
mkdir -p "app/(site)"
mv app/page.tsx "app/(site)/page.tsx"
mv app/projects "app/(site)/projects"
mv app/resume "app/(site)/resume"
```

The moved files import only through `@/`, so nothing inside them changes. Check: `grep -rn "from \"\.\|from '\." "app/(site)"` prints nothing.

- [ ] **Step 2: Create `components/site-chrome.tsx`**

```tsx
import type { ReactNode } from "react";

import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PaperMarks } from "@/components/paper-marks";
import { PencilLayer } from "@/components/pencil-layer";
import { profile } from "@/content/profile";

// The notebook page's chrome (spec 6.8, 6.10, 6.16, 6.17, 5.2): the nav,
// back-to-top, footer, ink marks and the pencil. Wraps every page of the
// app/(site) group and the 404. /notebook sits outside it: the desk has its
// own toolbar and dock.
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav shortName={profile.shortName} />
      {children}
      <BackToTop />
      <Footer />
      <PaperMarks />
      <PencilLayer />
    </>
  );
}
```

- [ ] **Step 3: Create `app/(site)/layout.tsx`**

```tsx
import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site-chrome";

// Home, case studies and the résumé share the site's chrome. The group
// changes no URL.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
```

- [ ] **Step 4: Slim the root layout** (`app/layout.tsx`)

- Delete the imports of `BackToTop`, `Footer`, `PaperMarks`, `PencilLayer` and `Nav`. Keep `profile` (metadata and JSON-LD use it).
- The `<body>` becomes:

```tsx
      <body>
        <InkFilters />
        <SplashName />
        <SkipLink />
        {children}
        <PenCursor />
        <Analytics />
        <SpeedInsights />
      </body>
```

- [ ] **Step 5: Give the 404 its chrome back, and a Notebook link** (`app/not-found.tsx`)

- Add `import { SiteChrome } from "@/components/site-chrome";`.
- Wrap the returned `<main>...</main>` in `<SiteChrome>...</SiteChrome>`.
- Add a fifth entry at the end of `ELSEWHERE`:

```ts
  { href: "/notebook", label: "Notebook", detail: "the loose pages, on a desk" }, // VERIFY
```

- [ ] **Step 6: Add `/notebook` to the sitemap** (`app/sitemap.ts`), right after the `/resume` line:

```ts
    { url: `${BASE}/notebook`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
```

- [ ] **Step 7: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in the files above. (If it reports stale `.next/types` paths for the moved pages, delete `.next` and run it again.)

- [ ] **Step 8: Report.** Do not commit. (The controller builds and checks that `/`, `/projects/tong-masters`, `/resume` and a 404 look exactly as before.)

---

### Task 5: Shared desk plumbing (z-index, paper sound, quiet pencil, bare lamp)

**Files:**
- Modify: `lib/z.ts`, `app/globals.css` (the `--z-*` block in `:root` only), `lib/pencil.ts`, `components/lamp-toggle.tsx`
- Create: `lib/paper-sound.ts`

**Depends on:** none

- [ ] **Step 1: z-index entries** — `lib/z.ts` becomes:

```ts
// The only z-index values in the app. Mirrored as --z-* in app/globals.css.
// Spec section 4.6. /notebook has no nav or mobile menu, so its desk UI
// reuses their levels.
export const z = {
  base: 0,
  sticker: 10,
  stickerDragging: 20,
  pencil: 30,
  nav: 40,
  /** /notebook: toolbar, dock and zoom. */
  deskUi: 40,
  mobileMenu: 50,
  /** /notebook: the phone's bottom sheet. */
  deskSheet: 50,
  /** /notebook: the first-visit tour's notes. */
  deskTour: 55,
  toast: 60,
  grain: 65,
  splash: 70,
  cursor: 80,
} as const;
```

In `app/globals.css`, in the `/* Mirrors lib/z.ts */` block of `:root`, add three lines so it reads:

```css
  /* Mirrors lib/z.ts */
  --z-sticker: 10;
  --z-sticker-dragging: 20;
  --z-pencil: 30;
  --z-nav: 40;
  --z-desk-ui: 40;
  --z-mobile-menu: 50;
  --z-desk-sheet: 50;
  --z-desk-tour: 55;
  --z-toast: 60;
```

(keep the lines after `--z-toast` as they are).

- [ ] **Step 2: A quiet pencil** — in `lib/pencil.ts`, replace `set` and `toggle` with:

```ts
  /** `silent` skips the pick-up and put-down sounds: the notebook desk
      while its Sound toggle is off. */
  set(next: boolean, silent = false) {
    if (next === active) return;
    active = next;
    // Every way in and out comes through here (the nav button, the bar,
    // Esc, a new page), mostly straight from a click or key, which is the
    // user gesture audio needs.
    if (!silent) {
      if (next) pencilSound.pickUp();
      else pencilSound.putDown();
    }
    listeners.forEach((listener) => listener());
  },
  toggle(silent = false) {
    pencil.set(!active, silent);
  },
```

Existing callers pass no second argument, so nothing else changes.

- [ ] **Step 3: Create `lib/paper-sound.ts`**

```ts
import { audio, filter } from "@/lib/sound";

// The notebook desk's paper sounds (notebook spec 9): a soft slide as a card
// is laid down or put away, and a short press as a dragged card is taped
// back down. Synthesized like the lamp and the pencil (lib/sound.ts), no
// audio files. Gabriel judges sound by ear: expect to tune these by ear.

/** Peak gain of the slide; the press scales from it. */
const LOUDNESS = 0.32;

export const paperSound = {
  /** A sheet sliding over paper: band-passed noise whose pitch falls as it
      slows, about 0.22s. `out` (putting a card away) sits a little lower. */
  slide(out = false) {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const at = context.currentTime + 0.005;
    const length = 0.22;

    const level = context.createGain();
    level.gain.setValueAtTime(0, at);
    level.gain.linearRampToValueAtTime(LOUDNESS, at + length * 0.35);
    level.gain.setTargetAtTime(0, at + length * 0.35, length * 0.22);
    level.connect(context.destination);

    const band = filter(context, "bandpass", out ? 1500 : 1900, 0.9);
    band.frequency.setValueAtTime(out ? 1700 : 2300, at);
    band.frequency.linearRampToValueAtTime(out ? 1100 : 1400, at + length);

    const source = context.createBufferSource();
    source.buffer = grain;
    source.connect(filter(context, "highpass", 500)).connect(band).connect(level);
    source.start(at, Math.random() * 2.5);
    source.stop(at + length + 0.2);
  },

  /** A card pressed back onto the desk: a low thump and a little crackle of
      tape, about 0.1s. */
  press() {
    const a = audio();
    if (!a) return;
    const { context, grain } = a;
    const at = context.currentTime + 0.005;

    const thump = context.createOscillator();
    thump.frequency.setValueAtTime(150, at);
    thump.frequency.exponentialRampToValueAtTime(70, at + 0.08);
    const thumpLevel = context.createGain();
    thumpLevel.gain.setValueAtTime(0, at);
    thumpLevel.gain.linearRampToValueAtTime(LOUDNESS * 0.9, at + 0.004);
    thumpLevel.gain.setTargetAtTime(0, at + 0.004, 0.025);
    thump.connect(thumpLevel).connect(context.destination);
    thump.start(at);
    thump.stop(at + 0.15);

    const crackle = context.createGain();
    crackle.gain.setValueAtTime(0, at + 0.01);
    crackle.gain.linearRampToValueAtTime(LOUDNESS * 0.35, at + 0.014);
    crackle.gain.setTargetAtTime(0, at + 0.014, 0.018);
    crackle.connect(context.destination);
    const source = context.createBufferSource();
    source.buffer = grain;
    source.connect(filter(context, "highpass", 3500)).connect(crackle);
    source.start(at + 0.01, Math.random() * 2.5);
    source.stop(at + 0.12);
  },
};
```

- [ ] **Step 4: A borderless lamp** — in `components/lamp-toggle.tsx`:

The signature becomes:

```tsx
export function LampToggle({
  className,
  bare = false,
}: {
  className?: string;
  /** Borderless, for a framed toolbar (the notebook desk). */
  bare?: boolean;
}) {
```

and the button's `className` becomes:

```tsx
      className={cn(
        "relative grid shrink-0 cursor-pointer place-items-center rounded-control text-ink",
        bare ? "size-10 hover:bg-wash" : "lift size-11 border-2 border-ink bg-sheet",
        className,
      )}
```

(The non-bare classes are exactly today's.)

- [ ] **Step 5: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in the files above.

- [ ] **Step 6: Report.** Do not commit.

---

### Task 6: Card bodies

**Files:**
- Create: `lib/toolbox.ts`, `components/notebook/cards/about-card.tsx`, `projects-card.tsx`, `experience-card.tsx`, `toolbox-card.tsx`, `contact-card.tsx`, `resume-card.tsx` (all in `components/notebook/cards/`)
- Modify: `components/home/toolbox.tsx`

**Depends on:** none

All six are **server components** (no `"use client"`). Every fact comes from `content/profile.ts`, `content/projects.ts` or `lib/dates.ts`.

- [ ] **Step 1: Create `lib/toolbox.ts`** by moving the data out of `components/home/toolbox.tsx`:

```ts
import {
  siClaude,
  siDbeaver,
  siDocker,
  siExpress,
  siGithubactions,
  siGitkraken,
  siGooglecloud,
  siJavascript,
  siLangchain,
  siLanggraph,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTypescript,
  siWarp,
  type SimpleIcon,
} from "simple-icons";

import { profile } from "@/content/profile";

// The Toolbox's data (spec 7.6), shared by the home section
// (components/home/toolbox.tsx) and the notebook's Toolbox card.

/** Logos for the tools Simple Icons has a mark for. The rest show their name
    only: never draw a brand mark. */
export const TOOL_ICONS: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "Node.js": siNodedotjs,
  Express: siExpress,
  React: siReact,
  "Next.js": siNextdotjs,
  PostgreSQL: siPostgresql,
  "React Native": siReact,
  "GitHub Actions": siGithubactions,
  GCP: siGooglecloud,
  Docker: siDocker,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  n8n: siN8n,
  "Claude Code": siClaude,
  Warp: siWarp,
  GitKraken: siGitkraken,
  DBeaver: siDbeaver,
};

// `profile` is `as const`, so widen once here instead of mapping a union of tuples.
export const TOOL_GROUPS: readonly { label: string; items: readonly string[] }[] = profile.skills;

const DAILY = new Set<string>(profile.dailyTools);

/** Each circled tool takes the next chip loop, counting across groups, so
    neighbouring circles are drawn by different hands. */
export const LOOP_OF = new Map<string, number>(
  TOOL_GROUPS.flatMap((group) => group.items)
    .filter((item) => DAILY.has(item))
    .map((item, i) => [item, i]),
);

/** The circled tools in page order, as an English list for an sr-only sentence. */
export const DAILY_SENTENCE = new Intl.ListFormat("en", { type: "conjunction" }).format([...LOOP_OF.keys()]);
```

- [ ] **Step 2: Point the home Toolbox at it** (`components/home/toolbox.tsx`)

- Delete the `simple-icons` import, `ICONS`, `GROUPS`, `DAILY`, `LOOP_OF`, `DAILY_SENTENCE` and their comments.
- Add `import { DAILY_SENTENCE, LOOP_OF, TOOL_GROUPS, TOOL_ICONS } from "@/lib/toolbox";`.
- Rename the uses: `GROUPS` → `TOOL_GROUPS`, `ICONS[item]` → `TOOL_ICONS[item]`. The rendered output must not change.

- [ ] **Step 3: Create `components/notebook/cards/about-card.tsx`**

```tsx
import { Highlight } from "@/components/ink/highlight";
import { Tape } from "@/components/ink/tape";
import { profile } from "@/content/profile";

// Notebook card: About (notebook spec 3). The bio with its key phrase under
// the highlighter, the motto taped on as a sticky, and where Gabriel is.
export function AboutCard() {
  const [before, after] = profile.bio.split(profile.bioMark);
  return (
    <div className="grid gap-6">
      <p>
        {before}
        <Highlight>{profile.bioMark}</Highlight>
        {after}
      </p>
      <div className="relative mx-2 rotate-[-2deg] rounded-paper bg-note px-5 pt-6 pb-4 text-on-note shadow-lift print:rotate-0">
        <Tape className="-top-3 left-1/2 h-6 w-16 -ml-8" style={{ rotate: "-4deg" }} />
        <p className="type-hand-lg">{profile.motto}</p>
        <p className="type-hand mt-2">my motto, for what it&apos;s worth</p>
      </div>
      <p className="type-meta text-ink-soft">
        {profile.location}. {profile.status}.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Create `components/notebook/cards/projects-card.tsx`**

```tsx
import { DrawnLink } from "@/components/drawn-link";
import { projects } from "@/content/projects";

// Notebook card: Projects (notebook spec 3). One row per side project, in
// content order: the way into its case study and to the live thing.
export function ProjectsCard() {
  return (
    <ul className="grid">
      {projects.map((project) => (
        <li key={project.slug} className="grid gap-1 border-t-2 border-ink py-4 first:border-t-0 first:pt-0">
          <h3 className="text-lg leading-tight font-bold">{project.name}</h3>
          <p className="text-ink-soft">{project.summary}</p>
          <div className="flex flex-wrap gap-x-5">
            <DrawnLink href={`/projects/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
              Case study
            </DrawnLink>
            <DrawnLink href={project.liveUrl} tone="ink" aria-label={`Visit ${project.name}`}>
              Live
            </DrawnLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Create `components/notebook/cards/experience-card.tsx`**

```tsx
import { DrawnLink } from "@/components/drawn-link";
import { profile } from "@/content/profile";
import { handRange } from "@/lib/dates";

// Notebook card: Experience (notebook spec 3). One row per role: company,
// current title, dates and work mode, and its one line. The full history is
// on the résumé.
export function ExperienceCard() {
  return (
    <div className="grid gap-2">
      <ol className="grid">
        {profile.roles.map((role) => (
          <li key={role.company} className="grid gap-1 border-t-2 border-ink py-4 first:border-t-0 first:pt-0">
            <h3 className="text-lg leading-tight font-bold">{role.company}</h3>
            <p className="type-meta text-ink-soft">
              {role.titles[0].title} · {handRange(role)} · {role.mode}
            </p>
            <p>{role.homeLine}</p>
          </li>
        ))}
      </ol>
      <DrawnLink href="/resume" className="w-fit">
        Full history on the résumé
      </DrawnLink>
    </div>
  );
}
```

- [ ] **Step 6: Create `components/notebook/cards/toolbox-card.tsx`**

```tsx
import { ToolChip } from "@/components/tool-chip";
import { DAILY_SENTENCE, LOOP_OF, TOOL_GROUPS, TOOL_ICONS } from "@/lib/toolbox";

// Notebook card: Toolbox (notebook spec 3). The home page's five groups of
// logo chips, the daily tools circled in pen.
export function ToolboxCard() {
  return (
    <div className="grid gap-6">
      {/* The circles are pen only, so say which tools they mark. */}
      <p className="sr-only">{`Open every day: ${DAILY_SENTENCE}.`}</p>
      {TOOL_GROUPS.map((group) => (
        <div key={group.label}>
          <h3 className="border-b-2 border-ink pb-2 text-base font-bold">{group.label}</h3>
          <ul className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-3">
            {group.items.map((item, i) => (
              <li key={item}>
                <ToolChip name={item} icon={TOOL_ICONS[item]} loop={LOOP_OF.get(item)} delay={0.2 + i * 0.08} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p aria-hidden="true" className="type-hand -rotate-2 text-pen print:hidden">
        circled = open every day
      </p>
    </div>
  );
}
```

- [ ] **Step 7: Create `components/notebook/cards/contact-card.tsx`**

```tsx
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { CopyEmailButton } from "@/components/copy-email-button";
import { profile } from "@/content/profile";

// Notebook card: Contact (notebook spec 3). The address, the copy button
// (with its pen tick), the two profiles and the availability.
export function ContactCard() {
  return (
    <div className="grid gap-4">
      <a
        id="notebook-email"
        href={`mailto:${profile.email}`}
        className="text-2xl leading-tight font-[650] tracking-[-0.02em] break-all"
      >
        {profile.email}
      </a>
      <div className="grid gap-2.5">
        <CopyEmailButton email={profile.email} selectTargetId="notebook-email" />
        <div className="grid grid-cols-2 gap-2.5">
          <ButtonLink href={profile.links.github} icon={<GithubLogo size={20} weight="bold" />}>
            GitHub
          </ButtonLink>
          <ButtonLink href={profile.links.linkedin} icon={<LinkedinLogo size={20} weight="bold" />}>
            LinkedIn
          </ButtonLink>
        </div>
      </div>
      <p className="type-meta text-ink-soft">{profile.status}.</p>
    </div>
  );
}
```

- [ ] **Step 8: Create `components/notebook/cards/resume-card.tsx`**

```tsx
import { DownloadSimple, FileText } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { profile } from "@/content/profile";

// Notebook card: Résumé (notebook spec 3). The way to the formal version
// and its PDF.
export function ResumeCard() {
  return (
    <div className="grid gap-4">
      {/* VERIFY */}
      <p>The formal version, one page.</p>
      <div className="grid gap-2.5">
        <ButtonLink href="/resume" variant="primary" icon={<FileText size={20} weight="bold" />}>
          Open résumé
        </ButtonLink>
        <ButtonLink href={profile.resumePdf} icon={<DownloadSimple size={20} weight="bold" />} download>
          Download PDF
        </ButtonLink>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in `lib/toolbox.ts`, `components/home/toolbox.tsx` or `components/notebook/cards/`.

- [ ] **Step 10: Report.** Do not commit.

---

### Task 7: The desk

**Files:**
- Create: `app/notebook/page.tsx`, and in `components/notebook/`: `notebook.tsx`, `desk-context.tsx`, `use-is-desktop.ts`, `card-icon.tsx`, `name-mark.tsx`, `name-node.tsx`, `card-node.tsx`, `dock.tsx`, `toolbar.tsx`, `zoom.tsx`, and three stubs `desk-pencil.tsx`, `sheet.tsx`, `tour.tsx`
- Modify: `app/globals.css` (pen-cursor grab rule; new desk block at the end), `lib/pointer-targets.ts`

**Depends on:** 1, 3, 4, 5, 6

The stubs fix the interfaces Tasks 8 to 10 fill in, so those tasks never touch `notebook.tsx`.

- [ ] **Step 1: `components/notebook/desk-context.tsx`**

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { CardId } from "@/lib/notebook";

// What the desk's cards share without passing through React Flow's node
// data: the six card bodies (server components, rendered in
// app/notebook/page.tsx) and the desk's own actions.
export const CardBodies = createContext<Partial<Record<CardId, ReactNode>>>({});
export const DeskActions = createContext<{ close: (id: CardId) => void }>({ close: () => {} });

export function useCardBody(id: CardId): ReactNode {
  return useContext(CardBodies)[id] ?? null;
}

export function useDeskActions() {
  return useContext(DeskActions);
}
```

- [ ] **Step 2: `components/notebook/use-is-desktop.ts`**

```ts
import { useSyncExternalStore } from "react";

// Notebook spec 6: from 768px cards land on the desk; below, they open as a
// bottom sheet.
const QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True from 768px, false below, null during SSR and hydration. */
export function useIsDesktop(): boolean | null {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => null);
}
```

- [ ] **Step 3: `components/notebook/card-icon.tsx`**

```tsx
"use client";

import { Briefcase, EnvelopeSimple, FileText, Folders, User, Wrench, type Icon } from "@phosphor-icons/react";

import type { CardId } from "@/lib/notebook";

const ICONS: Record<CardId, Icon> = {
  about: User,
  projects: Folders,
  experience: Briefcase,
  toolbox: Wrench,
  contact: EnvelopeSimple,
  resume: FileText,
};

// Each card's icon, in its title bar and on its dock button (notebook spec 3).
export function CardIcon({ id, size = 20 }: { id: CardId; size?: number }) {
  const Glyph = ICONS[id];
  return <Glyph aria-hidden="true" size={size} weight="bold" />;
}
```

- [ ] **Step 4: `components/notebook/name-mark.tsx`** (no hooks, so the pre-hydration placeholder and the node share it)

```tsx
import { InkSvg } from "@/components/ink/ink-svg";
import { profile } from "@/content/profile";
import { NAME_BOX } from "@/lib/notebook";

// The middle of the desk (notebook spec 2): the "gp" ring, the name, the
// role and where, and a handwritten hint (hidden on touch screens, where
// the tour says it instead).
export function NameMark() {
  return (
    <div className="grid place-items-center text-center" style={{ width: NAME_BOX.width, height: NAME_BOX.height }}>
      <div>
        <span className="relative mx-auto flex size-16 items-center justify-center rounded-full">
          <InkSvg name="ring" stretch delay={0.2} className="absolute inset-0 size-full" />
          <span aria-hidden="true" className="font-hand -mt-1 text-[1.75rem] leading-none font-bold text-ink">
            gp
          </span>
        </span>
        <h1 className="mt-4 text-[2.75rem] leading-none font-[750] tracking-[-0.03em] whitespace-nowrap">
          {profile.shortName}
        </h1>
        <p className="type-meta mt-3 text-ink-soft">{profile.role}</p>
        <p className="type-meta text-ink-soft">{profile.location}</p>
        <p aria-hidden="true" className="desk-hint type-hand mt-4 -rotate-3 text-pen print:hidden">
          drag the paper around →
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `components/notebook/name-node.tsx`**

```tsx
"use client";

import type { Node, NodeProps } from "@xyflow/react";

import { NameMark } from "@/components/notebook/name-mark";

export type NameNodeType = Node<Record<string, never>, "name">;

// React Flow node for the name (notebook spec 2). Not draggable; pointer
// events pass through it (globals.css), so a drag on the name pans the desk.
export function NameNode(_props: NodeProps<NameNodeType>) {
  return <NameMark />;
}
```

- [ ] **Step 6: `components/notebook/card-node.tsx`**

```tsx
"use client";

import { X } from "@phosphor-icons/react";
import type { Node, NodeProps } from "@xyflow/react";
import type { CSSProperties } from "react";

import { Tape } from "@/components/ink/tape";
import { CardIcon } from "@/components/notebook/card-icon";
import { useCardBody, useDeskActions } from "@/components/notebook/desk-context";
import { CARD_TITLES, CARD_WIDTH, HOME, type CardId } from "@/lib/notebook";

export type CardNodeType = Node<{ id: CardId }, "card">;

// A taped-in sheet on the desk (notebook spec 3): a title bar to drag it by
// (React Flow's dragHandle, `.card-handle`), × to put it away, and the body,
// which scrolls inside the card (`nowheel`) and keeps text selectable
// (`nodrag`). It settles at its own tilt; globals.css lifts and straightens
// it while dragged.
export function CardNode({ data }: NodeProps<CardNodeType>) {
  const { id } = data;
  const body = useCardBody(id);
  const { close } = useDeskActions();
  const title = CARD_TITLES[id];
  const tilt = HOME[id].tilt;

  return (
    <section
      aria-labelledby={`card-${id}-h`}
      className="desk-card paper relative"
      style={{ width: CARD_WIDTH, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <Tape className="-top-3 left-1/2 h-6.5 w-20 -ml-10" style={{ rotate: `${-tilt * 2}deg` }} />
      <header className="card-handle mx-5 flex cursor-grab items-center gap-2.5 border-b-2 border-ink pt-4 pb-2.5 active:cursor-grabbing">
        <CardIcon id={id} />
        <h2 id={`card-${id}-h`} className="flex-1 text-[1.1875rem] leading-tight font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => close(id)}
          aria-label={`Put away ${title}`}
          className="nodrag grid size-9 cursor-pointer place-items-center rounded-full border-2 border-ink bg-sheet text-ink hover:bg-wash"
        >
          <X aria-hidden="true" size={16} weight="bold" />
        </button>
      </header>
      <div className="nowheel nodrag max-h-[440px] cursor-auto overflow-y-auto overscroll-contain px-5 pt-4 pb-5 select-text">
        {body}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: `components/notebook/dock.tsx`**

```tsx
"use client";

import { CardIcon } from "@/components/notebook/card-icon";
import { cn } from "@/lib/cn";
import { CARD_IDS, CARD_TITLES, type CardId } from "@/lib/notebook";

// Under 768px six labels must fit 375px.
const PHONE_LABELS: Partial<Record<CardId, string>> = { experience: "Work" };

// The dock (notebook spec 4): one button per card. An open card's button
// takes the wash and a pen dot. Clicking opens or puts away.
export function Dock({ isOpen, onToggle }: { isOpen: (id: CardId) => boolean; onToggle: (id: CardId) => void }) {
  return (
    <nav
      aria-label="Notebook pages"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[var(--z-desk-ui)] flex justify-center print:hidden"
    >
      <ul className="flex gap-1 rounded-control border-2 border-ink bg-sheet p-1.5 max-md:w-full">
        {CARD_IDS.map((id) => {
          const open = isOpen(id);
          return (
            <li key={id} className="max-md:min-w-0 max-md:flex-1">
              <button
                type="button"
                aria-pressed={open}
                onClick={() => onToggle(id)}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center gap-1 rounded-control px-3 pt-2 pb-1.5 text-[0.8125rem] font-semibold text-ink hover:bg-wash max-md:px-0.5 max-md:text-[0.6875rem]",
                  open && "bg-wash",
                )}
              >
                <CardIcon id={id} />
                <span className="whitespace-nowrap">
                  <span className="md:hidden">{PHONE_LABELS[id] ?? CARD_TITLES[id]}</span>
                  <span className="max-md:hidden">{CARD_TITLES[id]}</span>
                </span>
                <span aria-hidden="true" className={cn("size-1 rounded-full", open ? "bg-pen" : "bg-transparent")} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 8: `components/notebook/toolbar.tsx`**

```tsx
"use client";

import { ArrowLeft, ArrowsOut, Broom, PencilSimple, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import Link from "next/link";

import { LampToggle } from "@/components/lamp-toggle";
import { cn } from "@/lib/cn";
import { pencil, usePencil } from "@/lib/pencil";

const ITEM =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control px-3 text-[0.9375rem] font-semibold text-ink no-underline hover:bg-wash max-md:px-2.5";

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-0.5 rounded-full bg-ink/20" />;
}

// The desk's toolbar (notebook spec 4): Fit all, Tidy up (desktop only),
// the pencil, sound and the lamp, and the way back to the site. On phones
// only Fit and Back keep their labels.
export function Toolbar({
  desktop,
  soundOn,
  onSound,
  onFit,
  onTidy,
}: {
  desktop: boolean;
  soundOn: boolean;
  onSound: () => void;
  onFit: () => void;
  onTidy: () => void;
}) {
  const pencilOut = usePencil();

  return (
    <div
      role="toolbar"
      aria-label="Desk"
      className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-1/2 z-[var(--z-desk-ui)] flex -translate-x-1/2 items-center gap-1 rounded-control border-2 border-ink bg-sheet p-1.5 print:hidden"
    >
      <button type="button" onClick={onFit} className={ITEM}>
        <ArrowsOut aria-hidden="true" size={18} weight="bold" />
        <span className="md:hidden">Fit</span>
        <span className="max-md:hidden">Fit all</span>
      </button>
      {desktop ? (
        <button type="button" onClick={onTidy} className={ITEM}>
          <Broom aria-hidden="true" size={18} weight="bold" />
          Tidy up
        </button>
      ) : null}
      <Divider />
      <button
        type="button"
        aria-pressed={pencilOut}
        aria-label="Pencil"
        title={pencilOut ? "Put the pencil down" : "Pick up the pencil and doodle on the paper"}
        onClick={() => pencil.toggle(!soundOn)}
        className={cn(ITEM, pencilOut && "bg-wash")}
      >
        <PencilSimple aria-hidden="true" size={18} weight="bold" />
        <span className="max-md:hidden">Pencil</span>
      </button>
      <button
        type="button"
        aria-pressed={soundOn}
        aria-label="Sound"
        title={soundOn ? "Turn the sound off" : "Turn the sound on"}
        onClick={onSound}
        className={cn(ITEM, soundOn && "bg-wash")}
      >
        {soundOn ? (
          <SpeakerHigh aria-hidden="true" size={18} weight="bold" />
        ) : (
          <SpeakerSlash aria-hidden="true" size={18} weight="bold" />
        )}
        <span className="max-md:hidden">Sound</span>
      </button>
      <LampToggle bare />
      <Divider />
      <Link href="/" className={ITEM}>
        <ArrowLeft aria-hidden="true" size={18} weight="bold" />
        <span className="md:hidden">Site</span>
        <span className="max-md:hidden">Back to the site</span>
      </Link>
    </div>
  );
}
```

- [ ] **Step 9: `components/notebook/zoom.tsx`**

```tsx
"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { useReactFlow, useViewport } from "@xyflow/react";
import { useReducedMotion } from "motion/react";

import { ZOOM, zoomLabel } from "@/lib/notebook";

const BUTTON =
  "grid size-8 cursor-pointer place-items-center rounded-control text-ink hover:bg-wash disabled:cursor-not-allowed disabled:opacity-40";

// Zoom controls, desktop only (notebook spec 4): −, the zoom in whole
// percent, +, in steps of 0.1 within the desk's range.
export function Zoom() {
  const { zoom } = useViewport();
  const flow = useReactFlow();
  const duration = useReducedMotion() ? 0 : 200;
  const to = (next: number) => void flow.zoomTo(Math.min(ZOOM.max, Math.max(ZOOM.min, next)), { duration });

  return (
    <div className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[var(--z-desk-ui)] flex items-center gap-0.5 rounded-control border-2 border-ink bg-sheet p-1 print:hidden">
      <button type="button" aria-label="Zoom out" disabled={zoom <= ZOOM.min + 0.001} onClick={() => to(zoom - ZOOM.step)} className={BUTTON}>
        <Minus aria-hidden="true" size={16} weight="bold" />
      </button>
      <output className="w-12 text-center text-sm font-semibold tabular-nums">{zoomLabel(zoom)}</output>
      <button type="button" aria-label="Zoom in" disabled={zoom >= ZOOM.max - 0.001} onClick={() => to(zoom + ZOOM.step)} className={BUTTON}>
        <Plus aria-hidden="true" size={16} weight="bold" />
      </button>
    </div>
  );
}
```

- [ ] **Step 10: The three stubs** (Tasks 8, 9 and 10 replace their bodies; the props are final)

`components/notebook/desk-pencil.tsx`:

```tsx
"use client";

// The pencil on the desk (notebook spec 8). Filled in by Task 8.
export function DeskPencil(_props: { soundOn: boolean }) {
  return null;
}
```

`components/notebook/sheet.tsx`:

```tsx
"use client";

import type { CardId } from "@/lib/notebook";

// The phone's bottom sheet (notebook spec 6). Filled in by Task 9.
export function Sheet(_props: { card: CardId | null; onClose: () => void }) {
  return null;
}
```

`components/notebook/tour.tsx`:

```tsx
"use client";

// The first-visit tour (notebook spec 7). Filled in by Task 10.
export function Tour(_props: { desktop: boolean }) {
  return null;
}
```

- [ ] **Step 11: `components/notebook/notebook.tsx`**

```tsx
"use client";

import "@xyflow/react/dist/base.css";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  useStore,
  type XYPosition,
} from "@xyflow/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

import { CardNode, type CardNodeType } from "@/components/notebook/card-node";
import { CardBodies, DeskActions } from "@/components/notebook/desk-context";
import { DeskPencil } from "@/components/notebook/desk-pencil";
import { Dock } from "@/components/notebook/dock";
import { NameMark } from "@/components/notebook/name-mark";
import { NameNode, type NameNodeType } from "@/components/notebook/name-node";
import { Sheet } from "@/components/notebook/sheet";
import { Toolbar } from "@/components/notebook/toolbar";
import { Tour } from "@/components/notebook/tour";
import { useIsDesktop } from "@/components/notebook/use-is-desktop";
import { Zoom } from "@/components/notebook/zoom";
import { cn } from "@/lib/cn";
import { HOME, NAME_BOX, ZOOM, cardSearch, isCardId, parseCard, type CardId } from "@/lib/notebook";
import { paperSound } from "@/lib/paper-sound";
import { usePencil } from "@/lib/pencil";

type DeskNode = NameNodeType | CardNodeType;

const nodeTypes = { name: NameNode, card: CardNode };

const NAME_NODE: NameNodeType = {
  id: "name",
  type: "name",
  position: { x: NAME_BOX.x, y: NAME_BOX.y },
  data: {},
  draggable: false,
  deletable: false,
  focusable: false,
};

function cardNode(id: CardId, position: XYPosition, zIndex: number): CardNodeType {
  return { id, type: "card", position, data: { id }, dragHandle: ".card-handle", zIndex, deletable: false };
}

/** Keyboard panning, in screen pixels per press. */
const PAN_STEP = 80;
const PAN_KEYS: Record<string, [dx: number, dy: number]> = {
  ArrowLeft: [PAN_STEP, 0],
  ArrowRight: [-PAN_STEP, 0],
  ArrowUp: [0, PAN_STEP],
  ArrowDown: [0, -PAN_STEP],
};

// ?card= follows the open cards without adding history entries (spec 5).
function writeCards(open: readonly CardId[]) {
  const { pathname, search, hash } = window.location;
  window.history.replaceState(null, "", `${pathname}${cardSearch(search, open)}${hash}`);
}

function Desk({ desktop }: { desktop: boolean }) {
  const flow = useReactFlow<DeskNode>();
  const reduce = useReducedMotion();
  const pencilOut = usePencil();
  const [nodes, setNodes, onNodesChange] = useNodesState<DeskNode>([NAME_NODE]);
  // Desktop: the cards on the desk, in the order they were opened.
  const [open, setOpen] = useState<CardId[]>([]);
  // Phones: the card in the bottom sheet.
  const [sheet, setSheet] = useState<CardId | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  // Nodes to glide to as soon as React Flow has measured them.
  const [focusOn, setFocusOn] = useState<string[] | null>(null);
  // Where each card was last dropped this visit; the next z-index; which
  // screen size the current first view was laid out for.
  const dropped = useRef<Partial<Record<CardId, XYPosition>>>({});
  const top = useRef(1);
  const laidOutFor = useRef<boolean | null>(null);
  const duration = reduce ? 0 : 400;

  const measured = useStore(
    (s) => focusOn !== null && focusOn.every((id) => Boolean(s.nodeLookup.get(id)?.measured?.width)),
  );

  useEffect(() => {
    if (!focusOn || !measured) return;
    void flow.fitView({ nodes: focusOn.map((id) => ({ id })), padding: 0.2, maxZoom: 1, duration });
    setFocusOn(null);
  }, [focusOn, measured, flow, duration]);

  // The first view (spec 2, 6), laid out again whenever the screen crosses
  // 768px. Only the very first one follows a ?card= link; later ones clear it.
  useEffect(() => {
    if (laidOutFor.current === desktop) return;
    const first = laidOutFor.current === null;
    laidOutFor.current = desktop;
    const linked = first ? parseCard(window.location.search) : null;
    if (!first) writeCards([]);
    dropped.current = {};
    if (desktop) {
      const card = linked ?? "about";
      top.current = 2;
      setNodes([NAME_NODE, cardNode(card, HOME[card].position, top.current)]);
      setOpen([card]);
      setSheet(null);
      setFocusOn(linked ? [linked] : ["name", card]);
    } else {
      setNodes([NAME_NODE]);
      setOpen([]);
      setSheet(linked);
      setFocusOn(["name"]);
    }
  }, [desktop, setNodes]);

  function openCard(id: CardId) {
    if (soundOn) paperSound.slide();
    if (!desktop) {
      setSheet(id);
      writeCards([id]);
      return;
    }
    const z = ++top.current;
    const position = dropped.current[id] ?? HOME[id].position;
    setNodes((all) => [...all.filter((n) => n.id !== id), cardNode(id, position, z)]);
    const next = [...open.filter((c) => c !== id), id];
    setOpen(next);
    writeCards(next);
    setFocusOn([id]);
  }

  function closeCard(id: CardId) {
    if (soundOn) paperSound.slide(true);
    if (!desktop) {
      setSheet(null);
      writeCards([]);
      return;
    }
    const node = flow.getNode(id);
    if (node) dropped.current[id] = node.position;
    setNodes((all) => all.filter((n) => n.id !== id));
    const next = open.filter((c) => c !== id);
    setOpen(next);
    writeCards(next);
  }

  const isOpen = (id: CardId) => (desktop ? open.includes(id) : sheet === id);
  const toggle = (id: CardId) => (isOpen(id) ? closeCard(id) : openCard(id));

  function fitAll() {
    void flow.fitView({ padding: 0.15, maxZoom: 1, duration });
  }

  function tidy() {
    dropped.current = {};
    top.current = 2;
    setNodes([NAME_NODE, cardNode("about", HOME.about.position, top.current)]);
    setOpen(["about"]);
    writeCards([]);
    setFocusOn(["name", "about"]);
  }

  // Esc puts away the card holding focus (spec 10). With the desk itself
  // focused, arrows pan and +/- zoom.
  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      const id = e.target instanceof Element ? e.target.closest(".react-flow__node")?.getAttribute("data-id") : null;
      if (desktop && isCardId(id) && open.includes(id)) {
        e.preventDefault();
        closeCard(id);
        e.currentTarget.focus();
      }
      return;
    }
    if (e.target !== e.currentTarget) return;
    const pan = PAN_KEYS[e.key];
    if (pan) {
      e.preventDefault();
      const { x, y, zoom } = flow.getViewport();
      void flow.setViewport({ x: x + pan[0], y: y + pan[1], zoom }, { duration: reduce ? 0 : 150 });
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      void flow.zoomIn({ duration: reduce ? 0 : 200 });
    } else if (e.key === "-") {
      e.preventDefault();
      void flow.zoomOut({ duration: reduce ? 0 : 200 });
    }
  }

  return (
    <DeskActions.Provider value={{ close: closeCard }}>
      <div
        data-desk=""
        role="region"
        aria-label="Desk"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn("desk fixed inset-0 overflow-hidden bg-paper", pencilOut && "desk-pencil-out")}
      >
        <ReactFlow<DeskNode>
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          minZoom={ZOOM.min}
          maxZoom={ZOOM.max}
          panOnDrag={!pencilOut}
          nodesDraggable={!pencilOut}
          nodesConnectable={false}
          elementsSelectable={false}
          selectionOnDrag={false}
          zoomOnDoubleClick={false}
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          onNodeDragStart={(_, node) => {
            const z = ++top.current;
            setNodes((all) => all.map((n) => (n.id === node.id ? { ...n, zIndex: z } : n)));
          }}
          onNodeDragStop={() => {
            if (soundOn) paperSound.press();
          }}
          onPaneClick={() => {
            if (!desktop && sheet) closeCard(sheet);
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1.6} color="var(--dot)" bgColor="var(--paper)" />
          <DeskPencil soundOn={soundOn} />
        </ReactFlow>
        <Toolbar
          desktop={desktop}
          soundOn={soundOn}
          onSound={() => setSoundOn((on) => !on)}
          onFit={fitAll}
          onTidy={tidy}
        />
        <Dock isOpen={isOpen} onToggle={toggle} />
        {desktop ? <Zoom /> : null}
        <Sheet
          card={desktop ? null : sheet}
          onClose={() => {
            if (sheet) closeCard(sheet);
          }}
        />
        <Tour desktop={desktop} />
      </div>
    </DeskActions.Provider>
  );
}

// The notebook desk (/notebook, notebook spec). It needs the screen width to
// choose desk cards or phone sheets, so until hydration it shows just the
// name on bare paper.
export function Notebook({ bodies }: { bodies: Record<CardId, ReactNode> }) {
  const desktop = useIsDesktop();
  return (
    <CardBodies.Provider value={bodies}>
      <ReactFlowProvider>
        {desktop === null ? (
          <div className="desk fixed inset-0 grid place-items-center bg-paper">
            <NameMark />
          </div>
        ) : (
          <Desk desktop={desktop} />
        )}
      </ReactFlowProvider>
    </CardBodies.Provider>
  );
}
```

If `tsc` rejects `nodeTypes` (React Flow's `NodeTypes` typing is strict about per-node props), declare it as `const nodeTypes = { name: NameNode, card: CardNode } satisfies NodeTypes;` with `type NodeTypes` imported from `@xyflow/react`, and say so in your report. Do not cast to `any`.

- [ ] **Step 12: `app/notebook/page.tsx`**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AboutCard } from "@/components/notebook/cards/about-card";
import { ContactCard } from "@/components/notebook/cards/contact-card";
import { ExperienceCard } from "@/components/notebook/cards/experience-card";
import { ProjectsCard } from "@/components/notebook/cards/projects-card";
import { ResumeCard } from "@/components/notebook/cards/resume-card";
import { ToolboxCard } from "@/components/notebook/cards/toolbox-card";
import { Notebook } from "@/components/notebook/notebook";
import { profile } from "@/content/profile";
import type { CardId } from "@/lib/notebook";

export const metadata: Metadata = {
  title: "Notebook",
  // VERIFY
  description: `The loose pages of ${profile.shortName}'s notebook, on a desk: drag them around, zoom out, doodle in the margins.`,
  alternates: { canonical: "/notebook" },
};

// The six card bodies render here, on the server, and ride into the client
// desk as props (notebook spec 1).
const BODIES: Record<CardId, ReactNode> = {
  about: <AboutCard />,
  projects: <ProjectsCard />,
  experience: <ExperienceCard />,
  toolbox: <ToolboxCard />,
  contact: <ContactCard />,
  resume: <ResumeCard />,
};

// Notebook spec: the playful half of the site. Outside the app/(site)
// group, so no nav or footer; the site's skip link lands on this <main>.
export default function NotebookPage() {
  return (
    <main id="main">
      <Notebook bodies={BODIES} />
    </main>
  );
}
```

- [ ] **Step 13: Keep the system grab cursor on a card's title bar**

In `lib/pointer-targets.ts`, `NATIVE` becomes:

```ts
export const NATIVE =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], .sticker-grab, .card-handle, :disabled, [aria-disabled="true"]';
```

and its comment's list reads "fields, draggable stickers and notebook card title bars, disabled controls".

In `app/globals.css`, the two `.sticker-grab` rules under `html.has-pen-cursor` become:

```css
html.has-pen-cursor :is(.sticker-grab, .card-handle) {
  cursor: grab;
}
html.has-pen-cursor :is(.sticker-grab, .card-handle):active {
  cursor: grabbing;
}
```

- [ ] **Step 14: The desk's CSS** — append to the end of `app/globals.css`:

```css
/* =========================================================
   The notebook desk (/notebook, components/notebook/). React Flow brings
   only its base CSS; every colour here is a token, so the lamp's night
   page works on the desk too.
   ========================================================= */
.desk:focus-visible {
  outline-offset: -4px;
}
/* The name never blocks a drag: a press on it pans the desk. */
.desk .react-flow__node-name {
  pointer-events: none;
}
.desk.desk-pencil-out .react-flow__pane {
  cursor: crosshair;
}
.desk-card {
  rotate: var(--tilt);
}
@media (prefers-reduced-motion: no-preference) {
  .desk-card {
    transition:
      rotate 0.25s var(--ease-out),
      box-shadow 0.25s var(--ease-out);
  }
  /* Picked up: straight, and lifted further off the paper. */
  .react-flow__node.dragging .desk-card {
    rotate: 0deg;
    box-shadow:
      0 34px 60px -24px var(--lift),
      0 2px 0 var(--lift);
  }
}
/* Touch screens learn to drag from the tour instead. */
@media (hover: none) {
  .desk-hint {
    display: none;
  }
}
```

- [ ] **Step 15: Typecheck and build** (run these one after the other, not with anything else)

Run: `./node_modules/.bin/tsc --noEmit`
Expected: exits 0.

Run: `NODE_ENV=production ./node_modules/.bin/next build`
Expected: succeeds, and the route list includes `/notebook` (static).

- [ ] **Step 16: Report**, including anything you had to change from the code above and why. Do not commit. (The controller checks it in the browser.)

---

### Task 8: The pencil on the desk

**Files:**
- Modify: `components/notebook/desk-pencil.tsx` (replace the stub)

**Depends on:** 2, 7

- [ ] **Step 1: Replace `components/notebook/desk-pencil.tsx`**

```tsx
"use client";

import { Eraser } from "@phosphor-icons/react";
import { ViewportPortal, useReactFlow, useStore } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";
import { pencil, usePencil } from "@/lib/pencil";
import { pencilSound } from "@/lib/pencil-sound";
import { toPath, type StrokePoint } from "@/lib/stroke";

// The pencil on the desk (notebook spec 8). While it is out, a press on bare
// paper (React Flow's pane, never a card) draws; points are kept in desk
// coordinates and drawn inside React Flow's viewport, so a doodle stays on
// the paper as it pans and zooms. A second finger means a pinch: the stroke
// is dropped and React Flow zooms. The scratch only sounds while the desk's
// Sound is on. Doodles last until Erase or leaving the page; nothing is
// saved. The live stroke is written straight to its <path>, so drawing never
// re-renders React.
export function DeskPencil({ soundOn }: { soundOn: boolean }) {
  const active = usePencil();
  const flow = useReactFlow();
  const domNode = useStore((s) => s.domNode);
  const [strokes, setStrokes] = useState<string[]>([]);
  const livePath = useRef<SVGPathElement>(null);
  const sound = useRef(soundOn);

  useEffect(() => {
    sound.current = soundOn;
  }, [soundOn]);

  // Leaving the desk puts the pencil down, quietly.
  useEffect(
    () => () => {
      pencilSound.stop();
      pencil.set(false, true);
    },
    [],
  );

  // Esc puts the pencil down.
  useEffect(() => {
    if (!active) {
      pencilSound.stop();
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") pencil.set(false, !sound.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    if (!active || !domNode) return;
    let live: StrokePoint[] | null = null;
    let pointerId: number | null = null;
    let last = { x: 0, y: 0, t: 0 };

    const point = (e: PointerEvent): StrokePoint => {
      const p = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY }, { snapToGrid: false });
      return [p.x, p.y, e.pointerType === "pen" ? e.pressure : 0.5];
    };
    const draw = () => livePath.current?.setAttribute("d", live ? toPath(live) : "");

    function down(e: PointerEvent) {
      if (pointerId !== null) {
        // A second finger: this is a pinch, not a stroke.
        live = null;
        pointerId = null;
        draw();
        pencilSound.stop();
        return;
      }
      if (e.button !== 0 || !(e.target instanceof Element) || !e.target.closest(".react-flow__pane")) return;
      pointerId = e.pointerId;
      live = [point(e)];
      draw();
      last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      if (sound.current) pencilSound.start();
    }

    function move(e: PointerEvent) {
      if (e.pointerId !== pointerId || !live) return;
      live.push(point(e));
      draw();
      const dt = e.timeStamp - last.t;
      if (dt > 0) {
        if (sound.current) {
          const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
          pencilSound.move(speed, e.pointerType === "pen" ? e.pressure : 0.5, e.clientX, e.clientY);
        }
        last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      }
    }

    function up(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      pencilSound.stop();
      const d = live ? toPath(live) : "";
      live = null;
      pointerId = null;
      draw();
      if (d) setStrokes((all) => [...all, d]);
    }

    domNode.addEventListener("pointerdown", down, true);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      domNode.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      pencilSound.stop();
      livePath.current?.setAttribute("d", "");
    };
  }, [active, domNode, flow]);

  return (
    <>
      {active || strokes.length > 0 ? (
        <ViewportPortal>
          <svg
            aria-hidden="true"
            focusable="false"
            width={1}
            height={1}
            className="pointer-events-none absolute top-0 left-0 overflow-visible text-ink print:hidden"
          >
            {strokes.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
            <path ref={livePath} fill="currentColor" />
          </svg>
        </ViewportPortal>
      ) : null}
      {active && strokes.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            if (sound.current) pencilSound.erase();
            setStrokes([]);
          }}
          className={buttonClasses(
            "secondary",
            "fixed top-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)] left-1/2 z-[var(--z-desk-ui)] -translate-x-1/2 print:hidden",
            "sm",
          )}
        >
          <Eraser aria-hidden="true" size={20} weight="bold" />
          Erase
        </button>
      ) : null}
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in `components/notebook/desk-pencil.tsx`.

- [ ] **Step 3: Report.** Do not commit.

---

### Task 9: The phone sheet

**Files:**
- Modify: `components/notebook/sheet.tsx` (replace the stub)

**Depends on:** 7

- [ ] **Step 1: Replace `components/notebook/sheet.tsx`**

```tsx
"use client";

import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useDragControls, useReducedMotion, type PanInfo } from "motion/react";
import { useEffect, useRef } from "react";

import { CardIcon } from "@/components/notebook/card-icon";
import { useCardBody } from "@/components/notebook/desk-context";
import { CARD_TITLES, type CardId } from "@/lib/notebook";

/** How far (px) or how fast (px/s) a downward swipe on the grab bar must go to close. */
const SWIPE_DISTANCE = 100;
const SWIPE_SPEED = 500;

// The phone's bottom sheet (notebook spec 6): under 768px a card opens here
// instead of on the desk. It sits just above the dock, which stays usable
// (tapping another tab swaps the sheet). It closes with ×, a swipe down on
// the grab bar, Esc, or a tap on the bare desk (notebook.tsx). Focus moves
// to its close button and returns where it was.
export function Sheet({ card, onClose }: { card: CardId | null; onClose: () => void }) {
  const reduce = useReducedMotion() ?? false;
  return <AnimatePresence>{card ? <Panel key={card} card={card} onClose={onClose} reduce={reduce} /> : null}</AnimatePresence>;
}

function Panel({ card, onClose, reduce }: { card: CardId; onClose: () => void; reduce: boolean }) {
  const body = useCardBody(card);
  const controls = useDragControls();
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = useRef(onClose);
  const title = CARD_TITLES[card];

  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      before?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <motion.section
      role="dialog"
      aria-modal="false"
      aria-labelledby={`sheet-${card}-h`}
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 1 }}
      onDragEnd={(_, info: PanInfo) => {
        if (info.offset.y > SWIPE_DISTANCE || info.velocity.y > SWIPE_SPEED) close.current();
      }}
      initial={reduce ? { opacity: 0 } : { y: "100%" }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: "120%" }}
      transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-2 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+5.25rem)] z-[var(--z-desk-sheet)] flex h-[min(70dvh,calc(100dvh-11rem))] flex-col rounded-control border-2 border-ink bg-sheet shadow-lift print:hidden"
    >
      <div
        aria-hidden="true"
        onPointerDown={(e) => controls.start(e)}
        className="grid h-7 shrink-0 cursor-grab touch-none place-items-center"
      >
        <span className="h-1 w-10 rounded-full bg-ink/30" />
      </div>
      <header className="mx-5 flex items-center gap-2.5 border-b-2 border-ink pb-2.5">
        <CardIcon id={card} />
        <h2 id={`sheet-${card}-h`} className="flex-1 text-[1.1875rem] leading-tight font-bold">
          {title}
        </h2>
        <button
          ref={closeButton}
          type="button"
          onClick={() => close.current()}
          aria-label={`Put away ${title}`}
          className="grid size-9 cursor-pointer place-items-center rounded-full border-2 border-ink bg-sheet text-ink"
        >
          <X aria-hidden="true" size={16} weight="bold" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-6">{body}</div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in `components/notebook/sheet.tsx`.

- [ ] **Step 3: Report.** Do not commit.

---

### Task 10: The first-visit tour

**Files:**
- Modify: `components/notebook/tour.tsx` (replace the stub)

**Depends on:** 3, 7

- [ ] **Step 1: Replace `components/notebook/tour.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";
import { Tape } from "@/components/ink/tape";
import { cn } from "@/lib/cn";
import { TOUR_STORAGE_KEY } from "@/lib/notebook";

type Place = "center" | "zoom" | "dock" | "toolbar";

// Written out in full: Tailwind only generates classes it can read whole.
const PLACE: Record<Place, string> = {
  center: "top-[22%] left-1/2 -translate-x-1/2",
  zoom: "right-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4rem)]",
  dock: "bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+6.5rem)] left-1/2 -translate-x-1/2",
  toolbar: "top-[calc(max(0.75rem,env(safe-area-inset-top))+4.5rem)] left-1/2 -translate-x-1/2",
};

// VERIFY: all copy.
const STEPS: { title: string; body: string; touch: string; place: Place }[] = [
  {
    title: "This is a notebook, not a page.",
    body: "Drag the paper to move around. Nothing scrolls here.",
    touch: "Drag with one finger to move around.",
    place: "center",
  },
  {
    title: "Scroll or pinch to zoom.",
    body: "Fit all brings everything back into view.",
    touch: "Pinch to zoom. Fit brings everything back.",
    place: "zoom",
  },
  {
    title: "The tabs open pages.",
    body: "Drag a card by its title. × puts it away.",
    touch: "Tap a tab to read it. Swipe it down to put it away.",
    place: "dock",
  },
  {
    title: "The pencil is in the toolbar.",
    body: "Doodle anywhere on the paper. Erase clears it.",
    touch: "Doodle anywhere on the paper. Erase clears it.",
    place: "toolbar",
  },
];

// The first-visit tour (notebook spec 7): four taped notes, one at a time,
// each beside what it describes. Shown once per browser; storage that
// throws just means it shows again next time. The desk stays usable while a
// note is up. Esc skips.
export function Tour({ desktop }: { desktop: boolean }) {
  const [step, setStep] = useState<number | null>(null);
  const note = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(TOUR_STORAGE_KEY) === "seen";
    } catch {
      // Storage blocked: show the tour.
    }
    if (!seen) setStep(0);
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "seen");
    } catch {
      // Storage blocked: it shows again next visit.
    }
    setStep(null);
    document.querySelector<HTMLElement>("[data-desk]")?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (step === null) return;
    note.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, finish]);

  if (step === null) return null;
  const current = STEPS[step];
  const last = step === STEPS.length - 1;
  // Phones have no zoom control to point at.
  const place = !desktop && current.place === "zoom" ? "center" : current.place;

  return (
    <motion.div
      key={step}
      ref={note}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-h"
      aria-describedby="tour-b"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "paper fixed z-[var(--z-desk-tour)] w-[min(320px,calc(100vw-2rem))] px-5 pt-6 pb-4 outline-none print:hidden",
        PLACE[place],
      )}
    >
      <Tape className="-top-3 left-1/2 h-6 w-16 -ml-8" style={{ rotate: "-3deg" }} />
      <div className="flex items-center justify-between">
        <p className="type-meta text-ink-soft">
          {step + 1} of {STEPS.length}
        </p>
        <button type="button" onClick={finish} className="type-meta cursor-pointer text-ink-soft underline underline-offset-4 hover:text-ink">
          Skip
        </button>
      </div>
      <h2 id="tour-h" className="mt-2 text-lg leading-tight font-bold">
        {current.title}
      </h2>
      <p id="tour-b" className="mt-1.5 text-ink-soft">
        {desktop ? current.body : current.touch}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div aria-hidden="true" className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={cn("h-1.5 rounded-full", i === step ? "w-4 bg-pen" : "w-1.5 bg-ink/25")} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish() : setStep(step + 1))}
          className={buttonClasses("primary", undefined, "sm")}
        >
          {last ? "Got it" : "Next"}
        </button>
      </div>
    </motion.div>
  );
}
```


- [ ] **Step 2: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in `components/notebook/tour.tsx`.

- [ ] **Step 3: Report.** Do not commit.

---

### Task 11: Home page teaser

**Files:**
- Create: `components/home/notebook-teaser.tsx`
- Modify: `app/(site)/page.tsx`

**Depends on:** 4

- [ ] **Step 1: Create `components/home/notebook-teaser.tsx`**

```tsx
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { PaperCard } from "@/components/paper-card";
import { Reveal } from "@/components/reveal";

// Notebook spec 11: the home page's closing note, the way into /notebook.
// VERIFY: all copy.
export function NotebookTeaser() {
  return (
    <section aria-labelledby="notebook-h" className="pb-20 md:pb-24 print:hidden">
      <Reveal className="mx-auto max-w-[520px]">
        <PaperCard rotate={-0.8} tape="top" className="px-7 pt-9 pb-7">
          <h2 id="notebook-h" className="type-h3">
            This page is the tidy half.
          </h2>
          <p className="mt-3 text-ink-soft">
            The rest of the notebook is loose pages on a desk: drag them around, zoom out, doodle in the margins.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href="/notebook" variant="primary" icon={<ArrowRight size={20} weight="bold" />}>
              Open the notebook
            </ButtonLink>
            <p aria-hidden="true" className="type-hand -rotate-2 text-pen">
              bring a pencil
            </p>
          </div>
        </PaperCard>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Render it after Contact** (`app/(site)/page.tsx`)

- Add `import { NotebookTeaser } from "@/components/home/notebook-teaser";` in alphabetical order with the other `@/components/home/` imports.
- Render `<NotebookTeaser />` right after `<Contact />`.
- The comment above `HomePage` gains ", and a closing note that opens the notebook" at the end of its list.

- [ ] **Step 3: Typecheck**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: no errors in these two files.

- [ ] **Step 4: Report.** Do not commit.

---

### Task 12: Docs

**Files:**
- Modify: `docs/v2/DESIGN-SPEC.md`, `CLAUDE.md`

**Depends on:** 7, 8, 9, 10, 11

- [ ] **Step 1: `docs/v2/DESIGN-SPEC.md`**

- Under section 7, after 7.6 Toolbox, add **### 7.7 Notebook teaser**: a short paragraph describing `components/home/notebook-teaser.tsx` as built (taped sheet after Contact, heading, one line, "Open the notebook" primary button to `/notebook`, "bring a pencil" margin note, hidden in print, copy VERIFY).
- Add a new top-level section at the end, **## 17. Notebook desk `/notebook`**: 10 to 20 lines summarising the shipped feature (route outside the `app/(site)` group; React Flow desk; six cards from content; dock, toolbar, zoom; `?card=`; phone sheet under 768px; tour stored under `gp-notebook-tour`; desk pencil; paper sounds off by default; z levels `deskUi`/`deskSheet`/`deskTour`), and a link to `docs/superpowers/specs/2026-11-01-notebook-desk-design.md` for the detail.
- In section 15 (build checklist), append ticked items in the existing format for: route group, notebook desk, cards, phone sheet, tour, desk pencil, paper sounds, home teaser.
- Section 1's non-goals keep the ⌘K palette retired; do not change them.

- [ ] **Step 2: `CLAUDE.md`**

- In **Commands**, change "(`tsc --noEmit`; there is no lint or test setup)" to "(`tsc --noEmit`; there is no lint setup)", and add a bullet:
  "- `corepack pnpm test` runs Vitest over pure `lib/` functions only (no DOM). Run one file with one worker: `corepack pnpm test lib/notebook.test.ts --maxWorkers=1`."
- In **Stack**, add `@xyflow/react` (React Flow, used only by `/notebook`) and Vitest.
- In **Where things live**, add a bullet:
  "- **Notebook desk:** `/notebook` (`app/notebook/page.tsx`, `components/notebook/`) is a React Flow desk outside the `app/(site)` route group, so it has no nav or footer; `components/site-chrome.tsx` holds that chrome for the group and the 404. Card bodies are server components in `components/notebook/cards/`. Pure desk data (card ids, home positions, `?card=`) is in `lib/notebook.ts`, the pencil's stroke maths in `lib/stroke.ts`, the Toolbox's logos and loops in `lib/toolbox.ts`. Spec: `docs/superpowers/specs/2026-11-01-notebook-desk-design.md`."

- [ ] **Step 3: Report.** Do not commit.

---

## Controller: verification after the last wave

Not a sub-agent task. In the feature worktree, on its own dev server (a port other than 3200):

1. `NODE_ENV=production ./node_modules/.bin/next build` succeeds; `/notebook` is in the route list.
2. Tests, one file at a time: `lib/stroke.test.ts`, then `lib/notebook.test.ts`.
3. In the user's default browser, desktop width, light then night: first view (name + About), each dock button opens and puts away its card, the view glides to a new card, drag lifts and straightens a card and it settles back tilted, Fit all, Tidy up, zoom − / + and the readout, `?card=projects` deep link, URL updates on open and close, Esc on a focused card, arrows and +/- with the desk focused, the tour shows once and not after reload, Sound on gives slide and press sounds and off is silent, pencil draws only on bare paper and doodles stay put while panning and zooming, Erase.
4. At 375px: name only on arrival, dock fits, a tab opens the sheet, another tab swaps it, swipe down, ×, tap on the desk and Esc close it, `?card=contact` opens its sheet, one-finger pan and pinch zoom, the tour's touch wording.
5. Reduced motion: no glides, no drag tilt, sheet and tour appear without moving.
6. `/`, `/projects/tong-masters`, `/resume` and a 404 look and behave as before (nav, footer, back-to-top, ink marks, pencil, splash on `/`), and the home teaser sits after Contact.
