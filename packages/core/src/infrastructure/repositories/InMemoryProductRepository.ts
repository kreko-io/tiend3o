import { ProductEntity } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export const SAMPLE_PRODUCTS: ProductEntity[] = [
  new ProductEntity({
    id: "prod-milk-whole",
    sku: "DAIRY-001",
    name: "Whole Milk 1L Carton",
    category: "dairy",
    dimensions: { width: 0.08, height: 0.22, depth: 0.08 },
    price: 1.85,
    margin: 0.32,
    historicalSalesVelocity: 145,
    color: "#60a5fa",
  }),
  new ProductEntity({
    id: "prod-milk-almond",
    sku: "DAIRY-002",
    name: "Almond Milk 1L",
    category: "dairy",
    dimensions: { width: 0.08, height: 0.22, depth: 0.08 },
    price: 2.95,
    margin: 0.45,
    historicalSalesVelocity: 88,
    color: "#93c5fd",
  }),
  new ProductEntity({
    id: "prod-cereal-oats",
    sku: "BAKERY-001",
    name: "Toasted Honey Oats Cereal 500g",
    category: "bakery",
    dimensions: { width: 0.18, height: 0.28, depth: 0.06 },
    price: 3.49,
    margin: 0.48,
    historicalSalesVelocity: 94,
    color: "#f59e0b",
  }),
  new ProductEntity({
    id: "prod-bread-artisan",
    sku: "BAKERY-002",
    name: "Artisan Sliced Brioche",
    category: "bakery",
    dimensions: { width: 0.12, height: 0.14, depth: 0.24 },
    price: 2.75,
    margin: 0.42,
    historicalSalesVelocity: 120,
    color: "#d97706",
  }),
  new ProductEntity({
    id: "prod-soda-cola",
    sku: "BEV-001",
    name: "Sparkling Cola 2L Bottle",
    category: "beverages",
    dimensions: { width: 0.11, height: 0.32, depth: 0.11 },
    price: 2.29,
    margin: 0.38,
    historicalSalesVelocity: 180,
    color: "#ef4444",
  }),
  new ProductEntity({
    id: "prod-chips-salted",
    sku: "SNACK-001",
    name: "Crispy Potato Chips 180g",
    category: "snacks",
    dimensions: { width: 0.16, height: 0.26, depth: 0.08 },
    price: 1.99,
    margin: 0.52,
    historicalSalesVelocity: 165,
    color: "#eab308",
  }),
  new ProductEntity({
    id: "prod-beer-craft",
    sku: "BEV-002",
    name: "Craft IPA 6-Pack",
    category: "beverages",
    dimensions: { width: 0.18, height: 0.22, depth: 0.12 },
    price: 9.99,
    margin: 0.44,
    historicalSalesVelocity: 72,
    color: "#ca8a04",
  }),
  new ProductEntity({
    id: "prod-pasta-spaghetti",
    sku: "CANNED-001",
    name: "Italian Spaghetti 500g",
    category: "canned_goods",
    dimensions: { width: 0.08, height: 0.28, depth: 0.04 },
    price: 1.25,
    margin: 0.35,
    historicalSalesVelocity: 130,
    color: "#fbbf24",
  }),
  new ProductEntity({
    id: "prod-tomato-sauce",
    sku: "CANNED-002",
    name: "Organic Basil Tomato Sauce 400g",
    category: "canned_goods",
    dimensions: { width: 0.08, height: 0.14, depth: 0.08 },
    price: 1.65,
    margin: 0.40,
    historicalSalesVelocity: 115,
    color: "#dc2626",
  }),
];

export class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, ProductEntity> = new Map();

  constructor(initialProducts: ProductEntity[] = SAMPLE_PRODUCTS) {
    for (const p of initialProducts) {
      this.products.set(p.id, p);
    }
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.products.get(id) ?? null;
  }

  async findAll(): Promise<ProductEntity[]> {
    return Array.from(this.products.values());
  }

  async findByCategory(category: string): Promise<ProductEntity[]> {
    return Array.from(this.products.values()).filter((p) => p.category === category);
  }

  async save(product: ProductEntity): Promise<void> {
    this.products.set(product.id, product);
  }
}
