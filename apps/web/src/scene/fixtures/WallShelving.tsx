import React from "react";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";

interface WallShelvingProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function WallShelving({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: WallShelvingProps) {
  const { position, dimensions, rotationY, shelves } = fixture;
  const { width, height, depth } = dimensions;

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* Back Wooden Paneling */}
      <mesh position={[0, height / 2, -depth / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Upright Dividers */}
      {[-width / 2, -width / 6, width / 6, width / 2].map((xUp, uIdx) => (
        <mesh key={`upright-${uIdx}`} position={[xUp, height / 2, 0]} castShadow>
          <boxGeometry args={[0.05, height, depth]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} />
        </mesh>
      ))}

      {/* Heavy Base Plinth */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.16, depth]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Shelves & Products */}
      {shelves.map((shelf) => {
        const shelfY = shelf.heightOffset;
        const slotCount = Math.max(1, shelf.slots.length);
        const slotStep = (width * 0.9) / slotCount;
        const startX = -((slotCount - 1) * slotStep) / 2;

        return (
          <group key={`shelf-${shelf.levelIndex}`} position={[0, shelfY, 0]}>
            {/* Wooden Shelf Plank */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.98, 0.035, depth * 0.95]} />
              <meshStandardMaterial color="#b45309" roughness={0.5} />
            </mesh>

            {/* Price Channel Lip */}
            <mesh position={[0, 0, depth / 2 - 0.01]}>
              <boxGeometry args={[width * 0.98, 0.025, 0.015]} />
              <meshStandardMaterial color="#0284c7" roughness={0.3} />
            </mesh>

            {/* Products on Shelf */}
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
                  position={[slotX, 0.02, 0]}
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
