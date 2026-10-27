import type { StoreSpace, GondolaAisle, PlanogramKPIs, ProductAffinity } from "@tiend3o/shared";
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

  calculateKPIs(
    productsMap: Map<string, ProductEntity>,
    affinities: ProductAffinity[] = []
  ): PlanogramKPIs {
    let totalSlots = 0;
    let occupiedSlots = 0;
    let eyeLevelRevenuePotential = 0;
    let hotZoneSlots = 0;
    let hotZoneHighMarginCount = 0;
    let ergonomicViolationsCount = 0;
    let totalLinearMeters = 0;

    // Determine top 40% threshold for financial priority score
    const allProducts = Array.from(productsMap.values());
    const sortedScores = allProducts
      .map((p) => p.calculatePlacementPriority())
      .sort((a, b) => b - a);
    const top40Threshold =
      sortedScores.length > 0 ? sortedScores[Math.floor(sortedScores.length * 0.4)] : 0;

    // Track product locations for affinity distance calculation: productId -> Array<{ gondolaId: string, side: string, bayIndex: number, levelIndex: number }>
    const productLocations = new Map<
      string,
      Array<{ gondolaId: string; side: string; bayIndex: number; levelIndex: number }>
    >();

    for (const gondola of this._space.gondolas) {
      for (const bay of gondola.bays) {
        totalLinearMeters += bay.width;
        for (const shelf of bay.shelves) {
          const isHotZone = shelf.levelIndex === 1 || shelf.levelIndex === 2; // Knee & Eye level
          if (isHotZone) hotZoneSlots += shelf.slots.length;

          for (const slot of shelf.slots) {
            totalSlots++;
            if (slot.productId) {
              occupiedSlots++;
              const prod = productsMap.get(slot.productId);
              if (prod) {
                // Record location
                const locs = productLocations.get(slot.productId) ?? [];
                locs.push({
                  gondolaId: gondola.id,
                  side: gondola.side,
                  bayIndex: bay.bayIndex,
                  levelIndex: shelf.levelIndex,
                });
                productLocations.set(slot.productId, locs);

                // Revenue potential
                if (isHotZone) {
                  eyeLevelRevenuePotential +=
                    prod.price * prod.margin * prod.historicalSalesVelocity;
                  if (prod.calculatePlacementPriority() >= top40Threshold) {
                    hotZoneHighMarginCount++;
                  }
                }

                // Ergonomic violation: Heavy product (>= 2kg) placed above floor level (level > 0)
                if (shelf.levelIndex > 0 && prod.isHeavy) {
                  ergonomicViolationsCount++;
                }
              }
            }
          }
        }
      }
    }

    // Calculate High-Lift pairs adjacent in space
    const highLiftAffinities = affinities.filter((a) => a.lift >= 2.0);
    let highLiftPairsAdjacent = 0;

    for (const aff of highLiftAffinities) {
      const locsA = productLocations.get(aff.productAId) ?? [];
      const locsB = productLocations.get(aff.productBId) ?? [];

      let isPairAdjacent = false;
      for (const a of locsA) {
        for (const b of locsB) {
          // Same aisle and within 1 bay distance
          const sameGondolaAisle = a.gondolaId.replace(/-(left|right)$/, "") === b.gondolaId.replace(/-(left|right)$/, "");
          const bayDist = Math.abs(a.bayIndex - b.bayIndex);

          if (sameGondolaAisle && bayDist <= 1) {
            isPairAdjacent = true;
            break;
          }
        }
        if (isPairAdjacent) break;
      }

      if (isPairAdjacent) highLiftPairsAdjacent++;
    }

    const spaceUtilizationRate = totalSlots > 0 ? occupiedSlots / totalSlots : 0;
    const hotZoneUtilizationRate = hotZoneSlots > 0 ? hotZoneHighMarginCount / hotZoneSlots : 0;
    const affinityAlignmentScore =
      highLiftAffinities.length > 0
        ? Math.round((highLiftPairsAdjacent / highLiftAffinities.length) * 100)
        : 85;

    const revenuePerLinearMeter =
      totalLinearMeters > 0 ? Math.round((eyeLevelRevenuePotential / totalLinearMeters) * 100) / 100 : 0;

    return {
      totalProductsAssigned: occupiedSlots,
      spaceUtilizationRate: Math.round(spaceUtilizationRate * 100) / 100,
      affinityAlignmentScore,
      eyeLevelRevenuePotential: Math.round(eyeLevelRevenuePotential * 100) / 100,
      hotZoneUtilizationRate: Math.round(hotZoneUtilizationRate * 100) / 100,
      ergonomicViolationsCount,
      highLiftPairsAdjacent,
      totalHighLiftPairs: highLiftAffinities.length,
      revenuePerLinearMeter,
    };
  }
}
