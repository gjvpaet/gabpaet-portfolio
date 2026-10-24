# Responsive pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the phone and tablet layouts the 2026-10-24 audit found: hero stickers wrapping, dead space after the hero, the stranded About lamp, orphaned words in margin notes, oversized napkins and phone screenshot, uneven button stacks, and the résumé's date rows and headline.

**Architecture:** Every fix is a Tailwind class or layout change inside the component that owns the problem; no new components, utilities, tokens or z-index values. From `lg` (1024px) up nothing changes. The spec is `docs/superpowers/specs/2026-10-24-responsive-pass-design.md`; `docs/v2/DESIGN-SPEC.md` is the site's design source of truth.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (no config file; breakpoints `sm` 640, `md` 768, `lg` 1024, `xl` 1280), `motion/react`.

---

## Ground rules for every task

- Package manager: `corepack pnpm` (pnpm is not on PATH). If `node_modules` is missing in your worktree, run `corepack pnpm install --frozen-lockfile` first.
- There is no lint or test setup. A task's checks are `corepack pnpm typecheck` and, where stated, a production build: `NODE_ENV=production corepack pnpm build` (the shell sets `NODE_ENV=development`, which breaks the build).
- Visual checking at each width is done by the controller after all tasks merge (Task 6). Implementers don't need a browser.
- Commit with plain `git`. **Never add a `Co-Authored-By:` line or any other attribution trailer** to a commit message.
- Match the surrounding code: short comments that say why, in the existing voice. Don't reformat lines you don't change.

## File map

| File | Task | Change |
|---|---|---|
| `components/sticker.tsx` | 1 | Sticker size fills its grid column below `md`; tape scales |
| `components/home/sticker-board.tsx` | 1 | One-line 6-column row below `md`; logo and keycap scale |
| `components/home/hero.tsx` | 2 | Less bottom padding below `lg`; buttons stack full-width below `sm` |
| `components/home/contact.tsx` | 2 | Buttons stack full-width below `sm` |
| `components/home/about.tsx` | 3 | Grid with bio, motto note and lamp placed per breakpoint |
| `components/margin-note.tsx` | 4 | `text-balance` on the note text |
| `components/home/projects.tsx` | 4 | Napkin capped at 520px below `lg` |
| `app/projects/[slug]/page.tsx` | 4 | Napkin capped at 520px below `lg`; phone screenshot 200px below `md` |
| `app/resume/page.tsx` | 5 | Buttons stack below `sm`; dates under titles below `sm`; headline breaks before the location |
| `docs/v2/DESIGN-SPEC.md` | 6 | 6.5, 6.6, 7.4 and step 18 updated |

## Waves

