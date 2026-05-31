---
name: gabpaet.dev
description: Personal portfolio for a senior programmer, presented as a VS-Code-style IDE you can read like the source.
colors:
  bg: "#0d1b2a"
  side: "#0b1624"
  panel: "#11243a"
  hover: "rgba(255,255,255,0.04)"
  border: "rgba(255,255,255,0.07)"
  border-2: "rgba(255,255,255,0.12)"
  accent-mint: "#2ee5b4"
  accent-mint-ink: "#04211a"
  accent-coral: "#f97070"
  accent-coral-ink: "#2a0606"
  accent-periwinkle: "#7a9cff"
  accent-periwinkle-ink: "#08122b"
  accent-amber: "#f2c14e"
  accent-amber-ink: "#2a1d00"
  accent-violet: "#c084fc"
  accent-violet-ink: "#1c0a30"
  fg: "#dbe4f0"
  fg-bright: "#ffffff"
  fg-dim: "#7b8aa3"
  fg-dim-2: "#4d5e7a"
  filament-amber: "#f2c14e"
  lumora-ember: "#ef8a5b"
  daylight-cyan: "#6db4e0"
  syntax-keyword: "#ff7eb6"
  syntax-number: "#b5e853"
  paper-bg: "#f7f6f1"
  paper-side: "#ecebe4"
  paper-panel: "#ffffff"
  paper-fg: "#1f2937"
  paper-fg-bright: "#0a0e1a"
  paper-fg-dim: "#5b6a83"
typography:
  display:
    fontFamily: "JetBrains Mono, ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "JetBrains Mono, ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  title:
    fontFamily: "JetBrains Mono, ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "normal"
  body:
    fontFamily: "JetBrains Mono, ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  xs: "3px"
  sm: "5px"
  md: "8px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "22px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-mint}"
    textColor: "{colors.accent-mint-ink}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.fg-bright}"
    textColor: "{colors.accent-mint-ink}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.accent-mint}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.fg-dim}"
    rounded: "{rounded.xs}"
    padding: "0 7px"
    typography: "{typography.label}"
  status-pill:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "4px 12px 4px 10px"
    typography: "{typography.label}"
  code-block:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    typography: "{typography.body}"
  callout-quote:
    backgroundColor: "transparent"
    textColor: "{colors.fg-dim}"
    padding: "4px 0 4px 14px"
    typography: "{typography.body}"
---

# Design System: gabpaet.dev

## 1. Overview

**Creative North Star: "The Source-as-Self Bio"**

This portfolio is not styled like an IDE; it IS one. Every page is a file. The sidebar holds the file tree, tabs sit above the open document, the gutter counts lines, the status bar speaks `UTF-8 / LF / Spaces: 2`, and ⌘K opens a fuzzy file palette. The bio renders itself: `package.json` describes the person, `.zshrc` shows how he actually works, and `projects/gabpaet-dev/page.tsx` prints its own source onto its own page. The meta-joke and the substance are the same artifact; the visitor reads the portfolio the way they'd read the codebase that produced it. Atmosphere: late-night editor, monospace everywhere, lowercase declarations, no marketing veneer. Confidence is quiet; restraint is the voice.

What this system explicitly rejects: the generic dev-template aesthetic (Vercel-lite hero, gradient mesh, "I build fast websites" hero card grid), the job-board CV (LinkedIn-export pill chips, corporate-blue headings, results-driven prose), maximalist showoff (marquee, neon, agency chaos), and editorial-magazine aesthetics (display serif italic + small mono kicker + ruled separators — wrong register entirely). This is not a marketing page wearing an IDE costume. It is an IDE that happens to also be the bio.

