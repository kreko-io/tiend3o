import type { ProductCategory } from "@tiend3o/shared";
import { ProductEntity, type ProductProps } from "../../domain/entities/Product";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { DatabasePool } from "./DatabasePool";

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  width_m: string | number;
  height_m: string | number;
  depth_m: string | number;
  weight_kg?: string | number;
  price: string | number;
  margin: string | number;
  historical_sales_velocity: string | number;
  model_url: string | null;
  color: string;
}

export class PostgresProductRepository implements IProductRepository {
  constructor(private readonly pool: DatabasePool = DatabasePool.getInstance()) {}

  private mapRowToEntity(row: ProductRow): ProductEntity {
    const props: ProductProps = {
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category as ProductCategory,
      dimensions: {
        width: Number(row.width_m),
        height: Number(row.height_m),
        depth: Number(row.depth_m),
      },
      weightKg: row.weight_kg !== undefined ? Number(row.weight_kg) : 0.5,
      price: Number(row.price),
      margin: Number(row.margin),
      historicalSalesVelocity: Number(row.historical_sales_velocity),
      modelUrl: row.model_url ?? undefined,
      color: row.color,
    };
    return new ProductEntity(props);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const sql = `
      SELECT id, sku, name, category, width_m, height_m, depth_m,
             COALESCE(weight_kg, 0.5) as weight_kg,
             price, margin, historical_sales_velocity, model_url, color
      FROM products
      WHERE id = $1
    `;
    const res = await this.pool.query<ProductRow>(sql, [id]);
    if (res.rows.length === 0) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  async findAll(): Promise<ProductEntity[]> {
    const sql = `
      SELECT id, sku, name, category, width_m, height_m, depth_m,
             COALESCE(weight_kg, 0.5) as weight_kg,
             price, margin, historical_sales_velocity, model_url, color
      FROM products
      ORDER BY category ASC, name ASC
    `;
    const res = await this.pool.query<ProductRow>(sql);
    return res.rows.map((row) => this.mapRowToEntity(row));
  }

  async findByCategory(category: string): Promise<ProductEntity[]> {
    const sql = `
      SELECT id, sku, name, category, width_m, height_m, depth_m,
             COALESCE(weight_kg, 0.5) as weight_kg,
             price, margin, historical_sales_velocity, model_url, color
      FROM products
      WHERE category = $1
      ORDER BY name ASC
    `;
    const res = await this.pool.query<ProductRow>(sql, [category]);
    return res.rows.map((row) => this.mapRowToEntity(row));
  }

  async save(product: ProductEntity): Promise<void> {
    const { id, sku, name, category, dimensions, weightKg, price, margin, historicalSalesVelocity, modelUrl, color } = product.props;
    const sql = `
      INSERT INTO products (
        id, sku, name, category, width_m, height_m, depth_m, weight_kg,
        price, margin, historical_sales_velocity, model_url, color, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (id) DO UPDATE SET
        sku = EXCLUDED.sku,
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        width_m = EXCLUDED.width_m,
        height_m = EXCLUDED.height_m,
        depth_m = EXCLUDED.depth_m,
        weight_kg = EXCLUDED.weight_kg,
        price = EXCLUDED.price,
        margin = EXCLUDED.margin,
        historical_sales_velocity = EXCLUDED.historical_sales_velocity,
        model_url = EXCLUDED.model_url,
        color = EXCLUDED.color,
        updated_at = NOW();
    `;
    await this.pool.query(sql, [
      id,
      sku,
      name,
      category,
      dimensions.width,
      dimensions.height,
      dimensions.depth,
      weightKg ?? 0.5,
      price,
      margin,
      historicalSalesVelocity,
      modelUrl ?? null,
      color ?? "#3b82f6",
    ]);
  }
}
