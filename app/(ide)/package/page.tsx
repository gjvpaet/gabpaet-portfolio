import type { Metadata } from "next";

import PackageJsonBody from "@/content/package-json";

export const metadata: Metadata = {
  title: "package.json",
  description: "Gabriel Joshua Paet — identity as a package.",
};

export default function PackagePage() {
  return <PackageJsonBody />;
}