**Key Characteristics:**
- **Single typeface, single posture.** JetBrains Mono across the entire surface. No display/body pairing. No serif anywhere. Hierarchy comes from weight and size, never family contrast.
- **Quietly layered, never lifted.** Three navy planes (sidebar deepest, body, code-block panel) carry depth tonally. Real `box-shadow` appears only on overlays (⌘K palette, mobile drawer): the editor metaphor is the budget.
- **Mint is signal, not decoration.** The phosphor-mint accent marks live state: the active tab, the status bar, link color, an `H2` keyword. Default coverage is well under 10% of the surface. Five accent swatches ship; the user picks.
- **Density is identity.** Compact/cozy/spacious aren't a personalization gimmick; they're how a real editor user adjusts their environment. Tokens (`--doc-fs`, `--doc-lh`, `--doc-pad-y`, etc.) drive everything.
- **Dual themes, dual contrast.** Dark is the default scene (late-night editor). Light is a real paper-mode rebuild — accents swap to darker `lightC` companions, syntax tokens darken — not a cosmetic invert.
- **Border-radius ceiling: 8px.** Chips 3, buttons 5, palette 8. Soft marketing-page rounding is off-brand by definition.

## 2. Colors: The Late-Night Editor Palette

The palette is one editor at 2 AM. Three navy planes carry the surface; a single phosphor-mint runs through it as the live wire. File-type accents (amber, ember, cyan, magenta keyword, lime number) light up only where syntax demands them.

### Primary

- **Phosphor Mint** (`#2ee5b4`, `oklch(85% 0.15 165)`): the brand accent. Tab top-line, active sidebar stripe, status bar background, link color, `H2` keyword, `.em` emphasis, status-pill pulse glow. Default coverage ≤10% of any screen.
- **Deep Phosphor Ink** (`#04211a`): the only legal text color on `accent-mint` surfaces (status bar text, primary button label). Pair-locked; do not substitute white.

### Secondary (file-type accents)

A small named family that maps to file glyphs and syntax roles. Not interchangeable: each color has one job.

- **Filament Amber** (`#f2c14e`): JSON file glyph, syntax function names (`.tk-fn`).
- **Lumora Ember** (`#ef8a5b`): Rust file glyph, the `currently @ Lumora` pulse dot, syntax strings (`.tk-str`).
- **Daylight Cyan** (`#6db4e0`): Markdown / TypeScript file glyph, syntax types (`.tk-typ`, `.tk-cls`).
- **Hot Magenta Keyword** (`#ff7eb6`): syntax keywords only (`.tk-kw`). Never used as a UI color.
- **Phosphor Lime** (`#b5e853`): syntax numeric literals only (`.tk-num`). Never used as a UI color.

### Tertiary (user-selectable accent swatches)

The Tweaks panel exposes five accent swatches. Mint is the default; the others are real alternates that re-skin live state. Each ships a darker `lightC` companion for paper mode.

- **Phosphor Mint** — `#2ee5b4` / `lightC` `#0f9d77` · ink `#04211a` / `#ffffff`
- **Console Coral** — `#f97070` / `#dc2626` · ink `#2a0606` / `#ffffff`
- **Periwinkle Standby** — `#7a9cff` / `#3b5bdb` · ink `#08122b` / `#ffffff`
- **Filament Amber** — `#f2c14e` / `#b45309` · ink `#2a1d00` / `#ffffff`
- **Lavender CRT** — `#c084fc` / `#8b5cf6` · ink `#1c0a30` / `#ffffff`

### Neutral

The dark scene is three navy planes stacked. Read them as ground floor, basement, and back-lit panel.

- **Late-Night Editor Navy** (`#0d1b2a`): `--bg`. The editor body, where docs render. The dominant plane.
- **3 AM Sidebar** (`#0b1624`): `--side`. Sidebar, title bar, tabs strip. Sits *below* the editor body tonally — the room is darker than the page.
- **Code-Block Glow Navy** (`#11243a`): `--panel`. Code blocks and the tweaks panel. Sits *above* the editor body — slightly bluer, slightly lit.
- **Editor Body** (`#dbe4f0`): `--fg`. The primary reading color on dark. Tuned for 1.85 line-height; do not darken without raising line-height.
- **Headline White** (`#ffffff`): `--fg-bright`. Reserved for `H1`, active sidebar item, work-row titles. Sparingly.
- **Comment Cool** (`#7b8aa3`): `--fg-dim`. Secondary text, breadcrumb, sub-headings, annotations. The `// the basics` voice.
- **Gutter Slate** (`#4d5e7a`): `--fg-dim-2`. Tertiary. Inactive line numbers in the gutter. The lowest legible step.
- **Hairline** (`rgba(255,255,255,0.07)`): `--border`. Dashed dividers between work rows; 1px lines under contact rows.
- **Stronger Hairline** (`rgba(255,255,255,0.12)`): `--border-2`. Chip outlines, tweaks-panel border, ghost-button border.
- **Hover Veil** (`rgba(255,255,255,0.04)`): `--hover`. The barely-there sidebar row hover.

