import type { Dimensions3D, GondolaAisle, GondolaBay, ShelfLevel, StoreSpace } from "./schema";

export interface StoreGridConfig {
  storeWidth: number; // in meters (X axis)
  storeLength: number; // in meters (Z axis)
  aisleWidth: number; // walkway between gondolas (typically 2.0 - 2.5m)
  gondolaDepth: number; // depth of a gondola back-to-back (typically 0.6m per side = 1.2m total)
  bayWidth: number; // standard section width (1.2m)
  bayCountPerAisle: number; // number of modular bays in each aisle
  shelfCountPerBay: number; // number of vertical shelves (e.g. 4)
  slotsPerShelf: number; // facings per shelf (e.g. 6)
  gondolaHeight: number; // height of gondola (e.g. 2.1m)
  perimeterBuffer: number; // margin from store walls (e.g. 3m for main perimeter corridor)
}

export const DEFAULT_GRID_CONFIG: StoreGridConfig = {
  storeWidth: 24,
  storeLength: 36,
  aisleWidth: 2.4,
  gondolaDepth: 0.6,
  bayWidth: 1.2,
  bayCountPerAisle: 8,
  shelfCountPerBay: 4,
  slotsPerShelf: 6,
  gondolaHeight: 2.1,
  perimeterBuffer: 3.0,
};

/**
 * Procedurally generates a standard retail store layout with parallel gondola aisles,
 * modular bays, shelf levels, and facing slots.
 */
export function generateStoreLayout(config: Partial<StoreGridConfig> = {}): StoreSpace {
  const definedOverrides = Object.fromEntries(
    Object.entries(config).filter(([_, v]) => v !== undefined)
  );
  const cfg = { ...DEFAULT_GRID_CONFIG, ...definedOverrides };
  const gondolas: GondolaAisle[] = [];

  // Usable area inside perimeter corridor
  const usableWidth = cfg.storeWidth - cfg.perimeterBuffer * 2;
  const aislePitch = cfg.gondolaDepth * 2 + cfg.aisleWidth; // spacing between centers of adjacent aisles
  const numAislePairs = Math.max(1, Math.floor(usableWidth / aislePitch));

  const totalAisleLength = cfg.bayCountPerAisle * cfg.bayWidth;
  const startZ = -(totalAisleLength / 2);

  let aisleIndex = 1;

  for (let i = 0; i < numAislePairs; i++) {
    const xBase = -cfg.storeWidth / 2 + cfg.perimeterBuffer + i * aislePitch + cfg.gondolaDepth;

    // Side A (facing left aisle corridor)
    gondolas.push(
      createGondolaAisle({
        id: `aisle-${aisleIndex}-left`,
        code: `Aisle ${aisleIndex}A`,
        side: "left",
        startX: xBase - cfg.gondolaDepth / 2,
        startZ,
        cfg,
      })
    );

    // Side B (facing right aisle corridor)
    gondolas.push(
      createGondolaAisle({
        id: `aisle-${aisleIndex}-right`,
        code: `Aisle ${aisleIndex}B`,
        side: "right",
        startX: xBase + cfg.gondolaDepth / 2,
        startZ,
        cfg,
      })
    );

    aisleIndex++;
  }

  return {
    id: "store-main-layout",
    name: "Main Retail Floor",
    width: cfg.storeWidth,
    length: cfg.storeLength,
    ceilingHeight: 4.5,
    entrancePosition: { x: 0, y: 0, z: cfg.storeLength / 2 - 1.5 },
    checkoutPosition: { x: cfg.storeWidth / 4, y: 0, z: cfg.storeLength / 2 - 2 },
    aisleWidth: cfg.aisleWidth,
    gondolas,
  };
}

function createGondolaAisle(params: {
  id: string;
  code: string;
  side: "left" | "right";
  startX: number;
  startZ: number;
  cfg: StoreGridConfig;
}): GondolaAisle {
  const { id, code, side, startX, startZ, cfg } = params;
  const bays: GondolaBay[] = [];

  for (let b = 0; b < cfg.bayCountPerAisle; b++) {
    const shelves: ShelfLevel[] = [];
    const shelfHeightStep = (cfg.gondolaHeight - 0.2) / cfg.shelfCountPerBay;

    for (let s = 0; s < cfg.shelfCountPerBay; s++) {
      const slots = [];
      for (let sl = 0; sl < cfg.slotsPerShelf; sl++) {
        slots.push({
          id: `${id}-bay${b}-shelf${s}-slot${sl}`,
          slotIndex: sl,
          productId: null,
          facingCount: 1,
          capacityDepth: 6,
        });
      }

      shelves.push({
        levelIndex: s,
        heightOffset: 0.15 + s * shelfHeightStep,
        slots,
      });
    }

    bays.push({
      id: `${id}-bay-${b}`,
      bayIndex: b,
      width: cfg.bayWidth,
      shelves,
    });
  }

  return {
    id,
    code,
    side,
    start: { x: startX, y: 0, z: startZ },
    length: cfg.bayCountPerAisle * cfg.bayWidth,
    height: cfg.gondolaHeight,
    depth: cfg.gondolaDepth,
    bays,
  };
}
