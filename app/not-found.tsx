import { House } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Spec 14.
export default function NotFound() {
  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-6 px-4 py-24 md:px-8 md:py-32">
      <span
        aria-hidden="true"
        className="grid size-[88px] -rotate-6 place-items-center rounded-control border-3 border-ink bg-ink font-mono text-[1.75rem] font-semibold text-bg shadow-brut-lg"
      >
        &gt;_
      </span>
      <h1 className="type-h2">Page not found</h1>
      <p className="text-ink-muted">That page moved or never existed.</p>
      <ButtonLink href="/" variant="primary" icon={<House size={20} weight="bold" />} className="w-fit">
        Back home
      </ButtonLink>
    </main>
  );
}
