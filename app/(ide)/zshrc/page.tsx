import type { Metadata } from "next";

import ZshrcBody from "@/content/zshrc";

export const metadata: Metadata = {
  title: ".zshrc",
  description: "Gabriel Joshua Paet's shell config — aliases and helpers.",
};

export default function ZshrcPage() {
  return <ZshrcBody />;
}
