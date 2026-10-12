"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";
import { Monogram } from "@/components/monogram";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
] as const;

const CONTACT = { href: "/#contact", label: "Get in touch" } as const;

// Spec 6.5. Sticky bar; the full link row shows from lg (1024px) up, where it
// fits on one line. Below that, a menu button opens a full-width sheet.
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
    const targets = [...SECTIONS.map((s) => s.id), "contact"]
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
        "sticky top-0 z-[var(--z-nav)] border-b-3 bg-bg transition-[border-color] duration-200 print:hidden",
        scrolledPastHero || menuOpen ? "border-ink" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:h-[72px] md:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-control no-underline">
          <Monogram />
          <span className="whitespace-nowrap font-bold [font-stretch:110%]">{shortName}</span>
        </Link>

        {/* lg and up: the full row */}
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-6">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  aria-current={activeId === section.id ? "true" : undefined}
                  className={cn(
                    // py-2.5 + 3px underline: a 44px tap target.
                    "inline-block border-b-3 py-2.5 font-semibold no-underline transition-[border-color] duration-150",
                    activeId === section.id ? "border-mint" : "border-transparent hover:border-mint",
                  )}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <Link href={CONTACT.href} className={buttonClasses("secondary", undefined, "sm")}>
            {CONTACT.label}
          </Link>
        </nav>

        {/* Below lg: toggle + menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
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
        className="absolute inset-x-0 top-full z-[var(--z-mobile-menu)] border-b-3 border-ink bg-bg lg:hidden"
      >
        <nav aria-label="Primary" className="mx-auto grid max-w-[1200px] gap-6 px-4 pt-6 pb-8 md:px-8">
          <ul className="grid gap-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1 text-[2rem] leading-tight font-extrabold no-underline [font-stretch:125%]"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={CONTACT.href}
            onClick={() => setMenuOpen(false)}
            className={buttonClasses("secondary", "w-fit")}
          >
            {CONTACT.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
