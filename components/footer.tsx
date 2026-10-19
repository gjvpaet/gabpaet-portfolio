import Link from "next/link";

import { FooterNap } from "@/components/footer-nap";
import { profile } from "@/content/profile";

// Empty paper under the last row, as tall as the back-to-top button plus its
// gap from the screen's edge (spec 6.17), so at the very bottom the button
// sits in it and never over a footer link.
const FOOTER_CLEARANCE = "pb-[calc(2.75rem+max(clamp(1rem,3vw,2rem),env(safe-area-inset-bottom))+0.5rem)]";

// min-h-11: a 44px tap target (spec 12) without changing how the text looks.
const linkClass =
  "inline-flex min-h-11 items-center font-semibold underline decoration-ink-soft decoration-[1.5px] underline-offset-4 hover:decoration-pen hover:decoration-2";

// Spec 6.16: the nap sign-off, a 2px ink rule, the copyright on the left, four
// links on the right.
export function Footer() {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <footer className="mx-auto max-w-[1200px] px-5 md:px-10 print:hidden">
      <FooterNap />
      <div className={`flex flex-col gap-2 border-t-2 border-ink pt-6 md:flex-row md:items-center md:justify-between ${FOOTER_CLEARANCE}`}>
        <p className="text-base text-ink-soft">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 text-base">
            <li>
              <Link href="/resume" className={linkClass}>
                Résumé
              </Link>
            </li>
            <li>
              <a href={profile.links.github} className={linkClass} {...external}>
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} className={linkClass} {...external}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.v1} className={linkClass} {...external}>
                v1 of this site
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
