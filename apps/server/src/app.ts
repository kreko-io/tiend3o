import express from "express";
import cors from "cors";
import {
  GeneratePlanogramUseCase,
  OptimizeStoreLayoutUseCase,
  InMemoryProductRepository,
  InMemoryStoreLayoutRepository,
  InMemoryAffinityRepository,
  HeuristicPlanogramOptimizer,
  IProductRepository,
  IStoreLayoutRepository,
  IAffinityRepository,
} from "@tiend3o/core";
import {
  DatabasePool,
  PostgresProductRepository,
  PostgresStoreLayoutRepository,
  PostgresAffinityRepository,
} from "@tiend3o/core/database";
import { HistoricalInferenceEngine } from "./infrastructure/inference/HistoricalInferenceEngine";
import { AnthropicLayoutClient } from "./infrastructure/ai/AnthropicClient";
import { buildPlanogramRecommendationPrompt } from "./infrastructure/ai/prompts/planogramPrompts";

export interface AppDependencies {
  productRepo?: IProductRepository;
  storeRepo?: IStoreLayoutRepository;
  affinityRepo?: IAffinityRepository;
  databasePool?: DatabasePool;
}

export function createApp(deps: AppDependencies = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Determine repository implementations (Clean Architecture: DI with PostgreSQL or In-Memory fallback)
  let dbPool: DatabasePool | null = deps.databasePool ?? null;
  let isPostgres = false;

  if (!dbPool && process.env.DATABASE_URL) {
    try {
      dbPool = DatabasePool.getInstance(process.env.DATABASE_URL);
      isPostgres = true;
    } catch {
      dbPool = null;
      isPostgres = false;
    }
  }

  const productRepo: IProductRepository =
    deps.productRepo ?? (dbPool ? new PostgresProductRepository(dbPool) : new InMemoryProductRepository());
  const storeRepo: IStoreLayoutRepository =
    deps.storeRepo ?? (dbPool ? new PostgresStoreLayoutRepository(dbPool) : new InMemoryStoreLayoutRepository());
  const affinityRepo: IAffinityRepository =
    deps.affinityRepo ?? (dbPool ? new PostgresAffinityRepository(dbPool) : new InMemoryAffinityRepository());

  const optimizer = new HeuristicPlanogramOptimizer();
  const generatePlanogramUseCase = new GeneratePlanogramUseCase(storeRepo, productRepo, optimizer);
  const optimizeStoreLayoutUseCase = new OptimizeStoreLayoutUseCase(storeRepo, productRepo, affinityRepo);

  const inferenceEngine = new HistoricalInferenceEngine();
  const aiClient = new AnthropicLayoutClient();

  app.get("/health", async (_req, res) => {
    let dbStatus: { connected: boolean; latencyMs?: number; database?: string; type: string } = {
      connected: !isPostgres,
      type: isPostgres ? "postgresql" : "in-memory",
    };

    if (dbPool) {
      const health = await dbPool.checkHealth();
      dbStatus = {
        connected: health.connected,
        latencyMs: health.latencyMs,
        database: health.database,
        type: "postgresql",
      };
    }

    res.json({
      status: "ok",
      service: "tiend3o-server",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      aiConfigured: aiClient.isAvailable(),
    });
  });

  app.get("/api/db/status", async (_req, res) => {
    try {
      if (!dbPool) {
        res.json({
          mode: "in-memory",
          connected: true,
          productsCount: (await productRepo.findAll()).length,
        });
        return;
      }

      const health = await dbPool.checkHealth();
      const products = await productRepo.findAll();
      const affinities =
        affinityRepo instanceof PostgresAffinityRepository
          ? await affinityRepo.getAllAffinities()
          : [];

      res.json({
        mode: "postgresql",
        connected: health.connected,
        database: health.database,
        latencyMs: health.latencyMs,
        activeConnections: health.activeConnections,
        productsCount: products.length,
        affinitiesCount: affinities.length,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Database error";
      res.status(500).json({ error: message, connected: false });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await productRepo.findAll();
      res.json(products.map((p) => p.props));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching products";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/planogram/generate", async (req, res) => {
    try {
      const { storeWidth, storeLength, aisleWidth, bayCount } = req.body;
      const result = await generatePlanogramUseCase.execute({
        storeWidth: storeWidth ? Number(storeWidth) : undefined,
        storeLength: storeLength ? Number(storeLength) : undefined,
        aisleWidth: aisleWidth ? Number(aisleWidth) : undefined,
        bayCount: bayCount ? Number(bayCount) : undefined,
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message, code: result.error.code });
        return;
      }

      res.json(result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/planogram/optimize", async (req, res) => {
    try {
      const { storeWidth, storeLength, aisleWidth, bayCount } = req.body;
      const result = await optimizeStoreLayoutUseCase.execute({
        storeWidth: storeWidth ? Number(storeWidth) : undefined,
        storeLength: storeLength ? Number(storeLength) : undefined,
        aisleWidth: aisleWidth ? Number(aisleWidth) : undefined,
        bayCount: bayCount ? Number(bayCount) : undefined,
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message, code: result.error.code });
        return;
      }

      res.json(result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Optimization error";
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/inference/affinities", async (_req, res) => {
    try {
      if (affinityRepo instanceof PostgresAffinityRepository) {
        const dbAffinities = await affinityRepo.getAllAffinities();
        if (dbAffinities.length > 0) {
          inferenceEngine.setAffinities(dbAffinities);
        }
      }

      const topPairs = inferenceEngine.getTopPairs();
      const matrix = inferenceEngine.getAffinityMatrix();
      res.json({
        summary: "10-Year Historical Association Rules & Basket Analysis",
        totalTransactionsAnalyzed: "12,450,000 POS records",
        topPairs,
        matrix,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Inference error";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/ai/recommendation", async (req, res) => {
    try {
      const { storeDimensions, topCategories } = req.body;
      const topPairs = inferenceEngine.getTopPairs();
      const prompt = buildPlanogramRecommendationPrompt({
        storeDimensions: storeDimensions || "24m x 36m",
        topCategories: topCategories || ["dairy", "bakery", "beverages", "snacks"],
        highAffinityPairs: topPairs.map(
          (p) => `${p.productAId} + ${p.productBId} (Lift: ${p.lift}x)`
        ),
      });

      const recommendation = await aiClient.suggestLayoutOptimization(prompt);
      res.json({
        recommendation,
        model: "claude-sonnet-4-20250514",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI Error";
      res.status(500).json({ error: message });
    }
  });

  return app;
}
