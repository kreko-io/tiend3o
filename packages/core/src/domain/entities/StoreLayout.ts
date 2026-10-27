import type { StoreSpace, GondolaAisle, PlanogramKPIs } from "@tiend3o/shared";
import { ProductEntity } from "./Product";

export class StoreLayoutEntity {
  constructor(private _space: StoreSpace) {}

  get space(): StoreSpace {
    return this._space;
  }

  get id(): string {
    return this._space.id;
  }

  get width(): number {
    return this._space.width;
  }

  get length(): number {
    return this._space.length;
  }

  get gondolas(): GondolaAisle[] {
    return this._space.gondolas;
  }

  assignProductToSlot(
    gondolaId: string,
    bayIndex: number,
    levelIndex: number,
    slotIndex: number,
    productId: string | null
  ): boolean {
    const gondola = this._space.gondolas.find((g) => g.id === gondolaId);
    if (!gondola) return false;

    const bay = gondola.bays.find((b) => b.bayIndex === bayIndex);
    if (!bay) return false;

    const shelf = bay.shelves.find((s) => s.levelIndex === levelIndex);
    if (!shelf) return false;

    const slot = shelf.slots.find((sl) => sl.slotIndex === slotIndex);
    if (!slot) return false;

    slot.productId = productId;
    return true;
  }

  calculateKPIs(productsMap: Map<string, ProductEntity>): PlanogramKPIs {
    let totalSlots = 0;
    let occupiedSlots = 0;
    let eyeLevelRevenuePotential = 0;

    for (const gondola of this._space.gondolas) {
      for (const bay of gondola.bays) {
        for (const shelf of bay.shelves) {
          const isEyeLevel = shelf.levelIndex === 2 || shelf.levelIndex === 1;
          for (const slot of shelf.slots) {
            totalSlots++;
            if (slot.productId) {
              occupiedSlots++;
              const prod = productsMap.get(slot.productId);
              if (prod && isEyeLevel) {
                eyeLevelRevenuePotential += prod.price * prod.margin * prod.historicalSalesVelocity;
              }
            }
          }
        }
      }
    }

    const spaceUtilizationRate = totalSlots > 0 ? occupiedSlots / totalSlots : 0;

    return {
      totalProductsAssigned: occupiedSlots,
      spaceUtilizationRate: Math.round(spaceUtilizationRate * 100) / 100,
      affinityAlignmentScore: 85.0, // baseline heuristic
      eyeLevelRevenuePotential: Math.round(eyeLevelRevenuePotential * 100) / 100,
    };
  }
}
