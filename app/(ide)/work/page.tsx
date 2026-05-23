import type { Metadata } from "next";

import WorkBody from "@/content/work";

export const metadata: Metadata = {
  title: "work.md",
  description:
    "Gabriel Joshua Paet — work history across Lumora Capital, ahaStudio, Volenday Group, HPE.",
};

export default function WorkPage() {
  return <WorkBody />;
}
