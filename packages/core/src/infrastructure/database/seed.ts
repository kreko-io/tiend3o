import { generateStoreLayout } from "@tiend3o/shared";
import { SAMPLE_PRODUCTS } from "../repositories/InMemoryProductRepository";
import { HISTORICAL_AFFINITIES_10Y } from "../repositories/InMemoryAffinityRepository";
import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { DatabasePool } from "./DatabasePool";
import { PostgresProductRepository } from "./PostgresProductRepository";
import { PostgresStoreLayoutRepository } from "./PostgresStoreLayoutRepository";
import { PostgresAffinityRepository } from "./PostgresAffinityRepository";

export async function seedDatabase(connectionString?: string): Promise<{
  productsCount: number;
  affinitiesCount: number;
  layoutsCount: number;
}> {
  const db = DatabasePool.getInstance(connectionString);
  const productRepo = new PostgresProductRepository(db);
  const layoutRepo = new PostgresStoreLayoutRepository(db);
  const affinityRepo = new PostgresAffinityRepository(db);

  console.log("🌱 Seeding retail products into PostgreSQL...");
  for (const product of SAMPLE_PRODUCTS) {
    await productRepo.save(product);
  }

  console.log("🌱 Seeding 10-year market basket affinity matrix...");
  for (const aff of HISTORICAL_AFFINITIES_10Y) {
    await affinityRepo.save(aff);
  }

  console.log("🌱 Seeding default physical store distribution (24m x 36m with 10 gondola aisles)...");
  const defaultSpace = generateStoreLayout({
    storeWidth: 24,
    storeLength: 36,
    aisleWidth: 2.4,
    bayCountPerAisle: 8,
  });
  const layoutEntity = new StoreLayoutEntity(defaultSpace);
  await layoutRepo.save(layoutEntity);

  console.log("✅ Database successfully seeded according to store layout distribution!");
  return {
    productsCount: SAMPLE_PRODUCTS.length,
    affinitiesCount: HISTORICAL_AFFINITIES_10Y.length,
    layoutsCount: 1,
  };
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  seedDatabase()
    .then((result) => {
      console.log("Seeding summary:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