### Paper Mode (light theme)

Not a cosmetic invert. Selected accents swap to their darker `lightC` companions, syntax tokens darken (`#be185d`, `#b45309`, `#b91c1c`, `#166534`, `#0369a1`), file-glyph fills flip to white where contrast would collapse.

- **Paper Bone** (`#f7f6f1`): `--bg`. Body in paper mode.
- **Cardstock** (`#ecebe4`): `--side`. Sidebar in paper mode.
- **Ink White** (`#ffffff`): `--panel`.
- **Paper Ink** (`#1f2937`): `--fg`.

### Named Rules

**The One Wire Rule.** The active accent (mint by default) is the live wire. It runs through the status bar, the active tab, the active sidebar row, links, `H2`, `.em`. It does not appear as a *decorative* surface anywhere — no accent-tinted cards, no accent borders on neutral chips. If it touches the screen, it means *this is alive*.

**The Three-Plane Rule.** The dark scene is exactly three navy planes: `--side` (deepest), `--bg` (middle), `--panel` (lightest, with a hint more blue). Adding a fourth plane is design drift. Use the existing three or a hairline border; do not introduce a new tinted neutral.

**The File-Glyph Rule.** Filament Amber, Lumora Ember, Daylight Cyan, Hot Magenta, and Phosphor Lime each map to one job (JSON file, Rust file + ember pulse, Markdown/TS file, syntax keyword, syntax number). Repurposing them as decorative UI colors breaks the IDE metaphor. Use accent variants for that.

## 3. Typography

**Display Font:** JetBrains Mono (variable, 400 / 500 / 600 / 700)
**Body Font:** JetBrains Mono
**Label / Mono Font:** JetBrains Mono

**Character:** One typeface, four weights, ruthless restraint. The portfolio is monospace from `H1` to gutter line numbers because the brand IS technical and the IDE IS the metaphor. Pairing JetBrains Mono with a serif display or a humanist sans would break costume.

### Hierarchy

- **Display** (`H1`, 700, 30px, line-height 1.15, letter-spacing `-0.5px`): the file's title line, prefixed with a mint `#`. One per file. On mobile, drops to 22px (≤640px) then 20px (≤420px).
- **Headline** (`H2`, 600, 14px, accent color, with dim `##` prefix and a faint right-side gradient rule): section anchors. Always carries an optional `// annotation` aligned right. Hierarchy is intentionally small; the section count, not the heading scale, carries weight.
- **Title** (work-row title, file-list active item: 500, 13px, `--fg-bright`): the bright bone above secondary copy.
- **Body** (`.doc p`, 400, density-driven 12 / 14 / 15.5px, line-height density-driven 1.55 / 1.85 / 2.1): the primary reading text. Max line length: 65–75ch, enforced via `max-width: 760px` on `<p>` and `max-width: 720–800px` on grids.
- **Label** (chips, status bar segments, breadcrumb, status pill: 400, 11–12.5px, `--fg-dim`): small, lowercase, declarative. Sentence case or pure lowercase, never SHOUTED.
- **Annotation** (`H2 .annot`, the `// the basics` voice: 400, 12px, `--fg-dim`): an inline editorial aside. Reads as a comment in the source.

### Named Rules

**The One Family Rule.** JetBrains Mono everywhere. Display, body, label, and code share the same family. No serif, no humanist sans, no `Inter`, no `Fraunces`. The reflex to pair fonts does not apply to a brand whose entire identity is monospace.

**The Lowercase Voice Rule.** Body copy, sub-headings, annotations, status-bar segments, and labels run lowercase. Title case appears only on proper nouns ("Gabriel Joshua Paet", "Lumora Capital", "Hewlett Packard Enterprise") and the literal `H1` name. ALL CAPS is never used. Sentence cadence is `commit-message`: terse, declarative, no marketing-buzzword family ("streamline", "empower", "leverage", "transform").

