import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { CutawayBuilding } from "./CutawayBuilding";
import { FixtureRenderer } from "./fixtures/FixtureRenderer";
import { AisleGondola } from "./AisleGondola";
import { Player } from "./Player";
import { StaticMerge } from "./StaticMerge";
import { LiftArcsOverlay } from "./LiftArcsOverlay";
import { ScanningLaserEffect } from "./ScanningLaserEffect";
import { SupermarketCheckouts } from "./SupermarketCheckouts";
import { SupermarketEntrance } from "./SupermarketEntrance";
import { SupermarketDepartments } from "./SupermarketDepartments";
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
  const isSupermarket = space.format === "modern_supermarket";

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

    // Hybrid Store Fixtures
    if (space.fixtures) {
      for (const f of space.fixtures) {
        list.push({
          minX: f.position.x - f.dimensions.width / 2,
          maxX: f.position.x + f.dimensions.width / 2,
          minZ: f.position.z - f.dimensions.depth / 2,
          maxZ: f.position.z + f.dimensions.depth / 2,
        });
      }
    }

    return list;
  }, [space]);

  // Compute camera position and target based on viewMode
  const { cameraPos, cameraTarget, cameraFov } = useMemo(() => {
    switch (viewMode) {
      case "isometric":
        return {
          cameraPos: [
            Math.max(space.width * 0.75, 7.5),
            Math.max(space.ceilingHeight * 2.2, 8.5),
            Math.max(space.length * 0.75, 8.8),
          ] as [number, number, number],
          cameraTarget: [0, 0.8, 0] as [number, number, number],
          cameraFov: 36, // Low architectural FOV for isometric feel
        };
      case "counter":
        return {
          cameraPos: [
            space.checkoutPosition.x,
            1.65, // Shopper eye level
            space.checkoutPosition.z + 1.5, // Standing in front of counter
          ] as [number, number, number],
          cameraTarget: [
            space.checkoutPosition.x,
            1.1,
            space.checkoutPosition.z,
          ] as [number, number, number],
          cameraFov: 55,
        };
      case "topdown":
        return {
          cameraPos: [0, Math.max(space.width, space.length) * 1.15, 0.01] as [number, number, number],
          cameraTarget: [0, 0, 0] as [number, number, number],
          cameraFov: 42,
        };
      case "orbit":
        return {
          cameraPos: [0, 10, 14] as [number, number, number],
          cameraTarget: [0, 1.0, 0] as [number, number, number],
          cameraFov: 55,
        };
      case "walk":
      default:
        return {
          cameraPos: [
            space.entrancePosition.x,
            1.65,
            space.entrancePosition.z,
          ] as [number, number, number],
          cameraTarget: [0, 1.2, 0] as [number, number, number],
          cameraFov: 60,
        };
    }
  }, [viewMode, space]);

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
        position={cameraPos}
        fov={cameraFov}
      />

      {/* Balanced Supermarket / Bodega Illumination */}
      <ambientLight intensity={isLight ? 1.15 : 0.65} />

      {/* Main Overhead Directional Sunlight / Track Light */}
      <directionalLight
        position={isLight ? [12, 24, 18] : [10, 20, 15]}
        intensity={isLight ? 1.6 : 1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Soft Secondary Fill Light for Uniform Architectural Visibility */}
      <directionalLight
        position={[-14, 18, -14]}
        intensity={isLight ? 0.75 : 0.3}
      />

      {/* Cutaway Diorama Building Architecture (Zoned Floors & Cutaway Walls) */}
      <CutawayBuilding space={space} />

      {/* Vision-to-3D Scanning Holographic Laser Effect */}
      <ScanningLaserEffect
        storeWidth={space.width}
        storeLength={space.length}
        ceilingHeight={space.ceilingHeight}
      />

      {/* Hybrid Store Fixtures (Glass Counter, Wire Snack Rack, Cooler, Wall Shelves, etc.) */}
      {space.fixtures &&
        space.fixtures.map((fixture) => (
          <FixtureRenderer
            key={fixture.id}
            fixture={fixture}
            productsMap={productsMap}
            selectedProductId={selectedProductId}
            hoveredSlotId={hoveredSlotId}
            onSelectProduct={selectProduct}
            onSlotHover={hoverSlot}
          />
        ))}

      {/* Standard Supermarket Gondolas (if present in layout) */}
      {space.gondolas && space.gondolas.length > 0 && (
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
      )}

      {/* Modern Supermarket Context Elements (Only in Modern Supermarket Format) */}
      {isSupermarket && (
        <>
          <SupermarketCheckouts storeWidth={space.width} storeLength={space.length} />
          <SupermarketEntrance
            storeWidth={space.width}
            storeLength={space.length}
            ceilingHeight={space.ceilingHeight}
          />
          <SupermarketDepartments
            storeWidth={space.width}
            storeLength={space.length}
            ceilingHeight={space.ceilingHeight}
          />
        </>
      )}

      {/* MBA Lift Arcs 3D Overlay */}
      <LiftArcsOverlay />

      {viewMode === "walk" ? (
        <Player
          active={true}
          initialPosition={[space.entrancePosition.x, 1.65, space.entrancePosition.z]}
          colliders={colliders}
        />
      ) : (
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={viewMode === "topdown" ? 0.01 : Math.PI / 2.05}
          target={cameraTarget}
        />
      )}
    </Canvas>
  );
}
