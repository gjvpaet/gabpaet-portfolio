import { getStroke } from "perfect-freehand";

// The pencil's stroke maths, shared by the site's PencilLayer and the
// notebook desk's pencil (components/notebook/desk-pencil.tsx). Pure, so it
// is unit-tested (lib/stroke.test.ts).

export type StrokePoint = [x: number, y: number, pressure: number];

// Spec 6.10: a pencil line, tapered by perfect-freehand.
export const STROKE = { size: 4.5, thinning: 0.6, smoothing: 0.5, streamline: 0.5 } as const;

// perfect-freehand returns the outline of a stroke as a polygon; this turns
// it into a smooth closed SVG path (the library's recommended helper).
// Pressure is simulated unless the points carry real pen pressure.
export function toPath(points: StrokePoint[]): string {
  const outline = getStroke(points, { ...STROKE, simulatePressure: points.every((p) => p[2] === 0.5) });
  if (outline.length < 2) return "";
  const [first, ...rest] = outline;
  let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)} Q`;
  for (let i = 0; i < rest.length; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = rest[i];
    d += `${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)} `;
  }
  return `${d}Z`;
}
