"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { CardId } from "@/lib/notebook";

// What the desk's cards share without passing through React Flow's node
// data: the six card bodies (server components, rendered in
// app/notebook/page.tsx) and the desk's own actions.
export const CardBodies = createContext<Partial<Record<CardId, ReactNode>>>({});
export const DeskActions = createContext<{ close: (id: CardId) => void }>({ close: () => {} });

export function useCardBody(id: CardId): ReactNode {
  return useContext(CardBodies)[id] ?? null;
}

export function useDeskActions() {
  return useContext(DeskActions);
}
