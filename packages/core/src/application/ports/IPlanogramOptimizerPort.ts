import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { ProductEntity } from "../../domain/entities/Product";

export interface IPlanogramOptimizerPort {
  optimizeSlotting(
    layout: StoreLayoutEntity,
    products: ProductEntity[]
  ): Promise<StoreLayoutEntity>;
}
