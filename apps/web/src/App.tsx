import React, { useEffect } from "react";
import { StoreWorld } from "./scene/StoreWorld";
import { StoreNavbar } from "./ui/StoreNavbar";
import { PlanogramSidebar } from "./ui/PlanogramSidebar";
import { AIRecommendationModal } from "./ui/AIRecommendationModal";
import { StoreScannerModal } from "./ui/StoreScannerModal";
import { ScanDiagnosticPanel } from "./ui/ScanDiagnosticPanel";
import { usePlanogramStore } from "./store/usePlanogramStore";

export function App() {
  const { loadComparison } = usePlanogramStore();

  useEffect(() => {
    loadComparison();
  }, [loadComparison]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      <StoreNavbar />
      <StoreWorld />
      <ScanDiagnosticPanel />
      <PlanogramSidebar />
      <AIRecommendationModal />
      <StoreScannerModal />
    </div>
  );
}

export default App;
