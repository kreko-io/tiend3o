import React from "react";
import {
  Eye,
  Camera,
  Footprints,
  Sparkles,
  Store,
  RefreshCw,
} from "lucide-react";
import { usePlanogramStore, ViewMode } from "../store/usePlanogramStore";

export function StoreNavbar() {
  const { viewMode, setViewMode, requestAiAnalysis, isAiLoading, loadPlanogram } =
    usePlanogramStore();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            tiend3o
          </h1>
          <p className="text-xs text-slate-400">
            3D Retail Space & 10Y Historical Planogram Engine
          </p>
        </div>
      </div>

      {/* Preset Store Sizes */}
      <div className="flex items-center gap-2 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60 text-xs">
        <button
          onClick={() => loadPlanogram({ width: 16, length: 22, bays: 4 })}
          className="px-2.5 py-1.5 rounded hover:bg-slate-700 transition font-medium"
        >
          Convenience (16x22m)
        </button>
        <button
          onClick={() => loadPlanogram({ width: 20, length: 28, bays: 6 })}
          className="px-2.5 py-1.5 rounded hover:bg-slate-700 transition font-medium"
        >
          Express (20x28m)
        </button>
        <button
          onClick={() => loadPlanogram({ width: 28, length: 36, bays: 8 })}
          className="px-2.5 py-1.5 rounded hover:bg-slate-700 transition font-medium"
        >
          Supermarket (28x36m)
        </button>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
        <button
          onClick={() => setViewMode("orbit")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            viewMode === "orbit"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          3D Orbit
        </button>

        <button
          onClick={() => setViewMode("topdown")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            viewMode === "topdown"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Top-Down
        </button>

        <button
          onClick={() => setViewMode("walk")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            viewMode === "walk"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          Walk (WASD)
        </button>
      </div>

      {/* AI Strategist Button */}
      <button
        onClick={requestAiAnalysis}
        disabled={isAiLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
      >
        {isAiLoading ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        AI Planogram Strategist
      </button>
    </header>
  );
}
