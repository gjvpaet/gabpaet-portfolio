# Product

## Register

brand

## Users

Visitors landing on `gabpaet.dev` — recruiters / hiring managers vetting a senior programmer, peers and engineers who clicked through from a link or a referral, and curious devs who hit the site through Google or social. They open the page in a desktop browser, scan for ~30 seconds to decide "is this person legit and interesting", and either drill into one or two sections or leave. The job to be done is **fast credibility**: communicate seniority, taste, and a specific point of view about software in the time it takes to read one screen.

A secondary audience is Gabriel himself — the site is also a portable identity document he wants to be proud of, not just an inbound funnel.

## Product Purpose

A personal portfolio for **Gabriel Joshua Paet** — senior programmer at Lumora Capital, 9 years shipping, based in Pasay City, PH. The site presents his work, employment history, contact details, and a few personality-revealing files (`package.json`, `.zshrc`, the portfolio's own source) wrapped in a **VS-Code-style IDE shell**. The metaphor is the brand: each "page" is a file, the chrome (sidebar / tabs / breadcrumb / gutter / status bar / ⌘K palette) is always present, and the visitor reads the portfolio the way they'd read the codebase that produced it.

Success looks like a visitor saying "I know who built this" within 10 seconds and "they care about details" within 30. Not a conversion funnel: he is **not actively looking** and the surface communicates that directly. The win is signal, not leads.

## Brand Personality

**Technical · ironic-meta · opinionated.**

- **Technical:** monospace everywhere (JetBrains Mono, 400/500/600/700), syntax-highlighted code as content, precise design tokens, file-system metaphors, a status bar that says `UTF-8 / LF / Spaces: 2`. The whole interface speaks to people who use editors all day.
- **Ironic-meta:** the portfolio renders its own `page.tsx` as a file inside itself. `package.json` describes Gabriel as a package with `engines: { coffee: ">= 1 cup/day" }`. The joke and the substance are the same thing.
- **Opinionated:** committed to a specific stack and a specific look. The tweaks panel exposes accent + density choices the way a real editor would, not a marketing "personalization" gimmick. Border radius caps at 8px on purpose. Big rounded corners are off-brand.

The voice across copy is **terse, lowercase, declarative** — `senior programmer · pasay city, ph · 9 years shipping`. No marketing buzzwords. Sentences read like commit messages or shell prompts.

## Anti-references

This site is none of these:

- **Generic dev-template aesthetic.** The Vercel/Linear-lite hero with gradient mesh, dark grid background, oversized "I build fast websites" headline, and three feature cards. The thing every dev portfolio looks like in 2026. We are not that.
- **Job-board CV vibes.** Bland recruiter-friendly LinkedIn-export layouts with corporate-blue headings, generic pill chips, and "results-driven engineer" prose. The IDE chrome is the explicit rejection of this register.
- **Maximalist / brutalist showoff.** Marquee text, oversized neon typography, intentional ugliness, agency-portfolio chaos. Confidence here is quiet, not loud; the design is restrained because restraint reads as senior.
- **Editorial-magazine aesthetic.** Big serif italic display, small mono kicker, ruled separators, Klim/Notion-adjacent broadsheet typography. We are mono-only and IDE-shaped, not magazine-shaped. Don't drift into that lane.

## Design Principles

1. **The metaphor is the brand.** Every design decision is answerable to "does an editor actually do this?" Tabs, breadcrumbs, gutters, status bars, palettes — all exist because real editors have them. If a UI element doesn't fit the IDE world, it doesn't belong. Don't graft on marketing-page components.
2. **Show, don't tell.** The portfolio renders its own source. `package.json` describes the person. `.zshrc` reveals how he actually works. The meta-joke is also the proof: the site IS the work, not a description of it.
3. **Terse over polished.** Lowercase, declarative, commit-message cadence. No buzzwords, no padding, no aphoristic-cadence body copy. One word over three; one sentence over two.
4. **Identity-preserve, don't redesign.** The IDE metaphor, JetBrains Mono, the mint accent default, the dark theme, the small border-radius rule are committed identity. Variants and improvements operate within that system; they don't relitigate it. The reflex-reject lists (Fraunces, editorial-magazine, etc.) protect *greenfield* choices, not the established brand.
5. **Details earn the seniority claim.** The tweaks panel persists. The FOUC script ships dual sources of truth in lockstep. The gutter highlights line 1 in accent. The accent has a `lightC` companion for paper-mode legibility. These details are the argument; the site claims senior-engineer taste by *being* one, not by saying so.

## Accessibility & Inclusion

**WCAG 2.1 AA baseline.**

- Body text contrast ≥4.5:1, large text ≥3:1, in both dark and light themes. The `data-theme="light"` palette in `globals.css` exists specifically so paper-mode hits AA — accent colors swap to their darker `lightC` companions, syntax tokens shift to darker hues. Verify before shipping any color change.
- **Keyboard navigation for the IDE chrome.** The ⌘K / ⌘P palette, tab close buttons, sidebar file rows, tweaks panel controls all need real focus states and arrow-key navigation where the metaphor implies it. The palette is the most important: arrow up/down + enter + escape are non-negotiable.
- **Reduced motion.** The two recurring animations are the orange pulse dot (sidebar footer + about.md status pill, 2s ease-in-out infinite) and the caret blink after the hero name. Both need a `@media (prefers-reduced-motion: reduce)` alternative — typically a static dot and a static caret. Tab / sidebar / density transitions should also collapse to instant.
- **Color independence.** Status (the pulsing dot, the green "no errors" segment) must not rely on color alone; pair with a text label or shape. The current copy ("currently @ Lumora · not actively looking") already does this.
- **Semantic HTML under the IDE costume.** The IDE chrome is visual; the underlying markup should still be navigable headings, lists, links, and landmarks. A screen reader user should hear "Gabriel Joshua Paet, senior programmer" as an H1, not as decorative `<div className="h1">`.
