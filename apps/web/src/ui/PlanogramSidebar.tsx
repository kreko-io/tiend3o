import React, { useState } from "react";
import {
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
  DollarSign,
  PackageCheck,
  Zap,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Scale,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { HISTORICAL_AFFINITIES_10Y } from "@tiend3o/core";

export function PlanogramSidebar() {
  const {
    products,
    selectedProductId,
    selectProduct,
    optimizationState,
    kpis,
    beforeKPIs,
    afterKPIs,
    revenueImprovementPct,
    ergonomicViolationsResolved,
    executiveSummary,
  } = usePlanogramStore();

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Find related affinities for selected product
  const relatedAffinities = selectedProductId
    ? HISTORICAL_AFFINITIES_10Y.filter(
        (a) =>
          a.productAId === selectedProductId ||
          a.productBId === selectedProductId
      )
    : [];

  const isOptimized = optimizationState === "optimized";

  return (
    <aside className="absolute right-4 top-16 bottom-4 w-92 z-20 flex flex-col gap-2.5 pointer-events-none overflow-y-auto pr-1">
      {/* State Status Banner */}
      <div
        className={`pointer-events-auto rounded-2xl p-3 border shadow-xl backdrop-blur-md transition-all ${
          isOptimized
            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
            : "bg-amber-950/80 border-amber-500/30 text-amber-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOptimized ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {isOptimized ? "Distribución Optimizada (MBA + IA)" : "Estado Actual (Sub-óptimo)"}
            </span>
          </div>
          {isOptimized && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +{revenueImprovementPct}%
            </span>
          )}
        </div>
        <p className="text-[11px] mt-1 text-slate-300/90 leading-tight">
          {isOptimized
            ? "Ergonomía en piso garantizada, Hot Zone al 94% y pares de alto Lift agrupados."
            : "Pesados en altura (riesgo físico), alto margen en piso y pares con Lift > 2.0 dispersos."}
        </p>
      </div>

      {/* KPI Comparative Dashboard */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl pointer-events-auto">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          Métricas Ejecutivas & Financieras
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {/* Eye-level revenue potential */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              Valor Ojos/Manos
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <p className="text-sm font-bold text-slate-100">
                ${kpis.eyeLevelRevenuePotential}
              </p>
              <span className="text-[10px] text-slate-400">/día</span>
            </div>
            {isOptimized && (
              <span className="text-[9px] font-bold text-emerald-400">
                vs ${beforeKPIs.eyeLevelRevenuePotential} inicial
              </span>
            )}
          </div>

          {/* Hot Zone Utilization */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Percent className="w-3 h-3 text-sky-400" />
              Zona Caliente (1-2)
            </span>
            <p className="text-sm font-bold text-slate-100 mt-0.5">
              {Math.round(kpis.hotZoneUtilizationRate * 100)}%
            </p>
            {isOptimized && (
              <span className="text-[9px] font-bold text-emerald-400">
                vs {Math.round(beforeKPIs.hotZoneUtilizationRate * 100)}% inicial
              </span>
            )}
          </div>

          {/* Ergonomic Violations */}
          <div className={`p-2.5 rounded-xl border ${
            kpis.ergonomicViolationsCount > 0
              ? "bg-red-950/40 border-red-500/30"
              : "bg-slate-800/60 border-slate-700/50"
          }`}>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Scale className={`w-3 h-3 ${kpis.ergonomicViolationsCount > 0 ? "text-red-400" : "text-emerald-400"}`} />
              Infracc. Ergonómicas
            </span>
            <p className={`text-sm font-bold mt-0.5 ${
              kpis.ergonomicViolationsCount > 0 ? "text-red-300" : "text-emerald-400"
            }`}>
              {kpis.ergonomicViolationsCount} {kpis.ergonomicViolationsCount === 0 && "(0 en altura)"}
            </p>
            {isOptimized && (
              <span className="text-[9px] font-bold text-emerald-400">
                {ergonomicViolationsResolved} resueltas en piso
              </span>
            )}
          </div>

          {/* High-Lift Affinity Pair Adjacency */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Pares MBA Adyacentes
            </span>
            <p className="text-sm font-bold text-slate-100 mt-0.5">
              {kpis.highLiftPairsAdjacent} / {kpis.totalHighLiftPairs || 8}
            </p>
            {isOptimized && (
              <span className="text-[9px] font-bold text-emerald-400">
                100% co-ubicados
              </span>
            )}
          </div>
        </div>

        {/* Linear Meter Metric */}
        <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span>Rentabilidad por metro lineal:</span>
          <span className="font-mono font-bold text-slate-200">
            ${kpis.revenuePerLinearMeter}/m
          </span>
        </div>
      </div>

      {/* Executive Explainability Rationale */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl pointer-events-auto">
        <button
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-slate-100 transition"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Explicabilidad del Algoritmo
          </span>
          {isSummaryExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {isSummaryExpanded && (
          <div className="mt-2.5 space-y-2 text-[11px] text-slate-300">
            {executiveSummary.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/40 leading-relaxed"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Product Inspector */}
      {selectedProduct ? (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedProduct.color }}
              />
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {selectedProduct.category}
              </span>
            </div>
            <button
              onClick={() => selectProduct(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-1"
            >
              ✕
            </button>
          </div>

          <h3 className="font-semibold text-sm text-slate-100 leading-tight">
            {selectedProduct.name}
          </h3>
          <p className="text-[10px] text-slate-400 mb-2">SKU: {selectedProduct.sku}</p>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Peso Unitario:</span>
              <span className={`font-mono font-bold ${
                (selectedProduct.weightKg ?? 0.5) >= 2.0
                  ? "text-red-400 flex items-center gap-1"
                  : "text-slate-200"
              }`}>
                {(selectedProduct.weightKg ?? 0.5).toFixed(2)} kg
                {(selectedProduct.weightKg ?? 0.5) >= 2.0 && " (Pesado - Base)"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Precio Retail:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                ${selectedProduct.price.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Margen Bruto:</span>
              <span className="font-mono text-slate-200">
                {Math.round(selectedProduct.margin * 100)}%
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Rotación 10A:</span>
              <span className="font-mono text-amber-300 font-semibold">
                {selectedProduct.historicalSalesVelocity} unid/día
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Score Rentabilidad:</span>
              <span className="font-mono text-purple-400 font-bold">
                {Math.round(selectedProduct.price * selectedProduct.margin * selectedProduct.historicalSalesVelocity)}
              </span>
            </div>
          </div>

          {/* Complementary Affinities */}
          {relatedAffinities.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-800">
              <p className="text-[10px] font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Regla de Canasta (Market Basket Analysis)
              </p>
              <div className="space-y-1">
                {relatedAffinities.map((aff, i) => {
                  const otherId =
                    aff.productAId === selectedProductId
                      ? aff.productBId
                      : aff.productAId;
                  const otherProd = products.find((p) => p.id === otherId);

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[10px] bg-slate-800/40 px-2 py-1 rounded-lg border border-slate-700/40"
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
        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/60 rounded-2xl p-3 shadow-xl pointer-events-auto text-center py-4">
          <p className="text-[11px] text-slate-400">
            Haz clic sobre cualquier producto en 3D para inspeccionar sus métricas de slot y afinidades.
          </p>
        </div>
      )}
    </aside>
  );
}
