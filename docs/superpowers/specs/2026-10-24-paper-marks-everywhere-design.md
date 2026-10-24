# Paper marks everywhere

Date: 2026-10-24. Status: approved design.

## Goal

The hero's ink-marks easter egg (spec 5.2, "Ink marks") works on every page of the site: the home sections, project pages, the résumé, the 404, the nav and the footer. Clicking empty paper anywhere drops a hand-drawn mark.

## Today

`components/home/hero-paper.tsx` (`HeroPaper`) wraps the hero `<section>` and handles its `onClick`:

- The click must not land on a link, a button or a sticker, and the pencil must not be out.
- It drops a mark from `CLICK_MARKS` (`lib/ink.ts`): star, check, scribble or burst, in rotation.
- Marks alternate between `--pen` and `--ink`, are rotated -20 to 20deg, and are 52px (`size-13`).
- At most 6 are on screen. Each is removed after 2.6s.
- The animation is the `.ink-mark` CSS (`app/globals.css`, easter-egg block).

## Design

### Components

- **`components/paper-marks.tsx` (new, client).**
  - Rendered once in `app/layout.tsx`, beside `PencilLayer`.
  - Listens for `click` on `document`.
  - Holds the mark state and rendering moved from `HeroPaper`. Constants, rotation, tones, sizes and lifetimes are unchanged.
  - Clears all marks when the pathname changes.
- **`components/home/hero.tsx`.** Renders `<section id="hero" aria-labelledby="hero-name" className="relative pt-10 pb-20 md:pt-14 md:pb-28">` itself.
- **`components/home/hero-paper.tsx`.** Deleted.
- **Hint note.** "click the paper, it leaves a mark" stays in the hero only, unchanged.
- **`.ink-mark` CSS.** Unchanged.

### Which clicks leave a mark

A click leaves no mark when any of these is true:

- **The target is interactive or native**, matched with `closest()`:
  - Interactive: `a[href]`, `button`, `[role="button"]`, `summary`, `label[for]`.
  - Native: `input`, `textarea`, `select`, `[contenteditable=""]`, `[contenteditable="true"]`, `.sticker-grab`, `:disabled`, `[aria-disabled="true"]`.
  - Also `.sticker-drop`.
  - These are the pen cursor's `INTERACTIVE` and `NATIVE` lists. Share them from one place instead of copying them.
- **The pencil is out** (`pencil.get()`).
- **The splash is up**: `<html>` has `splash-signing`, or a `.splash-sheet` is still in the document.
- **Text is selected**: `getSelection()` is not collapsed. A drag-select on the résumé leaves no mark.
- **The mobile menu is involved.** Either the menu was open when the click's `pointerdown` happened (that click closes it), or the click lands inside the open menu sheet. Detect this from the menu button's `aria-expanded="true"` at `pointerdown`.

Only primary clicks reach `click`. A tap on touch devices fires `click` too, as the hero does today.

### Where marks sit

- **Page marks.**
  - Positioned in document coordinates: `pageX - 26`, `pageY - 26`.
  - They go in an `aria-hidden`, `pointer-events: none` layer, `absolute top-0 left-0 w-full`.
  - The layer is at `z-[var(--z-pencil)]` (`lib/z.ts`): above the page content, below the nav (40), the mobile menu (50) and the splash (70). No new z values.
  - The marks scroll with the paper, as the pencil's doodles do.
- **Nav marks.**
  - A click inside the sticky nav (`header` that contains the "gp" link) puts its mark in a second, `position: fixed` layer at viewport coordinates (`clientX - 26`, `clientY - 26`).
  - That layer is at `z-[var(--z-mobile-menu)]`, so the mark shows over the nav and stays on it while the page scrolls.
- **Both layers** are `print:hidden`. They render nothing when there are no marks.

### Reduced motion

Unchanged. A mark appears without drawing, then fades (existing CSS).

### Docs

- **`docs/v2/DESIGN-SPEC.md`.**
  - 5.2 "Ink marks" row: clicking empty paper **anywhere on the site**. List the exclusions above (pencil, splash, selected text, mobile-menu clicks, interactive and native targets). Nav marks stay on the nav.
  - 7.1: the hero keeps the only hint note.
- **Spec 15, step 10:** add a note that `components/paper-marks.tsx` replaced `hero-paper.tsx`. Leave the original entry as it is: it is the record.
- **`CLAUDE.md`:** no change. It does not name `HeroPaper`.

## Testing

Production build on port 3300, checked in the user's default browser.

1. **On each page** (`/`, a project page, `/resume`, a 404):
   - A click on empty paper and on plain text leaves a mark that draws in and fades.
   - Links, buttons, stickers and the sticker drag handle do not.
2. **Footer**, below the nap illustration: a click leaves a mark.
3. **Nav**: a click on its empty paper leaves a mark. Scrolling keeps that mark on the nav.
4. **Blocked**: no mark with the pencil out, while the splash is up, after drag-selecting text, or on the click that closes the mobile menu.
5. **Limit**: more than 6 quick clicks keep at most 6 marks. Changing page clears the marks.
6. **Phone width**: a tap leaves a mark.
7. **Checks**: `corepack pnpm typecheck` and `corepack pnpm build` pass. The repo has no lint or test setup.

## Out of scope

- No new mark shapes, sounds or hint notes.
- No marks on the résumé PDF.
