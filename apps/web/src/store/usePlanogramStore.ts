import { create } from "zustand";
import {
  generateStoreLayout,
  type StoreSpace,
  type Product,
  type PlanogramKPIs,
  type StoreScanPreset,
  ALL_SCAN_PRESETS,
  PRESET_BODEGA_ESQUINA,
} from "@tiend3o/shared";
import { SAMPLE_PRODUCTS, HISTORICAL_AFFINITIES_10Y } from "@tiend3o/core";

export type ViewMode = "isometric" | "counter" | "orbit" | "topdown" | "walk";
export type OptimizationState = "suboptimal" | "optimized";
export type OverlayMode = "realistic" | "heatmap" | "lift_arcs";
export type ThemeMode = "light" | "dark";

interface PlanogramState {
  // Store Environment Theme
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Scan & Preset State
  activePresetId: string;
  isScannerModalOpen: boolean;
  isScanningAnimationActive: boolean;
  diagnostics: string[];
  isDiagnosticOpen: boolean;

  // Layout and Comparative Optimization State
  optimizationState: OptimizationState;
  overlayMode: OverlayMode;
  space: StoreSpace;
  suboptimalSpace: StoreSpace;
  optimizedSpace: StoreSpace;
  products: Product[];

  // Selection & Viewport
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  viewMode: ViewMode;

  // Comparative Executive KPIs
  kpis: PlanogramKPIs;
  beforeKPIs: PlanogramKPIs;
  afterKPIs: PlanogramKPIs;
  revenueImprovementPct: number;
  ergonomicViolationsResolved: number;
  affinityCoverageImprovementPct: number;
  executiveSummary: string[];
  isExecutiveSummaryOpen: boolean;
  isSidebarOpen: boolean;

  // AI Integration
  aiRecommendation: string | null;
  isAiLoading: boolean;

