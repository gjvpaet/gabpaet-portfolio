import { useSyncExternalStore } from "react";

import { pencilSound } from "@/lib/pencil-sound";

// Whether the pencil is out (spec 5.2, 6.10). One tiny shared store, so the
// nav's PencilButton and the PencilLayer (and its pinned bar) agree without
// a context provider around the whole app. Not persisted: doodles are a toy.
let active = false;
const listeners = new Set<() => void>();

export const pencil = {
  get: () => active,
  /** `silent` skips the pick-up and put-down sounds: the notebook desk
      while its Sound toggle is off. */
  set(next: boolean, silent = false) {
    if (next === active) return;
    active = next;
    // Every way in and out comes through here (the nav button, the bar,
    // Esc, a new page), mostly straight from a click or key, which is the
    // user gesture audio needs.
    if (!silent) {
      if (next) pencilSound.pickUp();
      else pencilSound.putDown();
    }
    listeners.forEach((listener) => listener());
  },
  toggle(silent = false) {
    pencil.set(!active, silent);
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** True while the pencil is out. Always false during SSR and hydration. */
export function usePencil(): boolean {
  return useSyncExternalStore(pencil.subscribe, pencil.get, () => false);
}
