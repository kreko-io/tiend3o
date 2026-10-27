import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app";

describe("Server API Integration", () => {
  const app = createApp();

  it("responds with health info", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.service).toBe("tiend3o-server");
  });

  it("returns product catalog", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("generates an optimized planogram layout", async () => {
    const res = await request(app)
      .post("/api/planogram/generate")
      .send({ storeWidth: 20, storeLength: 30 });
    expect(res.status).toBe(200);
    expect(res.body.layout).toBeDefined();
    expect(res.body.kpis).toBeDefined();
  });

  it("compares suboptimal vs optimized planograms with executive metrics", async () => {
    const res = await request(app)
      .post("/api/planogram/optimize")
      .send({ storeWidth: 20, storeLength: 30 });
    expect(res.status).toBe(200);
    expect(res.body.suboptimalLayout).toBeDefined();
    expect(res.body.optimizedLayout).toBeDefined();
    expect(res.body.beforeKPIs).toBeDefined();
    expect(res.body.afterKPIs).toBeDefined();
    expect(res.body.revenueImprovementPct).toBeGreaterThanOrEqual(0);
    expect(res.body.executiveSummary.length).toBeGreaterThan(0);
  });

  it("returns 10-year historical affinities", async () => {
    const res = await request(app).get("/api/inference/affinities");
    expect(res.status).toBe(200);
    expect(res.body.topPairs.length).toBeGreaterThan(0);
    expect(res.body.matrix).toBeDefined();
  });

  it("returns database status endpoint", async () => {
    const res = await request(app).get("/api/db/status");
    expect(res.status).toBe(200);
    expect(res.body.connected).toBe(true);
    expect(res.body.productsCount).toBeGreaterThan(0);
  });
});
