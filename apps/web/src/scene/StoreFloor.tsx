import React from "react";
import type { StoreSpace } from "@tiend3o/shared";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { SupermarketDepartments } from "./SupermarketDepartments";
import { SupermarketCheckouts } from "./SupermarketCheckouts";
import { SupermarketEntrance } from "./SupermarketEntrance";

interface StoreFloorProps {
  space: StoreSpace;
}

export function StoreFloor({ space }: StoreFloorProps) {
  const { width, length, ceilingHeight } = space;
  const { themeMode } = usePlanogramStore();
  const isLight = themeMode === "light";

  // Palette according to theme
  const floorColor = isLight ? "#f1f5f9" : "#1e293b";
  const gridPrimary = isLight ? "#cbd5e1" : "#334155";
  const gridSecondary = isLight ? "#e2e8f0" : "#0f172a";
  const wallColor = isLight ? "#f8fafc" : "#0f172a";
  const friezeColor = isLight ? "#0284c7" : "#1e293b";
  const ceilingColor = isLight ? "#e2e8f0" : "#020617";

  return (
    <group>
      {/* --- POLISHED COMMERCIAL SUPERMARKET FLOOR --- */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={isLight ? 0.18 : 0.25}
          metalness={isLight ? 0.08 : 0.15}
        />
      </mesh>

      {/* Modular Floor Tile Grout Lines (1.2m retail tiles) */}
      <gridHelper
        args={[Math.max(width, length), Math.round(Math.max(width, length) / 1.2), gridPrimary, gridSecondary]}
        position={[0, 0.004, 0]}
      />

      {/* Directional Exit / Cashier Walkway Tile Stripe */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-3.0, 0.006, length / 2 - 7]}
      >
        <planeGeometry args={[7.5, 0.4]} />
        <meshStandardMaterial color={isLight ? "#e0f2fe" : "#1e3a8a"} roughness={0.3} />
      </mesh>

      {/* --- PERIMETER WALLS WITH ARCHITECTURAL BRANDING TRIM --- */}
      {/* North Wall (Back) */}
      <group position={[0, ceilingHeight / 2, -length / 2]}>
        <mesh receiveShadow>
          <boxGeometry args={[width, ceilingHeight, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.8} />
        </mesh>
        {/* Top Branding Frieze Band */}
        <mesh position={[0, ceilingHeight / 2 - 0.2, 0.11]}>
          <boxGeometry args={[width, 0.4, 0.02]} />
          <meshStandardMaterial color={friezeColor} roughness={0.4} />
        </mesh>
      </group>

      {/* South Wall (Entrance / Front) */}
      <group position={[0, ceilingHeight / 2, length / 2]}>
        <mesh receiveShadow>
          <boxGeometry args={[width, ceilingHeight, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, ceilingHeight / 2 - 0.2, -0.11]}>
          <boxGeometry args={[width, 0.4, 0.02]} />
          <meshStandardMaterial color={friezeColor} roughness={0.4} />
        </mesh>
      </group>

      {/* West Wall (Left) */}
      <group position={[-width / 2, ceilingHeight / 2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.2, ceilingHeight, length]} />
          <meshStandardMaterial color={wallColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.11, ceilingHeight / 2 - 0.2, 0]}>
          <boxGeometry args={[0.02, 0.4, length]} />
          <meshStandardMaterial color={friezeColor} roughness={0.4} />
        </mesh>
      </group>

      {/* East Wall (Right) */}
      <group position={[width / 2, ceilingHeight / 2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.2, ceilingHeight, length]} />
          <meshStandardMaterial color={wallColor} roughness={0.8} />
        </mesh>
        <mesh position={[-0.11, ceilingHeight / 2 - 0.2, 0]}>
          <boxGeometry args={[0.02, 0.4, length]} />
          <meshStandardMaterial color={friezeColor} roughness={0.4} />
        </mesh>
      </group>

      {/* --- SUPERMARKET CEILING SLAB --- */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, ceilingHeight, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} />
      </mesh>

      {/* --- HIGH-EFFICIENCY CONTINUOUS LINEAR LED LIGHTING FIXTURES --- */}
      {/* 5 Rows running along the store aisles */}
      {[-7.2, -3.6, 0, 3.6, 7.2].map((xTrack, tIdx) => (
        <group key={`light-track-${tIdx}`} position={[xTrack, ceilingHeight - 0.15, 0]}>
          {/* Aluminum Fixture Housing */}
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.08, length * 0.85]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Frosted Acrylic LED Diffuser */}
          <mesh position={[0, -0.045, 0]}>
            <boxGeometry args={[0.14, 0.02, length * 0.84]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={isLight ? 2.2 : 1.4}
            />
          </mesh>

          {/* Point lights distributed along the aisle for realistic downlight illumination */}
          {[-length * 0.35, 0, length * 0.35].map((zPos, pIdx) => (
            <pointLight
              key={`light-pt-${tIdx}-${pIdx}`}
              position={[0, -0.6, zPos]}
              intensity={isLight ? 55 : 30}
              distance={22}
              decay={2}
              color={isLight ? "#ffffff" : "#f8fafc"}
            />
          ))}
        </group>
      ))}

      {/* --- SUPERMARKET CHECKOUTS (CAJAS REGISTRADORAS) --- */}
      <SupermarketCheckouts storeWidth={width} storeLength={length} />

      {/* --- SUPERMARKET ENTRANCE (PUERTAS, CARROS & TORNIQUETES) --- */}
      <SupermarketEntrance
        storeWidth={width}
        storeLength={length}
        ceilingHeight={ceilingHeight}
      />

      {/* --- SUPERMARKET DEPARTMENTS (LETREROS, PASILLOS & COLUMNAS) --- */}
      <SupermarketDepartments
        storeWidth={width}
        storeLength={length}
        ceilingHeight={ceilingHeight}
      />
    </group>
  );
}
