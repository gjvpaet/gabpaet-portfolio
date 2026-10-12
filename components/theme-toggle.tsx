"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

// The effective theme: an explicit data-theme wins, otherwise the OS setting.
function getTheme(): Theme {
  const pinned = document.documentElement.getAttribute("data-theme");
  if (pinned === "light" || pinned === "dark") return pinned;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    mq.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

// Spec 6.6: a chunky switch. First visit follows the OS; a click pins a choice.
export function ThemeToggle({ className }: { className?: string }) {
  // null during SSR and hydration, so server and client markup match.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the choice still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggle}
      className={cn("inline-flex h-11 shrink-0 cursor-pointer items-center rounded-pill px-0.5", className)}
    >
      <span className="relative block h-8 w-14 rounded-pill border-2 border-ink bg-surface">
        <span
          aria-hidden="true"
          className={cn(
            "tone-accent absolute top-0.5 left-0.5 grid size-6 place-items-center rounded-full border-2 border-ink",
            "transition-transform duration-200 ease-brut",
            isDark ? "translate-x-6 bg-mint" : "bg-yellow",
            theme === null && "opacity-0",
          )}
        >
          {isDark ? <Moon size={14} weight="bold" /> : <Sun size={14} weight="bold" />}
        </span>
      </span>
    </button>
  );
}
