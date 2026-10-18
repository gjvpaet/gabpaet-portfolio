import type { ComponentType } from "react";

import type { ProjectSlug } from "@/content/projects";

import { PortfolioV1Napkin } from "./portfolio-v1";
import { TongMastersNapkin } from "./tong-masters";

const NAPKINS: Record<ProjectSlug, ComponentType<{ className?: string }>> = {
  "tong-masters": TongMastersNapkin,
  "portfolio-v1": PortfolioV1Napkin,
};

// The napkin sketch for a project, picked by slug (spec 8.2).
export function ProjectNapkin({ slug }: { slug: ProjectSlug }) {
  const Napkin = NAPKINS[slug];
  return <Napkin />;
}
