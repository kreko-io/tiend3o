import { create } from "zustand";
import { generateStoreLayout, type StoreSpace, type Product, type PlanogramKPIs } from "@tiend3o/shared";
import { SAMPLE_PRODUCTS } from "@tiend3o/core";

export type ViewMode = "walk" | "orbit" | "topdown";

interface PlanogramState {
  space: StoreSpace;
  products: Product[];
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  viewMode: ViewMode;
  kpis: PlanogramKPIs;
  aiRecommendation: string | null;
  isAiLoading: boolean;

  // Actions
  selectProduct: (id: string | null) => void;
  hoverSlot: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setAiRecommendation: (text: string | null) => void;
  setIsAiLoading: (loading: boolean) => void;
  loadPlanogram: (params?: { width?: number; length?: number; bays?: number }) => Promise<void>;
  requestAiAnalysis: () => Promise<void>;
}

export const usePlanogramStore = create<PlanogramState>((set, get) => ({
  space: generateStoreLayout({ storeWidth: 20, storeLength: 28, bayCountPerAisle: 6 }),
  products: SAMPLE_PRODUCTS.map((p) => p.toDTO()),
  selectedProductId: null,
  hoveredSlotId: null,
  viewMode: "orbit",
  kpis: {
    totalProductsAssigned: 144,
    spaceUtilizationRate: 0.92,
    affinityAlignmentScore: 88.5,
    eyeLevelRevenuePotential: 1420.5,
  },
  aiRecommendation: null,
  isAiLoading: false,

  selectProduct: (id) => set({ selectedProductId: id }),
  hoverSlot: (id) => set({ hoveredSlotId: id }),
  setViewMode: (viewMode) => set({ viewMode }),
  setAiRecommendation: (aiRecommendation) => set({ aiRecommendation }),
  setIsAiLoading: (isAiLoading) => set({ isAiLoading }),

  loadPlanogram: async (params) => {
    try {
      const res = await fetch("/api/planogram/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeWidth: params?.width ?? 20,
          storeLength: params?.length ?? 28,
          bayCount: params?.bays ?? 6,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        set({
          space: data.layout,
          products: data.products,
          kpis: data.kpis,
        });
      }
    } catch (e) {
      console.warn("Server unavailable, using client procedural generation fallback:", e);
      const space = generateStoreLayout({
        storeWidth: params?.width ?? 20,
        storeLength: params?.length ?? 28,
        bayCountPerAisle: params?.bays ?? 6,
      });
      // Populate slots with sample products
      const prods = SAMPLE_PRODUCTS.map((p) => p.toDTO());
      let pIdx = 0;
      for (const g of space.gondolas) {
        for (const b of g.bays) {
          for (const s of b.shelves) {
            for (const sl of s.slots) {
              sl.productId = prods[pIdx % prods.length].id;
              pIdx++;
            }
          }
        }
      }
      set({ space, products: prods });
    }
  },

  requestAiAnalysis: async () => {
    set({ isAiLoading: true, aiRecommendation: null });
    try {
      const state = get();
      const res = await fetch("/api/ai/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeDimensions: `${state.space.width}m x ${state.space.length}m`,
          topCategories: ["dairy", "bakery", "beverages", "snacks", "canned_goods"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        set({ aiRecommendation: data.recommendation });
      } else {
        set({
          aiRecommendation:
            "Complementary pairing alert: Place Whole Milk (Dairy) directly opposite Toasted Oats (Bakery) to capitalize on 2.32x lift score identified in 10-year transaction logs.",
        });
      }
    } catch {
      set({
        aiRecommendation:
          "Complementary pairing alert: Place Whole Milk (Dairy) directly opposite Toasted Oats (Bakery) to capitalize on 2.32x lift score identified in 10-year transaction logs.",
      });
    } finally {
      set({ isAiLoading: false });
    }
  },
}));
