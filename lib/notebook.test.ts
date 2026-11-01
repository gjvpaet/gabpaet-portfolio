import { describe, expect, it } from "vitest";

import {
  CARD_IDS,
  HOME,
  NAME_BOX,
  cardSearch,
  homeRect,
  isCardId,
  overlaps,
  parseCard,
  zoomLabel,
} from "@/lib/notebook";

describe("home positions", () => {
  it("never overlap each other at 100%", () => {
    for (const a of CARD_IDS) {
      for (const b of CARD_IDS) {
        if (a !== b) expect(overlaps(homeRect(a), homeRect(b)), `${a} and ${b}`).toBe(false);
      }
    }
  });

  it("keep clear of the name", () => {
    for (const id of CARD_IDS) expect(overlaps(homeRect(id), NAME_BOX), id).toBe(false);
  });

  it("tilt between -1.5 and 1.5 degrees", () => {
    for (const id of CARD_IDS) expect(Math.abs(HOME[id].tilt)).toBeLessThanOrEqual(1.5);
  });
});

describe("isCardId", () => {
  it("accepts the six ids and nothing else", () => {
    expect(CARD_IDS.every(isCardId)).toBe(true);
    expect(isCardId("arcade")).toBe(false);
    expect(isCardId(null)).toBe(false);
  });
});

describe("parseCard", () => {
  it("reads a known card", () => {
    expect(parseCard("?card=projects")).toBe("projects");
    expect(parseCard("?utm_source=x&card=resume")).toBe("resume");
  });

  it("ignores unknown or missing values", () => {
    expect(parseCard("?card=arcade")).toBeNull();
    expect(parseCard("")).toBeNull();
    expect(parseCard("?card=")).toBeNull();
  });
});

describe("cardSearch", () => {
  it("names the most recently opened card still open", () => {
    expect(cardSearch("", ["about", "projects"])).toBe("?card=projects");
    expect(cardSearch("?card=projects", ["about"])).toBe("?card=about");
  });

  it("drops the parameter when nothing is open", () => {
    expect(cardSearch("?card=about", [])).toBe("");
  });

  it("keeps other parameters", () => {
    expect(cardSearch("?utm_source=x&card=about", [])).toBe("?utm_source=x");
    expect(cardSearch("?utm_source=x", ["toolbox"])).toBe("?utm_source=x&card=toolbox");
  });
});

describe("zoomLabel", () => {
  it("rounds to a whole percent", () => {
    expect(zoomLabel(0.996)).toBe("100%");
    expect(zoomLabel(0.4)).toBe("40%");
    expect(zoomLabel(1.5)).toBe("150%");
  });
});
