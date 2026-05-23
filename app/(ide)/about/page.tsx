import type { Metadata } from "next";

import AboutBody from "@/content/about";

export const metadata: Metadata = {
  title: "about.md",
  description: "Gabriel Joshua Paet — senior programmer · 9 years shipping · pasay city.",
};

export default function AboutPage() {
  return <AboutBody />;
}
