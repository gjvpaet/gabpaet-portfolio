"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";
import { InkSvg } from "@/components/ink/ink-svg";
import { Tape } from "@/components/ink/tape";
import { LampToggle } from "@/components/lamp-toggle";
import { PencilButton } from "@/components/pencil-button";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

const RESUME = { href: "/resume", label: "Résumé" } as const;

// Spec 6.8. Sticky 72px bar on the paper. The full row (links, pencil, lamp,
// Résumé) shows from lg (1024px) up, where it fits on one line. Below that:
// the "gp" mark, pencil, lamp and a menu button that opens a taped-in paper
// sheet.
export function Nav({ shortName }: { shortName: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Bottom border appears once the hero leaves the viewport. Pages without a
  // hero always show it.
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setScrolledPastHero(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setScrolledPastHero(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  // Underline the link for the section in the middle band of the viewport.
  useEffect(() => {
    const targets = SECTIONS.map((s) => s.id)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) {
      setActiveId(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Close the sheet whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While open: Esc closes, Tab stays inside the button + sheet, an outside
  // click closes, and focus moves to the first link.
  useEffect(() => {
    if (!menuOpen) return;
    const sheet = sheetRef.current;
    const button = menuButtonRef.current;
    if (!sheet || !button) return;

    const focusables = () => [button, ...sheet.querySelectorAll<HTMLElement>("a[href], button")];
    focusables()[1]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? index - 1 : index + 1;
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!sheet?.contains(target) && !button?.contains(target)) setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-nav)] border-b-2 bg-paper transition-[border-color] duration-200 print:hidden",
        scrolledPastHero || menuOpen ? "border-ink" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 md:h-18 md:px-10">
        {/* The "gp" mark, as in the favicon: a pen ring drawn round the
            handwritten initials. It boils on hover; the name is its label. */}
        <Link
          href="/"
          aria-label={`${shortName}, home`}
          className="ink-boil relative flex size-12 shrink-0 items-center justify-center rounded-full no-underline"
        >
          <InkSvg name="ring" stretch delay={0.2} className="absolute inset-0 size-full" />
          <span aria-hidden="true" className="font-hand -mt-1 text-[1.375rem] leading-none font-bold text-ink">
            gp
          </span>
        </Link>

        {/* lg and up: the full row */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <ul className="flex items-center gap-7">
            {SECTIONS.map((section) => {
              const active = activeId === section.id;
              return (
                <li key={section.id}>
                  <Link
                    href={`/#${section.id}`}
                    aria-current={active ? "true" : undefined}
                    // min-h-11: a 44px tap target around the 16px label.
                    className="group relative inline-flex min-h-11 items-center text-base font-medium no-underline"
                  >
                    {section.label}
                    {/* Hover: a faint pencil line. In view: the pen draws one in. */}
                    <InkSvg
                      name="underlineLinkAlt"
                      tone="soft"
                      draw={false}
                      rough="b"
                      stretch
                      className={cn(
                        "absolute bottom-1.5 left-0 h-2 w-full opacity-0 transition-opacity duration-150",
                        !active && "group-hover:opacity-100",
                      )}
                    />
                    {active ? (
                      <InkSvg
                        name="underlineLink"
                        strokeWidth={3}
                        stretch
                        className="absolute bottom-1.5 left-0 h-2 w-full"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2.5">
            <PencilButton />
            <LampToggle />
            <Link href={RESUME.href} className={buttonClasses("secondary", undefined, "sm")}>
              {RESUME.label}
            </Link>
          </div>
        </nav>

        {/* Below lg: pencil, lamp, menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <PencilButton />
          <LampToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className={buttonClasses("secondary", undefined, "icon")}
          >
            {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </div>

      <div
        ref={sheetRef}
        id={menuId}
        hidden={!menuOpen}
        // Taped-in paper: the sheet hangs just under the bar, slightly tilted.
        className="paper absolute inset-x-4 top-full z-[var(--z-mobile-menu)] mt-3 -rotate-[0.6deg] md:inset-x-8 lg:hidden"
      >
        <Tape className="-top-3 left-8 h-7 w-[92px]" style={{ rotate: "-6deg" }} />
        <Tape className="-top-2.5 right-8 h-7 w-[84px]" style={{ rotate: "5deg" }} />
        <nav aria-label="Primary" className="grid gap-6 px-6 pt-8 pb-7">
          <ul className="grid gap-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1.5 text-[2rem] leading-tight font-bold tracking-[-0.02em] no-underline"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={RESUME.href}
            onClick={() => setMenuOpen(false)}
            className={buttonClasses("primary", "w-fit")}
          >
            {RESUME.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
