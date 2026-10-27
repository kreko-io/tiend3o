import React, { useEffect } from "react";
import { StoreWorld } from "./scene/StoreWorld";
import { StoreNavbar } from "./ui/StoreNavbar";
import { PlanogramSidebar } from "./ui/PlanogramSidebar";
import { AIRecommendationModal } from "./ui/AIRecommendationModal";
import { usePlanogramStore } from "./store/usePlanogramStore";

export function App() {
  const { loadPlanogram } = usePlanogramStore();

  useEffect(() => {
    loadPlanogram();
  }, [loadPlanogram]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      <StoreNavbar />
      <StoreWorld />
      <PlanogramSidebar />
      <AIRecommendationModal />
    </div>
  );
}

export default App;
