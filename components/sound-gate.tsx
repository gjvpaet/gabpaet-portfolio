"use client";

import { createContext, useContext } from "react";

// Whether the site's small UI sounds may play here (the copy button's pen
// tick). On by default; the notebook desk passes its Sound toggle, which is
// off on arrival (notebook spec 9).
export const SoundGate = createContext(true);

export function useSoundOn(): boolean {
  return useContext(SoundGate);
}
