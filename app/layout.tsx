import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Shantell_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/footer";
import { InkFilters } from "@/components/ink/ink-filters";
import { PencilLayer } from "@/components/pencil-layer";
import { SplashSignature } from "@/components/splash-signature";
import { Nav } from "@/components/nav";
import { SkipLink } from "@/components/skip-link";
import { profile } from "@/content/profile";
import { SPLASH_INIT_SCRIPT } from "@/lib/splash";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { tokens } from "@/lib/tokens";
import "./globals.css";

const SITE_TITLE = `${profile.name}, ${profile.role}`;

// Structure layer (spec 4.2). Variable on weight, optical size and width;
// display type uses opsz 96.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

// Pen layer: handwriting for notes, dates and captions. INFM (informality)
// and BNCE (bounce) are set per role in globals.css.
const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  axes: ["BNCE", "INFM"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: SITE_TITLE,
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
    "senior programmer",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: tokens.light.paper },
    { media: "(prefers-color-scheme: dark)", color: tokens.dark.paper },
  ],
  colorScheme: "light dark",
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
        <SplashSignature />
        <SkipLink />
        <Nav shortName={profile.shortName} />
        {children}
        <Footer />
        <PencilLayer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
