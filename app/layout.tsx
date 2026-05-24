import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gabpaet.dev"),
  title: {
    default: "Gabriel Joshua Paet — Senior Programmer",
    template: "%s — Gabriel Joshua Paet",
  },
  description: "9 years shipping. AI · automation · DevOps · web.",
  openGraph: {
    type: "website",
    siteName: "gabpaet.dev",
    title: "Gabriel Joshua Paet — Senior Programmer",
    description: "9 years shipping. AI · automation · DevOps · web.",
  },
  twitter: {
    card: "summary",
    title: "Gabriel Joshua Paet — Senior Programmer",
    description: "9 years shipping. AI · automation · DevOps · web.",
  },
};

// Read saved tweaks from localStorage and write CSS variables BEFORE the body
// renders, so a non-default accent / density / theme doesn't flash on first
// paint. Mirrors lib/tweaks.ts + context/tweaks-provider.tsx — see CLAUDE.md
// for the sync rules (accent companions, density tuples, storage key).
const FOUC_SCRIPT = `
(function(){
  try {
    var raw = localStorage.getItem('portfolio.tweaks.v1');
    if (!raw) {
      document.documentElement.setAttribute('data-theme', 'dark');
      return;
    }
    var t = JSON.parse(raw);
    // accent → { ink (dark mode), lightC, lightInk }
    var ACCENTS = {
      '#2ee5b4': { ink: '#04211a', lightC: '#0f9d77', lightInk: '#ffffff' },
      '#f97070': { ink: '#2a0606', lightC: '#dc2626', lightInk: '#ffffff' },
      '#7a9cff': { ink: '#08122b', lightC: '#3b5bdb', lightInk: '#ffffff' },
      '#f2c14e': { ink: '#2a1d00', lightC: '#b45309', lightInk: '#ffffff' },
      '#c084fc': { ink: '#1c0a30', lightC: '#8b5cf6', lightInk: '#ffffff' }
    };
    var DENSITY = {
      compact:  ['12px','1.55','12px','20px','2px','12px'],
      cozy:     ['14px','1.85','22px','28px','5px','22px'],
      spacious: ['15.5px','2.1','32px','40px','8px','32px']
    };
    var html = document.documentElement;
    var isLight = t.theme === 'light';
    html.setAttribute('data-theme', isLight ? 'light' : 'dark');
    var a = t.accent && ACCENTS[t.accent.toLowerCase()];
    if (a) {
      html.style.setProperty('--accent',     isLight ? a.lightC   : t.accent);
      html.style.setProperty('--accent-ink', isLight ? a.lightInk : a.ink);
    }
    var d = DENSITY[t.density];
    if (d) {
      var r = html.style;
      r.setProperty('--doc-fs', d[0]);
      r.setProperty('--doc-lh', d[1]);
      r.setProperty('--doc-pad-y', d[2]);
      r.setProperty('--doc-pad-x', d[3]);
      r.setProperty('--side-item-pad', d[4]);
      r.setProperty('--gutter-pad-y', d[5]);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body>
        <Script id="tweaks-fouc" strategy="beforeInteractive">
          {FOUC_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
