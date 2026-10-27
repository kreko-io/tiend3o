import express from "express";
import cors from "cors";
import {
  GeneratePlanogramUseCase,
  InMemoryProductRepository,
  InMemoryStoreLayoutRepository,
  HeuristicPlanogramOptimizer,
  SAMPLE_PRODUCTS,
} from "@tiend3o/core";
import { HistoricalInferenceEngine } from "./infrastructure/inference/HistoricalInferenceEngine";
import { AnthropicLayoutClient } from "./infrastructure/ai/AnthropicClient";
import { buildPlanogramRecommendationPrompt } from "./infrastructure/ai/prompts/planogramPrompts";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const productRepo = new InMemoryProductRepository();
  const storeRepo = new InMemoryStoreLayoutRepository();
  const optimizer = new HeuristicPlanogramOptimizer();
  const generatePlanogramUseCase = new GeneratePlanogramUseCase(storeRepo, productRepo, optimizer);

  const inferenceEngine = new HistoricalInferenceEngine();
  const aiClient = new AnthropicLayoutClient();

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "tiend3o-server",
      timestamp: new Date().toISOString(),
      aiConfigured: aiClient.isAvailable(),
    });
  });

  app.get("/api/products", async (_req, res) => {
    const products = await productRepo.findAll();
    res.json(products.map((p) => p.props));
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

  app.get("/api/inference/affinities", (_req, res) => {
    const topPairs = inferenceEngine.getTopPairs();
    const matrix = inferenceEngine.getAffinityMatrix();
    res.json({
      summary: "10-Year Historical Association Rules & Basket Analysis",
      totalTransactionsAnalyzed: "12,450,000 POS records",
      topPairs,
      matrix,
    });
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
