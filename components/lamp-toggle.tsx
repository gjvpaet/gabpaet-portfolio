"use client";

import { Lamp } from "@phosphor-icons/react";
import { useEffect, useSyncExternalStore } from "react";

import { InkSvg } from "@/components/ink/ink-svg";
import { cn } from "@/lib/cn";
import { lampSound } from "@/lib/lamp-sound";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { tokens } from "@/lib/tokens";

// Light unless the lamp has been switched off (data-theme="dark").
function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

// Spec 6.7: the theme switch is a desk lamp. Light mode is the lamp on (two
// pen strokes of light under the shade); dark mode, the "night page", is the
// lamp off. Every visit starts light; a click switches and is remembered.
export function LampToggle({ className }: { className?: string }) {
  // null during SSR and hydration, so server and client markup match.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const isDark = theme === "dark";

  // Keep the browser chrome (a phone's address bar) the colour of the page.
  useEffect(() => {
    if (theme === null) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", isDark ? tokens.dark.paper : tokens.light.paper);
  }, [theme, isDark]);

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    lampSound.pull(next === "light");
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
