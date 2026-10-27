import {
  HISTORICAL_AFFINITIES_10Y,
  SAMPLE_PRODUCTS,
} from "@tiend3o/core";
import type { ProductAffinity } from "@tiend3o/shared";

export interface CategoryAffinitySummary {
  categoryA: string;
  categoryB: string;
  avgLift: number;
  totalTransactions: number;
}

/**
 * Historical Inference Engine simulating insights from 10 years of POS and basket data.
 */
export class HistoricalInferenceEngine {
  private affinities: ProductAffinity[] = HISTORICAL_AFFINITIES_10Y;

  getAllAffinities(): ProductAffinity[] {
    return this.affinities;
  }

  getTopPairs(minLift = 1.5): ProductAffinity[] {
    return this.affinities.filter((a) => a.lift >= minLift);
  }

  getComplementaryProductIds(productId: string): string[] {
    return this.affinities
      .filter((a) => a.productAId === productId || a.productBId === productId)
      .sort((a, b) => b.lift - a.lift)
      .map((a) => (a.productAId === productId ? a.productBId : a.productAId));
  }

  getAffinityMatrix(): { products: string[]; matrix: number[][] } {
    const products = SAMPLE_PRODUCTS.map((p) => p.id);
    const matrix: number[][] = products.map(() => products.map(() => 0));

    for (const aff of this.affinities) {
      const idxA = products.indexOf(aff.productAId);
      const idxB = products.indexOf(aff.productBId);
      if (idxA !== -1 && idxB !== -1) {
        matrix[idxA][idxB] = aff.lift;
        matrix[idxB][idxA] = aff.lift;
      }
    }

    return { products, matrix };
  }
}
