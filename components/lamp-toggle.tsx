"use client";

import { Lamp } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

import { InkSvg } from "@/components/ink/ink-svg";
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

// Spec 6.7: the theme switch is a desk lamp. Light mode is the lamp on (two
// pen strokes of light under the shade); dark mode, the "night page", is the
// lamp off. First visit follows the OS; a click pins a choice.
export function LampToggle({ className }: { className?: string }) {
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
      title={isDark ? "Turn the lamp on" : "Turn the lamp off"}
      onClick={toggle}
      className={cn(
        "lift relative grid size-11 shrink-0 cursor-pointer place-items-center rounded-control border-2 border-ink bg-sheet text-ink",
        className,
      )}
    >
      <span className="relative size-6" aria-hidden="true">
        <Lamp size={24} weight="bold" />
        {!isDark && theme !== null && (
          <InkSvg name="lampRays" tone="pen" rough={false} className="absolute inset-0 size-6" />
        )}
      </span>
    </button>
  );
}
