import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  GitBranch,
} from "lucide-react";
import { usePlanogramStore } from "../store/usePlanogramStore";

export function ScanDiagnosticPanel() {
  const {
    optimizationState,
    setOptimizationState,
    diagnostics,
    isDiagnosticOpen,
    toggleDiagnostic,
    applyOneClickOptimization,
    revenueImprovementPct,
    ergonomicViolationsResolved,
    overlayMode,
    setOverlayMode,
  } = usePlanogramStore();

  const isSuboptimal = optimizationState === "suboptimal";

  return (
    <div className="absolute left-6 top-16 z-20 w-84 pointer-events-auto">
      {/* Collapsed Pill Button */}
      {!isDiagnosticOpen ? (
        <button
          onClick={toggleDiagnostic}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs font-semibold text-slate-200 transition-all hover:scale-105 active:scale-95 group"
          title="Ver diagnóstico del escaneo y optimización inteligente"
        >
          {isSuboptimal ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Diagnóstico Escaneo (3 Alertas)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Planograma Optimizado (+{revenueImprovementPct}%)</span>
            </>
          )}
        </button>
      ) : (
        /* Expanded Full Diagnostic Card */
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              {isSuboptimal ? (
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight">
                  {isSuboptimal ? "Diagnóstico del Escaneo" : "Optimización Aplicada"}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {isSuboptimal ? "Estado As-Is (Detectado)" : "Modelo Optimizado con MBA"}
                </span>
              </div>
            </div>

            <button
              onClick={toggleDiagnostic}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Colapsar panel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Diagnostic Issues List (When in As-Is state) */}
          {isSuboptimal ? (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-amber-300">
                Problemas detectados por el modelo de visión:
              </span>
              <div className="flex flex-col gap-1.5">
                {diagnostics.map((diag, idx) => (
                  <div
                    key={`diag-${idx}`}
                    className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-tight flex items-start gap-1.5"
                  >
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{diag}</span>
                  </div>
                ))}
              </div>

              {/* 1-Click Reorder Action CTA */}
              <button
                onClick={applyOneClickOptimization}
                className="mt-1.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition active:scale-95 group"
              >
                <Zap className="w-4 h-4 text-emerald-200 fill-emerald-200 group-hover:scale-110 transition-transform" />
                <span>Optimizar con Data & MBA (1-Click)</span>
              </button>
            </div>
          ) : (
            /* Success State After 1-Click Optimization */
            <div className="flex flex-col gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Maqueta Reordenada Exitosamente</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Los productos fueron redistribuidos según lift histórico, zona de pago y ergonomía.
                </p>
              </div>

              {/* Metrics Pill Grid */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Incremento Estimado</span>
                  <span className="text-sm font-bold text-emerald-400">+{revenueImprovementPct}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Riesgos Ergonómicos</span>
                  <span className="text-sm font-bold text-sky-400">0 Infracciones</span>
                </div>
              </div>

              {/* Toggle to toggle Lift Arcs overlay */}
              <button
                onClick={() => setOverlayMode(overlayMode === "lift_arcs" ? "realistic" : "lift_arcs")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                  overlayMode === "lift_arcs"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>{overlayMode === "lift_arcs" ? "Ocultar Arcos Lift" : "Ver Arcos Lift 3D"}</span>
              </button>

              {/* Revert to As-Is button */}
              <button
                onClick={() => setOptimizationState("suboptimal")}
                className="text-[11px] text-slate-400 hover:text-amber-300 transition text-center underline"
              >
                Volver a ver estado As-Is (Detectado)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
