import type { ProductAffinity } from "@tiend3o/shared";
import { IAffinityRepository } from "../../domain/repositories/IAffinityRepository";

export const HISTORICAL_AFFINITIES_10Y: ProductAffinity[] = [
  {
    productAId: "prod-beer-craft",
    productBId: "prod-chips-salted",
    support: 0.24,
    confidence: 0.62,
    lift: 2.85,
    coOccurrenceCount: 38400,
  },
  {
    productAId: "prod-milk-whole",
    productBId: "prod-cereal-oats",
    support: 0.28,
    confidence: 0.65,
    lift: 2.75,
    coOccurrenceCount: 44200,
  },
  {
    productAId: "prod-pasta-spaghetti",
    productBId: "prod-tomato-sauce",
    support: 0.35,
    confidence: 0.74,
    lift: 3.20,
    coOccurrenceCount: 52600,
  },
  {
    productAId: "prod-soda-cola",
    productBId: "prod-charcoal-bag",
    support: 0.18,
    confidence: 0.54,
    lift: 2.40,
    coOccurrenceCount: 29500,
  },
  {
    productAId: "prod-wine-red",
    productBId: "prod-cheese-parmesan",
    support: 0.21,
    confidence: 0.68,
    lift: 2.95,
    coOccurrenceCount: 31200,
  },
  {
    productAId: "prod-coffee-ground",
    productBId: "prod-cookies-artisan",
    support: 0.23,
    confidence: 0.59,
    lift: 2.65,
    coOccurrenceCount: 34100,
  },
  {
    productAId: "prod-shampoo",
    productBId: "prod-conditioner",
    support: 0.26,
    confidence: 0.72,
    lift: 3.15,
    coOccurrenceCount: 41800,
  },
  {
    productAId: "prod-bread-artisan",
    productBId: "prod-butter-organic",
    support: 0.22,
    confidence: 0.55,
    lift: 2.35,
    coOccurrenceCount: 35700,
  },
  {
    productAId: "prod-charcoal-bag",
    productBId: "prod-bbq-sauce",
    support: 0.16,
    confidence: 0.51,
    lift: 2.25,
    coOccurrenceCount: 26800,
  },
  {
    productAId: "prod-olive-oil",
    productBId: "prod-pasta-spaghetti",
    support: 0.20,
    confidence: 0.48,
    lift: 2.10,
    coOccurrenceCount: 32000,
  },
];

export class InMemoryAffinityRepository implements IAffinityRepository {
  constructor(private readonly affinities: ProductAffinity[] = HISTORICAL_AFFINITIES_10Y) {}

  async getAffinity(productAId: string, productBId: string): Promise<ProductAffinity | null> {
    const found = this.affinities.find(
      (a) =>
        (a.productAId === productAId && a.productBId === productBId) ||
        (a.productAId === productBId && a.productBId === productAId)
    );
    return found ?? null;
  }

  async getTopAffinitiesFor(productId: string, limit = 5): Promise<ProductAffinity[]> {
    return this.affinities
      .filter((a) => a.productAId === productId || a.productBId === productId)
      .sort((a, b) => b.lift - a.lift)
      .slice(0, limit);
  }
}
