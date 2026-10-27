import { describe, expect, it } from "vitest";
import { GeneratePlanogramUseCase } from "./application/use-cases/GeneratePlanogramUseCase";
import { InMemoryProductRepository } from "./infrastructure/repositories/InMemoryProductRepository";
import { InMemoryStoreLayoutRepository } from "./infrastructure/repositories/InMemoryStoreLayoutRepository";
import { HeuristicPlanogramOptimizer } from "./infrastructure/engine/HeuristicPlanogramOptimizer";
import { AffinityScore } from "./domain/value-objects/AffinityScore";

describe("Planogram Generation & Optimization Use Case", () => {
  it("generates an optimized planogram assigning products to store slots", async () => {
    const productRepo = new InMemoryProductRepository();
    const storeRepo = new InMemoryStoreLayoutRepository();
    const optimizer = new HeuristicPlanogramOptimizer();

    const useCase = new GeneratePlanogramUseCase(storeRepo, productRepo, optimizer);
    const result = await useCase.execute({
      storeWidth: 16,
      storeLength: 24,
      bayCount: 4,
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.layout.gondolas.length).toBeGreaterThan(0);
    expect(result.data.kpis.totalProductsAssigned).toBeGreaterThan(0);
    expect(result.data.kpis.spaceUtilizationRate).toBe(1); // all slots filled in sample
  });

  it("evaluates affinity score correctly", () => {
    const strongPair = new AffinityScore(0.3, 0.6, 2.4, 40000);
    expect(strongPair.isComplementary()).toBe(true);

    const weakPair = new AffinityScore(0.05, 0.1, 0.9, 1000);
    expect(weakPair.isComplementary()).toBe(false);
  });
});
