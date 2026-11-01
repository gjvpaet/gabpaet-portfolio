import { useSyncExternalStore } from "react";

// Notebook spec 6: from 768px cards land on the desk; below, they open as a
// bottom sheet. Written in rem to match Tailwind's `md`.
const QUERY = "(min-width: 48rem)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True from 768px, false below, null during SSR and hydration. */
export function useIsDesktop(): boolean | null {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => null);
}
