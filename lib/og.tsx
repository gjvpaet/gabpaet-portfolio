import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { ink, type InkName } from "@/lib/ink";
import { tokens } from "@/lib/tokens";

// Share images and icons are rendered by next/og (Satori), which reads static
// TTF/OTF files only: no CSS variables, no variable-font axes, no SVG filters.
// The fonts in assets/fonts are fixed instances from Google Fonts, all SIL Open
// Font License: Bricolage Grotesque (opsz 96 / wght 800, and opsz 24 / wght
// 500) and Shantell Sans 600 / 700 (default INFM; the static API does not
// instance its custom axes).
const FONT_DIR = join(process.cwd(), "assets/fonts");

export async function ogFonts() {
  const [display, body, hand, handBold] = await Promise.all([
    readFile(join(FONT_DIR, "BricolageGrotesque-ExtraBold.ttf")),
    readFile(join(FONT_DIR, "BricolageGrotesque-Medium.ttf")),
    readFile(join(FONT_DIR, "ShantellSans-SemiBold.ttf")),
    readFile(join(FONT_DIR, "ShantellSans-Bold.ttf")),
  ]);
  return [
    { name: "Bricolage", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Bricolage", data: body, weight: 500 as const, style: "normal" as const },
    { name: "Shantell", data: hand, weight: 600 as const, style: "normal" as const },
    { name: "Shantell", data: handBold, weight: 700 as const, style: "normal" as const },
  ];
}

export const OG_SIZE = { width: 1200, height: 630 };

const t = tokens.light;

/** A mark from lib/ink.ts as a plain SVG (stretched to its box when asked). */
function Mark({
  name,
  width,
  height,
  color,
  strokeWidth,
  stretch = false,
}: {
  name: InkName;
  width: number;
  height: number;
  color: string;
  strokeWidth?: number;
  stretch?: boolean;
}) {
  const m = ink[name];
  return (
    <svg width={width} height={height} viewBox={m.viewBox} preserveAspectRatio={stretch ? "none" : undefined}>
      {m.strokes.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth ?? m.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

// The how-I-build napkin from the hero, simplified for a still image: a
// taped sheet, a handwritten title, three hand-drawn boxes joined by arrows.
function Napkin() {
  const steps = ["rough idea", "first version", "people use it"];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        width: 360,
        padding: "40px 28px 30px",
        background: t.sheet,
        borderRadius: 3,
        boxShadow: "0 26px 50px -24px rgba(29,29,27,0.35), 0 2px 0 rgba(29,29,27,0.18)",
        transform: "rotate(3deg)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -14,
          left: 132,
          width: 100,
          height: 30,
          background: "rgba(205,207,196,0.85)",
          transform: "rotate(-4deg)",
        }}
      />
      <div style={{ display: "flex", fontFamily: "Shantell", fontWeight: 700, fontSize: 30, color: t.ink, marginBottom: 18 }}>
        how I like to build
      </div>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {i > 0 ? <Mark name="arrowDown" width={20} height={28} color={t.ink} /> : null}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: 220,
              height: 54,
              marginTop: i > 0 ? 2 : 0,
              background: i === steps.length - 1 ? tokens.light.washOnPaper : "transparent",
              borderRadius: 6,
            }}
          >
            <div style={{ display: "flex", position: "absolute", top: 0, left: 0 }}>
              <Mark name="ogBox" width={220} height={54} color={t.ink} stretch />
            </div>
            <span style={{ fontFamily: "Shantell", fontWeight: 600, fontSize: 24, color: t.ink }}>{step}</span>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", fontFamily: "Shantell", fontWeight: 600, fontSize: 20, color: t.pen, marginTop: 18 }}>
        then make it better. repeat.
      </div>
    </div>
  );
}

/**
 * The share card (spec 13): dot-grid paper, a handwritten note, the title in
 * Bricolage ExtraBold, then either the role circled in purple pen (home) or
 * the project summary, and the how-I-build napkin taped on the right.
 */
export async function renderShareCard({
  note,
  title,
  circled,
  subtitle,
}: {
  /** Handwritten line above the title: "hi, I'm", "case study". */
  note: string;
  title: string;
  /** Circled in pen under the title (the role). */
  circled?: string;
  subtitle: string;
}): Promise<ImageResponse> {
  const titleSize = title.length > 14 ? 100 : 112;
  // Satori cannot size an SVG to its parent, so the ring around the role is
  // sized from the text: about 0.56em per character of Bricolage ExtraBold.
  const ringWidth = circled ? Math.round(circled.length * 21.5 + 56) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "56px 70px 56px 80px",
          position: "relative",
          backgroundColor: t.paper,
        }}
      >
        {/* Dot-grid paper. Satori ignores repeating CSS gradients, so the
            dots are an SVG pattern behind everything. */}
        <svg width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="13" cy="13" r="1.7" fill="rgba(29,29,27,0.17)" />
            </pattern>
          </defs>
          <rect width={OG_SIZE.width} height={OG_SIZE.height} fill="url(#dots)" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", fontFamily: "Shantell", fontWeight: 600, fontSize: 34, color: t.pen, transform: "rotate(-3deg)", marginBottom: 6 }}>
            {note}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 660,
              fontFamily: "Bricolage",
              fontWeight: 800,
              fontSize: titleSize,
              lineHeight: 0.94,
              letterSpacing: "-0.035em",
              color: t.ink,
            }}
          >
            {title}
          </div>
          {circled ? (
            <div style={{ display: "flex", position: "relative", alignSelf: "flex-start", width: ringWidth, marginTop: 34, padding: "10px 26px" }}>
              <span style={{ fontFamily: "Bricolage", fontWeight: 800, fontSize: 38, letterSpacing: "-0.01em", color: t.ink }}>
                {circled}
              </span>
              <div style={{ display: "flex", position: "absolute", top: -6, left: -12 }}>
                <Mark name="circle" width={ringWidth + 24} height={78} color={t.pen} strokeWidth={4} stretch />
              </div>
            </div>
          ) : null}
          <div style={{ display: "flex", maxWidth: 620, marginTop: circled ? 26 : 30, fontFamily: "Bricolage", fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: t.inkSoft }}>
            {subtitle}
          </div>
        </div>
        <Napkin />
      </div>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}

/** The handwritten "gp" in a pen ring: favicon and Apple touch icon. */
export async function renderIconMark({
  size,
  fontSize,
  ringStroke,
}: {
  size: number;
  fontSize: number;
  /** Ring stroke width in its 100-unit viewBox. */
  ringStroke: number;
}): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
          height: "100%",
          background: t.paper,
        }}
      >
        {/* Inset a little, so the ring's overshoot never touches the edge. */}
        <div style={{ display: "flex", position: "absolute", top: size * 0.04, left: size * 0.04 }}>
          <Mark name="ring" width={size * 0.92} height={size * 0.92} color={t.pen} strokeWidth={ringStroke} />
        </div>
        <span style={{ fontFamily: "Shantell", fontWeight: 700, fontSize, lineHeight: 1, color: t.ink, marginTop: -fontSize * 0.12 }}>
          gp
        </span>
      </div>
    ),
    { width: size, height: size, fonts: await ogFonts() },
  );
}
