import Link from "next/link";

import { FooterNap } from "@/components/footer-nap";
import { profile } from "@/content/profile";

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
      <div className="flex flex-col gap-2 border-t-2 border-ink py-6 md:flex-row md:items-center md:justify-between">
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
