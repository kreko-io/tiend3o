import React from "react";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { GlassCounterCase } from "./GlassCounterCase";
import { WireSnackRack } from "./WireSnackRack";
import { CoolerUnit } from "./CoolerUnit";
import { WallShelving } from "./WallShelving";
import { ProduceIsland } from "./ProduceIsland";
import { BackroomStorage } from "./BackroomStorage";

interface FixtureRendererProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function FixtureRenderer({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: FixtureRendererProps) {
  const commonProps = {
    fixture,
    productsMap,
    selectedProductId,
    hoveredSlotId,
    onSelectProduct,
    onSlotHover,
  };

  switch (fixture.fixtureType) {
    case "glass_counter_case":
      return <GlassCounterCase {...commonProps} />;
    case "wire_snack_rack":
      return <WireSnackRack {...commonProps} />;
    case "cooler_unit":
      return <CoolerUnit {...commonProps} />;
    case "wall_shelving":
      return <WallShelving {...commonProps} />;
    case "produce_island":
      return <ProduceIsland {...commonProps} />;
    case "backroom_storage":
      return <BackroomStorage {...commonProps} />;
    default:
      return null;
  }
}
