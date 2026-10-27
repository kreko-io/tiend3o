import { IPlanogramOptimizerPort } from "../../application/ports/IPlanogramOptimizerPort";
import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { ProductEntity } from "../../domain/entities/Product";

export class HeuristicPlanogramOptimizer implements IPlanogramOptimizerPort {
  async optimizeSlotting(
    layout: StoreLayoutEntity,
    products: ProductEntity[]
  ): Promise<StoreLayoutEntity> {
    // Sort products by placement priority (margin * price * sales velocity) descending
    const sorted = [...products].sort(
      (a, b) => b.calculatePlacementPriority() - a.calculatePlacementPriority()
    );

    let productIndex = 0;

    for (const gondola of layout.gondolas) {
      for (const bay of gondola.bays) {
        // Shelf 2 = Eye Level (place highest priority items here)
        // Shelf 1 = Touch Level
        // Shelf 0 = Bottom / Reach
        // Shelf 3 = Top / Overstock
        const shelfPriorityOrder = [2, 1, 0, 3];

        for (const levelIdx of shelfPriorityOrder) {
          const shelf = bay.shelves.find((s) => s.levelIndex === levelIdx);
          if (!shelf) continue;

          for (const slot of shelf.slots) {
            const product = sorted[productIndex % sorted.length];
            slot.productId = product.id;
            slot.facingCount = product.historicalSalesVelocity > 100 ? 2 : 1;
            productIndex++;
          }
        }
      }
    }

    return layout;
  }
}
