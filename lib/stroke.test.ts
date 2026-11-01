import { describe, expect, it } from "vitest";

import { toPath, type StrokePoint } from "@/lib/stroke";

const line = (pressure: number): StrokePoint[] =>
  Array.from({ length: 12 }, (_, i) => [i * 10, i * 4, pressure] as StrokePoint);

describe("toPath", () => {
  it("returns an empty path for no points", () => {
    expect(toPath([])).toBe("");
  });

  it("turns a stroke into one closed SVG path of quadratic curves", () => {
    const d = toPath(line(0.5));
    expect(d.startsWith("M")).toBe(true);
    expect(d).toContain(" Q");
    expect(d.endsWith("Z")).toBe(true);
  });

  it("follows real pen pressure instead of simulating it", () => {
    expect(toPath(line(0.9))).not.toBe(toPath(line(0.5)));
  });
});
