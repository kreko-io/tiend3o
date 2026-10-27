import type { StoreSpace, Product, PlanogramKPIs } from "@tiend3o/shared";

export interface GeneratePlanogramRequestDTO {
  storeWidth?: number;
  storeLength?: number;
  aisleWidth?: number;
  bayCount?: number;
}

export interface OptimizeLayoutRequestDTO {
  storeId: string;
}

export interface PlanogramResponseDTO {
  layout: StoreSpace;
  products: Product[];
  kpis: PlanogramKPIs;
}

export interface OptimizeStoreLayoutResponseDTO {
  suboptimalLayout: StoreSpace;
  optimizedLayout: StoreSpace;
  products: Product[];
  beforeKPIs: PlanogramKPIs;
  afterKPIs: PlanogramKPIs;
  revenueImprovementPct: number;
  ergonomicViolationsResolved: number;
  affinityCoverageImprovementPct: number;
  executiveSummary: string[];
}
