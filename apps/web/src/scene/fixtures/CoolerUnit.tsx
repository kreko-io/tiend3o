import React, { useMemo } from "react";
import * as THREE from "three";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";

interface CoolerUnitProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function CoolerUnit({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: CoolerUnitProps) {
  const { position, dimensions, rotationY, shelves, metadata } = fixture;
  const { width, height, depth } = dimensions;

  // Header Brand Texture
  const headerTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#0284c7"; // Cyan blue
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BEBIDAS BIEN FRÍAS", 256, 56);

    ctx.fillStyle = "#bae6fd";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("REFRESCOS • JUGOS • CERVEZAS", 256, 98);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* --- EXTERNAL METAL CABINET --- */}
      {/* Outer Shell Back and Sides */}
      <mesh position={[0, height / 2, -depth * 0.05]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth * 0.9]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Internal White Cavity */}
      <mesh position={[0, height / 2 - 0.05, 0]}>
        <boxGeometry args={[width * 0.92, height * 0.76, depth * 0.7]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#e0f2fe"
          emissiveIntensity={0.25}
          roughness={0.2}
        />
      </mesh>

      {/* Interior Cold Blue-White LED Glow Light */}
      <pointLight
        position={[0, height * 0.7, depth * 0.1]}
        intensity={20}
        distance={6}
        decay={2}
        color="#38bdf8"
      />

      {/* Top Illuminated Canopy Header */}
      <group position={[0, height - 0.16, depth / 2 - 0.04]}>
        <mesh>
          <boxGeometry args={[width * 0.96, 0.28, 0.04]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[width * 0.94, 0.26]} />
          <meshBasicMaterial map={headerTexture} />
        </mesh>
      </group>

      {/* Bottom Compressor Air Vent Grille */}
      <mesh position={[0, 0.12, depth / 2 - 0.02]}>
        <boxGeometry args={[width * 0.96, 0.22, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* --- GLASS DOORS WITH HANDLES --- */}
      {[-width / 4, width / 4].map((doorX, dIdx) => (
        <group key={`door-${dIdx}`} position={[doorX, height / 2 - 0.05, depth / 2 - 0.01]}>
          {/* Glass Door Panel */}
          <mesh>
            <boxGeometry args={[width / 2 - 0.04, height * 0.72, 0.02]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.3}
              roughness={0.05}
              metalness={0.2}
            />
          </mesh>
          {/* Aluminum Door Perimeter Frame */}
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[width / 2 - 0.02, height * 0.74, 0.01]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Vertical Chrome Door Handle */}
          <mesh position={[dIdx === 0 ? width / 8 : -width / 8, 0, 0.04]}>
            <cylinderGeometry args={[0.012, 0.012, 0.45, 12]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* --- SHELVES & PRODUCT SLOTS INSIDE COOLER --- */}
      {shelves.map((shelf) => {
        const shelfY = shelf.heightOffset;
        const slotCount = Math.max(1, shelf.slots.length);
        const slotStep = (width * 0.85) / slotCount;
        const startX = -((slotCount - 1) * slotStep) / 2;

        return (
          <group key={`shelf-${shelf.levelIndex}`} position={[0, shelfY, 0]}>
            {/* White Metal Grated Shelf Plate */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <boxGeometry args={[width * 0.88, 0.02, depth * 0.65]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Products inside the cooler */}
            {shelf.slots.map((slot, sIdx) => {
              const product = slot.productId ? productsMap.get(slot.productId) : null;
              if (!product) return null;

              const slotX = startX + sIdx * slotStep;
              const isSelected = selectedProductId === product.id;
              const isHovered = hoveredSlotId === slot.id;

              return (
                <ProductItem
                  key={slot.id}
                  product={product}
                  position={[slotX, 0.01, 0]}
                  facingCount={slot.facingCount}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  onClick={() => onSelectProduct(product.id)}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
