import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { ProductEntity } from "../../domain/entities/Product";

/**
 * Procedurally generates the "Estado Actual (Sub-óptimo)" layout for the comparative demo:
 * 1. Heavy products placed on high shelves (Level 2 or 3) -> Severe ergonomic and safety violations.
 * 2. High-margin / high-velocity products hidden at floor level (Level 0).
 * 3. Complementary High-Lift pairs separated in distant aisles (Aisle 1 vs Aisle 3/4).
 */
export class SuboptimalPlanogramGenerator {
  generate(layout: StoreLayoutEntity, products: ProductEntity[]): StoreLayoutEntity {
    // Clone space structure
    const clonedSpace = JSON.parse(JSON.stringify(layout.space));
    const suboptimal = new StoreLayoutEntity(clonedSpace);

    const heavyProducts = products.filter((p) => p.isHeavy);
    const nonHeavy = products.filter((p) => !p.isHeavy);

    // Complementary pair segregation:
    // Partition high lift items into Group A (Aisle 1 & 2) and Group B (Aisle 3 & 4)
    const splitIndex = Math.floor(nonHeavy.length / 2);
    const groupA = nonHeavy.slice(0, splitIndex);
    const groupB = nonHeavy.slice(splitIndex);

    let heavyIdx = 0;
    let groupAIdx = 0;
    let groupBIdx = 0;

    for (let gIdx = 0; gIdx < suboptimal.gondolas.length; gIdx++) {
      const gondola = suboptimal.gondolas[gIdx];
      // Front aisles (gIdx < 4) get Group A; Rear aisles (gIdx >= 4) get Group B
      const isFrontAisle = gIdx < Math.floor(suboptimal.gondolas.length / 2);

      for (const bay of gondola.bays) {
        for (const shelf of bay.shelves) {
          for (const slot of shelf.slots) {
            if (shelf.levelIndex === 3 || (shelf.levelIndex === 2 && heavyIdx < heavyProducts.length)) {
              if (heavyIdx < heavyProducts.length) {
                // ERGONOMIC VIOLATION: Heavy product in height (Level 2 or 3)
                slot.productId = heavyProducts[heavyIdx % heavyProducts.length].id;
                heavyIdx++;
              } else {
                const prod = isFrontAisle
                  ? groupA[groupAIdx++ % groupA.length]
                  : groupB[groupBIdx++ % groupB.length];
                slot.productId = prod.id;
              }
            } else if (shelf.levelIndex === 0) {
              // High margin items hidden down on the floor (Level 0)
              const prod = isFrontAisle
                ? groupA[groupAIdx++ % groupA.length]
                : groupB[groupBIdx++ % groupB.length];
              slot.productId = prod.id;
            } else {
              // Level 1: remaining items separated by aisle
              const prod = isFrontAisle
                ? groupA[groupAIdx++ % groupA.length]
                : groupB[groupBIdx++ % groupB.length];
              slot.productId = prod.id;
            }
            slot.facingCount = 1;
          }
        }
      }
    }

    return suboptimal;
  }
}
