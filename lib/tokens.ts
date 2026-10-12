// Hex mirror of the color tokens in app/globals.css, for places that cannot
// read CSS variables (next/og images, viewport themeColor).
// Change a value here and in globals.css together.
export const tokens = {
  light: {
    bg: "#F6F7F3",
    surface: "#FDFDFB",
    ink: "#1B1C1A",
    inkMuted: "#55584F",
    mintText: "#0A7A5C",
  },
  dark: {
    bg: "#121412",
    surface: "#1C1F1B",
    ink: "#F2F3EE",
    inkMuted: "#A3A69C",
    mintText: "#2EE5B4",
  },
  mint: "#2EE5B4",
  yellow: "#FFD23F",
  onAccent: "#1B1C1A",
} as const;
