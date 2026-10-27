import { describe, expect, it } from "vitest";
import { generateStoreLayout } from "./grid";
import { calculateFitFromBounds } from "./bounds";

describe("Store Grid Layout Generator", () => {
  it("generates symmetrical aisles inside bounds with shelves and slots", () => {
    const layout = generateStoreLayout({
      storeWidth: 20,
      storeLength: 30,
      aisleWidth: 2.0,
      bayCountPerAisle: 6,
      shelfCountPerBay: 4,
      slotsPerShelf: 5,
    });

    expect(layout.gondolas.length).toBeGreaterThan(0);
    expect(layout.width).toBe(20);
    expect(layout.length).toBe(30);

    const firstGondola = layout.gondolas[0];
    expect(firstGondola.bays.length).toBe(6);
    expect(firstGondola.bays[0].shelves.length).toBe(4);
    expect(firstGondola.bays[0].shelves[0].slots.length).toBe(5);
  });
});

describe("Model Fitting Bounds", () => {
  it("computes correct scaling and centering", () => {
    const bounds = {
      min: [-1, 0, -2] as [number, number, number],
      max: [1, 4, 2] as [number, number, number],
    };
    const fit = calculateFitFromBounds(bounds, 1.0);
    expect(fit.scale).toBeCloseTo(0.25); // 1.0 / 4.0
    expect(fit.offset[1]).toBe(0); // minY = 0
  });
});
