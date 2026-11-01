"use client";

import { Briefcase, EnvelopeSimple, FileText, Folders, User, Wrench, type Icon } from "@phosphor-icons/react";

import type { CardId } from "@/lib/notebook";

const ICONS: Record<CardId, Icon> = {
  about: User,
  projects: Folders,
  experience: Briefcase,
  toolbox: Wrench,
  contact: EnvelopeSimple,
  resume: FileText,
};

// Each card's icon, in its title bar and on its dock button (notebook spec 3).
export function CardIcon({ id, size = 20 }: { id: CardId; size?: number }) {
  const Glyph = ICONS[id];
  return <Glyph aria-hidden="true" size={size} weight="bold" />;
}
