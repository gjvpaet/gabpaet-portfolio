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

/** Card width in desk units (px at 100% zoom). */
export const CARD_WIDTH = 360;
/** The tallest a card gets: its title bar plus a body capped at 440px. */
export const CARD_MAX_HEIGHT = 540;

/** The name node's box, centred on the desk's origin. */
export const NAME_BOX: Rect = { x: -210, y: -130, width: 420, height: 260 };

/** Where each card lies when first opened (its top-left corner), and its
    settled tilt in degrees. Two columns either side of the name; all six
    open at once never overlap at 100% (lib/notebook.test.ts). */
export const HOME: Record<CardId, { position: Point; tilt: number }> = {
  projects: { position: { x: -660, y: -320 }, tilt: -1.2 },
  experience: { position: { x: -660, y: 260 }, tilt: 0.8 },
  about: { position: { x: 260, y: -300 }, tilt: 1.2 },
  toolbox: { position: { x: 680, y: -300 }, tilt: -0.6 },
  contact: { position: { x: 260, y: 280 }, tilt: -1 },
  resume: { position: { x: 680, y: 280 }, tilt: 1.4 },
};

/** The most room a card can take at its home position. */
export function homeRect(id: CardId): Rect {
  return { ...HOME[id].position, width: CARD_WIDTH, height: CARD_MAX_HEIGHT };
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
