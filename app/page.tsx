import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Temporary token check while v2 is built. Replaced by the real home page
// sections in build-checklist step 7 (docs/v2/DESIGN-SPEC.md section 7).
export default function HomePage() {
  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-8 px-4 py-16 md:px-8 md:py-24">
      <span className="w-fit rounded-pill border-2 border-ink bg-yellow px-3.5 py-1.5 text-sm font-semibold text-on-accent shadow-brut-sm">
        Not actively looking, open to a chat
      </span>
      <h1 className="type-display">
        <span className="block">Gabriel</span>
        <span className="block">Joshua</span>
        <span className="block">Paet</span>
      </h1>
      <p className="max-w-[34ch] text-[1.1875rem] leading-normal">
        Senior programmer building AI agents, workflow automation, and the cloud
        infrastructure that runs them. 9 years shipping.
      </p>
      <div className="flex flex-wrap gap-3">
        <span className="type-chip rounded-pill border-2 border-ink bg-surface px-2.5 py-2">Next.js</span>
        <span className="type-chip rounded-pill border-2 border-ink bg-mint px-2.5 py-2 text-on-accent">
          v2 in progress
        </span>
      </div>
    </main>
  );
}
