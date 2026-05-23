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
// renders, so a non-default accent/density doesn't flash on first paint.
const FOUC_SCRIPT = `
(function(){
  try {
    var raw = localStorage.getItem('portfolio.tweaks.v1');
    if (!raw) return;
    var t = JSON.parse(raw);
    var ACCENTS = {
      '#2ee5b4':'#04211a','#f97070':'#2a0606','#7a9cff':'#08122b',
      '#f2c14e':'#2a1d00','#c084fc':'#1c0a30'
    };
    var DENSITY = {
      compact:  ['12px','1.55','12px','20px','2px','12px'],
      cozy:     ['14px','1.85','22px','28px','5px','22px'],
      spacious: ['15.5px','2.1','32px','40px','8px','32px']
    };
    var r = document.documentElement.style;
    if (t.accent && ACCENTS[t.accent.toLowerCase()]) {
      r.setProperty('--accent', t.accent);
      r.setProperty('--accent-ink', ACCENTS[t.accent.toLowerCase()]);
    }
    var d = DENSITY[t.density];
    if (d) {
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
