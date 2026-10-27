import React, { useState } from "react";
import {
  Scan,
  Sparkles,
  Camera,
  Layers,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Store,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { ALL_SCAN_PRESETS, type StoreScanPreset } from "@tiend3o/shared";

export function StoreScannerModal() {
  const {
    isScannerModalOpen,
    closeScannerModal,
    activePresetId,
    selectPreset,
  } = usePlanogramStore();

  const [selectedPresetId, setSelectedPresetId] = useState<string>(activePresetId);
  const [activeTab, setActiveTab] = useState<"preset" | "upload">("preset");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!isScannerModalOpen) return null;

  const currentPreset =
    ALL_SCAN_PRESETS.find((p) => p.id === selectedPresetId) ?? ALL_SCAN_PRESETS[0];

  const handleApply = () => {
    selectPreset(selectedPresetId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Escáner de Tienda (Vision-to-DSL)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Scan-to-Planogram
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Detecta estantes, vitrinas y productos desde imágenes para construir la maqueta 3D base
              </p>
            </div>
          </div>

          <button
            onClick={closeScannerModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Left Column: Preset Selector & Upload Tabs */}
          <div className="w-full md:w-5/12 flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
              <button
                onClick={() => setActiveTab("preset")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === "preset"
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Escenarios Pre-cargados
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === "upload"
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Subir Foto / Escaneo
              </button>
            </div>

            {activeTab === "preset" ? (
              <div className="flex flex-col gap-2.5">
                {ALL_SCAN_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-slate-800/90 border-sky-500/80 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">
                          {preset.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            preset.format === "corner_bodega"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : preset.format === "neighborhood_store"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {preset.subtitle}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 text-sky-400 font-semibold">
                          <Layers className="w-3 h-3" />
                          {preset.detections.length} muebles detectados
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <TrendingUp className="w-3 h-3" />
                          {preset.optimizationGains.revenueImprovement} proyección
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom Upload Box */
              <div className="flex flex-col gap-3">
                <label className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-slate-950/40">
                  <Upload className="w-8 h-8 text-sky-400 animate-bounce" />
                  <span className="text-xs font-semibold text-slate-200">
                    Haz clic para subir foto del local
                  </span>
                  <span className="text-[10px] text-slate-400 text-center">
                    Soporta JPG, PNG de mostrador, estanterías o fachada comercial
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  💡 <strong>Modo Mock Vision</strong>: Si subes una foto, nuestro modelo
                  identificará las vitrinas y estanterías automáticamente según la geometría
                  detectada.
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Detection Preview with Bounding Boxes */}
          <div className="w-full md:w-7/12 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                Detección por Visión Computacional (YOLO / Vision Model)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                ● 100% Calibrado
              </span>
            </div>

            {/* Simulated Detection Canvas */}
            <div className="relative aspect-[16/10] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center select-none">
              {/* Background Canvas Illustration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col items-center justify-center p-4">
                <Store className="w-24 h-24 text-slate-800/80" />
                <span className="text-xs text-slate-500 font-medium mt-2">
                  {currentPreset.photoTitle}
                </span>
              </div>

              {/* Animated Laser Scanning Sweep Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-pulse pointer-events-none" />

              {/* Detected Bounding Boxes Overlay */}
              {currentPreset.detections.map((det) => {
                // Normalize coords for percentage
                const left = (det.bbox.x / currentPreset.photoDimensions.width) * 100;
                const top = (det.bbox.y / currentPreset.photoDimensions.height) * 100;
                const width = (det.bbox.width / currentPreset.photoDimensions.width) * 100;
                const height = (det.bbox.height / currentPreset.photoDimensions.height) * 100;

                return (
                  <div
                    key={det.id}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                      borderColor: det.color,
                    }}
                    className="absolute border-2 rounded-lg bg-sky-500/10 pointer-events-none transition-all group"
                  >
                    {/* Bounding box label tag */}
                    <div
                      style={{ backgroundColor: det.color }}
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[9px] font-bold text-slate-950 shadow-md whitespace-nowrap flex items-center gap-1"
                    >
                      <span>{det.label}</span>
                      <span className="opacity-75 font-mono">
                        ({Math.round(det.confidence * 100)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detection Summary Badges */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {currentPreset.detections.map((det) => (
                <div
                  key={`sum-${det.id}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]"
                >
                  <span className="text-slate-300 truncate max-w-[160px]">
                    {det.label}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-[10px]">
                    {det.skusDetected} SKUs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Escenario activo:{" "}
            <span className="text-white font-bold">{currentPreset.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeScannerModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Construir Maqueta 3D (As-Is / Desordenado)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
