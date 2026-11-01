// The notebook desk (/notebook, docs/superpowers/specs/2026-11-01-notebook-desk-design.md).
// Pure data and helpers: which cards exist, where each lies on the desk, and
// how `?card=` is read and written. No React and no DOM, so it is unit-tested
// in node (lib/notebook.test.ts).

export const CARD_IDS = ["about", "projects", "experience", "toolbox", "contact", "resume"] as const;
export type CardId = (typeof CARD_IDS)[number];

export const CARD_TITLES: Record<CardId, string> = {
  about: "About",
  projects: "Projects",
  experience: "Experience",
  toolbox: "Toolbox",
  contact: "Contact",
  resume: "Résumé",
};

export type Point = { x: number; y: number };
export type Rect = Point & { width: number; height: number };

/** Each card's width in desk units (px at 100% zoom), and the most height
    it takes at that width. Cards never scroll: each is wide enough for its
    whole body, so Experience and Toolbox lie landscape. The heights were
    measured in Chrome with a little room spare; re-measure them after a
    content change makes a card taller. */
export const CARD_SIZE: Record<CardId, { width: number; height: number }> = {
  about: { width: 560, height: 460 },
  projects: { width: 360, height: 470 },
  experience: { width: 760, height: 600 },
  toolbox: { width: 760, height: 640 },
  contact: { width: 360, height: 320 },
  resume: { width: 360, height: 300 },
};

/** The name node's box, centred on the desk's origin. */
export const NAME_BOX: Rect = { x: -210, y: -130, width: 420, height: 260 };

/** Where each card lies when first opened (its top-left corner), and its
    settled tilt in degrees. About sits above the name, the two landscape
    sheets either side of it and the small cards below them; all six open at
    once never overlap at 100% (lib/notebook.test.ts). */
export const HOME: Record<CardId, { position: Point; tilt: number }> = {
  experience: { position: { x: -1100, y: -620 }, tilt: 0.6 },
  projects: { position: { x: -700, y: 40 }, tilt: -1.2 },
  about: { position: { x: -280, y: -620 }, tilt: 0.8 },
  toolbox: { position: { x: 340, y: -620 }, tilt: -0.5 },
  contact: { position: { x: 340, y: 80 }, tilt: -1 },
  resume: { position: { x: 740, y: 80 }, tilt: 1.4 },
};

/** The most room a card can take at its home position. */
export function homeRect(id: CardId): Rect {
  return { ...HOME[id].position, ...CARD_SIZE[id] };
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

export function isCardId(value: unknown): value is CardId {
  return typeof value === "string" && (CARD_IDS as readonly string[]).includes(value);
}

/** The card a `?card=` link asks for, or null for none or an unknown one. */
export function parseCard(search: string): CardId | null {
  const value = new URLSearchParams(search).get("card");
  return isCardId(value) ? value : null;
}

/** The query string for the open cards: `card` names the most recently
    opened one still open, or is dropped when none is. Other parameters are
    kept. Returns "" or "?...". */
export function cardSearch(search: string, open: readonly CardId[]): string {
  const params = new URLSearchParams(search);
  const top = open[open.length - 1];
  if (top) params.set("card", top);
  else params.delete("card");
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** The desk's zoom range and the zoom buttons' step. */
export const ZOOM = { min: 0.4, max: 1.5, step: 0.1 } as const;

/** A zoom held within the desk's range. */
export function clampZoom(zoom: number): number {
  return Math.min(ZOOM.max, Math.max(ZOOM.min, zoom));
}

/** Easing for the desk's animated glides and zooms: an ease-out quart,
    which approximates --ease-out (cubic-bezier(0.16, 1, 0.3, 1)) in
    app/globals.css. React Flow takes a function, not a CSS curve. */
export const EASE_OUT = (t: number): number => 1 - Math.pow(1 - t, 4);

/** The zoom readout: 0.996 is "100%". */
export function zoomLabel(zoom: number): string {
  return `${Math.round(zoom * 100)}%`;
}

/** Set to "seen" once the tour is skipped or finished: the only thing /notebook stores. */
export const TOUR_STORAGE_KEY = "gp-notebook-tour";
