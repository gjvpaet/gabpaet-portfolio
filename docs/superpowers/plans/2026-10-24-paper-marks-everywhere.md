# Paper Marks Everywhere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking empty paper anywhere on gabpaet.dev (every page, the nav and the footer) drops the hero's hand-drawn ink mark, not just in the hero.

**Architecture:** One client component, `PaperMarks`, is rendered once in the root layout. It listens for `click` on `document` and draws marks in a page-sized, `aria-hidden` layer that ignores the pointer, as `PencilLayer` does. Clicks on the sticky nav get a second, fixed layer. The hero's `HeroPaper` wrapper is deleted, and the selectors that say "this is interactive" move out of the pen cursor into a shared module, so the cursor and the marks agree.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4. Run tools with `corepack pnpm`.

**Spec:** `docs/superpowers/specs/2026-10-24-paper-marks-everywhere-design.md`

**Repo rules that apply here (from `CLAUDE.md`):**
- **No test setup.** The checks are `corepack pnpm typecheck` and `corepack pnpm build`, plus the browser check in Task 4.
- **Committing.** Use `GIT_CONFIG_GLOBAL=/dev/null git -c user.name="Gabriel Joshua Paet" -c user.email="gjvpaet@gmail.com" commit ...`. Never add a Co-Authored-By trailer. Every git command needs `GIT_CONFIG_GLOBAL=/dev/null`.
- **z-index.** Use only the existing `--z-*` values (`lib/z.ts`).
- **Pen layer.** Everything in it is `print:hidden` and `aria-hidden`.
- **Comments.** Match the house style: short, plain-English comments that cite the spec section.

## File map

| File | Change | Responsibility |
|---|---|---|
| `lib/pointer-targets.ts` | Create | The `INTERACTIVE` and `NATIVE` selectors, shared by the pen cursor and the paper marks |
| `components/pen-cursor.tsx` | Modify lines 8-12 | Import the selectors instead of defining them |
| `components/paper-marks.tsx` | Create | The click listener, mark state and both mark layers |
| `app/layout.tsx` | Modify | Render `<PaperMarks />` beside `<PencilLayer />` |
| `components/home/hero.tsx` | Modify | Render the `<section>` itself; drop `HeroPaper` |
| `components/home/hero-paper.tsx` | Delete | Replaced by `PaperMarks` |
| `docs/v2/DESIGN-SPEC.md` | Modify | 5.2 "Ink marks" row, 7.1 caption note, a note on section 15 step 10 |

## Waves

- **Wave 1:** Task 1 and Task 3, in parallel. They share no files.
- **Wave 2:** Task 2. It needs Task 1.
- **Then:** Task 4, the browser check, run by the controller.

---

### Task 1: Share the pointer-target selectors

**Files:**
- Create: `lib/pointer-targets.ts`
- Modify: `components/pen-cursor.tsx:8-12`

**Depends on:** none

- [ ] **Step 1: Create `lib/pointer-targets.ts`**

```ts
// What a pointer can land on that is not plain paper. Shared by the pen
// cursor (spec 5.3), which changes shape over these, and the paper marks
// (spec 5.2), which never land on them.

/** Controls: links, buttons and their kin. */
export const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for]';

/** Things that keep the system cursor (it says something the dot cannot):
    fields, draggable stickers, disabled controls. */
export const NATIVE =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], .sticker-grab, :disabled, [aria-disabled="true"]';
```

- [ ] **Step 2: Use it in `components/pen-cursor.tsx`**

Replace lines 8-12, which are currently:

```ts
// What sits under the pointer decides the cursor's shape.
const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for]';
// Things that keep the system cursor (it says something the dot cannot):
// fields, draggable stickers, disabled controls.
const NATIVE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], .sticker-grab, :disabled, [aria-disabled="true"]';
```

with:

```ts
// What sits under the pointer decides the cursor's shape (lib/pointer-targets.ts).
```

