// The pen-mark library (spec 4.4, 6.1, 10.2). Every hand-drawn mark on the
// site is one of these paths, drawn once and reviewed on the style sheet
// (https://claude.ai/artifact/EAyMLR1pzPucMff9nit5rg). Never draw a one-off
// path inline: add it here.
//
// Each mark is a viewBox plus one or more strokes. Strokes draw in one after
// another (components/ink/ink-svg.tsx staggers them), so list them in the
// order a hand would draw them: an arrow's shaft before its head.

export type InkMark = {
  viewBox: string;
  /** Natural size in px, for marks rendered at a fixed size. */
  width: number;
  height: number;
  strokes: readonly string[];
  /** Default stroke width in viewBox units. */
  strokeWidth: number;
};

const mark = (
  viewBox: string,
  strokes: readonly string[],
  strokeWidth: number,
): InkMark => {
  const [, , width, height] = viewBox.split(" ").map(Number);
  return { viewBox, width, height, strokes, strokeWidth };
};

export const ink = {
  /** Overshooting ellipse around a phrase (hero title). Stretched to fit. */
  circle: mark(
    "0 0 300 80",
    ["M46 12 C 118 -3, 254 2, 288 28 C 312 50, 232 77, 142 75 C 62 73, 6 62, 9 39 C 12 22, 52 9, 128 6"],
    4,
  ),

  /** Under headings and the contact email. Stretched to fit. */
  underline: mark("0 0 400 16", ["M3 9 C 90 3, 210 13, 397 6"], 5),

  /** Under the nav name. */
  underlineShort: mark("0 0 118 8", ["M2 5 C 30 2, 70 7, 116 3"], 3.5),

  /** Under drawn links (pen) and secondary drawn links (ink). Stretched to fit. */
  underlineLink: mark("0 0 200 12", ["M2 7 C 50 3, 120 10, 198 4"], 3),
  underlineLinkAlt: mark("0 0 200 12", ["M2 6 C 60 9, 130 3, 198 7"], 3),

  /** Two quick lines through a crossed-out draft, loose enough to still read
      the joke. Stretched to fit. */
  strike: mark("0 0 200 30", ["M2 14 C 60 10, 140 17, 198 12", "M6 20 C 70 17, 128 22, 194 18"], 2.2),

  /** Margin note pointing back at its subject on the left. */
  arrowLeft: mark("0 0 46 30", ["M44 22 C 32 26, 16 22, 6 8", "M4 17 L5 7 L14 8"], 2),

  /** From a note above-left down toward its subject ("hi, I'm" to the name). */
  arrowDownRight: mark("0 0 58 40", ["M4 8 C 22 2, 40 10, 46 30", "M37 25 L46 32 L50 21"], 2.2),

  /** Margin note below its subject, pointing up at it (phones), and the contact note. */
  arrowUpRight: mark("0 0 40 34", ["M4 30 C 6 16, 18 6, 34 6", "M26 1 L35 6 L27 12"], 2),

  /** Short connector between boxes in a sketch or diagram. */
  arrowRight: mark("0 0 28 20", ["M3 10 C 10 9, 17 11, 24 10", "M18 5 L25 10 L18 15"], 2),

  /** Short connector, top to bottom (diagrams on phones). */
  arrowDown: mark("0 0 20 28", ["M10 3 C 9 10, 11 17, 10 24", "M5 18 L10 25 L15 18"], 2),

  /** "then make it better" loop under the how-I-build sketch. Stretched to fit. */
  arrowLoop: mark(
    "0 0 430 64",
    ["M372 6 C 376 52, 300 58, 214 58 C 128 58, 62 54, 60 12", "M51 22 L60 9 L69 21"],
    2,
  ),

  /** To-do checkbox tick (drawn over an InkBox). */
  check: mark("0 0 22 22", ["M5 11 C 7 13, 8 15, 9 17 C 12 11, 15 7, 21 1"], 2.4),

  /** Hero click marks (spec 5.2), in rotation. */
  markStar: mark(
    "0 0 48 48",
    ["M24 5 L29.5 18.5 L44 19 L32.5 28 L36.5 42.5 L24 34 L11.5 42.5 L15.5 28 L4 19 L18.5 18.5 Z"],
    3,
  ),
  markCheck: mark("0 0 48 48", ["M7 27 C 12 31, 15 35, 18 39 C 24 27, 32 15, 43 7"], 3),
  markScribble: mark(
    "0 0 48 48",
    ["M10 30 C 5 15, 27 7, 33 18 C 39 29, 19 37, 17 26 C 15 15, 35 9, 41 22"],
    3,
  ),
  markBurst: mark(
    "0 0 48 48",
    ["M24 3 L24 13 M24 35 L24 45 M3 24 L13 24 M35 24 L45 24 M9 9 L16 16 M32 32 L39 39 M39 9 L32 16 M16 32 L9 39"],
    3,
  ),

  /** The lamp's light, drawn under the shade in light mode (LampToggle). */
  lampRays: mark("0 0 24 24", ["M9 14 L7.5 16.5", "M15 14 L16.5 16.5"], 2),
} as const satisfies Record<string, InkMark>;

export type InkName = keyof typeof ink;

export const CLICK_MARKS = ["markStar", "markCheck", "markScribble", "markBurst"] as const satisfies readonly InkName[];
