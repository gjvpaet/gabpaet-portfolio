// The roughness filters every pen mark points at (spec 4.4): three seeds so
// the boil (globals.css) can cycle them. Rendered once in the root layout.
// A 0x0 SVG, not display:none, because Firefox drops filters defined there.
const FILTERS = [
  { id: "ink-a", baseFrequency: 0.035, seed: 3 },
  { id: "ink-b", baseFrequency: 0.05, seed: 11 },
  { id: "ink-c", baseFrequency: 0.04, seed: 23 },
] as const;

export function InkFilters() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute print:hidden"
    >
      <defs>
        {FILTERS.map((f) => (
          <filter key={f.id} id={f.id} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency={f.baseFrequency} numOctaves={2} seed={f.seed} />
            <feDisplacementMap in="SourceGraphic" scale={3} />
          </filter>
        ))}
        {/* Sticker logos: same wobble, gentler, so brand marks stay recognisable. */}
        <filter id="ink-sticker" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={0.04} numOctaves={2} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={1.5} />
        </filter>
      </defs>
    </svg>
  );
}
