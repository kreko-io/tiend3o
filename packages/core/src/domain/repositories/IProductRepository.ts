import { ProductEntity } from "../entities/Product";

export interface IProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  findAll(): Promise<ProductEntity[]>;
  findByCategory(category: string): Promise<ProductEntity[]>;
  save(product: ProductEntity): Promise<void>;
}
