export interface AccentOption {
  c: string;
  ink: string;
  name: string;
  /** Darker companion used when the user is in light theme — keeps contrast on paper bg. */
  lightC: string;
  lightInk: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { c: "#2ee5b4", ink: "#04211a", name: "mint",       lightC: "#0f9d77", lightInk: "#ffffff" },
  { c: "#f97070", ink: "#2a0606", name: "coral",      lightC: "#dc2626", lightInk: "#ffffff" },
  { c: "#7a9cff", ink: "#08122b", name: "periwinkle", lightC: "#3b5bdb", lightInk: "#ffffff" },
  { c: "#f2c14e", ink: "#2a1d00", name: "amber",      lightC: "#b45309", lightInk: "#ffffff" },
  { c: "#c084fc", ink: "#1c0a30", name: "violet",     lightC: "#8b5cf6", lightInk: "#ffffff" },
];

export type Density = "compact" | "cozy" | "spacious";

export interface DensitySpec {
  fs: string;
  lh: string;
  padY: string;
  padX: string;
  side: string;
  gut: string;
}

export const DENSITY_MAP: Record<Density, DensitySpec> = {
  compact: { fs: "12px", lh: "1.55", padY: "12px", padX: "20px", side: "2px", gut: "12px" },
  cozy: { fs: "14px", lh: "1.85", padY: "22px", padX: "28px", side: "5px", gut: "22px" },
  spacious: { fs: "15.5px", lh: "2.1", padY: "32px", padX: "40px", side: "8px", gut: "32px" },
};

export type Theme = "dark" | "light";

export const TWEAKS_STORAGE_KEY = "portfolio.tweaks.v1";

export interface Tweaks {
  accent: string;
  density: Density;
  theme: Theme;
}

export const DEFAULT_TWEAKS: Tweaks = {
  accent: "#2ee5b4",
  density: "cozy",
  theme: "dark",
};

export function findAccent(c: string): AccentOption {
  return (
    ACCENT_OPTIONS.find((o) => o.c.toLowerCase() === c.toLowerCase()) ?? ACCENT_OPTIONS[0]
  );
}
