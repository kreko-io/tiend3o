import React from "react";
import {
  Eye,
  Camera,
  Footprints,
  Sparkles,
  Store,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  GitBranch,
  Box,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { usePlanogramStore, ViewMode, OverlayMode, OptimizationState } from "../store/usePlanogramStore";

export function StoreNavbar() {
  const {
    viewMode,
    setViewMode,
    optimizationState,
    setOptimizationState,
    overlayMode,
    setOverlayMode,
    requestAiAnalysis,
    isAiLoading,
    loadComparison,
  } = usePlanogramStore();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              tiend3o
            </h1>
            <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-widest uppercase rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
              PoC Demo
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            3D Retail Planogram & Market Basket Analysis
          </p>
        </div>
      </div>

      {/* Comparison Toggle (Before vs After) */}
      <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-700/80 shadow-inner">
        <button
          onClick={() => setOptimizationState("suboptimal")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            optimizationState === "suboptimal"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Ver distribución actual con infracciones ergonómicas y pares dispersos"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Estado Actual (Sub-óptimo)
        </button>

        <button
          onClick={() => setOptimizationState("optimized")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            optimizationState === "optimized"
              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Aplicar reglas heurísticas de MBA (Lift > 2.0) y nivel de ojos"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Optimizado (IA + MBA)
        </button>
      </div>

      {/* 3D Data Overlay Mode Switcher */}
      <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setOverlayMode("realistic")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            overlayMode === "realistic"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Visualización fotométrica con dimensiones reales"
        >
          <Box className="w-3.5 h-3.5" />
          Realista
        </button>

        <button
          onClick={() => setOverlayMode("heatmap")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            overlayMode === "heatmap"
              ? "bg-gradient-to-r from-emerald-500 to-amber-500 text-white shadow-md shadow-amber-500/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Mapa de calor por score financiero de cada slot"
        >
          <Flame className="w-3.5 h-3.5" />
          Heatmap Rentabilidad
        </button>

        <button
          onClick={() => setOverlayMode("lift_arcs")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            overlayMode === "lift_arcs"
              ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Grafo 3D de arcos Bézier conectando pares con Lift > 2.0"
        >
          <GitBranch className="w-3.5 h-3.5" />
          Arcos de Lift (MBA)
        </button>
      </div>

      {/* View Mode Switcher & Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode("orbit")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "orbit"
                ? "bg-sky-500/20 text-sky-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Vista Orbital 3D"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("topdown")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "topdown"
                ? "bg-sky-500/20 text-sky-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Planta Superior 2D"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("walk")}
            className={`p-1.5 rounded-lg transition ${
              viewMode === "walk"
                ? "bg-sky-500/20 text-sky-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Modo Comprador / Recorrido en Primera Persona (WASD)"
          >
            <Footprints className="w-4 h-4" />
          </button>
        </div>

        {/* AI Strategist Button */}
        <button
          onClick={requestAiAnalysis}
          disabled={isAiLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
        >
          {isAiLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          Estrategia IA
        </button>
      </div>
    </header>
  );
}
