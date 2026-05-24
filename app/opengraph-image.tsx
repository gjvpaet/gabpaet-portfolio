import { ImageResponse } from "next/og";

// Route segment config — Next renders this PNG at build time as a static asset
// (the content has no runtime inputs), then Vercel CDN-caches it indefinitely.
export const alt = "Gabriel Joshua Paet — Senior Programmer · gabpaet.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Renders a 1200×630 PNG that mimics the IDE chrome: dark bg, traffic-light
 * dots, ~/portfolio breadcrumb, the same mint accent token, and a status pill.
 * No custom font fetch — the platform default monospace ships zero KB and
 * keeps the build deterministic; visual identity comes from color + layout.
 */
export default async function OpengraphImage() {
  const bg = "#0d1b2a";
  const side = "#0b1624";
  const panel = "#11243a";
  const accent = "#2ee5b4";
  const accentInk = "#04211a";
  const fg = "#dbe4f0";
  const fgBright = "#ffffff";
  const fgDim = "#7b8aa3";
  const orange = "#ef8a5b";
  const border = "rgba(255,255,255,0.12)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: bg,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          color: fg,
        }}
      >
        {/* TITLE BAR — three dots + path */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 32px",
            background: side,
            borderBottom: `1px solid ${border}`,
            fontSize: 22,
            color: fgDim,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: "#ff5f56",
              }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: "#27c93f",
              }}
            />
          </div>
          <div style={{ display: "flex", marginLeft: 12, color: fg }}>
            <span style={{ color: accent }}>~</span>
            <span>/portfolio · </span>
            <span style={{ color: accent, marginLeft: 6 }}>about.md</span>
          </div>
        </div>

        {/* BODY */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px",
            gap: 12,
          }}
        >
          {/* status pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 22px 10px 18px",
              border: `1px solid ${border}`,
              borderRadius: 999,
              fontSize: 22,
              color: fg,
              alignSelf: "flex-start",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: orange,
              }}
            />
            <span>currently @ Lumora Capital</span>
          </div>

          {/* H1 */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              fontSize: 84,
              fontWeight: 700,
              color: fgBright,
              letterSpacing: -1,
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: accent, fontWeight: 500 }}>#</span>
            <span>Gabriel Joshua Paet</span>
          </div>

          {/* subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: fgDim,
              marginTop: 8,
            }}
          >
            senior programmer · pasay city, ph · 9 years shipping
          </div>

          {/* primary stack chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 36,
            }}
          >
            {[
              "Node.js",
              "Next.js",
              "React",
              "TypeScript",
              "PostgreSQL",
              "AI / LLM",
              "AWS · GCP",
            ].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "6px 16px",
                  border: `1px solid ${border}`,
                  borderRadius: 6,
                  fontSize: 22,
                  color: fgDim,
                  background: panel,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* STATUS BAR — accent strip on the bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            background: accent,
            color: accentInk,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>● gabpaet.dev</span>
          <span>main · UTF-8 · Markdown</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