**The Tracked-Eyebrow Ban.** The 2023-era small-uppercase-letterspaced-eyebrow above every section is explicitly forbidden. Sections are introduced by their `H2 ## name` only. The only tracked-uppercase exception is the mobile-collapsed key-label inside the grid block (`.grid .k` at ≤640px), where the constraint is layout, not voice.

**The Annotation Rule.** Each `H2` may carry one `// inline annotation` aligned to the right. The annotation is a comment in the source; it is not an eyebrow, not a tagline, not a CTA. Maximum five words.

## 4. Elevation

This is a quietly layered system, not a flat one. Depth is carried tonally by three stacked navy planes (`--side` below, `--bg` middle, `--panel` above with a hair more blue) and reinforced by 1px hairlines and dashed dividers. Real `box-shadow` is reserved for overlays the editor metaphor actually has: the ⌘K palette modal and the mobile sidebar drawer. Outside those two surfaces, shadow is forbidden.

### Shadow Vocabulary

- **Overlay Modal** (`box-shadow: 0 24px 70px rgba(0,0,0,0.5)`): the ⌘K command palette. Tells the eye the surface is floating above the editor scene; pairs with a blurred `rgba(7,13,21,0.55)` backdrop.
- **Drawer Slide** (`box-shadow: 4px 0 24px rgba(0,0,0,0.4)`): the mobile sidebar drawer at ≤900px. Casts onto the editor body when slid open.
- **Phosphor Glow** (`box-shadow: 0 0 6px var(--accent)`): the pulsing status-pill dot and the `currently @ lumora` sidebar pulse. Not a depth shadow — a *light source*. Always paired with the `pulse` keyframe and the accent ink it glows from.

### Named Rules

**The Editor-Has-It Rule.** Box shadows exist only where a real editor has them: floating palettes / autocomplete popovers / sliding drawers. Cards, buttons, chips, code blocks, status pills, and quotes never carry a shadow. The list of legal shadows above is exhaustive.

**The Tonal-Plane Rule.** Depth between `--side` / `--bg` / `--panel` is achieved by hue and lightness alone, not by shadow. If a new surface needs to register as "above the page", it gets `--panel`'s value or a `--border-2` hairline. Not a new shadow.

## 5. Components

Component philosophy: **quiet, restrained, senior-IC**. Subtle hover transitions, dim secondary text, accent appearing sparingly. The components hold back so the content does the talking. Small radii, 1px borders, hairline dividers, no decorative shadows, no gradients.

### Buttons (`.qa`)

The portfolio uses one button shape with two variants. Both live in the `.qa-row` in `about.md` and `contact.md` and nowhere else.

- **Shape:** Gently sharp (`border-radius: 5px`). 1px border in `--border-2` for the ghost variant; mint fill for primary. Inline SVG icon (13×13) sits left of the label with `gap: 7px`. Padding `7px 14px`. Font: label (11.5px monospace).
- **Primary** (`.qa.primary`): mint background (`--accent`), deep-phosphor-ink label (`--accent-ink`). One per row. Used for the dominant action ("say hello").
- **Hover:** primary flips to `--fg-bright` background with the same ink. Ghost flips to mint border + mint label. Transition: `all .15s`. No transform, no shadow.
- **Focus:** must be a 2px mint outline at 1px offset (currently relies on default outline; tighten in next polish pass).

### Stack Chips (`.stack-chip`)

The chip is *not* a pill — it is a tag with sharp corners.

- **Style:** `border: 1px solid var(--border-2)`, transparent background, `--fg-dim` text, `border-radius: 3px`, `padding: 0 7px`, `font-size: 11px`, `line-height: 1.7`. Right-aligned, wrap-friendly (`flex-wrap: wrap`, `max-width: 220px`).
- **State:** non-interactive. Stack chips list technologies on work rows; they do not become filters or actions. Don't add hover state.

### Status Pill (`.status-pill`)

A signature component. Inline-flex pill with a leading pulse dot and a label.

