import React from "react";
import {
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
  DollarSign,
  PackageCheck,
  Zap,
} from "lucide-react";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { HISTORICAL_AFFINITIES_10Y } from "@tiend3o/core";

export function PlanogramSidebar() {
  const {
    products,
    selectedProductId,
    selectProduct,
    kpis,
    space,
  } = usePlanogramStore();

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Find related affinities for selected product
  const relatedAffinities = selectedProductId
    ? HISTORICAL_AFFINITIES_10Y.filter(
        (a) =>
          a.productAId === selectedProductId ||
          a.productBId === selectedProductId
      )
    : [];

  return (
    <aside className="absolute right-4 top-20 bottom-4 w-84 z-20 flex flex-col gap-3 pointer-events-none">
      {/* KPI Metrics Widget */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl pointer-events-auto">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          Store Performance KPIs
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <PackageCheck className="w-3 h-3 text-emerald-400" />
              Slot Occupancy
            </span>
            <p className="text-base font-bold text-slate-100 mt-0.5">
              {kpis.totalProductsAssigned} facings
            </p>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Percent className="w-3 h-3 text-sky-400" />
              Space Utilization
            </span>
            <p className="text-base font-bold text-slate-100 mt-0.5">
              {Math.round(kpis.spaceUtilizationRate * 100)}%
            </p>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Affinity Score
            </span>
            <p className="text-base font-bold text-slate-100 mt-0.5">
              {kpis.affinityAlignmentScore}/100
            </p>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-purple-400" />
              Eye-Level Value
            </span>
            <p className="text-base font-bold text-slate-100 mt-0.5">
              ${kpis.eyeLevelRevenuePotential}/day
            </p>
          </div>
        </div>
      </div>

      {/* Selected Product Inspector */}
      {selectedProduct ? (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {selectedProduct.category}
            </span>
            <button
              onClick={() => selectProduct(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <h3 className="font-semibold text-sm text-slate-100 leading-tight">
            {selectedProduct.name}
          </h3>
          <p className="text-[11px] text-slate-400 mb-3">SKU: {selectedProduct.sku}</p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Dimensions (WxHxD):</span>
              <span className="font-mono text-slate-200">
                {Math.round(selectedProduct.dimensions.width * 100)} ×{" "}
                {Math.round(selectedProduct.dimensions.height * 100)} ×{" "}
                {Math.round(selectedProduct.dimensions.depth * 100)} cm
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Unit Retail Price:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                ${selectedProduct.price.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Gross Margin:</span>
              <span className="font-mono text-slate-200">
                {Math.round(selectedProduct.margin * 100)}%
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">10-Yr Sales Velocity:</span>
              <span className="font-mono text-amber-300 font-semibold">
                {selectedProduct.historicalSalesVelocity} units/day
              </span>
            </div>
          </div>

          {/* Historical Complementary Affinities */}
          {relatedAffinities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                10-Year Co-Purchase Affinities
              </p>
              <div className="space-y-1.5">
                {relatedAffinities.map((aff, i) => {
                  const otherId =
                    aff.productAId === selectedProductId
                      ? aff.productBId
                      : aff.productAId;
                  const otherProd = products.find((p) => p.id === otherId);

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] bg-slate-800/40 px-2 py-1.5 rounded-lg border border-slate-700/40"
                    >
                      <span className="text-slate-300 truncate max-w-[140px]">
                        {otherProd?.name ?? otherId}
                      </span>
                      <span className="text-sky-400 font-semibold font-mono">
                        +{aff.lift}x Lift
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/60 rounded-2xl p-4 shadow-xl pointer-events-auto text-center py-6">
          <p className="text-xs text-slate-400">
            Click any product carton, bottle, or shelf slot to inspect planogram analytics.
          </p>
        </div>
      )}
    </aside>
  );
}