- **Wave 1 (parallel):** Tasks 1, 2, 3, 4 and 5. No two share a file.
- **Wave 2:** Task 6 (docs, then the controller's browser verification).

---

### Task 1: Hero stickers in one row on phones

**Files:**
- Modify: `components/sticker.tsx` (whole file, 15 lines)
- Modify: `components/home/sticker-board.tsx:38-41` (comment), `:57` (row), `:83-90` (logo and keycap)

**Depends on:** none

Today, below `md`, the six 60px stickers sit in a `flex flex-wrap gap-4` row and wrap 4 + 2 at 375px. They must stay on one line from 320px up. Each sticker fills a grid column capped at 60px (3.75rem), with 8px gaps, so it's about 40px at 320px, 49px at 375px and 58px at 430px. From `md` they are 80px stickers taped around the napkin card, exactly as today.

- [ ] **Step 1: Make the sticker fill its column below `md`**

Replace the whole of `components/sticker.tsx` with:

```tsx
import { Tape } from "@/components/ink/tape";
import { cn } from "@/lib/cn";

// Spec 6.6: a scrap of paper taped to the page, holding one hand-traced
// logo. Below md it fills its column in the hero's one-line row (60px at
// most); 80px from md.
export function stickerClasses(className?: string): string {
  return cn("paper relative grid aspect-square w-full place-items-center text-ink md:size-20", className);
}

/** The strip of tape across a sticker's top edge, 80% of its width. */
export function StickerTape() {
  return (
    <Tape
      className="-top-2 left-1/2 -ml-[40%] h-4 w-[80%] sm:-top-2.5 sm:h-5 md:-ml-7 md:w-14"
      style={{ rotate: "4deg" }}
    />
  );
}
```

`-ml-[40%]` with `w-[80%]` centres the tape. Percentage margins resolve against the containing block's width, which is the sticker. Use a margin rather than `translate`, because the tape's angle comes from the inline `rotate` style.

- [ ] **Step 2: Make the row a 6-column grid capped at 60px per column**

In `components/home/sticker-board.tsx`, replace:

```tsx
      <div className="flex flex-wrap gap-4 md:contents">
```

with:

```tsx
      <div className="grid grid-cols-[repeat(6,minmax(0,3.75rem))] gap-2 md:contents">
```

- [ ] **Step 3: Scale the logo and the keycap with the sticker**

In the same file, replace:

```tsx
              <BrandIcon
                icon={s.icon}
                decorative
                className="sticker-logo pointer-events-none size-7 md:size-9"
              />
            ) : (
              <span className="type-hand pointer-events-none text-2xl font-semibold md:text-[1.875rem]">&gt;_</span>
```

with:

```tsx
              <BrandIcon
                icon={s.icon}
                decorative
                className="sticker-logo pointer-events-none size-[46%] md:size-9"
              />
            ) : (
              <span className="type-hand pointer-events-none text-[clamp(1rem,5.5vw,1.5rem)] font-semibold md:text-[1.875rem]">
                &gt;_
              </span>
```

These sizes keep today's proportions: 46% of a 60px sticker is 28px, the current `size-7`, and the keycap reaches today's 24px (`text-2xl`) on wide phones.

- [ ] **Step 4: Update the component comment**

In the same file, replace:

```tsx
// Spec 5.2 + 6.6. From md the stickers sit around `children` (the napkin
// card), draggable with a mouse or trackpad and springing home on release.
// Below md they are a static row above the card. Touch screens and reduced
// motion get static stickers, so dragging never fights scrolling.
```

with:

```tsx
// Spec 5.2 + 6.6. From md the stickers sit around `children` (the napkin
// card), draggable with a mouse or trackpad and springing home on release.
// Below md they are a static one-line row above the card, each filling a
// column of at most 60px. Touch screens and reduced motion get static
// stickers, so dragging never fights scrolling.
```

- [ ] **Step 5: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0 with no output.

- [ ] **Step 6: Commit**

```bash
git add components/sticker.tsx components/home/sticker-board.tsx
git commit -m "fix(hero): stickers fit one row on phones"
```

---

### Task 2: Hero spacing, and full-width button stacks in the hero and Contact

**Files:**
- Modify: `components/home/hero.tsx:25` (section), `:56` (buttons), `:67` (right column)
- Modify: `components/home/contact.tsx:30` (button group)

**Depends on:** none

Below `sm` (640px), button groups wrap at natural widths and look uneven. They become a one-column `grid`. Grid items stretch to the column by default, so every button is full width with the same width as the others. From `sm`, `sm:flex sm:flex-wrap` restores today's row. Don't add width or padding classes to the buttons themselves: `buttonClasses` in `components/button.tsx` owns their size. (The spec's "each button is `w-full`" is met by the grid's default stretch.)

- [ ] **Step 1: Shrink the hero's bottom padding below `lg`**

In `components/home/hero.tsx`, replace:

```tsx
    <section id="hero" aria-labelledby="hero-name" className="relative pt-10 pb-20 md:pt-14 md:pb-28">
```

with:

```tsx
    <section id="hero" aria-labelledby="hero-name" className="relative pt-10 pb-12 md:pt-14 md:pb-16 lg:pb-28">
```

- [ ] **Step 2: Drop the right column's tablet bottom padding**

In the same file, replace:

```tsx
        <div className="mx-auto w-full max-w-[500px] md:pt-6 md:pb-10 lg:pt-12 lg:pb-0 lg:pr-10 xl:pr-0">
```

with:

```tsx
        <div className="mx-auto w-full max-w-[500px] md:pt-6 lg:pt-12 lg:pr-10 xl:pr-0">
```

- [ ] **Step 3: Stack the hero buttons full-width on phones**

In the same file, replace:

```tsx
          <div className="rise mt-8 flex flex-wrap gap-3.5" style={rise(4)}>
```

with:

```tsx
          {/* Full-width stack on phones, a row from sm. */}
          <div className="rise mt-8 grid gap-3.5 sm:flex sm:flex-wrap" style={rise(4)}>
```

- [ ] **Step 4: Stack the Contact buttons full-width on phones**

In `components/home/contact.tsx`, replace:

```tsx
          <div className="flex flex-wrap gap-3">
```

with:

```tsx
          {/* Full-width stack on phones, a row beside the address from sm. */}
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
```

`w-full` is needed because this group is a flex item in the row beside the email address. Without it the group would shrink to its widest button.

- [ ] **Step 5: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0 with no output.

- [ ] **Step 6: Commit**

```bash
git add components/home/hero.tsx components/home/contact.tsx
git commit -m "fix(home): tighter hero bottom, full-width button stacks on phones"
```

---

### Task 3: About lamp beside the motto note

**Files:**
- Modify: `components/home/about.tsx:17-48` (comment and JSX of `About`)

**Depends on:** none

Today the About grid has two children: a left `div` holding the bio and the motto note, and the lamp. Below `lg` the lamp lands alone in its own row, 200px wide and pushed right. The bio, the motto note and the lamp become three placed grid children:

- **`lg+`:** unchanged. Columns `minmax(0,1fr) | 300px`. The bio is in row 1 and the note in row 2 of the left column. The lamp is in the right column, spanning both rows, with `lg:pt-16`.
- **`sm` to `lg`:** columns `minmax(0,1fr) | 200px`. The bio spans both columns. In row 2 the note is left and the lamp right, both aligned to the row's bottom.
- **Below `sm`:** one column. The lamp is 170px wide and right-aligned, just under the note (`mt-2`), close but not covering it.

- [ ] **Step 1: Replace the `About` comment and JSX**

In `components/home/about.tsx`, replace everything from the comment line `// Spec 7.4: a lead paragraph with the pinned lavender motto note under it,` to the end of the file with:

```tsx
// Spec 7.4: a lead paragraph with the pinned lavender motto note under it,
// and the desk lamp (illustration #3). From lg the lamp has the right column
// beside the bio; from sm it shares the note's row; on phones it sits just
// under the note. Personal; never mentions the current employer.
export function About() {
  const { before, after, rest } = splitBio();

  return (
    <section id="about" aria-labelledby="about-h" className="py-16 md:py-24">
      <div className="grid items-start gap-x-12 sm:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-14">
        <Reveal className="sm:col-span-2 lg:col-span-1">
          <SectionHeading id="about-h">About</SectionHeading>
          <p className="mt-8 max-w-[36ch] text-[clamp(1.375rem,2.3vw,1.75rem)] leading-[1.45] tracking-[-0.01em]">
            {before}
            <Highlight>{profile.bioMark}</Highlight>
            {after}
          </p>
          <p className="mt-6 max-w-[60ch] text-ink-soft">{rest}</p>
        </Reveal>
        <Reveal index={1} as="aside" aria-label="Motto" className="mt-14 max-w-[360px] sm:ml-12 sm:self-end lg:self-start">
          <div className="relative rotate-[-2deg] rounded-paper bg-note px-6 pt-7 pb-6 text-on-note shadow-lift print:rotate-0">
            <Tape className="-top-3 left-1/2 h-6.5 w-20 -ml-10" style={{ rotate: "-4deg" }} />
            <p className="type-hand-lg">{profile.motto}</p>
            <p className="type-hand mt-3">my motto, for what it&apos;s worth</p>
          </div>
        </Reveal>
        <Reveal
          index={2}
          className="mt-2 w-[170px] justify-self-end sm:col-start-2 sm:row-start-2 sm:mt-0 sm:w-full sm:self-end lg:row-span-2 lg:row-start-1 lg:self-start lg:pt-16"
        >
          <Illustration name="lamp" className="w-full" />
        </Reveal>
      </div>
    </section>
  );
}
```

The bio's `Reveal` (index 0) and the note's `Reveal` (index 1) keep today's content, classes and stagger. Only their wrapper changed: the old left `div` is gone and they are grid children now. The DOM order is still bio, note, lamp, so the reading order doesn't change.

- [ ] **Step 2: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0 with no output.

- [ ] **Step 3: Commit**

```bash
git add components/home/about.tsx
git commit -m "fix(about): the lamp shares the motto note's row below lg"
```

---

### Task 4: Balanced margin notes, capped napkins and phone screenshot

**Files:**
- Modify: `components/margin-note.tsx:36-37`
- Modify: `components/home/projects.tsx:17` (napkin figure)
- Modify: `app/projects/[slug]/page.tsx:135` (napkin figure), `:165-166` (phone screenshot)

**Depends on:** none

- [ ] **Step 1: Balance the margin note's lines**

In `components/margin-note.tsx`, replace:

```tsx
      {/* Only the margin column is narrow; notes elsewhere stay on one line. */}
      <span className={arrow === "left" ? "max-w-[24ch]" : undefined}>{children}</span>
```

with:

```tsx
      {/* Only the margin column is narrow; notes elsewhere stay on one line.
          Balanced, so a wrapped note never leaves one word on its last line. */}
      <span className={cn("text-balance", arrow === "left" && "max-w-[24ch]")}>{children}</span>
```

`cn` is already imported in this file.

- [ ] **Step 2: Cap the home napkin below `lg`**

In `components/home/projects.tsx`, replace:

```tsx
      <Reveal as="figure">
        <PaperCard rotate={-1.8} tape="top" className="ink-boil px-5.5 pt-6 pb-4">
```

with:

```tsx
      {/* Capped below lg, where it would otherwise fill the column. */}
      <Reveal as="figure" className="max-w-[520px] lg:max-w-none">
        <PaperCard rotate={-1.8} tape="top" className="ink-boil px-5.5 pt-6 pb-4">
```

- [ ] **Step 3: Cap the case-study napkin below `lg`**

In `app/projects/[slug]/page.tsx`, replace:

```tsx
        <Reveal as="figure">
          <PaperCard rotate={-1.6} tape="top" className="ink-boil px-5.5 pt-6 pb-4">
```

with:

```tsx
        {/* Capped below lg, where it would otherwise fill the column. */}
        <Reveal as="figure" className="max-w-[520px] lg:max-w-none">
          <PaperCard rotate={-1.6} tape="top" className="ink-boil px-5.5 pt-6 pb-4">
```

- [ ] **Step 4: Cap the phone screenshot at 200px below `md`**

In the same file, replace:

```tsx
              sizes="(min-width: 768px) 250px, 260px"
              className="w-full max-w-[260px] md:max-w-none"
```

with:

```tsx
              sizes="(min-width: 768px) 250px, 200px"
              className="w-full max-w-[200px] md:max-w-none"
```

- [ ] **Step 5: Typecheck**

Run: `corepack pnpm typecheck`
Expected: exits 0 with no output.

- [ ] **Step 6: Commit**

```bash
git add components/margin-note.tsx components/home/projects.tsx "app/projects/[slug]/page.tsx"
git commit -m "fix(layout): balanced margin notes, smaller napkins and phone shot below lg"
```

---

### Task 5: Résumé buttons, date rows and headline

**Files:**
- Modify: `app/resume/page.tsx:49-51` (title rows), `:81-83` (headline), `:99` (buttons)

**Depends on:** none

`/resume` is also printed to `public/gabriel-paet-resume.pdf`. Every change here is screen-only below `sm`, and `print:` variants keep the printed layout as it is today, so the PDF is **not** regenerated. Don't touch `content/`.

- [ ] **Step 1: Dates under their titles below `sm`**

In `RoleEntry`, replace:

```tsx
          <ul className="mt-1 grid gap-0.5">
            {role.titles.map((t) => (
              <li key={t.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
```

with:

```tsx
          {/* Below sm the dates always sit under the title, so the rows line
              up; from sm (and on paper) they sit on the right. */}
          <ul className="mt-1 grid gap-0.5">
            {role.titles.map((t) => (
              <li
                key={t.title}
                className="grid sm:flex sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4 print:flex print:flex-wrap print:items-baseline print:justify-between print:gap-x-4"
              >
```

The `print:` classes repeat the `sm:` ones on purpose. They keep the printed layout, and so the PDF, the same at any paper width.

- [ ] **Step 2: Keep the location together in the headline**

Replace:

```tsx
        <p className="text-[1.25rem] font-semibold">
          {profile.role}, {profile.location}
        </p>
```

with:

```tsx
        <p className="text-[1.25rem] font-semibold">
          {profile.role}, <span className="whitespace-nowrap">{profile.location}</span>
        </p>
```

- [ ] **Step 3: Full-width button stack below `sm`**

Replace:

```tsx
        <div className="mt-2 flex flex-wrap gap-3.5 print:hidden">
```

with:

```tsx
        {/* Full-width stack on phones, a row from sm. */}
        <div className="mt-2 grid gap-3.5 sm:flex sm:flex-wrap print:hidden">
```

- [ ] **Step 4: Typecheck and build**

Run: `corepack pnpm typecheck`
Expected: exits 0 with no output.

Run: `NODE_ENV=production corepack pnpm build`
Expected: ends with the route table, including `○ /resume`, and no errors.

- [ ] **Step 5: Commit**

```bash
git add app/resume/page.tsx
git commit -m "fix(resume): phone layout for buttons, role dates and headline"
```

---

### Task 6: Design spec updates and verification

**Files:**
- Modify: `docs/v2/DESIGN-SPEC.md` (6.5 line 248; 6.6 lines 254 and 258; 7.4 line 401; 15 step 18 at line 542)

**Depends on:** 1, 2, 3, 4, 5 (merged)

- [ ] **Step 1: 6.5 Button, phone stacking**

After the line that starts `- Heights 52px (\`md\`) / 44px (\`sm\`), 44×44 (\`icon\`).`, add:

```markdown
- A group of buttons (hero, Contact, `/resume`) stacks below `sm` as full-width buttons, one per row; from `sm` it is a wrapping row at natural widths.
```

- [ ] **Step 2: 6.6 Sticker sizes on phones**

In the line that starts `- Paper scrap:`, replace `80px square (60px on phones)` with:

```markdown
80px square (on phones each fills a column of the one-line row, at most 60px)
```

Replace the line `- Phones: a static wrapping row under the hero buttons.` with:

```markdown
- Phones: a static one-line row of six under the hero buttons, a 6-column grid with 8px gaps (about 40px stickers at 320px, 49px at 375px).
```

- [ ] **Step 3: 7.4 Lamp placement**

Replace the line `- Right: illustration #3 (desk lamp over a notebook, rays in \`--pen\`), level with the bio from \`lg\`; on phones 200px wide, right-aligned under the note.` with:

```markdown
- Right: illustration #3 (desk lamp over a notebook, rays in `--pen`), level with the bio from `lg`. From `sm` to `lg` it shares the note's row (200px column on the right, bottoms aligned); on phones it is 170px wide, right-aligned just under the note.
```

- [ ] **Step 4: Dated note under step 18 (QA)**

At the end of the step 18 paragraph (the one that starts `18. [ ] QA on a production build:`), append on a new line, indented to stay part of the item:

```markdown
    Responsive pass on 2026-10-24 (`docs/superpowers/specs/2026-10-24-responsive-pass-design.md`). The audit found no sideways scroll at 320 to 1280px but awkward layouts below 1024px. Fixed:
    - the hero stickers now sit in one row on phones;
    - the hero's bottom space is shorter below `lg`;
    - the About lamp shares the motto note's row;
    - margin notes are balanced;
    - napkins are capped at 520px below `lg`;
    - the case-study phone shot is 200px on phones;
    - button groups stack full-width on phones;
    - résumé dates sit under their titles on phones, and the headline breaks before the location.
```

- [ ] **Step 5: Commit**

```bash
git add docs/v2/DESIGN-SPEC.md
git commit -m "docs(spec): responsive pass (6.5, 6.6, 7.4, QA note)"
```

- [ ] **Step 6: Controller verification (not an implementer step)**

The controller does this on the merged feature branch:

1. **Build and serve.**
   - Run `NODE_ENV=production corepack pnpm build`.
   - Serve it on port 3300 from the feature worktree, with a temporary launch config.
2. **Overflow scan.** Script `/`, both project pages, `/resume` and a 404 at 320, 375, 430, 768, 1024 and 1280px.
   - `scrollWidth === clientWidth` on every page and width.
   - No visible element past the viewport.
3. **Phones.** At 320 and 375px in the built-in pane, and at 393px in mobile Safari on the iOS Simulator, check the spec's phone list:
   - six stickers on one line;
   - full-width button stacks;
   - the lamp just under the note, not covering it;
   - no margin note with a lone last word;
   - a 200px phone shot;
   - résumé dates under their titles;
   - the headline breaking after "Developer,".
4. **Tablet (768px).**
   - The note and the lamp share a row.
   - The napkin is no wider than 520px.
   - The gap from the hero to About is about 160px.
   - The stickers sit around the card.
5. **Desktop.** At 1024 and 1280px, in Gabriel's Chrome, compare with today's `main`: no visible change.
6. **Print.** The `/resume` print preview still shows dates on the right and no buttons.
7. **Dark mode.** One pass at 375px with `data-theme="dark"`.
8. **Tuning.** If the lamp's `mt-2` covers or floats off the note, adjust it in `components/home/about.tsx`, re-check and commit.
