import { House } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/button";
import { Illustration } from "@/components/illustration";
import { InkBox } from "@/components/ink/ink-box";
import { InkSvg } from "@/components/ink/ink-svg";
import { MarginNote } from "@/components/margin-note";
import { PaperCard } from "@/components/paper-card";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Where else to go, as a to-do list on a taped-in card.
const ELSEWHERE = [
  { href: "/#experience", label: "Experience", detail: "where I've worked" },
  { href: "/#projects", label: "Projects", detail: "what I've built on the side" },
  { href: "/resume", label: "Résumé", detail: "the one-page version" },
  { href: "/#contact", label: "Contact", detail: "email, LinkedIn, GitHub" },
];

// Spec 14. Left: the note's arrow points up at the paper plane
// (illustration #4) that took the page with it, then the heading and the
// way home. Right, from lg: a notebook card listing the other ways in;
// hovering or focusing a row ticks its box.
export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-20"
    >
      <div className="relative">
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

      <nav aria-label="Other pages" className="w-full max-w-[400px]">
        <PaperCard rotate={1.5} className="px-7 pt-9 pb-7 sm:px-8">
          <p className="type-hand-title text-pen">or try one of these</p>
          <ul className="mt-5 grid gap-1">
            {ELSEWHERE.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="todo-link ink-boil grid grid-cols-[24px_minmax(0,1fr)] items-start gap-4 rounded-control py-2.5 no-underline"
                >
                  <span className="relative mt-1 size-5" aria-hidden="true">
                    <InkBox rough={i % 2 ? "b" : "a"} delay={0.2 + i * 0.12} className="size-5" />
                    <InkSvg name="check" draw={false} className="todo-check absolute -top-1 left-0.5 size-6" />
                  </span>
                  <span>
                    <span className="block text-xl font-bold tracking-[-0.01em]">{item.label}</span>
                    <span className="block text-ink-soft">{item.detail}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </PaperCard>
      </nav>
    </main>
  );
}
