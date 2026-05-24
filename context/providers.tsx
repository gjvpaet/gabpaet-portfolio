"use client";

import { PaletteProvider } from "./palette-provider";
import { SidebarProvider } from "./sidebar-provider";
import { TabsProvider } from "./tabs-provider";
import { TweaksProvider } from "./tweaks-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TweaksProvider>
      <PaletteProvider>
        <SidebarProvider>
          <TabsProvider>{children}</TabsProvider>
        </SidebarProvider>
      </PaletteProvider>
    </TweaksProvider>
  );
}
