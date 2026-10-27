import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { StoreFloor } from "./StoreFloor";
import { AisleGondola } from "./AisleGondola";
import { Player } from "./Player";
import { StaticMerge } from "./StaticMerge";
import { LiftArcsOverlay } from "./LiftArcsOverlay";
import { BoundingBox2D } from "./walk";

export function StoreWorld() {
  const {
    space,
    products,
    selectedProductId,
    hoveredSlotId,
    viewMode,
    themeMode,
    selectProduct,
    hoverSlot,
  } = usePlanogramStore();

  const isLight = themeMode === "light";

  const productsMap = useMemo(() => {
    return new Map(products.map((p) => [p.id, p]));
  }, [products]);

  // Compute 2D obstacle colliders for player walk mode
  const colliders: BoundingBox2D[] = useMemo(() => {
    const list: BoundingBox2D[] = [];

    // Gondolas
    for (const g of space.gondolas) {
      list.push({
        minX: g.start.x - g.depth / 2,
        maxX: g.start.x + g.depth / 2,
        minZ: g.start.z,
        maxZ: g.start.z + g.length,
      });
    }

    // Checkout Counters (4 lanes at front)
    const checkoutZ = space.length / 2 - 6.5;
    const laneXPositions = [-6.6, -4.2, -1.8, 0.6];
    for (const lx of laneXPositions) {
      list.push({
        minX: lx - 0.55,
        maxX: lx + 0.55,
        minZ: checkoutZ - 1.5,
        maxZ: checkoutZ + 1.5,
      });
    }

    // Shopping Carts Corral at entrance
    list.push({
      minX: 6.0 + 3.2 - 0.8,
      maxX: 6.0 + 3.2 + 0.8,
      minZ: space.length / 2 - 1.2 - 0.6 - 1.4,
      maxZ: space.length / 2 - 1.2 - 0.6 + 1.4,
    });

    return list;
  }, [space]);

  const cameraInitialPosition: [number, number, number] =
    viewMode === "topdown"
      ? [0, 24, 0.01]
      : viewMode === "orbit"
      ? [0, 16, 22]
      : [6.0, 1.7, space.length / 2 - 1.5]; // Enter from entrance door

  return (
    <Canvas
      shadows
      className={`w-full h-full transition-colors duration-300 ${
        isLight ? "bg-slate-100" : "bg-slate-950"
      }`}
      gl={{ antialias: true, alpha: false }}
    >
      <PerspectiveCamera
        makeDefault
        position={cameraInitialPosition}
        fov={viewMode === "topdown" ? 45 : 60}
      />

      {/* Balanced Supermarket Illumination */}
      <ambientLight intensity={isLight ? 1.15 : 0.65} />

      {/* Main Overhead Directional Sunlight / Track Light */}
      <directionalLight
        position={isLight ? [12, 24, 18] : [10, 20, 15]}
        intensity={isLight ? 1.6 : 1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Soft Secondary Fill Light for Uniform Supermarket Visibility */}
      <directionalLight
        position={[-14, 18, -14]}
        intensity={isLight ? 0.75 : 0.3}
      />

      {/* Complete Supermarket Environment: Floor, Checkouts, Entrance, Departments */}
      <StoreFloor space={space} />

      {/* MBA Lift Arcs 3D Overlay */}
      <LiftArcsOverlay />

      {/* Batch-Merged Shelving Geometry for 60 FPS Performance */}
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
          initialPosition={[6.0, 1.7, space.length / 2 - 1.5]}
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
