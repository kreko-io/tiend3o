import type { ProductAffinity } from "@tiend3o/shared";
import type { IAffinityRepository } from "../../domain/repositories/IAffinityRepository";
import { DatabasePool } from "./DatabasePool";

interface AffinityRow {
  product_a_id: string;
  product_b_id: string;
  support: string | number;
  confidence: string | number;
  lift: string | number;
  co_occurrence_count: string | number;
}

export class PostgresAffinityRepository implements IAffinityRepository {
  constructor(private readonly pool: DatabasePool = DatabasePool.getInstance()) {}

  private mapRowToDTO(row: AffinityRow): ProductAffinity {
    return {
      productAId: row.product_a_id,
      productBId: row.product_b_id,
      support: Number(row.support),
      confidence: Number(row.confidence),
      lift: Number(row.lift),
      coOccurrenceCount: Number(row.co_occurrence_count),
    };
  }

  async getAffinity(productAId: string, productBId: string): Promise<ProductAffinity | null> {
    const sql = `
      SELECT product_a_id, product_b_id, support, confidence, lift, co_occurrence_count
      FROM product_affinities
      WHERE (product_a_id = $1 AND product_b_id = $2)
         OR (product_a_id = $2 AND product_b_id = $1)
      LIMIT 1
    `;
    const res = await this.pool.query<AffinityRow>(sql, [productAId, productBId]);
    if (res.rows.length === 0) return null;
    return this.mapRowToDTO(res.rows[0]);
  }

  async getTopAffinitiesFor(productId: string, limit = 5): Promise<ProductAffinity[]> {
    const sql = `
      SELECT product_a_id, product_b_id, support, confidence, lift, co_occurrence_count
      FROM product_affinities
      WHERE product_a_id = $1 OR product_b_id = $1
      ORDER BY lift DESC
      LIMIT $2
    `;
    const res = await this.pool.query<AffinityRow>(sql, [productId, limit]);
    return res.rows.map((row) => this.mapRowToDTO(row));
  }

  async getAllAffinities(): Promise<ProductAffinity[]> {
    const sql = `
      SELECT product_a_id, product_b_id, support, confidence, lift, co_occurrence_count
      FROM product_affinities
      ORDER BY lift DESC
    `;
    const res = await this.pool.query<AffinityRow>(sql);
    return res.rows.map((row) => this.mapRowToDTO(row));
  }

  async save(affinity: ProductAffinity): Promise<void> {
    const sql = `
      INSERT INTO product_affinities (
        product_a_id, product_b_id, support, confidence, lift, co_occurrence_count
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (product_a_id, product_b_id) DO UPDATE SET
        support = EXCLUDED.support,
        confidence = EXCLUDED.confidence,
        lift = EXCLUDED.lift,
        co_occurrence_count = EXCLUDED.co_occurrence_count;
    `;
    await this.pool.query(sql, [
      affinity.productAId,
      affinity.productBId,
      affinity.support,
      affinity.confidence,
      affinity.lift,
      affinity.coOccurrenceCount,
    ]);
  }
}