Then add the import to the import block at the top. Keep the existing order: `@/lib/ink`, then `@/lib/pencil`, then `@/lib/pointer-targets`.

```ts
import { ink } from "@/lib/ink";
import { pencil } from "@/lib/pencil";
import { INTERACTIVE, NATIVE } from "@/lib/pointer-targets";
```

- [ ] **Step 3: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0 with no output. If it reports missing `app/(ide)` modules, delete `.next/dev` and run it again.

- [ ] **Step 4: Commit**

```bash
GIT_CONFIG_GLOBAL=/dev/null git add lib/pointer-targets.ts components/pen-cursor.tsx
GIT_CONFIG_GLOBAL=/dev/null git -c user.name="Gabriel Joshua Paet" -c user.email="gjvpaet@gmail.com" commit -m "refactor(cursor): share the pointer-target selectors"
```

---

### Task 2: PaperMarks across the whole site

**Files:**
- Create: `components/paper-marks.tsx`
- Modify: `app/layout.tsx` (import block, and the `<body>` around `<PencilLayer />`)
- Modify: `components/home/hero.tsx`
- Delete: `components/home/hero-paper.tsx`

**Depends on:** Task 1 (imports `lib/pointer-targets.ts`)

- [ ] **Step 1: Create `components/paper-marks.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { InkSvg } from "@/components/ink/ink-svg";
import { CLICK_MARKS } from "@/lib/ink";
import { pencil } from "@/lib/pencil";
import { INTERACTIVE, NATIVE } from "@/lib/pointer-targets";

type Mark = {
  id: number;
  x: number;
  y: number;
  name: (typeof CLICK_MARKS)[number];
  pen: boolean;
  rotate: number;
  /** Dropped on the sticky nav: drawn in the fixed layer, so it stays there. */
  onNav: boolean;
};

const MAX_MARKS = 6;
const MARK_LIFE_MS = 2600;
/** Half a mark's 52px box, to centre it on the pointer. */
const HALF = 26;
/** Never paper: controls, fields, stickers. */
const NOT_PAPER = `${INTERACTIVE}, ${NATIVE}, .sticker-drop`;
/** The site nav, the only <header> directly in <body>. */
const NAV = "body > header";

// The whole site as paper you can mark (spec 5.2). Clicking empty paper
// anywhere (not a control, field or sticker; not while the pencil is out,
// the splash is up, text is selected or the mobile menu is open) drops a
// hand-drawn star, check, scribble or burst that draws in and fades away.
// Marks sit on the page and scroll with it, like the pencil's doodles; one
// dropped on the sticky nav stays on the nav. A new page starts clean.
export function PaperMarks() {
  const pathname = usePathname();
  const [marks, setMarks] = useState<Mark[]>([]);
  const count = useRef(0);

  useEffect(() => {
    setMarks([]);
  }, [pathname]);

  useEffect(() => {
    // Was the mobile menu open when this click started? Then the click
    // closes it, or lands in it, and leaves no mark. Read at pointerdown, in
    // the capture phase, before the nav's own listener closes the menu.
    let menuWasOpen = false;
    const onPointerDown = () => {
      menuWasOpen = document.querySelector(`${NAV} [aria-expanded="true"]`) !== null;
    };

    const onClick = (e: MouseEvent) => {
      if (menuWasOpen || pencil.get()) return;
      // The splash: still writing, or lifting after a click skipped it.
      if (document.documentElement.classList.contains("splash-signing") || document.querySelector(".splash-sheet")) return;
      const target = e.target;
      if (!(target instanceof Element) || target.closest(NOT_PAPER)) return;
      // Selecting text (to copy from the résumé, say) is not a mark.
      if (window.getSelection()?.isCollapsed === false) return;

      const onNav = target.closest(NAV) !== null;
      const id = ++count.current;
      const mark: Mark = {
        id,
        x: (onNav ? e.clientX : e.pageX) - HALF,
        y: (onNav ? e.clientY : e.pageY) - HALF,
        name: CLICK_MARKS[id % CLICK_MARKS.length],
        pen: id % 2 === 1,
        rotate: ((id * 37) % 40) - 20,
        onNav,
      };
      setMarks((all) => [...all, mark].slice(-MAX_MARKS));
      setTimeout(() => setMarks((all) => all.filter((m) => m.id !== id)), MARK_LIFE_MS);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (marks.length === 0) return null;

  const draw = (m: Mark) => (
    <InkSvg
      key={m.id}
      name={m.name}
      tone={m.pen ? "pen" : "ink"}
      draw={false}
      className="ink-mark absolute size-13"
      style={{ left: m.x, top: m.y, rotate: `${m.rotate}deg` }}
    />
  );
  const onPage = marks.filter((m) => !m.onNav);
  const onNav = marks.filter((m) => m.onNav);

  return (
    <>
      {onPage.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-[var(--z-pencil)] w-full print:hidden">
          {onPage.map(draw)}
        </div>
      ) : null}
      {onNav.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[var(--z-mobile-menu)] print:hidden">
          {onNav.map(draw)}
        </div>
      ) : null}
    </>
  );
}
```

