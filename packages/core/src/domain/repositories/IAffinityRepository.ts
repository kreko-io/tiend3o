import type { ProductAffinity } from "@tiend3o/shared";

export interface IAffinityRepository {
  getAffinity(productAId: string, productBId: string): Promise<ProductAffinity | null>;
  getTopAffinitiesFor(productId: string, limit?: number): Promise<ProductAffinity[]>;
}
