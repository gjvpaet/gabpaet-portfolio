import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import { siClaude } from "simple-icons";

import { tokens } from "@/lib/tokens";

// Share images and icons are rendered by next/og (Satori), which reads static
// TTF/OTF files only: no CSS variables, no variable-font axes. The fonts in
// assets/fonts are fixed instances of Archivo (wdth 125 / wght 800, and
// wght 500) and JetBrains Mono 600, all SIL Open Font License.
const FONT_DIR = join(process.cwd(), "assets/fonts");

export async function ogFonts() {
  const [display, body, mono] = await Promise.all([
    readFile(join(FONT_DIR, "Archivo-Expanded-ExtraBold.ttf")),
    readFile(join(FONT_DIR, "Archivo-Medium.ttf")),
    readFile(join(FONT_DIR, "JetBrainsMono-SemiBold.ttf")),
  ]);
  return [
    { name: "Archivo Expanded", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Archivo", data: body, weight: 500 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 600 as const, style: "normal" as const },
  ];
}

export const OG_SIZE = { width: 1200, height: 630 };

const { light, mint, yellow, onAccent } = tokens;

// Measured: an uppercase Archivo Expanded ExtraBold word is about 0.805em wide
// per letter. Size the title so its longest word fits beside the stickers.
const TITLE_MAX_PX = 104;
const TITLE_MAX_WIDTH = 620;
function titleSize(words: string[]): number {
  const longest = Math.max(...words.map((w) => w.length));
  return Math.min(TITLE_MAX_PX, Math.floor(TITLE_MAX_WIDTH / (longest * 0.805)));
}

function Sticker({ fill, rotate, children }: { fill: string; rotate: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 150,
        background: fill,
        border: `5px solid ${light.ink}`,
        borderRadius: 22,
        boxShadow: `10px 10px 0 0 ${light.ink}`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * The share card (spec 13): light page, a 6px outlined frame with a hard
 * 12px shadow, the title stacked one word per line, a line under it, a
 * yellow chip, and two tilted stickers on the right.
 */
export async function renderShareCard({
  title,
  subtitle,
  chip,
}: {
  title: string;
  subtitle: string;
  chip: string;
}): Promise<ImageResponse> {
  const words = title.toUpperCase().split(/\s+/);
  const size = titleSize(words);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: light.bg, padding: 32 }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            marginRight: 12,
            marginBottom: 12,
            padding: "44px 56px",
            background: light.surface,
            border: `6px solid ${light.ink}`,
            borderRadius: 28,
            boxShadow: `12px 12px 0 0 ${light.ink}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, gap: 26 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 20px",
                background: yellow,
                color: onAccent,
                border: `3px solid ${light.ink}`,
                borderRadius: 999,
                boxShadow: `4px 4px 0 0 ${light.ink}`,
                fontFamily: "Archivo",
                fontSize: 24,
              }}
            >
              {chip}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Archivo Expanded",
                fontSize: size,
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                color: light.ink,
              }}
            >
              {words.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
            <div style={{ display: "flex", maxWidth: 640, fontFamily: "Archivo", fontSize: 30, lineHeight: 1.3, color: light.inkMuted }}>
              {subtitle}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 44, paddingRight: 8 }}>
            <Sticker fill={mint} rotate={-8}>
              <svg width="76" height="76" viewBox="0 0 24 24">
                <path d={siClaude.path} fill={onAccent} />
              </svg>
            </Sticker>
            <div style={{ display: "flex", marginLeft: 60 }}>
              <Sticker fill={light.ink} rotate={6}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 54, color: light.bg }}>&gt;_</span>
              </Sticker>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}

/** The "GP" monogram tile used for the favicon and the Apple touch icon. */
export async function renderMonogram({
  size,
  fontSize,
  radius,
  border,
}: {
  size: number;
  fontSize: number;
  radius: number;
  border: number;
}): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: mint,
          color: onAccent,
          border: border ? `${border}px solid ${light.ink}` : "none",
          borderRadius: radius,
          fontFamily: "Archivo Expanded",
          fontSize,
          letterSpacing: "-0.02em",
        }}
      >
        GP
      </div>
    ),
    { width: size, height: size, fonts: await ogFonts() },
  );
}
