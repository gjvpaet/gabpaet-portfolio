"use client";

import { useTweaks } from "@/context/tweaks-provider";
import { ACCENT_OPTIONS, type Density, type Theme, findAccent } from "@/lib/tweaks";

const DENSITY_VALUES: Density[] = ["compact", "cozy", "spacious"];
const THEME_VALUES: Theme[] = ["dark", "light"];

export function TweaksPanel() {
  const t = useTweaks();
  const activeAccent = findAccent(t.accent);

  return (
    <>
      <button
        type="button"
        onClick={t.togglePanel}
        aria-label="Tweaks"
        className="tweaks-trigger fixed bottom-9 right-3.5 z-40 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-2)] bg-[var(--panel)] text-[var(--fg-dim)] transition-colors hover:text-[var(--accent)]"
        style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      </button>

      {t.isPanelOpen && (
        <div
          className="tweaks-panel fixed bottom-[38px] right-3.5 z-50 w-72 overflow-hidden rounded-lg border border-[var(--border-2)] bg-[var(--panel)] text-[11.5px] text-[var(--fg)]"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--side)] px-3.5 py-2.5">
            <b className="text-[11px] font-semibold uppercase tracking-[2px] text-[var(--accent)]">
              Tweaks
            </b>
            <button
              type="button"
              onClick={t.closePanel}
              aria-label="close"
              className="tweaks-close flex h-[18px] w-[18px] items-center justify-center rounded-[3px] text-[var(--fg-dim)] hover:bg-white/[.06] hover:text-[var(--fg-bright)]"
            >
              ×
            </button>
          </div>
          <div className="p-3.5">
            <div className="mb-3.5">
              <div className="mb-1.5 flex items-center text-[10px] uppercase tracking-[1.5px] text-[var(--fg-dim)]">
                Theme
                <span className="ml-auto text-[10.5px] capitalize tracking-[.5px] text-[var(--accent)]">
                  {t.theme}
                </span>
              </div>
              <div className="flex rounded-[4px] border border-[var(--border)] bg-[var(--side)] p-0.5">
                {THEME_VALUES.map((v) => {
                  const active = v === t.theme;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => t.setTheme(v)}
                      className={[
                        "segmented-btn flex-1 rounded-[3px] border-0 py-1 text-[11px] transition-colors",
                        active
                          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                          : "bg-transparent text-[var(--fg-dim)]",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[10.5px] italic leading-[1.5] text-[var(--fg-dim-2)]">
                flip the editor between night and paper.
              </div>
            </div>

            <div className="mb-3.5">
              <div className="mb-1.5 flex items-center text-[10px] uppercase tracking-[1.5px] text-[var(--fg-dim)]">
                Accent
                <span className="ml-auto text-[10.5px] capitalize tracking-[.5px] text-[var(--accent)]">
                  {activeAccent.name}
                </span>
              </div>
              <div className="flex gap-1.5">
                {ACCENT_OPTIONS.map((o) => {
                  const active = o.c.toLowerCase() === t.accent.toLowerCase();
                  return (
                    <button
                      key={o.c}
                      type="button"
                      onClick={() => t.setAccent(o.c)}
                      aria-label={o.name}
                      className={[
                        "accent-swatch h-[26px] w-[26px] cursor-pointer rounded-[5px] border-[1.5px] transition-transform",
                        active ? "scale-110 border-[var(--fg-bright)]" : "border-[var(--border-2)]",
                      ].join(" ")}
                      style={{ background: t.theme === "light" ? o.lightC : o.c }}
                    />
                  );
                })}
              </div>
              <div className="mt-2 text-[10.5px] italic leading-[1.5] text-[var(--fg-dim-2)]">
                recolors the active tab, status bar, sidebar selection &amp; links.
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center text-[10px] uppercase tracking-[1.5px] text-[var(--fg-dim)]">
                Density
                <span className="ml-auto text-[10.5px] capitalize tracking-[.5px] text-[var(--accent)]">
                  {t.density}
                </span>
              </div>
              <div className="flex rounded-[4px] border border-[var(--border)] bg-[var(--side)] p-0.5">
                {DENSITY_VALUES.map((v) => {
                  const active = v === t.density;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => t.setDensity(v)}
                      className={[
                        "segmented-btn flex-1 rounded-[3px] border-0 py-1 text-[11px] transition-colors",
                        active
                          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                          : "bg-transparent text-[var(--fg-dim)]",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-[10.5px] italic leading-[1.5] text-[var(--fg-dim-2)]">
                changes editor font size, line height &amp; document padding.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
