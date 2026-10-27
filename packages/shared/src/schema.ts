import { z } from "zod";

export const Dimensions3DSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  depth: z.number().positive(),
});
export type Dimensions3D = z.infer<typeof Dimensions3DSchema>;

export const Position3DSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});
export type Position3D = z.infer<typeof Position3DSchema>;

export const ProductCategorySchema = z.enum([
  "dairy",
  "bakery",
  "beverages",
  "snacks",
  "produce",
  "meat",
  "canned_goods",
  "personal_care",
  "cleaning",
  "general",
]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: ProductCategorySchema,
  dimensions: Dimensions3DSchema, // in meters (e.g. milk carton: 0.08 x 0.22 x 0.08)
  weightKg: z.number().nonnegative().default(0.5), // weight in kg for ergonomics & shelf stability
  price: z.number().positive(),
  margin: z.number().min(0).max(1),
  historicalSalesVelocity: z.number().nonnegative(), // units/day from 10-year data
  modelUrl: z.string().optional(),
  color: z.string().default("#3b82f6"),
});
export type Product = z.infer<typeof ProductSchema>;

export const FacingSlotSchema = z.object({
  id: z.string(),
  slotIndex: z.number().int().nonnegative(),
  productId: z.string().nullable(),
  facingCount: z.number().int().positive().default(1),
  capacityDepth: z.number().int().positive().default(5),
});
export type FacingSlot = z.infer<typeof FacingSlotSchema>;

export const ShelfLevelSchema = z.object({
  levelIndex: z.number().int().nonnegative(), // 0 = bottom, 1 = knee, 2 = eye level, 3 = top
  heightOffset: z.number().nonnegative(),
  slots: z.array(FacingSlotSchema),
});
export type ShelfLevel = z.infer<typeof ShelfLevelSchema>;

export const GondolaBaySchema = z.object({
  id: z.string(),
  bayIndex: z.number().int().nonnegative(),
  width: z.number().positive().default(1.2), // standard 1.2m bay
  shelves: z.array(ShelfLevelSchema),
});
export type GondolaBay = z.infer<typeof GondolaBaySchema>;

export const AisleSideSchema = z.enum(["left", "right"]);
export type AisleSide = z.infer<typeof AisleSideSchema>;

export const GondolaAisleSchema = z.object({
  id: z.string(),
  code: z.string(), // e.g. "Aisle-1"
  side: AisleSideSchema,
  start: Position3DSchema,
  bays: z.array(GondolaBaySchema),
  length: z.number().positive(),
  height: z.number().positive().default(2.1),
  depth: z.number().positive().default(0.6),
});
export type GondolaAisle = z.infer<typeof GondolaAisleSchema>;

export const StoreFormatSchema = z.enum([
  "modern_supermarket",
  "corner_bodega",
  "neighborhood_store",
]);
export type StoreFormat = z.infer<typeof StoreFormatSchema>;

export const FloorZoneMaterialSchema = z.enum([
  "tiles",
  "wood",
  "concrete",
  "carpet",
  "brick",
  "terrazzo",
]);
export type FloorZoneMaterial = z.infer<typeof FloorZoneMaterialSchema>;

export const FloorZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  zoneType: z.enum([
    "retail_sales",
    "checkout_counter",
    "backroom_storage",
    "entrance_porch",
    "bakery_cafe",
    "produce_area",
  ]),
  minX: z.number(),
  maxX: z.number(),
  minZ: z.number(),
  maxZ: z.number(),
  material: FloorZoneMaterialSchema.default("tiles"),
  color: z.string().default("#f1f5f9"),
});
export type FloorZone = z.infer<typeof FloorZoneSchema>;

export const StoreFixtureTypeSchema = z.enum([
  "gondola",
  "glass_counter_case",
  "wire_snack_rack",
  "hanging_strip",
  "produce_island",
  "cooler_unit",
  "wall_shelving",
  "backroom_storage",
  "cafe_station",
]);
export type StoreFixtureType = z.infer<typeof StoreFixtureTypeSchema>;

export const StoreFixtureSchema = z.object({
  id: z.string(),
  name: z.string(),
  fixtureType: StoreFixtureTypeSchema,
  position: Position3DSchema,
  dimensions: Dimensions3DSchema,
  rotationY: z.number().default(0), // in radians
  shelves: z.array(ShelfLevelSchema).default([]),
  metadata: z.record(z.any()).optional(),
});
export type StoreFixture = z.infer<typeof StoreFixtureSchema>;

export const ScanDetectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  fixtureType: StoreFixtureTypeSchema,
  confidence: z.number().min(0).max(1),
  bbox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  color: z.string().default("#22c55e"),
  skusDetected: z.number().int().nonnegative().default(0),
});
export type ScanDetection = z.infer<typeof ScanDetectionSchema>;

export const StoreSpaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  format: StoreFormatSchema.optional().default("modern_supermarket"),
  width: z.number().positive(), // in meters, e.g. 20m
  length: z.number().positive(), // in meters, e.g. 35m
  ceilingHeight: z.number().positive().default(4.0),
  entrancePosition: Position3DSchema.default({ x: 0, y: 0, z: 0 }),
  checkoutPosition: Position3DSchema.default({ x: 5, y: 0, z: 0 }),
  aisleWidth: z.number().positive().default(2.2), // standard 2.2m walkway
  gondolas: z.array(GondolaAisleSchema),
  fixtures: z.array(StoreFixtureSchema).optional().default([]),
  zones: z.array(FloorZoneSchema).optional().default([]),
});
export type StoreSpace = z.infer<typeof StoreSpaceSchema>;

export const ProductAffinitySchema = z.object({
  productAId: z.string(),
  productBId: z.string(),
  support: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  lift: z.number().positive(), // > 1 indicates positive affinity / complementary purchase
  coOccurrenceCount: z.number().int().nonnegative(),
});
export type ProductAffinity = z.infer<typeof ProductAffinitySchema>;

export const PlanogramKPIsSchema = z.object({
  totalProductsAssigned: z.number().int().nonnegative(),
  spaceUtilizationRate: z.number().min(0).max(1),
  affinityAlignmentScore: z.number().min(0).max(100),
  eyeLevelRevenuePotential: z.number().nonnegative(),
  hotZoneUtilizationRate: z.number().min(0).max(1).default(0), // % of high-margin items in levels 1 & 2
  ergonomicViolationsCount: z.number().int().nonnegative().default(0), // heavy items on high levels
  highLiftPairsAdjacent: z.number().int().nonnegative().default(0), // high-lift pairs placed close
  totalHighLiftPairs: z.number().int().nonnegative().default(0),
  revenuePerLinearMeter: z.number().nonnegative().default(0),
});
export type PlanogramKPIs = z.infer<typeof PlanogramKPIsSchema>;

export interface PlanogramComparison {
  beforeKPIs: PlanogramKPIs;
  afterKPIs: PlanogramKPIs;
  revenueImprovementPct: number;
  ergonomicViolationsResolved: number;
  affinityCoverageImprovementPct: number;
  executiveSummary: string[];
}
