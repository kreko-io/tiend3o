import React, { useMemo } from "react";
import * as THREE from "three";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";

interface CafeStationProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function CafeStation({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: CafeStationProps) {
  const { position, dimensions, rotationY, shelves } = fixture;
  const { width = 2.4, height = 1.05, depth = 0.85 } = dimensions;

  // Chalkboard Coffee Menu Texture
  const menuTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Chalkboard background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 256);

    // Wooden border
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 502, 246);

    // Header
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("☕ CAFÉ & ESPRESSO BAR", 256, 44);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 58);
    ctx.lineTo(472, 58);
    ctx.stroke();

    // Menu Items
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";

    const items = [
      { name: "Espresso Doble", price: "$1.50" },
      { name: "Café Americano", price: "$1.80" },
      { name: "Cappuccino Cremoso", price: "$2.40" },
      { name: "Café Latte Vainilla", price: "$2.60" },
      { name: "Medialunas / Croissant", price: "$1.20" },
    ];

    items.forEach((item, idx) => {
      const y = 92 + idx * 30;
      ctx.fillText(item.name, 50, y);
      ctx.fillText(item.price, 400, y);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* --- WOODEN SERVICE COUNTER BASE --- */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>

      {/* Marble/Granite Countertop Slab */}
      <mesh position={[0, height + 0.02, 0]} receiveShadow>
        <boxGeometry args={[width + 0.04, 0.04, depth + 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* --- COMMERCIAL DUAL-GROUP ESPRESSO MACHINE --- */}
      <group position={[-width * 0.22, height + 0.04, 0]}>
        {/* Main Stainless Steel Boiler Body */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.62, 0.44, 0.46]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Red / Polished Side Accent Panels */}
        <mesh position={[-0.315, 0.22, 0]}>
          <boxGeometry args={[0.01, 0.42, 0.44]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0.315, 0.22, 0]}>
          <boxGeometry args={[0.01, 0.42, 0.44]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>

        {/* Dual Chrome Portafilters */}
        {[-0.14, 0.14].map((pX, pIdx) => (
          <group key={`portafilter-${pIdx}`} position={[pX, 0.18, 0.24]}>
            {/* Grouphead Bell */}
            <mesh>
              <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Black Handle */}
            <mesh position={[0, -0.02, 0.09]} rotation={[Math.PI / 2 + Math.PI / 12, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.016, 0.14, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Chrome Steam Wands */}
        {[-0.26, 0.26].map((wX, wIdx) => (
          <mesh key={`wand-${wIdx}`} position={[wX, 0.14, 0.22]} rotation={[0.2, (wIdx === 0 ? -0.3 : 0.3), 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}

        {/* Round Pressure Gauges (Manómetros) */}
        {[-0.06, 0.06].map((gX, gIdx) => (
          <group key={`gauge-${gIdx}`} position={[gX, 0.32, 0.235]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            {/* Red Needle */}
            <mesh position={[0, 0.006, 0.006]}>
              <boxGeometry args={[0.004, 0.02, 0.002]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>
        ))}

        {/* Top Cup Warming Tray with Stacks of Porcelain Espresso Cups */}
        {[-0.18, -0.06, 0.06, 0.18].map((cX, cIdx) => (
          <group key={`cup-${cIdx}`} position={[cX, 0.48, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.032, 0.022, 0.05, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            {/* Saucer */}
            <mesh position={[0, -0.025, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.006, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- COFFEE BEAN GRINDER WITH GLASS HOPPER --- */}
      <group position={[-width * 0.44, height + 0.04, 0]}>
        {/* Grinder Base Body */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.18, 0.32, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Transparent Glass Bean Hopper */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.08, 0.05, 0.22, 16]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
        {/* Dark Roasted Coffee Beans inside hopper */}
        <mesh position={[0, 0.39, 0]}>
          <cylinderGeometry args={[0.075, 0.045, 0.16, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      </group>

      {/* --- TO-GO PAPER CUPS STACK & CONDIMENTS --- */}
      <group position={[0.08, height + 0.04, 0.12]}>
        {/* Stack of Paper Cups with Sleeves */}
        {[0, 0.04, 0.08].map((offsetY, idx) => (
          <group key={`to-go-cup-${idx}`} position={[0, 0.08 + offsetY, 0]}>
            <mesh>
              <cylinderGeometry args={[0.042, 0.03, 0.12, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
            {/* Kraft Cardboard Insulating Heat Sleeve */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.044, 0.034, 0.05, 16]} />
              <meshStandardMaterial color="#d97706" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- GLASS PASTRY DISPLAY SHOWCASE (VITRINA DE MEDIALUNAS) --- */}
      <group position={[width * 0.32, height + 0.04, 0]}>
        {/* Showcase Frame & Base */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.68, 0.02, depth * 0.9]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>

        {/* Curved Glass Enclosure */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.66, 0.34, depth * 0.86]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.35}
            roughness={0.05}
          />
        </mesh>

        {/* Internal Glass Shelf */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.64, 0.01, depth * 0.8]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.4} />
        </mesh>

        {/* Golden Medialunas / Croissants on Tray */}
        {[-0.18, 0, 0.18].map((mX, mIdx) => (
          <group key={`croissant-${mIdx}`} position={[mX, 0.05, 0]}>
            {/* Crescent Croissant Shape */}
            <mesh castShadow>
              <torusGeometry args={[0.038, 0.018, 8, 16, Math.PI * 1.1]} />
              <meshStandardMaterial color="#d97706" roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Muffins on Top Shelf */}
        {[-0.14, 0.14].map((ufX, ufIdx) => (
          <mesh key={`muffin-${ufIdx}`} position={[ufX, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.024, 0.05, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* --- OVERHEAD CHALKBOARD COFFEE MENU SIGN --- */}
      <group position={[0, height + 1.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[width * 0.85, 0.55, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[width * 0.82, 0.52]} />
          <meshBasicMaterial map={menuTexture} />
        </mesh>
      </group>
    </group>
  );
}
