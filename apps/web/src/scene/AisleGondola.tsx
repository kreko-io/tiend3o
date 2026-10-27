import React from "react";
import type { GondolaAisle, Product } from "@tiend3o/shared";
import { ProductItem } from "./ProductItem";

interface AisleGondolaProps {
  gondola: GondolaAisle;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function AisleGondola({
  gondola,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: AisleGondolaProps) {
  const { start, length, height, depth, bays, side } = gondola;
  const isLeft = side === "left";
  const shelfDepth = depth * 0.9;

  return (
    <group position={[start.x, start.y, start.z]}>
      {/* Gondola Metal Backpanel */}
      <mesh
        position={[0, height / 2, length / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.04, height, length]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Base kickplate */}
      <mesh
        position={[isLeft ? -depth / 2 : depth / 2, 0.08, length / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[depth, 0.16, length]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Bays and Shelves */}
      {bays.map((bay) => {
        const bayZ = bay.bayIndex * bay.width + bay.width / 2;

        return (
          <group key={bay.id} position={[0, 0, bayZ]}>
            {/* Bay Upright divider */}
            <mesh
              position={[0, height / 2, bay.width / 2]}
              castShadow
            >
              <boxGeometry args={[0.06, height, 0.04]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>

            {bay.shelves.map((shelf) => {
              const shelfY = shelf.heightOffset;
              const slotStep = (bay.width * 0.9) / Math.max(1, shelf.slots.length);

              return (
                <group key={shelf.levelIndex}>
                  {/* Metal Cantilever Shelf Plate */}
                  <mesh
                    position={[isLeft ? -shelfDepth / 2 : shelfDepth / 2, shelfY, 0]}
                    castShadow
                    receiveShadow
                  >
                    <boxGeometry args={[shelfDepth, 0.025, bay.width * 0.98]} />
                    <meshStandardMaterial
                      color="#64748b"
                      roughness={0.4}
                      metalness={0.6}
                    />
                  </mesh>

                  {/* Plastic Price Tag Rail */}
                  <mesh
                    position={[
                      isLeft ? -shelfDepth - 0.005 : shelfDepth + 0.005,
                      shelfY,
                      0,
                    ]}
                  >
                    <boxGeometry args={[0.01, 0.03, bay.width * 0.98]} />
                    <meshStandardMaterial color="#0284c7" roughness={0.3} />
                  </mesh>

                  {/* Product Facings in Slots */}
                  {shelf.slots.map((slot, sIdx) => {
                    const product = slot.productId ? productsMap.get(slot.productId) : null;
                    if (!product) return null;

                    const slotZ =
                      -bay.width / 2 + slotStep / 2 + sIdx * slotStep + 0.02;
                    const slotX = isLeft ? -shelfDepth / 2 : shelfDepth / 2;

                    return (
                      <ProductItem
                        key={slot.id}
                        product={product}
                        position={[slotX, shelfY + 0.0125, slotZ]}
                        facingCount={slot.facingCount}
                        isSelected={selectedProductId === product.id}
                        isHovered={hoveredSlotId === slot.id}
                        onClick={() => onSelectProduct(product.id)}
                      />
                    );
                  })}
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
