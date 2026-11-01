import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site-chrome";

// Home, case studies and the résumé share the site's chrome. The group
// changes no URL.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