- **Style:** `border: 1px solid var(--border-2)`, transparent background, `border-radius: 999px`, `padding: 4px 12px 4px 10px`, `font-size: 11.5px`. The pulse dot is `7×7` with `box-shadow: 0 0 6px <color>` and a 2s `pulse` keyframe (opacity 1 → 0.3 → 1).
- **Variant:** the `currently @ Lumora Capital · not actively looking` pill on `about.md` uses Lumora Ember (`--orange`) for the dot, deliberately *not* the accent — it announces a foreign company in the brand's own colors.

### Callout Quote (`.doc .quote`)

The markdown `> blockquote` rendered as a single 2px accent stripe on the left edge.

- **Style:** `border-left: 2px solid var(--accent)`, `padding: 4px 0 4px 14px`, `--fg-dim` text, `max-width: 720px`. Emphasis (`.em` inside) flips to `--fg-bright`.
- **Identity exception:** the global rule "no side-stripe borders >1px" doesn't apply here. The stripe is the markdown `>` glyph rendered visually; removing it would erase the convention. The sidebar active row earns the same exception (2px mint left border) for the same reason: that IS what an IDE active-state looks like. Outside these two surfaces, side-stripes are banned.

### Code Block (`.doc .cb`)

- **Style:** `--panel` background, 1px `--border`, `border-radius: 5px`, `padding: 12px 16px`, `font-size: 12.5px`, `line-height: 1.8`, `white-space: pre-wrap`, `max-width: 760px`. No language label, no copy button, no chrome. The block IS the language label, via its `.tk-*` syntax tokens.

### Syntax Tokens (`.tk-*`)

Nine tokens. Read from CSS variables, never hardcode. Light theme re-points them to darker hues automatically.

- `.tk-kw` Hot Magenta (`#ff7eb6` / paper `#be185d`) — keywords (`pub`, `fn`, `import`, `const`).
- `.tk-fn` Filament Amber — function names.
- `.tk-str` Lumora Ember — string literals.
- `.tk-num` Phosphor Lime (`#b5e853` / paper `#166534`) — numeric literals.
- `.tk-cmt` Comment Cool, italic — comments.
- `.tk-typ` / `.tk-cls` Daylight Cyan — types.
- `.tk-pun` Comment Cool — punctuation.
- `.tk-var` Editor Body — variable names.
- `.tk-tag` Phosphor Mint — JSX tag names (the only syntax token that follows the active accent).

### Sidebar File Row (signature)

The active-state of a sidebar item is the brand's most concentrated statement.

- **Default:** transparent background, `--fg-dim` text, file-glyph icon (14×14 colored badge: M↓ Daylight Cyan for markdown, `Rs` Lumora Ember for Rust, `Ts` Daylight Cyan for TypeScript, `{ }` Filament Amber for JSON, `Sh` mint for shell). Hover: `--hover` background.
- **Active:** `border-left: 2px solid var(--accent)`, accent-tinted background (`color-mix` of 8% accent with `--side`), `--fg-bright` text. Exactly the pattern VS Code uses. This is the brand crystallized; do not redesign it.

### Tab (Active)

- **Style:** the active tab matches the editor body background (`--bg`, not `--side`), has a 1px accent line on top (`box-shadow: inset 0 1px 0 var(--accent)`), and replaces its close × with a mint dot when active. Inactive tabs sit on `--side` with `--fg-dim` text. Click area is the tab; the × is a separate, smaller target.

### Command Palette (`⌘K` modal)

- **Style:** 560px wide, 100px from top, centered. Backdrop `rgba(7,13,21,0.55)` with `backdrop-filter: blur(2px)`. Box: `--side` background, `--border-2` hairline, `border-radius: 8px`, `box-shadow: 0 24px 70px rgba(0,0,0,0.5)`. Input at top, file list below.
- **Active row:** accent background, `--accent-ink` text. Arrow-up/down navigates, Enter opens, Escape closes. Clicking the backdrop closes.

### Named Rules

**The Quiet Hover Rule.** Hover transitions are 100–150ms, opacity / color / border only. Never `transform: scale()`, never `box-shadow` reveal, never elastic. The components were already at rest; hover is a *confirmation*, not a performance.

**The One-Active-Wire Rule.** On any given screen, the accent appears in: links, the active sidebar row, the active tab top-line, the status bar, the `H2` `##` marker, one `.em` emphasis at a time, and exactly zero decorative places. If you're about to use accent as a background tint on a non-state element, stop.

