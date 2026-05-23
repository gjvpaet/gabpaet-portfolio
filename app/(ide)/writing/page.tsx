import type { Metadata } from "next";

import WritingBody from "@/content/writing";

export const metadata: Metadata = {
  title: "writing.md",
  description: "Coming soon.",
};

export default function WritingPage() {
  return <WritingBody />;
}
