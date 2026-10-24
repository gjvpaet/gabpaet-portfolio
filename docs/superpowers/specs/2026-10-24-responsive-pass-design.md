# Responsive pass

Date: 2026-10-24. Status: approved design.

## Goal

Fix the layouts that look awkward on phones and tablets. An audit of the production build (every page at 320, 375, 414, 620, 768, 1024 and 1280px) found no sideways scroll anywhere, and nothing wrong from 1024px up. Every finding below is a composition problem under 1024px.

## Findings and fixes

### 1. Hero tech stickers wrap (`components/home/sticker-board.tsx`, `components/sticker.tsx`)

Today, below `md`, the six stickers are a `flex flex-wrap gap-4` row of 60px scraps. They wrap 4 + 2 at 375px and 5 + 1 at 430px.

- Below `md` the row is a 6-column grid with an 8px gap (`grid grid-cols-6 gap-2`).
- Each sticker fills its column, square, capped at 60px: about 40px at 320px, 49px at 375px and 58px at 430px.
- The logo, the `>_` keycap and the tape strip scale down with the sticker below `md`, so a 40px sticker still reads as a taped scrap with a logo on it.
- All six stay. From `md` nothing changes: 80px stickers taped around the napkin card, draggable with a fine pointer.

### 2. Dead space after the hero (`components/home/hero.tsx`)

Below `lg` there is about 140px (phones) to 300px (tablets) of empty paper between the hint note and About.

- The section's bottom padding becomes `pb-12 md:pb-16 lg:pb-28` (from `pb-20 md:pb-28`).
- The right column drops `md:pb-10`; it already has `lg:pb-0`.
- `lg+` is unchanged.

### 3. About lamp stranded (`components/home/about.tsx`)

Below `lg` the lamp is a 200px drawing pushed right, alone in its own row, with empty bands above and below it.

The About grid gets three placed children: the bio block, the motto note, and the lamp.

- **`lg+`:** unchanged. Columns `minmax(0,1fr) | 300px`. The bio and the motto note are in the left column; the lamp sits in the right column, spanning both rows, with `lg:pt-16`.
- **`sm` to `lg`:** columns `minmax(0,1fr) | 200px`. The bio spans both columns. The motto note (still max 360px, indented 48px) is bottom-left; the lamp fills the 200px column bottom-right, aligned to the note's bottom.
- **Below `sm`:** one column. The lamp sits under the note, about 170px wide and right-aligned, pulled up with a negative top margin so it tucks under the note's corner without covering it. The gap to "Where I've built things" shrinks with it.
- The motto note keeps its `sm:ml-12` indent, -2deg rotation, tape and `Reveal` stagger. The lamp keeps its `Reveal`.

### 4. Margin notes orphan a word (`components/margin-note.tsx`)

Notes such as "Programmer to Senior in 8 / months", "6 years, 8 / months" and "open to a / chat" leave one word on the last line on phones.

- The note's text `span` gets `text-balance` (`text-wrap: balance`).
- The arrow and layout are unchanged.

### 5. Projects napkin too big on tablets (`components/home/projects.tsx`, `app/projects/[slug]/page.tsx`)

Below `lg` the napkin card stretches to the full column, about 700px at 768px, and its handwriting comes out much larger than anything else on the page.

- On both pages the napkin `figure` gets `max-w-[520px] lg:max-w-none`.
- It stays left-aligned, with its "the napkin" caption under it.

### 6. Button groups stack unevenly (`components/home/hero.tsx`, `components/home/contact.tsx`, `app/resume/page.tsx`)

Below `sm`, buttons wrap at their natural widths:

- Hero: Résumé (148px) over See projects (184px).
- Contact: Copy email alone, then LinkedIn and GitHub.
- Résumé page: Download PDF over Print (they miss fitting side by side by about 1px).

The fix:

- Below `sm` each group is `grid` and each button is `w-full`, so every button in a group is the full column width, one per row.
- From `sm` the groups go back to their current `flex flex-wrap` with natural widths (`sm:flex sm:w-auto`).
- `CopyEmailButton` already takes a `className`, which it passes to `buttonClasses`.
- Contact's button group sits in a flex row beside the email address, so it also needs `w-full sm:w-auto` to take the full row on phones.
- Button heights, padding and labels are unchanged; `buttonClasses` keeps owning them.

