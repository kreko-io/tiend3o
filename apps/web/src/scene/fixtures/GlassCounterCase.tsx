import React, { useMemo } from "react";
import * as THREE from "three";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";
import { createSignTexture } from "../signTextures";

interface GlassCounterCaseProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function GlassCounterCase({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: GlassCounterCaseProps) {
  const { position, dimensions, rotationY, shelves, metadata } = fixture;
  const { width, height, depth } = dimensions;

  const hasScale = metadata?.hasScale ?? true;
  const hasQr = metadata?.hasQr ?? true;

  // QR Code canvas texture
  const qrTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 256);

    // Header
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 256, 44);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PAGUE CON QR", 128, 28);

    // Simulated QR pattern
    ctx.fillStyle = "#0f172a";
    // QR position corners
    ctx.fillRect(36, 64, 48, 48);
    ctx.clearRect(44, 72, 32, 32);
    ctx.fillRect(52, 80, 16, 16);

    ctx.fillRect(172, 64, 48, 48);
    ctx.clearRect(180, 72, 32, 32);
    ctx.fillRect(188, 80, 16, 16);

    ctx.fillRect(36, 172, 48, 48);
    ctx.clearRect(44, 180, 32, 32);
    ctx.fillRect(52, 188, 16, 16);

    // Data matrix dots
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0 || (i * j) % 3 === 0) {
          ctx.fillRect(96 + (i * 8), 120 + (j * 8), 6, 6);
        }
      }
    }

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Transferencia / Móvil", 128, 242);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* --- WOODEN / ALUMINUM BASE PLINTH --- */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.16, depth]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* --- CORNER METAL POSTS --- */}
      {[-width / 2 + 0.02, width / 2 - 0.02].map((xPost, pxIdx) =>
        [-depth / 2 + 0.02, depth / 2 - 0.02].map((zPost, pzIdx) => (
          <mesh
            key={`post-${pxIdx}-${pzIdx}`}
            position={[xPost, height / 2, zPost]}
            castShadow
          >
            <boxGeometry args={[0.04, height - 0.16, 0.04]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* --- TEMPERED GLASS PANELS --- */}
      {/* Front Glass Facing Customer */}
      <mesh position={[0, height / 2, depth / 2]}>
        <boxGeometry args={[width - 0.08, height - 0.2, 0.02]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Top Glass Counter Surface */}
      <mesh position={[0, height, 0]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.4}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Side Glass Panels */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.02, height - 0.2, depth - 0.08]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.35}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.02, height - 0.2, depth - 0.08]} />
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.35}
          roughness={0.05}
        />
      </mesh>

      {/* --- INTERNAL SHELVES & PRODUCT SLOTS --- */}
      {shelves.map((shelf) => {
        const shelfY = shelf.heightOffset;
        const slotCount = Math.max(1, shelf.slots.length);
        const slotStep = (width * 0.85) / slotCount;
        const startX = -((slotCount - 1) * slotStep) / 2;

        return (
          <group key={`shelf-${shelf.levelIndex}`} position={[0, shelfY, 0]}>
            {/* Internal Glass Shelf Plate */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[width - 0.08, 0.015, depth - 0.1]} />
              <meshStandardMaterial
                color="#e0f2fe"
                transparent
                opacity={0.5}
                roughness={0.1}
              />
            </mesh>

            {/* Products inside the showcase */}
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

      {/* --- DIGITAL WEIGHING SCALE (ON TOP SURFACE) --- */}
      {hasScale && (
        <group position={[-width * 0.25, height + 0.01, 0]}>
          {/* Scale Base */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <boxGeometry args={[0.42, 0.08, 0.36]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Stainless Steel Weighing Platter */}
          <mesh position={[0, 0.085, 0]}>
            <boxGeometry args={[0.44, 0.01, 0.38]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* LCD Digital Weight Screen */}
          <mesh position={[0, 0.14, 0.12]} rotation={[-Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.18, 0.08, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.14, 0.142]} rotation={[-Math.PI / 6, 0, 0]}>
            <planeGeometry args={[0.16, 0.06]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>
      )}

      {/* --- PAYMENT QR CODE PLAQUE (ON TOP SURFACE FACING CUSTOMER) --- */}
      {hasQr && (
        <group position={[width * 0.25, height + 0.01, depth * 0.15]} rotation={[0, 0, 0]}>
          {/* Acrylic Plaque Base Stand */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.08]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
          </mesh>
          {/* Tilted Acrylic Plaque with QR code texture */}
          <group position={[0, 0.12, 0]} rotation={[-Math.PI / 10, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.24, 0.01]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.006]}>
              <planeGeometry args={[0.19, 0.23]} />
              <meshBasicMaterial map={qrTexture} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
