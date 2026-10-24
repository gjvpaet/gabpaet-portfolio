import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Shantell_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { InkFilters } from "@/components/ink/ink-filters";
import { PaperMarks } from "@/components/paper-marks";
import { PenCursor } from "@/components/pen-cursor";
import { PencilLayer } from "@/components/pencil-layer";
import { SplashName } from "@/components/splash-name";
import { Nav } from "@/components/nav";
import { SkipLink } from "@/components/skip-link";
import { profile } from "@/content/profile";
import { SPLASH_INIT_SCRIPT } from "@/lib/splash";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { tokens } from "@/lib/tokens";
import "./globals.css";

// The browser tab shows just the name (after aahil-khan.xyz); link previews
// (Open Graph, X) keep the role, where there is room to say who this is.
const SITE_TITLE = `${profile.name}, ${profile.role}`;

// Structure layer (spec 4.2). Variable on weight and optical size; display
// type uses opsz 96. The width axis is left out on purpose: nothing uses
// it, and it nearly doubles the file, which mobile LCP pays for.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// Pen layer: handwriting for notes, dates and captions, with the INFM
// (informality) axis set per role in globals.css. Preloaded: the hero's
// "hi, I'm" is above the fold, so a late discovery would hold up first
// paint. The BNCE axis is left out for size.
const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  axes: ["INFM"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: profile.name,
    template: `%s | ${profile.name}`,
  },
  description: profile.metaDescription,
  applicationName: "gabpaet.dev",
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [
    "Gabriel Joshua Paet",
    "gabpaet",
    "software developer",
    "full-stack developer",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "AI engineer",
    "Philippines",
  ],
  // sitemap.xml, robots.txt, opengraph-image, icon and apple-icon come from
  // the app/ file conventions, so they are not listed here.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "gabpaet.dev",
    title: SITE_TITLE,
    description: profile.metaDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: profile.metaDescription,
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
  // Light by default whatever the OS prefers (lib/theme.ts); the night page
  // sets its own color-scheme in globals.css.
  themeColor: tokens.light.paper,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// schema.org Person + WebSite (spec 13), built from content/profile.ts so the
// structured data can never disagree with the page.
const currentRole = profile.roles.find((r) => r.current);

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: "gabpaet",
  url: profile.site,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  ...(currentRole ? { worksFor: { "@type": "Organization", name: currentRole.company } } : {}),
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.address.locality,
    addressRegion: profile.address.region,
    addressCountry: profile.address.country,
  },
  sameAs: [profile.links.github, profile.links.linkedin],
  knowsAbout: profile.skills.flatMap((group) => group.items),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "gabpaet.dev",
  url: profile.site,
  author: { "@type": "Person", name: profile.name },
  inLanguage: "en",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${shantell.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: apply a saved light/dark choice, decide whether
            the splash plays, and flag that JS runs so scroll reveals may
            start hidden (see globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: SPLASH_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
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
        <InkFilters />
        <SplashName />
        <SkipLink />
        <Nav shortName={profile.shortName} />
        {children}
        <BackToTop />
        <Footer />
        <PaperMarks />
        <PencilLayer />
        <PenCursor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
