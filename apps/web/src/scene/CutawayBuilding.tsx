import React, { useMemo } from "react";
import * as THREE from "three";
import type { StoreSpace } from "@tiend3o/shared";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { createSignTexture } from "./signTextures";

interface CutawayBuildingProps {
  space: StoreSpace;
}

export function CutawayBuilding({ space }: CutawayBuildingProps) {
  const { width, length, ceilingHeight, zones = [], format } = space;
  const { themeMode } = usePlanogramStore();
  const isLight = themeMode === "light";

  const hw = width / 2;
  const hl = length / 2;
  const wallThickness = 0.22;
  const cutawayHeight = 0.45; // Low front walls for diorama view

  // Facade Header Sign Texture
  const bodegaSignTexture = useMemo(() => {
    return createSignTexture({
      width: 1024,
      height: 256,
      backgroundColor: "#0369a1",
      textColor: "#ffffff",
      text: format === "corner_bodega" ? "BODEGA & ABASTO CENTRAL" : "SUPERMERCADO TIEND3O",
      subtitle: "VÍVERES • LÁCTEOS • BEBIDAS • CHARCUTERÍA",
      subtitleColor: "#e0f2fe",
      borderColor: "#fef08a",
      borderWidth: 8,
      badge: "ABIERTO",
      badgeBg: "#10b981",
    });
  }, [format]);

  return (
    <group>
      {/* ================= 1. ZONED MULTI-TEXTURED FLOORING ================= */}
      {zones.length > 0 ? (
        zones.map((zone) => {
          const zWidth = zone.maxX - zone.minX;
          const zLength = zone.maxZ - zone.minZ;
          const centerX = (zone.minX + zone.maxX) / 2;
          const centerZ = (zone.minZ + zone.maxZ) / 2;

          let color = zone.color;
          let roughness = 0.3;
          let metalness = 0.1;

          if (zone.material === "wood") {
            color = isLight ? "#92400e" : "#451a03";
            roughness = 0.7;
          } else if (zone.material === "concrete") {
            color = isLight ? "#94a3b8" : "#334155";
            roughness = 0.9;
          } else if (zone.material === "terrazzo") {
            color = isLight ? "#cbd5e1" : "#1e293b";
            roughness = 0.2;
            metalness = 0.15;
          } else if (zone.material === "brick") {
            color = isLight ? "#b45309" : "#78350f";
            roughness = 0.8;
          }

          return (
            <mesh
              key={zone.id}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[centerX, 0.002, centerZ]}
              receiveShadow
            >
              <planeGeometry args={[zWidth, zLength]} />
              <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
              />
            </mesh>
          );
        })
      ) : (
        /* Fallback single floor */
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[width, length]} />
          <meshStandardMaterial
            color={isLight ? "#f1f5f9" : "#1e293b"}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Base Foundation Concrete Slab Underneath */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[width + 0.6, 0.3, length + 0.6]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* ================= 2. CUTAWAY ISOMETRIC WALLS ================= */}
      {/* North Wall (Back - Full Height) */}
      <group position={[0, ceilingHeight / 2, -hl - wallThickness / 2]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[width + wallThickness * 2, ceilingHeight, wallThickness]} />
          <meshStandardMaterial color={isLight ? "#f8fafc" : "#0f172a"} roughness={0.8} />
        </mesh>
        {/* Exterior Brick Base trim */}
        <mesh position={[0, -ceilingHeight / 2 + 0.3, -wallThickness / 2 - 0.01]}>
          <boxGeometry args={[width + wallThickness * 2, 0.6, 0.02]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
      </group>

      {/* East Wall (Right Side - Stepped Cutaway) */}
      <group position={[hw + wallThickness / 2, 0, 0]}>
        {/* Back portion (Full height) */}
        <mesh position={[0, ceilingHeight / 2, -hl / 2]} receiveShadow castShadow>
          <boxGeometry args={[wallThickness, ceilingHeight, hl]} />
          <meshStandardMaterial color={isLight ? "#f8fafc" : "#0f172a"} roughness={0.8} />
        </mesh>
        {/* Front portion (Low Cutaway for Isometric camera) */}
        <mesh position={[0, cutawayHeight / 2, hl / 2]} receiveShadow>
          <boxGeometry args={[wallThickness, cutawayHeight, hl]} />
          <meshStandardMaterial color={isLight ? "#e2e8f0" : "#1e293b"} roughness={0.8} />
        </mesh>
        {/* Wall Cap Molding */}
        <mesh position={[0, cutawayHeight + 0.02, hl / 2]}>
          <boxGeometry args={[wallThickness + 0.04, 0.04, hl]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
      </group>

      {/* West Wall (Left Side - Full/High) */}
      <group position={[-hw - wallThickness / 2, 0, 0]}>
        <mesh position={[0, ceilingHeight / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[wallThickness, ceilingHeight, length]} />
          <meshStandardMaterial color={isLight ? "#f8fafc" : "#0f172a"} roughness={0.8} />
        </mesh>
      </group>

      {/* South Wall (Front - Cutaway / Open Diorama View) */}
      <group position={[0, 0, hl + wallThickness / 2]}>
        {/* Left Side Entry Pillar */}
        <mesh position={[-hw + 0.4, ceilingHeight / 2, 0]} castShadow>
          <boxGeometry args={[0.8, ceilingHeight, wallThickness]} />
          <meshStandardMaterial color={isLight ? "#f8fafc" : "#0f172a"} roughness={0.8} />
        </mesh>

        {/* Right Side Entry Pillar */}
        <mesh position={[hw - 0.4, ceilingHeight / 2, 0]} castShadow>
          <boxGeometry args={[0.8, ceilingHeight, wallThickness]} />
          <meshStandardMaterial color={isLight ? "#f8fafc" : "#0f172a"} roughness={0.8} />
        </mesh>

        {/* Low Front Diorama Curb (Allows looking inside without wall obstruction) */}
        <mesh position={[0, cutawayHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[width - 1.6, cutawayHeight, wallThickness]} />
          <meshStandardMaterial color={isLight ? "#e2e8f0" : "#1e293b"} roughness={0.8} />
        </mesh>

        {/* Top Header Arch / Signage Beam */}
        <group position={[0, ceilingHeight - 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[width + wallThickness * 2, 0.8, wallThickness * 1.4]} />
            <meshStandardMaterial color="#0369a1" roughness={0.4} />
          </mesh>
          {/* Sign Face Facing Customer Exterior */}
          <mesh position={[0, 0, wallThickness * 0.71]}>
            <planeGeometry args={[width * 0.8, 0.7]} />
            <meshBasicMaterial map={bodegaSignTexture} />
          </mesh>
        </group>

        {/* Rolled-up Metal Security Grille / Shutter */}
        <mesh position={[0, ceilingHeight - 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, width - 1.6, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
