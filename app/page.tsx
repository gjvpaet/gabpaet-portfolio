import type { Metadata } from "next";

import { profile } from "@/content/profile";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Temporary token check while v2 is built. Replaced by the real home page
// sections in build-checklist step 7 (docs/v2/DESIGN-SPEC.md section 7).
export default function HomePage() {
  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-8 px-4 py-16 md:px-8 md:py-24">
      <span className="w-fit rounded-pill border-2 border-ink bg-yellow px-3.5 py-1.5 text-sm font-semibold text-on-accent shadow-brut-sm">
        {profile.status}
      </span>
      <h1 className="type-display">
        {profile.name.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h1>
      <p className="max-w-[34ch] text-[1.1875rem] leading-normal">{profile.heroLine}</p>
      <div className="flex flex-wrap gap-3">
        <span className="type-chip rounded-pill border-2 border-ink bg-mint px-2.5 py-2 text-on-accent">
          v2 in progress
        </span>
      </div>
    </main>
  );
}
