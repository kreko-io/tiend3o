import type { StoreSpace, GondolaAisle } from "@tiend3o/shared";
import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import type { IStoreLayoutRepository } from "../../domain/repositories/IStoreLayoutRepository";
import { DatabasePool } from "./DatabasePool";

interface StoreLayoutRow {
  id: string;
  name: string;
  width: string | number;
  length: string | number;
  ceiling_height: string | number;
  entrance_x: string | number;
  entrance_y: string | number;
  entrance_z: string | number;
  checkout_x: string | number;
  checkout_y: string | number;
  checkout_z: string | number;
  aisle_width: string | number;
  gondolas: GondolaAisle[] | string;
}

export class PostgresStoreLayoutRepository implements IStoreLayoutRepository {
  constructor(private readonly pool: DatabasePool = DatabasePool.getInstance()) {}

  private mapRowToEntity(row: StoreLayoutRow): StoreLayoutEntity {
    const gondolas: GondolaAisle[] =
      typeof row.gondolas === "string" ? JSON.parse(row.gondolas) : row.gondolas;

    const space: StoreSpace = {
      id: row.id,
      name: row.name,
      width: Number(row.width),
      length: Number(row.length),
      ceilingHeight: Number(row.ceiling_height),
      entrancePosition: {
        x: Number(row.entrance_x),
        y: Number(row.entrance_y),
        z: Number(row.entrance_z),
      },
      checkoutPosition: {
        x: Number(row.checkout_x),
        y: Number(row.checkout_y),
        z: Number(row.checkout_z),
      },
      aisleWidth: Number(row.aisle_width),
      gondolas: gondolas || [],
    };

    return new StoreLayoutEntity(space);
  }

  async findById(id: string): Promise<StoreLayoutEntity | null> {
    const sql = `
      SELECT id, name, width, length, ceiling_height,
             entrance_x, entrance_y, entrance_z,
             checkout_x, checkout_y, checkout_z,
             aisle_width, gondolas
      FROM store_layouts
      WHERE id = $1
    `;
    const res = await this.pool.query<StoreLayoutRow>(sql, [id]);
    if (res.rows.length === 0) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  async save(layout: StoreLayoutEntity): Promise<void> {
    const s = layout.space;
    const sql = `
      INSERT INTO store_layouts (
        id, name, width, length, ceiling_height,
        entrance_x, entrance_y, entrance_z,
        checkout_x, checkout_y, checkout_z,
        aisle_width, gondolas, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        width = EXCLUDED.width,
        length = EXCLUDED.length,
        ceiling_height = EXCLUDED.ceiling_height,
        entrance_x = EXCLUDED.entrance_x,
        entrance_y = EXCLUDED.entrance_y,
        entrance_z = EXCLUDED.entrance_z,
        checkout_x = EXCLUDED.checkout_x,
        checkout_y = EXCLUDED.checkout_y,
        checkout_z = EXCLUDED.checkout_z,
        aisle_width = EXCLUDED.aisle_width,
        gondolas = EXCLUDED.gondolas,
        updated_at = NOW();
    `;
    await this.pool.query(sql, [
      s.id,
      s.name,
      s.width,
      s.length,
      s.ceilingHeight,
      s.entrancePosition.x,
      s.entrancePosition.y,
      s.entrancePosition.z,
      s.checkoutPosition.x,
      s.checkoutPosition.y,
      s.checkoutPosition.z,
      s.aisleWidth,
      JSON.stringify(s.gondolas),
    ]);
  }
}
