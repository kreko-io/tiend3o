import React from "react";
import { Sparkles, X, Bot, CheckCircle } from "lucide-react";
import { usePlanogramStore } from "../store/usePlanogramStore";

export function AIRecommendationModal() {
  const { aiRecommendation, setAiRecommendation } = usePlanogramStore();

  if (!aiRecommendation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={() => setAiRecommendation(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              Claude 4 Planogram Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Strategic slotting insights powered by 10-year historical basket data
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300 font-sans whitespace-pre-line max-h-96 overflow-y-auto">
          {aiRecommendation}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setAiRecommendation(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