**The No-Card Rule.** Cards are the lazy answer; this site does not have any. Work history is row-tables with dashed dividers, projects are inline rows, contact is a two-column key/value grid, and the `package.json` page is a syntax-highlighted JSON block. If a new section reaches for a card grid, redesign as a row-table or a key/value block first.

## 6. Do's and Don'ts

### Do:

- **Do** keep JetBrains Mono on every surface. Weight + size carry hierarchy; the family is fixed.
- **Do** treat the accent as live-state signal. Tabs, the status bar, `H2`, links, the active sidebar row: these are where mint belongs. ≤10% accent coverage per screen is the cap.
- **Do** depth-layer tonally (`--side` → `--bg` → `--panel`). New surfaces use the existing three planes plus hairlines; do not invent a fourth.
- **Do** lowercase everything except proper nouns and the `H1` filename. Voice is commit-message: terse, declarative.
- **Do** keep border-radius ≤8px (chips 3, buttons 5, palette/tweaks 8, status pill 999 for the pill only). Marketing-page rounding is off-brand.
- **Do** test every color change in *both* themes. The paper-mode `lightC` companions and the light-theme syntax token block exist for a reason; AA contrast must hold in both.
- **Do** keep `.qa` action rows to ≤3 buttons and exactly 1 primary.
- **Do** carry `prefers-reduced-motion` alternatives for the pulse dots and the caret blink — both currently animate unconditionally.
- **Do** render the markdown `> quote` as the 2px-accent left-stripe `.doc .quote`. It is the convention being invoked.
- **Do** rely on hairlines (`--border`, `--border-2`) and dashed dividers for separation before reaching for boxes.

### Don't:

- **Don't** introduce a serif anywhere. Not for `H1`, not for pull-quotes, not for "tasteful contrast". Editorial-magazine aesthetics (display serif italic + small mono kicker + ruled separators) are an explicit anti-reference from PRODUCT.md.
- **Don't** ship gradient text. `background-clip: text` plus a gradient is forbidden on every surface. The accent does emphasis; weight + size do hierarchy.
- **Don't** ship glassmorphism, gradient mesh hero backgrounds, neon glows, or marquee text. The "generic dev-template aesthetic" PRODUCT.md rejects starts here.
- **Don't** add card grids of identical icon-heading-text tiles. Not for "features", not for "what I do", not for projects. Use row-tables and key/value grids; see *The No-Card Rule*.
- **Don't** add a tracked-uppercase eyebrow ("ABOUT", "PROCESS", "PRICING") above sections. The `H2 ## name` is the section anchor; the inline `// annotation` is the only allowed secondary marker.
- **Don't** number sections (`01 / 02 / 03`). The portfolio is not a sequence. Numbered scaffolding is AI grammar, not voice.
- **Don't** use `border-left: Npx solid <color>` (with N > 1) as a colored stripe on anything other than the two grandfathered surfaces: the sidebar active row and `.doc .quote`. Both are editor-convention citations, not decoration.
- **Don't** add shadows to cards, buttons, chips, code blocks, or status pills. The legal shadow list in Section 4 is exhaustive: overlay modal, drawer slide, phosphor glow on the pulse dot. Adding a fifth is regression.
- **Don't** use marketing-buzzword copy. The streamline / empower / leverage / supercharge / transform / seamless / world-class family is banned. Replace with a specific noun and the verb that describes what the thing literally does.
- **Don't** use em dashes ("—") in copy. Use commas, colons, semicolons, periods, or parentheses. The codebase currently violates this in a few places; future copy must not add more.
- **Don't** treat the file-glyph palette (amber, ember, cyan, magenta keyword, lime number) as decorative UI color. Each glyph maps to one file type or one syntax role. For new accents, use the user-selectable accent swatches.
- **Don't** introduce a third or fourth border weight. There are two: `--border` (0.07 alpha) and `--border-2` (0.12 alpha). Use them.
- **Don't** force accent coverage above 10% on any screen ("more brand"). The mint is *signal*; saturating it is the opposite of senior-IC restraint.
- **Don't** ship the job-board CV (LinkedIn pill chips, corporate-blue headings, "results-driven engineer" prose). The IDE chrome is the explicit rejection of that register.
