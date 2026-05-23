"use client";

import { useRouter, usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { DEFAULT_OPEN_TABS, FILES, type FileId } from "@/content/files";
import { getFileByRoute } from "@/lib/files";

const STORAGE_KEY = "portfolio.tabs.v1";

interface TabsState {
  openTabs: FileId[];
  activeId: FileId | undefined;
  closeTab: (id: FileId) => void;
}

const TabsContext = createContext<TabsState | null>(null);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeFile = getFileByRoute(pathname);
  const activeId = activeFile?.id;

  const [openTabs, setOpenTabs] = useState<FileId[]>(DEFAULT_OPEN_TABS);
  const hydratedRef = useRef(false);

  // Hydrate from localStorage after first render (avoid SSR/CSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FileId[];
        const filtered = parsed.filter((id): id is FileId => id in FILES);
        if (filtered.length > 0) setOpenTabs(filtered);
      }
    } catch {
      /* ignore */
    }
    hydratedRef.current = true;
  }, []);

  // Persist whenever tabs change (post-hydration).
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(openTabs));
    } catch {
      /* ignore */
    }
  }, [openTabs]);

  // When the route changes to a file not in tabs, append it.
  useEffect(() => {
    if (!activeId) return;
    setOpenTabs((tabs) => (tabs.includes(activeId) ? tabs : [...tabs, activeId]));
  }, [activeId]);

  const closeTab = useCallback(
    (id: FileId) => {
      setOpenTabs((tabs) => {
        const idx = tabs.indexOf(id);
        if (idx < 0) return tabs;
        const next = tabs.slice(0, idx).concat(tabs.slice(idx + 1));
        if (id === activeId) {
          const fallbackId = next[Math.min(idx, next.length - 1)] ?? "about.md";
          router.push(FILES[fallbackId].route);
        }
        return next;
      });
    },
    [activeId, router],
  );

  return (
    <TabsContext.Provider value={{ openTabs, activeId, closeTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs(): TabsState {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within TabsProvider");
  return ctx;
}