- [ ] **Step 2: Render it in `app/layout.tsx`**

Add the import between `InkFilters` and `PenCursor`, in alphabetical order:

```ts
import { InkFilters } from "@/components/ink/ink-filters";
import { PaperMarks } from "@/components/paper-marks";
import { PenCursor } from "@/components/pen-cursor";
import { PencilLayer } from "@/components/pencil-layer";
```

In `<body>`, render it just before `<PencilLayer />`:

```tsx
        <Footer />
        <PaperMarks />
        <PencilLayer />
        <PenCursor />
```

- [ ] **Step 3: Drop `HeroPaper` from `components/home/hero.tsx`**

1. Remove this import:

```ts
import { HeroPaper } from "@/components/home/hero-paper";
```

2. Replace the opening `<HeroPaper>` with:

```tsx
    <section id="hero" aria-labelledby="hero-name" className="relative pt-10 pb-20 md:pt-14 md:pb-28">
```

3. Replace the closing `</HeroPaper>` with `</section>`.

4. In the component comment above `export function Hero()`, replace its last line, `// after the text rises.`, with:

```ts
// after the text rises. Its paper takes click marks like every page's
// (components/paper-marks.tsx); the caption under the card is the hint.
```

- [ ] **Step 4: Delete `components/home/hero-paper.tsx`**

```bash
GIT_CONFIG_GLOBAL=/dev/null git rm components/home/hero-paper.tsx
```

- [ ] **Step 5: Confirm nothing still imports it**

Run: `grep -rn "hero-paper\|HeroPaper" app components lib`
Expected: no output.

- [ ] **Step 6: Typecheck and build**

Run: `corepack pnpm typecheck`
Expected: exits 0.

Run: `corepack pnpm build`
Expected: `✓ Compiled successfully`, and every route builds (`/`, `/resume`, `/projects/[slug]`, `/_not-found`). No type errors.

- [ ] **Step 7: Commit**

```bash
GIT_CONFIG_GLOBAL=/dev/null git add components/paper-marks.tsx app/layout.tsx components/home/hero.tsx
GIT_CONFIG_GLOBAL=/dev/null git -c user.name="Gabriel Joshua Paet" -c user.email="gjvpaet@gmail.com" commit -m "feat(marks): click marks on every page, not just the hero"
```

---

### Task 3: Spec updates

**Files:**
- Modify: `docs/v2/DESIGN-SPEC.md`: the 5.2 "Ink marks" row (around line 193), the 7.1 caption bullet (around line 367), and the section 15 step 10 entry (around line 534)

**Depends on:** none

- [ ] **Step 1: Rewrite the 5.2 "Ink marks" row**

Replace the whole row that begins `| **Ink marks** | Clicking empty paper in the hero` with:

