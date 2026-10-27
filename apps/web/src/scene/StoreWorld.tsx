import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { StoreFloor } from "./StoreFloor";
import { AisleGondola } from "./AisleGondola";
import { Player } from "./Player";
import { StaticMerge } from "./StaticMerge";
import { BoundingBox2D } from "./walk";

export function StoreWorld() {
  const {
    space,
    products,
    selectedProductId,
    hoveredSlotId,
    viewMode,
    selectProduct,
    hoverSlot,
  } = usePlanogramStore();

  const productsMap = useMemo(() => {
    return new Map(products.map((p) => [p.id, p]));
  }, [products]);

  // Compute 2D obstacle colliders for player walk mode
  const colliders: BoundingBox2D[] = useMemo(() => {
    const list: BoundingBox2D[] = [];

    // Outer store walls
    const hw = space.width / 2;
    const hl = space.length / 2;

    // Gondolas
    for (const g of space.gondolas) {
      list.push({
        minX: g.start.x - g.depth / 2,
        maxX: g.start.x + g.depth / 2,
        minZ: g.start.z,
        maxZ: g.start.z + g.length,
      });
    }

    return list;
  }, [space]);

  const cameraInitialPosition: [number, number, number] =
    viewMode === "topdown"
      ? [0, 24, 0.01]
      : viewMode === "orbit"
      ? [0, 16, 22]
      : [0, 1.7, space.length / 2 - 2];

  return (
    <Canvas
      shadows
      className="w-full h-full bg-slate-950"
      gl={{ antialias: true, alpha: false }}
    >
      <PerspectiveCamera
        makeDefault
        position={cameraInitialPosition}
        fov={viewMode === "topdown" ? 45 : 60}
      />

      <ambientLight intensity={0.65} />
      <directionalLight
        position={[10, 20, 15]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <StoreFloor space={space} />

      <StaticMerge>
        {space.gondolas.map((gondola) => (
          <AisleGondola
            key={gondola.id}
            gondola={gondola}
            productsMap={productsMap}
            selectedProductId={selectedProductId}
            hoveredSlotId={hoveredSlotId}
            onSelectProduct={selectProduct}
            onSlotHover={hoverSlot}
          />
        ))}
      </StaticMerge>

      {viewMode === "walk" ? (
        <Player
          active={true}
          initialPosition={[0, 1.7, space.length / 2 - 2]}
          colliders={colliders}
        />
      ) : (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={viewMode === "topdown" ? 0.01 : Math.PI / 2.05}
          target={[0, 1.2, 0]}
        />
      )}
    </Canvas>
  );
}
