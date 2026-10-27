import type { Dimensions3D, ProductCategory } from "@tiend3o/shared";

export interface ProductProps {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  dimensions: Dimensions3D;
  price: number;
  margin: number;
  historicalSalesVelocity: number;
  modelUrl?: string;
  color?: string;
}

export class ProductEntity {
  constructor(public readonly props: ProductProps) {}

  toDTO() {
    return {
      ...this.props,
      color: this.color,
    };
  }

  get id(): string {
    return this.props.id;
  }

  get sku(): string {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): ProductCategory {
    return this.props.category;
  }

  get dimensions(): Dimensions3D {
    return this.props.dimensions;
  }

  get price(): number {
    return this.props.price;
  }

  get margin(): number {
    return this.props.margin;
  }

  get historicalSalesVelocity(): number {
    return this.props.historicalSalesVelocity;
  }

  get modelUrl(): string | undefined {
    return this.props.modelUrl;
  }

  get color(): string {
    return this.props.color ?? "#3b82f6";
  }

  /**
   * Eye-level priority score based on profit margin * historical transaction frequency.
   */
  calculatePlacementPriority(): number {
    return this.props.margin * this.props.price * this.props.historicalSalesVelocity;
  }
}
