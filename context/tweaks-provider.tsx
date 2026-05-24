"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  DEFAULT_TWEAKS,
  DENSITY_MAP,
  TWEAKS_STORAGE_KEY,
  type Density,
  type Theme,
  type Tweaks,
  findAccent,
} from "@/lib/tweaks";

interface TweaksState extends Tweaks {
  setAccent: (c: string) => void;
  setDensity: (d: Density) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const TweaksContext = createContext<TweaksState | null>(null);

function applyToDocument(t: Tweaks) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const styleR = root.style;
  const accent = findAccent(t.accent);
  const isLight = t.theme === "light";

  // data-theme drives the :root[data-theme="light"] token block in globals.css.
  root.setAttribute("data-theme", isLight ? "light" : "dark");

  // Accent shifts to its darker light-mode companion so it still reads on paper.
  styleR.setProperty("--accent", isLight ? accent.lightC : accent.c);
  styleR.setProperty("--accent-ink", isLight ? accent.lightInk : accent.ink);

  const d = DENSITY_MAP[t.density];
  styleR.setProperty("--doc-fs", d.fs);
  styleR.setProperty("--doc-lh", d.lh);
  styleR.setProperty("--doc-pad-y", d.padY);
  styleR.setProperty("--doc-pad-x", d.padX);
  styleR.setProperty("--side-item-pad", d.side);
  styleR.setProperty("--gutter-pad-y", d.gut);
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Hydrate from localStorage after mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TWEAKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Tweaks>;
        const next: Tweaks = {
          accent: parsed.accent ?? DEFAULT_TWEAKS.accent,
          density:
            parsed.density === "compact" || parsed.density === "cozy" || parsed.density === "spacious"
              ? parsed.density
              : DEFAULT_TWEAKS.density,
          theme: parsed.theme === "light" ? "light" : "dark",
        };
        setTweaks(next);
        applyToDocument(next);
      } else {
        applyToDocument(DEFAULT_TWEAKS);
      }
    } catch {
      applyToDocument(DEFAULT_TWEAKS);
    }
  }, []);

  function persist(next: Tweaks) {
    setTweaks(next);
    applyToDocument(next);
    try {
      localStorage.setItem(TWEAKS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  return (
    <TweaksContext.Provider
      value={{
        ...tweaks,
        setAccent: (c) => persist({ ...tweaks, accent: c }),
        setDensity: (d) => persist({ ...tweaks, density: d }),
        setTheme: (t) => persist({ ...tweaks, theme: t }),
        toggleTheme: () =>
          persist({ ...tweaks, theme: tweaks.theme === "light" ? "dark" : "light" }),
        isPanelOpen,
        openPanel: () => setIsPanelOpen(true),
        closePanel: () => setIsPanelOpen(false),
        togglePanel: () => setIsPanelOpen((v) => !v),
      }}
    >
      {children}
    </TweaksContext.Provider>
  );
}

export function useTweaks(): TweaksState {
  const ctx = useContext(TweaksContext);
  if (!ctx) throw new Error("useTweaks must be used within TweaksProvider");
  return ctx;
}
