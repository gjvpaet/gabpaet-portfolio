import { House } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/button";
import { Sticker } from "@/components/sticker";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Spec 14.
export default function NotFound() {
  return (
    <main id="main" className="mx-auto grid max-w-[1200px] gap-6 px-4 py-24 md:px-8 md:py-32">
      <Sticker rotate={-6}>
        <span className="type-hand text-2xl font-semibold md:text-[1.875rem]">&gt;_</span>
      </Sticker>
      <h1 className="type-h2">Page not found</h1>
      <p className="text-ink-muted">That page moved or never existed.</p>
      <ButtonLink href="/" variant="primary" icon={<House size={20} weight="bold" />} className="w-fit">
        Back home
      </ButtonLink>
    </main>
  );
}