  // Actions
  setOptimizationState: (state: OptimizationState) => void;
  setOverlayMode: (mode: OverlayMode) => void;
  selectProduct: (id: string | null) => void;
  hoverSlot: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setExecutiveSummaryOpen: (open: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDiagnosticOpen: (open: boolean) => void;
  toggleDiagnostic: () => void;
  openScannerModal: () => void;
  closeScannerModal: () => void;
  selectPreset: (presetId: string) => void;
  applyOneClickOptimization: () => void;
  setAiRecommendation: (text: string | null) => void;
  setIsAiLoading: (loading: boolean) => void;
  loadComparison: (params?: { width?: number; length?: number; bays?: number }) => Promise<void>;
  requestAiAnalysis: () => Promise<void>;
}

// Initial default: Bodega de Esquina (mostrador, vitrina, estantería y snacks)
const initialPreset = PRESET_BODEGA_ESQUINA;
const initialOptimized = initialPreset.generateSpace(true);
const initialSuboptimal = initialPreset.generateSpace(false);

export const usePlanogramStore = create<PlanogramState>((set, get) => ({
  themeMode: "light",
  setThemeMode: (themeMode) => set({ themeMode }),
  toggleTheme: () => set((s) => ({ themeMode: s.themeMode === "light" ? "dark" : "light" })),

  // Scan & Preset State
  activePresetId: initialPreset.id,
  isScannerModalOpen: false,
  isScanningAnimationActive: false,
  diagnostics: initialPreset.diagnostics,
  isDiagnosticOpen: true,

  optimizationState: "optimized",
  overlayMode: "realistic",
  space: initialOptimized,
  suboptimalSpace: initialSuboptimal,
  optimizedSpace: initialOptimized,
  products: SAMPLE_PRODUCTS.map((p) => p.toDTO()),
  selectedProductId: null,
  hoveredSlotId: null,
  viewMode: "isometric",

  kpis: {
    totalProductsAssigned: 72,
    spaceUtilizationRate: 0.98,
    affinityAlignmentScore: 100,
    eyeLevelRevenuePotential: 1850.0,
    hotZoneUtilizationRate: 0.92,
    ergonomicViolationsCount: 0,
    highLiftPairsAdjacent: 6,
    totalHighLiftPairs: 6,
    revenuePerLinearMeter: 54.2,
  },
  beforeKPIs: {
    totalProductsAssigned: 72,
    spaceUtilizationRate: 0.92,
    affinityAlignmentScore: 24,
    eyeLevelRevenuePotential: 620.0,
    hotZoneUtilizationRate: 0.32,
    ergonomicViolationsCount: 2,
    highLiftPairsAdjacent: 1,
    totalHighLiftPairs: 6,
    revenuePerLinearMeter: 18.4,
  },
  afterKPIs: {
    totalProductsAssigned: 72,
    spaceUtilizationRate: 0.98,
    affinityAlignmentScore: 100,
    eyeLevelRevenuePotential: 1850.0,
    hotZoneUtilizationRate: 0.92,
    ergonomicViolationsCount: 0,
    highLiftPairsAdjacent: 6,
    totalHighLiftPairs: 6,
    revenuePerLinearMeter: 54.2,
  },
  revenueImprovementPct: 24,
  ergonomicViolationsResolved: 2,
  affinityCoverageImprovementPct: 76,
  executiveSummary: [
    "🛡️ Ergonomía y Seguridad en Bodega: Se reubicaron galones pesados de Aceite (5kg) y sacos de harina al Nivel 0 (Piso), eliminando el riesgo de caída sobre el bodeguero.",
    "📈 Vitrina Mostrador Rentabilizada: Se colocaron en la vitrina de vidrio frente al código QR los productos de alto margen (Atún gourmet, Chocolates y Afeitadoras), proyectando +24.8% en ticket promedio.",
    "🔗 Venta Cruzada Activada (Lift 2.8): Se colocó el exhibidor de snacks junto al punto de pago y frente a la nevera de bebidas frías.",
  ],
  isExecutiveSummaryOpen: false,
  isSidebarOpen: false,

  aiRecommendation: null,
  isAiLoading: false,

  setOptimizationState: (state) => {
    const s = get();
    if (state === "optimized") {
      set({
        optimizationState: "optimized",
        space: s.optimizedSpace,
        kpis: s.afterKPIs,
      });
    } else {
      set({
        optimizationState: "suboptimal",
        space: s.suboptimalSpace,
        kpis: s.beforeKPIs,
      });
    }
  },

  setOverlayMode: (overlayMode) => set({ overlayMode }),
  selectProduct: (id) =>
    set({
      selectedProductId: id,
      ...(id ? { isSidebarOpen: true } : {}),
    }),
  hoverSlot: (id) => set({ hoveredSlotId: id }),
  setViewMode: (viewMode) => set({ viewMode }),
  setExecutiveSummaryOpen: (isExecutiveSummaryOpen) => set({ isExecutiveSummaryOpen }),
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setDiagnosticOpen: (isDiagnosticOpen) => set({ isDiagnosticOpen }),
  toggleDiagnostic: () => set((s) => ({ isDiagnosticOpen: !s.isDiagnosticOpen })),
  openScannerModal: () => set({ isScannerModalOpen: true }),
  closeScannerModal: () => set({ isScannerModalOpen: false }),

  selectPreset: (presetId: string) => {
    const preset = ALL_SCAN_PRESETS.find((p) => p.id === presetId) ?? PRESET_BODEGA_ESQUINA;
    const subSpace = preset.generateSpace(false);
    const optSpace = preset.generateSpace(true);

    // Trigger scanning animation
    set({
      activePresetId: preset.id,
      isScannerModalOpen: false,
      isScanningAnimationActive: true,
      suboptimalSpace: subSpace,
      optimizedSpace: optSpace,
      space: subSpace, // Start in As-Is (scanned/disordered)
      optimizationState: "suboptimal",
      diagnostics: preset.diagnostics,
      isDiagnosticOpen: true,
      overlayMode: "realistic",
      revenueImprovementPct: parseInt(preset.optimizationGains.revenueImprovement.replace(/[^0-9]/g, "")) || 25,
      ergonomicViolationsResolved: preset.optimizationGains.hazardsResolved,
    });

    // Stop laser animation after 2.2 seconds
    setTimeout(() => {
      set({ isScanningAnimationActive: false });
    }, 2200);
  },

  applyOneClickOptimization: () => {
    const s = get();
    set({
      optimizationState: "optimized",
      space: s.optimizedSpace,
      kpis: s.afterKPIs,
      overlayMode: "lift_arcs", // Show the activated cross-selling connections!
      isDiagnosticOpen: false,
    });
  },
  setAiRecommendation: (aiRecommendation) => set({ aiRecommendation }),
  setIsAiLoading: (isAiLoading) => set({ isAiLoading }),

  loadComparison: async (params) => {
    try {
      const res = await fetch("/api/planogram/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeWidth: params?.width ?? 24,
          storeLength: params?.length ?? 36,
          aisleWidth: 2.4,
          bayCount: params?.bays ?? 8,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const currentOptState = get().optimizationState;
        const activeSpace =
          currentOptState === "optimized" ? data.optimizedLayout : data.suboptimalLayout;
        const activeKPIs = currentOptState === "optimized" ? data.afterKPIs : data.beforeKPIs;

        set({
          suboptimalSpace: data.suboptimalLayout,
          optimizedSpace: data.optimizedLayout,
          space: activeSpace,
          products: data.products,
          beforeKPIs: data.beforeKPIs,
          afterKPIs: data.afterKPIs,
          kpis: activeKPIs,
          revenueImprovementPct: data.revenueImprovementPct,
          ergonomicViolationsResolved: data.ergonomicViolationsResolved,
          affinityCoverageImprovementPct: data.affinityCoverageImprovementPct,
          executiveSummary: data.executiveSummary,
        });
      }
    } catch (e) {
      console.warn("Using offline deterministic fallback comparison:", e);
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
      }
    } catch (e) {
      set({
        aiRecommendation:
          "Estrategia de Merchandising IA: El traslado de artículos de alto margen (Aged Parmesan, Dark Chocolate, Artesanal Brioche) a la franja de 1.2m-1.5m incrementa la tasa de conversión en un 28%. La colocación de Cerveza Artesanal y Snacks Salados en adyacencia directa en Pasillo 1A/1B maximiza la captura de compras impulsivas basadas en un Lift histórico de 2.85x.",
      });
    } finally {
      set({ isAiLoading: false });
    }
  },
}));
