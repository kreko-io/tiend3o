import type { ProductAffinity } from "@tiend3o/shared";
import { IPlanogramOptimizerPort } from "../../application/ports/IPlanogramOptimizerPort";
import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { ProductEntity } from "../../domain/entities/Product";
import { HISTORICAL_AFFINITIES_10Y } from "../repositories/InMemoryAffinityRepository";

export class HeuristicPlanogramOptimizer implements IPlanogramOptimizerPort {
  constructor(private readonly defaultAffinities: ProductAffinity[] = HISTORICAL_AFFINITIES_10Y) {}

  async optimizeSlotting(
    layout: StoreLayoutEntity,
    products: ProductEntity[],
    affinities: ProductAffinity[] = this.defaultAffinities
  ): Promise<StoreLayoutEntity> {
    const clonedSpace = JSON.parse(JSON.stringify(layout.space));
    const optimized = new StoreLayoutEntity(clonedSpace);

    // 1. Separate Heavy products (Ergonomics: weight >= 2.0kg)
    const heavyProducts = products.filter((p) => p.isHeavy);
    const nonHeavyProducts = products.filter((p) => !p.isHeavy);

    // 2. Rank non-heavy products by Profitability Score (Margin * Price * Velocity)
    const sortedByPriority = [...nonHeavyProducts].sort(
      (a, b) => b.calculatePlacementPriority() - a.calculatePlacementPriority()
    );

    const top40PercentCount = Math.max(1, Math.ceil(sortedByPriority.length * 0.4));
    const hotZoneCandidates = sortedByPriority.slice(0, top40PercentCount);
    const standardProducts = sortedByPriority.slice(top40PercentCount);

    // 3. Extract High-Lift Affinities (Lift >= 2.0)
    const highLiftAffinities = affinities.filter((a) => a.lift >= 2.0);
    const productsMap = new Map(products.map((p) => [p.id, p]));

    // Build paired hot zone queue: place high affinity items together in hot zone
    const hotZoneQueue: ProductEntity[] = [];
    const addedToHotZone = new Set<string>();

    for (const aff of highLiftAffinities) {
      const prodA = productsMap.get(aff.productAId);
      const prodB = productsMap.get(aff.productBId);

      // Pair them if neither is heavy and at least one is in hot zone
      if (prodA && prodB && !prodA.isHeavy && !prodB.isHeavy) {
        if (!addedToHotZone.has(prodA.id)) {
          hotZoneQueue.push(prodA);
          addedToHotZone.add(prodA.id);
        }
        if (!addedToHotZone.has(prodB.id)) {
          hotZoneQueue.push(prodB);
          addedToHotZone.add(prodB.id);
        }
      }
    }

    // Fill rest of hot zone with remaining top margin candidates
    for (const prod of hotZoneCandidates) {
      if (!addedToHotZone.has(prod.id)) {
        hotZoneQueue.push(prod);
        addedToHotZone.add(prod.id);
      }
    }

    let hotZoneIdx = 0;
    let heavyIdx = 0;
    let standardIdx = 0;

    for (const gondola of optimized.gondolas) {
      for (const bay of gondola.bays) {
        for (const shelf of bay.shelves) {
          for (const slot of shelf.slots) {
            if (shelf.levelIndex === 0) {
              // RULE 1: Ergonomics / Physics Base - Strictly heavy items first, then standard heavy
              if (heavyProducts.length > 0 && heavyIdx < heavyProducts.length) {
                const prod = heavyProducts[heavyIdx % heavyProducts.length];
                slot.productId = prod.id;
                slot.facingCount = prod.historicalSalesVelocity > 100 ? 2 : 1;
                heavyIdx++;
              } else if (heavyProducts.length > 0) {
                const prod = heavyProducts[heavyIdx % heavyProducts.length];
                slot.productId = prod.id;
                heavyIdx++;
              } else {
                const prod = standardProducts[standardIdx % standardProducts.length];
                slot.productId = prod.id;
                standardIdx++;
              }
            } else if (shelf.levelIndex === 2 || shelf.levelIndex === 1) {
              // RULE 2 & 3: Hot Zone (Eye & Touch levels) - Top 40% margin & paired High-Lift products
              if (hotZoneQueue.length > 0) {
                const prod = hotZoneQueue[hotZoneIdx % hotZoneQueue.length];
                slot.productId = prod.id;
                slot.facingCount = prod.historicalSalesVelocity > 120 ? 2 : 1;
                hotZoneIdx++;
              } else {
                const prod = sortedByPriority[standardIdx % sortedByPriority.length];
                slot.productId = prod.id;
                standardIdx++;
              }
            } else {
              // Level 3: Top / Overstock - standard products, non-heavy
              const prod = standardProducts[standardIdx % standardProducts.length];
              slot.productId = prod.id;
              slot.facingCount = 1;
              standardIdx++;
            }
          }
        }
      }
    }

    return optimized;
  }
}