### 7. Case-study phone screenshot fills the screen (`app/projects/[slug]/page.tsx`)

Below `md` the portrait phone screenshot is 260px wide and about 800px tall: a whole phone screen of one image.

- It is capped at 200px below `md` (`max-w-[200px] md:max-w-none`).
- Its `sizes` attribute becomes `(min-width: 768px) 250px, 200px`.
- The "and in your pocket" caption is unchanged.

### 8. Résumé role dates change alignment (`app/resume/page.tsx`, `RoleEntry`)

The title row is `flex flex-wrap justify-between`. When the title and date don't fit on one line, the date wraps under the title and is left-aligned; when they do fit, the date is on the right. At 375px, ahaStudio's two titles show both behaviours one above the other.

- Below `sm` the row is `grid`: date always under the title.
- From `sm` it's the current `flex flex-wrap items-baseline justify-between`.
- `print:flex` keeps the printed layout, and so the PDF, exactly as it is today.

### 9. Résumé headline breaks inside the location (`app/resume/page.tsx`)

"Software Developer, Metro Manila, / Philippines" breaks inside the place name.

- `profile.location` is wrapped in a `whitespace-nowrap` span, so a narrow screen breaks the line after the comma: "Software Developer, / Metro Manila, Philippines".
- The text is unchanged.

### 10. Docs (`docs/v2/DESIGN-SPEC.md`)

- **6.5 Button.** Below `sm`, a group of buttons stacks as full-width buttons.
- **6.6 Sticker.**
  - Replace "60px on phones" with: on phones a one-line 6-column row, each sticker filling its column up to 60px.
  - Replace "Phones: a static wrapping row" with "a static one-line row".
- **7.4 About.** Replace "on phones 200px wide, right-aligned under the note" with the `sm`-to-`lg` and phone placements in section 3.
- **15, step 18 (QA).** Add a dated note that this pass ran: what was checked, at which widths.

## Left alone

- **The back-to-top button** covers the end of body-text lines on phones. That is normal for a floating button.
- **The footer's "v1 of this site"** link wraps onto its own line at 375px. It's a links row, so a wrap reads fine.
- **Pages at 1024px and up** are unchanged.

## Constraints

- No content changes, so neither `content/profile.ts` nor `content/projects.ts` is touched. The printed résumé layout doesn't change either, so the PDF is not regenerated. Its print preview is checked to confirm.
- No new z-index values, shadows, colors or SVG paths.
- Illustrations stay optional: every layout works without them.
- Reduced motion, drag and the pen cursor behave as they do today.

## Testing

Production build (`NODE_ENV=production corepack pnpm build`, `portfolio-prod` on port 3300).

1. **Checks.** `corepack pnpm typecheck` and the build pass. The repo has no lint or test setup.
2. **Sideways overflow.** A scripted scan of `/`, both project pages, `/resume` and a 404 at 320, 375, 430, 768, 1024 and 1280px finds no element past the viewport and `scrollWidth === clientWidth`.
3. **Phones**, in the built-in pane's emulation at 320 and 375px and in mobile Safari on the iOS Simulator (iPhone 16 Pro, 393px):
   - The six stickers sit in one row.
   - Every button group is a full-width stack.
   - The lamp tucks under the motto note.
   - No margin note leaves a lone word.
   - The phone screenshot is 200px wide.
   - Résumé dates sit under their titles.
   - The headline breaks after "Developer,".
4. **Tablet (768px).**
   - The motto note and the lamp share a row.
   - The napkin is no wider than 520px.
   - The gap between the hero and About is about 160px.
   - The stickers are around the card as today.
5. **Desktop (1024 and 1280px)**, in Gabriel's Chrome: unchanged from today (hero, About, Projects, Contact, résumé).
6. **Print.** `/resume` print preview matches today's: role dates on the right, no buttons.
7. **Dark mode.** One pass at 375px with `data-theme="dark"`.
