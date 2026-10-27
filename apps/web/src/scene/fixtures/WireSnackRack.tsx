import React, { useMemo } from "react";
import * as THREE from "three";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";

interface WireSnackRackProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function WireSnackRack({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: WireSnackRackProps) {
  const { position, dimensions, rotationY, shelves, metadata } = fixture;
  const { width, height, depth } = dimensions;
  const frameColor = (metadata?.frameColor as string) ?? "#0284c7"; // Classic snack rack blue or yellow

  // Header Brand Plaque Texture
  const headerTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#eab308"; // Golden yellow
    ctx.fillRect(0, 0, 256, 96);

    ctx.fillStyle = "#dc2626"; // Red bold text
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SNACKS & PAPAS", 128, 45);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("¡CRUJIENTES!", 128, 75);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* --- TUBULAR METAL FRAME --- */}
      {/* 4 Vertical Tubular Leg Posts */}
      {[-width / 2 + 0.02, width / 2 - 0.02].map((xP, xIdx) =>
        [-depth / 2 + 0.02, depth / 2 - 0.02].map((zP, zIdx) => (
          <mesh key={`post-${xIdx}-${zIdx}`} position={[xP, height / 2, zP]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, height, 12]} />
            <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.7} />
          </mesh>
        ))
      )}

      {/* Base Wire Stabilizer H-bar */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Curved Header Branding Plate */}
      <group position={[0, height + 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[width * 0.95, 0.24, 0.02]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[width * 0.92, 0.22]} />
          <meshBasicMaterial map={headerTexture} />
        </mesh>
        <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[width * 0.92, 0.22]} />
          <meshBasicMaterial map={headerTexture} />
        </mesh>
      </group>

      {/* --- MULTI-TIER SLANTED WIRE BASKETS & PRODUCT SLOTS --- */}
      {shelves.map((shelf) => {
        const shelfY = shelf.heightOffset;
        const slotCount = Math.max(1, shelf.slots.length);
        const slotStep = (width * 0.85) / slotCount;
        const startX = -((slotCount - 1) * slotStep) / 2;

        return (
          <group key={`shelf-${shelf.levelIndex}`} position={[0, shelfY, 0]}>
            {/* Slanted Wire Basket Bottom */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 12, 0, 0]} receiveShadow>
              <boxGeometry args={[width * 0.94, 0.01, depth * 0.95]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Front Wire Retaining Lip */}
            <mesh position={[0, 0.06, depth / 2 - 0.02]}>
              <boxGeometry args={[width * 0.94, 0.08, 0.015]} />
              <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Red Price Tag Rail */}
            <mesh position={[0, 0.06, depth / 2]}>
              <boxGeometry args={[width * 0.92, 0.03, 0.008]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} />
            </mesh>

            {/* Products displayed on the rack */}
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
                  position={[slotX, 0.05, 0]}
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
