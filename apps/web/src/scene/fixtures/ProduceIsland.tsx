import React, { useMemo } from "react";
import * as THREE from "three";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";

interface ProduceIslandProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function ProduceIsland({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: ProduceIslandProps) {
  const { position, dimensions, rotationY, shelves } = fixture;
  const { width, height, depth } = dimensions;

  // Chalkboard Banner Texture
  const chalkTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#1e293b"; // Slate blackboard
    ctx.fillRect(0, 0, 256, 96);

    ctx.fillStyle = "#22c55e"; // Green fresh
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FRESCOS DEL DÍA", 128, 42);

    ctx.fillStyle = "#fef08a"; // Yellow chalk
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("AREPAS • PAN • FRUTAS", 128, 74);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* Wooden Bin Island Chassis */}
      <mesh position={[0, height * 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height * 0.9, depth]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Slanted Wooden Produce Deck (Tilted towards shopper) */}
      <mesh
        position={[0, height + 0.05, 0]}
        rotation={[Math.PI / 8, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width * 1.02, 0.04, depth * 1.05]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Front Retaining Wood Lip */}
      <mesh
        position={[0, height + 0.12, depth / 2]}
        castShadow
      >
        <boxGeometry args={[width * 1.02, 0.12, 0.04]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>

      {/* Chalkboard Sign Plaque */}
      <group position={[0, height + 0.38, -depth * 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[width * 0.7, 0.22, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[width * 0.68, 0.2]} />
          <meshBasicMaterial map={chalkTexture} />
        </mesh>
      </group>

      {/* Shelf Levels with Products */}
      {shelves.map((shelf) => {
        const shelfY = shelf.heightOffset;
        const slotCount = Math.max(1, shelf.slots.length);
        const slotStep = (width * 0.8) / slotCount;
        const startX = -((slotCount - 1) * slotStep) / 2;

        return (
          <group key={`shelf-${shelf.levelIndex}`} position={[0, shelfY, 0]}>
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
                  position={[slotX, height * 0.55, 0.1]}
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
