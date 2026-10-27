// Shared
export * from "./shared/errors";

// Domain
export * from "./domain/entities/Product";
export * from "./domain/entities/StoreLayout";
export * from "./domain/value-objects/AffinityScore";
export * from "./domain/repositories/IProductRepository";
export * from "./domain/repositories/IStoreLayoutRepository";
export * from "./domain/repositories/IAffinityRepository";

// Application
export * from "./application/dtos/PlanogramDTO";
export * from "./application/ports/IPlanogramOptimizerPort";
export * from "./application/use-cases/GeneratePlanogramUseCase";

// Infrastructure
export * from "./infrastructure/repositories/InMemoryProductRepository";
export * from "./infrastructure/repositories/InMemoryStoreLayoutRepository";
export * from "./infrastructure/repositories/InMemoryAffinityRepository";
export * from "./infrastructure/engine/HeuristicPlanogramOptimizer";
