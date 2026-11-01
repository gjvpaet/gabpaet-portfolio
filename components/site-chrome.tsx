import type { ReactNode } from "react";

import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PaperMarks } from "@/components/paper-marks";
import { PencilLayer } from "@/components/pencil-layer";
import { profile } from "@/content/profile";

// The site's chrome (spec 6.8, 6.10, 6.16, 6.17, 5.2): the nav,
// back-to-top, footer, ink marks and the pencil. Wraps every page of the
// app/(site) group and the 404. /notebook sits outside it: the desk has its
// own toolbar and dock.
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav shortName={profile.shortName} />
      {children}
      <BackToTop />
      <Footer />
      <PaperMarks />
      <PencilLayer />
    </>
  );
}
