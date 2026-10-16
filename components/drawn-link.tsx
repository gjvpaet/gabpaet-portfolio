import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { InkSvg } from "@/components/ink/ink-svg";
import { cn } from "@/lib/cn";

// A text link with a hand-drawn underline (spec 6.1 InkUnderline "link"):
// "Read the case study", "Play it", "Visit v1", "Full résumé". The pen
// underline boils while hovered or focused. Padding, not the visible line,
// gives the 44px hit area (spec 12). `tone="ink"` is the quieter second link.
export function DrawnLink({
  href,
  children,
  tone = "pen",
  external,
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  tone?: "pen" | "ink";
  /** New tab with rel="noopener noreferrer". Implied for http(s) URLs. */
  external?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const classes = cn(
    "ink-boil relative inline-flex min-h-11 items-center py-2.5 font-semibold no-underline",
    "print:underline print:min-h-0 print:py-0",
    className,
  );
  const inner = (
    <>
      {children}
      <InkSvg
        name={tone === "pen" ? "underlineLink" : "underlineLinkAlt"}
        tone={tone}
        rough={tone === "pen" ? "a" : "b"}
        strokeWidth={tone === "pen" ? 3 : 2}
        draw={false}
        stretch
        className="absolute bottom-1.5 left-0 h-2.5 w-full"
      />
    </>
  );

  if (isExternal || href.startsWith("mailto:") || /\.[a-z0-9]+$/i.test(href)) {
    return (
      <a href={href} className={classes} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {inner}
    </Link>
  );
}
