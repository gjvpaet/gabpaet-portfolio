import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary";

// Spec 6.1: 48px tall, 3px outline, 12px radius, one-line label, press physics.
export function buttonClasses(variant: ButtonVariant = "secondary", className?: string): string {
  return cn(
    "press type-button inline-flex h-12 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap",
    "rounded-control border-3 border-ink px-5 no-underline select-none",
    variant === "primary" ? "bg-mint text-on-accent" : "bg-surface text-ink",
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
