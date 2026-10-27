import type { ProductAffinity } from "@tiend3o/shared";
import { IAffinityRepository } from "../../domain/repositories/IAffinityRepository";

export const HISTORICAL_AFFINITIES_10Y: ProductAffinity[] = [
  {
    productAId: "prod-milk-whole",
    productBId: "prod-cereal-oats",
    support: 0.28,
    confidence: 0.65,
    lift: 2.32,
    coOccurrenceCount: 42100,
  },
  {
    productAId: "prod-beer-craft",
    productBId: "prod-chips-salted",
    support: 0.22,
    confidence: 0.58,
    lift: 2.64,
    coOccurrenceCount: 33400,
  },
  {
    productAId: "prod-pasta-spaghetti",
    productBId: "prod-tomato-sauce",
    support: 0.35,
    confidence: 0.74,
    lift: 3.12,
    coOccurrenceCount: 51200,
  },
  {
    productAId: "prod-milk-whole",
    productBId: "prod-bread-artisan",
    support: 0.31,
    confidence: 0.52,
    lift: 1.68,
    coOccurrenceCount: 46800,
  },
  {
    productAId: "prod-soda-cola",
    productBId: "prod-chips-salted",
    support: 0.25,
    confidence: 0.49,
    lift: 1.85,
    coOccurrenceCount: 37900,
  },
];

export class InMemoryAffinityRepository implements IAffinityRepository {
  constructor(private readonly affinities: ProductAffinity[] = HISTORICAL_AFFINITIES_10Y) {}

  async getAffinity(productAId: string, productBId: string): Promise<ProductAffinity | null> {
    return (
      this.affinities.find(
        (a) =>
          (a.productAId === productAId && a.productBId === productBId) ||
          (a.productAId === productBId && a.productBId === productAId)
      ) ?? null
    );
  }

  async getTopAffinitiesFor(productId: string, limit = 5): Promise<ProductAffinity[]> {
    return this.affinities
      .filter((a) => a.productAId === productId || a.productBId === productId)
      .sort((a, b) => b.lift - a.lift)
      .slice(0, limit);
  }
}
