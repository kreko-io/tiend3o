import { generateStoreLayout } from "@tiend3o/shared";
import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { IStoreLayoutRepository } from "../../domain/repositories/IStoreLayoutRepository";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IPlanogramOptimizerPort } from "../ports/IPlanogramOptimizerPort";
import { GeneratePlanogramRequestDTO, PlanogramResponseDTO } from "../dtos/PlanogramDTO";
import { Result, ok } from "../../shared/errors";

export class GeneratePlanogramUseCase {
  constructor(
    private readonly storeRepo: IStoreLayoutRepository,
    private readonly productRepo: IProductRepository,
    private readonly optimizer: IPlanogramOptimizerPort
  ) {}

  async execute(dto: GeneratePlanogramRequestDTO): Promise<Result<PlanogramResponseDTO>> {
    const rawSpace = generateStoreLayout({
      storeWidth: dto.storeWidth,
      storeLength: dto.storeLength,
      aisleWidth: dto.aisleWidth,
      bayCountPerAisle: dto.bayCount,
    });

    const storeEntity = new StoreLayoutEntity(rawSpace);
    const products = await this.productRepo.findAll();

    const optimized = await this.optimizer.optimizeSlotting(storeEntity, products);
    await this.storeRepo.save(optimized);

    const productsMap = new Map(products.map((p) => [p.id, p]));
    const kpis = optimized.calculateKPIs(productsMap);

    return ok({
      layout: optimized.space,
      products: products.map((p) => p.toDTO()),
      kpis,
    });
  }
}