```markdown
| **Ink marks** | Clicking empty paper anywhere on the site (every page, the nav and the footer) drops a hand-drawn mark at the pointer: a star, check, scribble or burst, in rotation, alternating `--pen` and `--ink`, rotated -20 to 20deg, 52px. No mark on a link, button, field, sticker or disabled control (the pen cursor's targets, `lib/pointer-targets.ts`), or while the pencil is out, the splash is up, text is selected, or the mobile menu is open (the click that closes it leaves none). Marks sit on the page and scroll with it; one dropped on the sticky nav stays on the nav. It draws in 0.35s, fades after 1.6s and is removed at 2.6s. At most 6 on screen; a new page starts clean. Reduced motion: it appears without drawing, then fades. Marks are `aria-hidden`. One component, `components/paper-marks.tsx`, in the root layout. |
```

- [ ] **Step 2: Note the hint in 7.1**

Replace the bullet:

```markdown
- Under the card, Hand caption "click the paper, it leaves a mark", right-aligned on phones and left-aligned from `md` (clear of the hand's arm).
```

with:

```markdown
- Under the card, Hand caption "click the paper, it leaves a mark", right-aligned on phones and left-aligned from `md` (clear of the hand's arm). It is the site's only hint: the marks work on every page (5.2).
```

- [ ] **Step 3: Note the replacement on section 15, step 10**

At the end of the step 10 entry (the paragraph that begins `10. [x] Easter eggs: ink marks, \`PencilLayer\``), after its last sentence, append:

```markdown
 (2026-10-24: the ink marks moved from the hero to the whole site; `components/paper-marks.tsx` in the root layout replaced `hero-paper.tsx`.)
```

Keep the rest of the entry as it is: it is the record.

- [ ] **Step 4: Check that no em dashes went in**

Run: `git diff docs/v2/DESIGN-SPEC.md | grep "^+" | grep -c "—"`
Expected: `0`

- [ ] **Step 5: Commit**

```bash
GIT_CONFIG_GLOBAL=/dev/null git add docs/v2/DESIGN-SPEC.md
GIT_CONFIG_GLOBAL=/dev/null git -c user.name="Gabriel Joshua Paet" -c user.email="gjvpaet@gmail.com" commit -m "docs(spec): ink marks on every page"
```

---

### Task 4: Browser check (controller)

**Files:** none

**Depends on:** Task 2, Task 3

Run this on a production build in the user's default browser, as crew-build says. Find the default browser first. Use Claude in Chrome if it is Chrome; otherwise ask the user.

- [ ] **Step 1: Production build.** `corepack pnpm build`, then start the `portfolio-prod` preview config (port 3300), or `corepack pnpm start -p 3300` from the feature worktree.
- [ ] **Step 2: Every page.** On `/` (skip the splash with a click), `/projects/<a slug>`, `/resume` and `/nope` (the 404):
  - A click on empty paper and on plain text leaves a mark that draws in and fades by 2.6s.
  - Links, buttons, a sticker and the sticker drag handle leave nothing.
- [ ] **Step 3: Footer.** A click below the nap illustration leaves a mark.
- [ ] **Step 4: Nav.** A click on the nav's empty paper leaves a mark that shows over the nav and stays on it while the page scrolls.
- [ ] **Step 5: Blocked.** No mark:
  - with the pencil out;
  - while the splash is up (fresh session on `/`);
  - after drag-selecting text on `/resume`;
  - from the click that closes the mobile menu at 375px;
  - from a click inside the open menu sheet.
- [ ] **Step 6: Limit.** Seven quick clicks leave at most 6 marks. Going to another page clears them.
- [ ] **Step 7: Phone width.** At 375px, a tap leaves a mark and the page doesn't scroll sideways after a mark near the right edge (`document.documentElement.scrollWidth === innerWidth`).
- [ ] **Step 8: Console.** No errors in the console.
