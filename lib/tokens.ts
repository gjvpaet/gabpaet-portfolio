// Hex mirror of the color tokens in app/globals.css, for places that cannot
// read CSS variables (next/og images, viewport themeColor).
// Change a value here and in globals.css together. Spec section 4.1.
export const tokens = {
  light: {
    paper: "#F2F2EE",
    sheet: "#FBFBF8",
    ink: "#1D1D1B",
    inkSoft: "#57574F",
    pen: "#5A2D91",
    btn: "#4B2380",
    onBtn: "#FBFBF8",
    note: "#E6DDF3",
    onNote: "#1D1D1B",
    /** --wash (violet at 20%) pre-mixed over --paper, for images without alpha blending. */
    washOnPaper: "#DAD1E6",
  },
  dark: {
    paper: "#1A1B19",
    sheet: "#242622",
    ink: "#ECEDE6",
    inkSoft: "#A6A79C",
    pen: "#B79CF0",
    btn: "#B79CF0",
    onBtn: "#1A1B19",
    note: "#3A2E52",
    onNote: "#ECEDE6",
    washOnPaper: "#403A4D",
  },
} as const;
