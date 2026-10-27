import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { generateStoreLayout } from "@tiend3o/shared";
import { DatabasePool } from "./DatabasePool";
import { PostgresProductRepository } from "./PostgresProductRepository";
import { PostgresStoreLayoutRepository } from "./PostgresStoreLayoutRepository";
import { PostgresAffinityRepository } from "./PostgresAffinityRepository";
import { ProductEntity } from "../../domain/entities/Product";
import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";

const TEST_DB_URL = process.env.DATABASE_URL || "postgres://tiend3o:tiend3o_secret@localhost:5433/tiend3o_db";

describe("PostgreSQL Infrastructure Repositories", () => {
  let db: DatabasePool;
  let productRepo: PostgresProductRepository;
  let layoutRepo: PostgresStoreLayoutRepository;
  let affinityRepo: PostgresAffinityRepository;

  beforeAll(async () => {
    db = new DatabasePool(TEST_DB_URL);
    productRepo = new PostgresProductRepository(db);
    layoutRepo = new PostgresStoreLayoutRepository(db);
    affinityRepo = new PostgresAffinityRepository(db);
  });

  afterAll(async () => {
    await db.close();
  });

  it("checks database health status", async () => {
    const health = await db.checkHealth();
    expect(health.connected).toBe(true);
    expect(health.database).toBe("tiend3o_db");
    expect(health.latencyMs).toBeGreaterThanOrEqual(0);
  });

  describe("PostgresProductRepository", () => {
    it("fetches all seeded products", async () => {
      const products = await productRepo.findAll();
      expect(products.length).toBeGreaterThanOrEqual(9);
      const milk = products.find((p) => p.id === "prod-milk-whole");
      expect(milk).toBeDefined();
      expect(milk?.category).toBe("dairy");
      expect(milk?.price).toBe(1.85);
    });

    it("finds a product by id", async () => {
      const product = await productRepo.findById("prod-cereal-oats");
      expect(product).not.toBeNull();
      expect(product?.name).toContain("Honey Oats");
    });

    it("filters products by category", async () => {
      const dairy = await productRepo.findByCategory("dairy");
      expect(dairy.length).toBeGreaterThanOrEqual(2);
      expect(dairy.every((p) => p.category === "dairy")).toBe(true);
    });

    it("saves and updates a product", async () => {
      const newProd = new ProductEntity({
        id: "prod-test-yogurt",
        sku: "TEST-001",
        name: "Greek Yogurt 500g",
        category: "dairy",
        dimensions: { width: 0.1, height: 0.12, depth: 0.1 },
        price: 2.19,
        margin: 0.40,
        historicalSalesVelocity: 60,
        color: "#ffffff",
      });

      await productRepo.save(newProd);
      const retrieved = await productRepo.findById("prod-test-yogurt");
      expect(retrieved).not.toBeNull();
      expect(retrieved?.sku).toBe("TEST-001");
      expect(retrieved?.price).toBe(2.19);
    });
  });

  describe("PostgresAffinityRepository", () => {
    it("fetches all historical affinities", async () => {
      const affinities = await affinityRepo.getAllAffinities();
      expect(affinities.length).toBeGreaterThanOrEqual(5);
      expect(affinities[0].lift).toBeGreaterThanOrEqual(1.5);
    });

    it("fetches affinity between two products bidirectionally", async () => {
      const aff = await affinityRepo.getAffinity("prod-milk-whole", "prod-cereal-oats");
      expect(aff).not.toBeNull();
      expect(aff?.lift).toBe(2.32);

      const affReverse = await affinityRepo.getAffinity("prod-cereal-oats", "prod-milk-whole");
      expect(affReverse).not.toBeNull();
      expect(affReverse?.lift).toBe(2.32);
    });

    it("fetches top affinities for a given product", async () => {
      const topForMilk = await affinityRepo.getTopAffinitiesFor("prod-milk-whole", 3);
      expect(topForMilk.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("PostgresStoreLayoutRepository", () => {
    it("saves and retrieves a store layout entity", async () => {
      const space = generateStoreLayout({
        storeWidth: 20,
        storeLength: 30,
        aisleWidth: 2.2,
        bayCountPerAisle: 6,
      });
      const layout = new StoreLayoutEntity(space);

      await layoutRepo.save(layout);

      const retrieved = await layoutRepo.findById(layout.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(space.id);
      expect(retrieved?.width).toBe(20);
      expect(retrieved?.length).toBe(30);
      expect(retrieved?.gondolas.length).toBe(space.gondolas.length);
    });
  });
});
