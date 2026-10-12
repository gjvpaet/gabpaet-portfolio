import Link from "next/link";

import { profile } from "@/content/profile";

// min-h-11: a 44px tap target (spec 12) without changing how the text looks.
const linkClass =
  "inline-flex min-h-11 items-center font-semibold underline decoration-2 underline-offset-4 hover:decoration-mint-text";

// Spec 6.13.
export function Footer() {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <footer className="mx-auto max-w-[1200px] px-4 md:px-8 print:hidden">
      <div className="flex flex-col gap-2 border-t-3 border-ink py-6 md:flex-row md:items-center md:justify-between">
        <p className="type-body-sm">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav aria-label="Footer">
          <ul className="type-body-sm flex flex-wrap gap-x-6">
            <li>
              <Link href="/resume" className={linkClass}>
                Resume
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
