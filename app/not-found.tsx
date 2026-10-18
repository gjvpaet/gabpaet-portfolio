import { House } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/button";
import { Illustration } from "@/components/illustration";
import { MarginNote } from "@/components/margin-note";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Spec 14. The note's arrow points up at the paper plane (illustration #4)
// that took the page with it.
export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-32">
      <div className="relative max-w-[640px]">
        <Illustration name="plane" className="absolute -top-28 left-20 w-[300px] max-sm:hidden md:-top-32 md:w-[400px]" />
        <MarginNote arrow="up-right" className="-rotate-2">
          this one flew off
        </MarginNote>
        <h1 className="type-display mt-6">Page not found</h1>
        <p className="type-lead mt-6 text-ink-soft">That page moved or never existed.</p>
        <ButtonLink href="/" variant="primary" icon={<House size={20} weight="bold" />} className="mt-9 w-fit">
          Back home
        </ButtonLink>
      </div>
    </main>
  );
}
