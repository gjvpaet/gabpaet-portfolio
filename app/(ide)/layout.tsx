import { Breadcrumb } from "@/components/ide/breadcrumb";
import { CommandPalette } from "@/components/ide/command-palette";
import { Gutter } from "@/components/ide/gutter";
import { Sidebar } from "@/components/ide/sidebar";
import { SidebarBackdrop } from "@/components/ide/sidebar-backdrop";
import { StatusBar } from "@/components/ide/status-bar";
import { Tabs } from "@/components/ide/tabs";
import { TitleBar } from "@/components/ide/title-bar";
import { TweaksPanel } from "@/components/ide/tweaks-panel";
import { Providers } from "@/context/providers";

export default function IdeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="ide-shell absolute inset-0 grid grid-cols-[260px_1fr] grid-rows-[38px_1fr_26px]">
        <TitleBar />
        <SidebarBackdrop />
        <Sidebar />
        <main className="main col-start-2 row-start-2 flex min-w-0 flex-col overflow-hidden bg-[var(--bg)]">
          <Tabs />
          <Breadcrumb />
          <div className="content grid flex-1 grid-cols-[50px_1fr] overflow-hidden">
            <Gutter />
            <div className="doc">{children}</div>
          </div>
        </main>
        <StatusBar />
      </div>
      <CommandPalette />
      <TweaksPanel />
    </Providers>
  );
}
