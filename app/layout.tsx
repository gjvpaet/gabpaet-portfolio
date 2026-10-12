import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SkipLink } from "@/components/skip-link";
import { profile } from "@/content/profile";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { tokens } from "@/lib/tokens";
import "./globals.css";

const SITE_URL = "https://gabpaet.dev";
const SITE_TITLE = "Gabriel Joshua Paet, Senior Programmer";
const SITE_DESCRIPTION =
  "Senior programmer with 9 years of experience. AI agents, workflow automation, DevOps, and full-stack web. Based in Pasay City, currently at Lumora Capital.";

// Archivo is variable on weight and width; the wdth axis drives the wide
// display type (font-stretch: 110% / 125%).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Gabriel Joshua Paet",
  },
  description: SITE_DESCRIPTION,
  applicationName: "gabpaet.dev",
  authors: [{ name: "Gabriel Joshua Paet", url: SITE_URL }],
  creator: "Gabriel Joshua Paet",
  publisher: "Gabriel Joshua Paet",
  keywords: [
    "Gabriel Joshua Paet",
    "gabpaet",
    "senior programmer",
    "full-stack developer",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "AI engineer",
    "Philippines",
    "Lumora Capital",
  ],
  // App Router auto-includes /sitemap.xml + /robots.txt + /opengraph-image
  // via the file conventions, so no need to list them here.
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "gabpaet.dev",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: tokens.light.bg },
    { media: "(prefers-color-scheme: dark)", color: tokens.dark.bg },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// schema.org/Person — gives Google enough structured data to build a
// knowledge-panel-style result with name, role, location, and sameAs links.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gabriel Joshua Paet",
  alternateName: "gabpaet",
  url: SITE_URL,
  jobTitle: "Senior Programmer",
  worksFor: {
    "@type": "Organization",
    name: "Lumora Capital",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pasay City",
    addressRegion: "NCR",
    addressCountry: "PH",
  },
  sameAs: ["https://github.com/gjvpaet"],
  knowsAbout: [
    "Node.js",
    "Next.js",
    "React",
    "React Native",
    "TypeScript",
    "PostgreSQL",
    "LangChain",
    "OpenAI API",
    "AWS Bedrock Agents",
    "Google Vertex AI",
    "DevOps",
    "Workflow automation",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "gabpaet.dev",
  url: SITE_URL,
  author: { "@type": "Person", name: "Gabriel Joshua Paet" },
  inLanguage: "en",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a saved light/dark choice before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <SkipLink />
        <Nav shortName={profile.shortName} />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
