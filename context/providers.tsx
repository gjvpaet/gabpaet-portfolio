"use client";

import { PaletteProvider } from "./palette-provider";
import { TabsProvider } from "./tabs-provider";
import { TweaksProvider } from "./tweaks-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TweaksProvider>
      <PaletteProvider>
        <TabsProvider>{children}</TabsProvider>
      </PaletteProvider>
    </TweaksProvider>
  );
}
