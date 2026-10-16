import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary";

// Height and padding live here, never in className: Tailwind resolves two
// conflicting utilities by stylesheet order, not class order, so a passed-in
// `px-0` would silently lose to the base `px-5`.
export type ButtonSize = "md" | "sm" | "icon";

const SIZES: Record<ButtonSize, string> = {
  md: "h-13 px-6", // spec 6.5 default, 52px
  sm: "h-11 px-4.5", // nav bar, 44px
  icon: "size-11", // square icon-only button (pencil, lamp, menu)
};

// Spec 6.5: structure layer, so clean: 2px ink outline, 12px radius, no
// shadow, one-line label, lift on hover. Focus is the global pen ring.
export function buttonClasses(
  variant: ButtonVariant = "secondary",
  className?: string,
  size: ButtonSize = "md",
): string {
  return cn(
    "lift type-button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap",
    "rounded-control border-2 border-ink no-underline select-none",
    SIZES[size],
    variant === "primary" ? "bg-btn text-on-btn" : "bg-sheet text-ink",
    className,
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  /** Phosphor icon element, rendered before the label at 20px. */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

function Inner({ icon, children }: Pick<CommonProps, "icon" | "children">) {
  return (
    <>
      {icon ? (
        <span aria-hidden="true" className="inline-flex size-5 items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({ variant, icon, children, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

type ButtonLinkProps = CommonProps & {
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". Implied for http(s) URLs. */
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "children" | "className" | "href">;

export function ButtonLink({ variant, icon, children, className, href, external, ...rest }: ButtonLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const classes = buttonClasses(variant, className);

  // mailto:, file downloads and other sites use a plain anchor.
  if (isExternal || href.startsWith("mailto:") || /\.[a-z0-9]+$/i.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        <Inner icon={icon}>{children}</Inner>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}
