"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface PaletteState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const PaletteContext = createContext<PaletteState | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (cmdOrCtrl && (e.key === "k" || e.key === "p" || e.key === "K" || e.key === "P")) {
        e.preventDefault();
        setIsOpen((v) => !v);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette(): PaletteState {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
  return ctx;
}
