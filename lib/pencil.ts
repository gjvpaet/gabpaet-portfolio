import { useSyncExternalStore } from "react";

// Whether the pencil is out (spec 5.2, 6.10). One tiny shared store, so the
// nav's PencilButton and the PencilLayer (and its pinned bar) agree without
// a context provider around the whole app. Not persisted: doodles are a toy.
let active = false;
const listeners = new Set<() => void>();

export const pencil = {
  get: () => active,
  set(next: boolean) {
    if (next === active) return;
    active = next;
    listeners.forEach((listener) => listener());
  },
  toggle() {
    pencil.set(!active);
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
