"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  DEFAULT_TWEAKS,
  DENSITY_MAP,
  TWEAKS_STORAGE_KEY,
  type Density,
  type Tweaks,
  findAccent,
} from "@/lib/tweaks";

interface TweaksState extends Tweaks {
  setAccent: (c: string) => void;
  setDensity: (d: Density) => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const TweaksContext = createContext<TweaksState | null>(null);

function applyToDocument(t: Tweaks) {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  const accent = findAccent(t.accent);
  root.setProperty("--accent", accent.c);
  root.setProperty("--accent-ink", accent.ink);
  const d = DENSITY_MAP[t.density];
  root.setProperty("--doc-fs", d.fs);
  root.setProperty("--doc-lh", d.lh);
  root.setProperty("--doc-pad-y", d.padY);
  root.setProperty("--doc-pad-x", d.padX);
  root.setProperty("--side-item-pad", d.side);
  root.setProperty("--gutter-pad-y", d.gut);
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
