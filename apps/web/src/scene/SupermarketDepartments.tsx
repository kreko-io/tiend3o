import React, { useMemo } from "react";
import * as THREE from "three";
import { createSignTexture } from "./signTextures";

interface SupermarketDepartmentsProps {
  storeWidth: number;
  storeLength: number;
  ceilingHeight: number;
}

export function SupermarketDepartments({
  storeWidth,
  storeLength,
  ceilingHeight,
}: SupermarketDepartmentsProps) {
  const hw = storeWidth / 2; // 12
  const hl = storeLength / 2; // 18

  // Department Sign Textures
  const bakeryTexture = useMemo(
    () =>
      createSignTexture({
        width: 1024,
        height: 256,
        backgroundColor: "#b45309",
        text: "PANADERÍA & PASTELERÍA",
        subtitle: "HORNEADO FRESCO CADA DÍA",
        borderColor: "#fef3c7",
        borderWidth: 8,
        badge: "ARTESANAL",
        badgeBg: "#f59e0b",
      }),
    []
  );

  const dairyTexture = useMemo(
    () =>
      createSignTexture({
        width: 1024,
        height: 256,
        backgroundColor: "#0369a1",
        text: "LÁCTEOS & CHARCUTERÍA",
        subtitle: "QUESOS, LECHES & EMBUTIDOS SELECTOS",
        borderColor: "#e0f2fe",
        borderWidth: 8,
        badge: "FRESCOS",
        badgeBg: "#38bdf8",
      }),
    []
  );

  const beveragesTexture = useMemo(
    () =>
      createSignTexture({
        width: 1024,
        height: 256,
        backgroundColor: "#0f766e",
        text: "BEBIDAS & REFRESCOS",
        subtitle: "JUGOS, AGUAS & CERVEZAS NACIONALES",
        borderColor: "#ccfbf1",
        borderWidth: 8,
        badge: "FRÍO",
        badgeBg: "#14b8a6",
      }),
    []
  );

  const snacksTexture = useMemo(
    () =>
      createSignTexture({
        width: 1024,
        height: 256,
        backgroundColor: "#7c2d12",
        text: "SNACKS & DESPENSA",
        subtitle: "APERITIVOS, GALLETAS & DULCES",
        borderColor: "#ffedd5",
        borderWidth: 8,
        badge: "VARIEDAD",
        badgeBg: "#ea580c",
      }),
    []
  );

  // Aisle Category Hanging Markers
  const aisleSigns = useMemo(() => {
    const list = [
      { id: 1, x: -7.2, title: "PASILLO 1", sub: "Bebidas & Cervezas", color: "#0284c7" },
      { id: 2, x: -3.6, title: "PASILLO 2", sub: "Snacks & Aperitivos", color: "#ea580c" },
      { id: 3, x: 0.0, title: "PASILLO 3", sub: "Lácteos & Desayuno", color: "#16a34a" },
      { id: 4, x: 3.6, title: "PASILLO 4", sub: "Pastas & Salsas", color: "#b91c1c" },
      { id: 5, x: 7.2, title: "PASILLO 5", sub: "Limpieza & Hogar", color: "#9333ea" },
    ];

    return list.map((item) => ({
      ...item,
      texture: createSignTexture({
        width: 512,
        height: 256,
        backgroundColor: item.color,
        text: item.title,
        subtitle: item.sub,
        borderColor: "#ffffff",
        borderWidth: 6,
        badge: `0${item.id}`,
        badgeBg: "#0f172a",
      }),
    }));
  }, []);

  return (
    <group>
      {/* ================= NORTH WALL SIGNS (BACK OF STORE) ================= */}
      {/* Bakery Sign (Left Back) */}
      <group position={[-hw * 0.45, ceilingHeight - 1.1, -hl + 0.15]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[5.8, 1.4, 0.1]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[5.6, 1.25]} />
          <meshBasicMaterial map={bakeryTexture} />
        </mesh>
      </group>

      {/* Dairy / Fresh Sign (Right Back) */}
      <group position={[hw * 0.45, ceilingHeight - 1.1, -hl + 0.15]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[5.8, 1.4, 0.1]} />
          <meshStandardMaterial color="#075985" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[5.6, 1.25]} />
          <meshBasicMaterial map={dairyTexture} />
        </mesh>
      </group>

      {/* ================= WEST WALL SIGNS (LEFT SIDE) ================= */}
      <group position={[-hw + 0.15, ceilingHeight - 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[6.8, 1.4, 0.1]} />
          <meshStandardMaterial color="#115e59" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[6.6, 1.25]} />
          <meshBasicMaterial map={beveragesTexture} />
        </mesh>
      </group>

      {/* ================= EAST WALL SIGNS (RIGHT SIDE) ================= */}
      <group position={[hw - 0.15, ceilingHeight - 1.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[6.8, 1.4, 0.1]} />
          <meshStandardMaterial color="#9a3412" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[6.6, 1.25]} />
          <meshBasicMaterial map={snacksTexture} />
        </mesh>
      </group>

      {/* ================= HANGING AISLE INDICATORS (SUSPENDED FROM CEILING) ================= */}
      {aisleSigns.map((aisle) => (
        <group key={`hanging-aisle-${aisle.id}`} position={[aisle.x, ceilingHeight - 1.3, 0]}>
          {/* Steel Suspension Cables */}
          <mesh position={[-0.7, 0.7, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.4, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.7, 0.7, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.4, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Double-Sided Sign Board Frame */}
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.9, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>

          {/* South-Facing Face */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.72, 0.82]} />
            <meshBasicMaterial map={aisle.texture} />
          </mesh>

          {/* North-Facing Face */}
          <mesh position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.72, 0.82]} />
            <meshBasicMaterial map={aisle.texture} />
          </mesh>
        </group>
      ))}

      {/* ================= ARCHITECTURAL SUPERMARKET COLUMNS ================= */}
      {/* 4 concrete support columns positioned along perimeter aisle corridors */}
      {[
        [-hw * 0.75, -hl * 0.45],
        [hw * 0.75, -hl * 0.45],
        [-hw * 0.75, hl * 0.45],
        [hw * 0.75, hl * 0.45],
      ].map(([colX, colZ], idx) => (
        <group key={`column-${idx}`} position={[colX, 0, colZ]}>
          {/* Concrete Column Body */}
          <mesh position={[0, ceilingHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.7, ceilingHeight, 0.7]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0.1} />
          </mesh>

          {/* Yellow & Black Safety Impact Bumper Guard at Base */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.76, 0.8, 0.76]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.77, 0.2, 0.77]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ================= HVAC INDUSTRIAL VENTILATION DUCTS ================= */}
      {/* Longitudinal air ducts running under the ceiling */}
      {[-hw * 0.45, hw * 0.45].map((ductX, dIdx) => (
        <mesh key={`duct-${dIdx}`} position={[ductX, ceilingHeight - 0.35, 0]}>
          <boxGeometry args={[0.9, 0.5, storeLength * 0.9]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}
