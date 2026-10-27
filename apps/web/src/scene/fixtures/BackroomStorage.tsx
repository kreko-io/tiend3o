import React from "react";
import type { StoreFixture, Product } from "@tiend3o/shared";
import { ProductItem } from "../ProductItem";

interface BackroomStorageProps {
  fixture: StoreFixture;
  productsMap: Map<string, Product>;
  selectedProductId: string | null;
  hoveredSlotId: string | null;
  onSelectProduct: (productId: string) => void;
  onSlotHover: (slotId: string | null) => void;
}

export function BackroomStorage({
  fixture,
  productsMap,
  selectedProductId,
  hoveredSlotId,
  onSelectProduct,
  onSlotHover,
}: BackroomStorageProps) {
  const { position, dimensions, rotationY, shelves } = fixture;
  const { width, height, depth } = dimensions;

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotationY, 0]}>
      {/* Industrial Orange / Blue Steel Rack Uprights */}
      {[-width / 2, width / 2].map((xPost, pxIdx) =>
        [-depth / 2, depth / 2].map((zPost, pzIdx) => (
          <mesh key={`post-${pxIdx}-${pzIdx}`} position={[xPost, height / 2, zPost]} castShadow>
            <boxGeometry args={[0.08, height, 0.08]} />
            <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Horizontal Beams */}
      {[0.15, 1.2, 2.3].map((bY, bIdx) => (
        <React.Fragment key={`beam-${bIdx}`}>
          <mesh position={[0, bY, depth / 2]} castShadow>
            <boxGeometry args={[width, 0.08, 0.04]} />
            <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, bY, -depth / 2]} castShadow>
            <boxGeometry args={[width, 0.08, 0.04]} />
            <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Wooden Pallet on Ground Deck */}
      <group position={[0, 0.08, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[width * 0.92, 0.14, depth * 0.9]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>
      </group>

      {/* Stacked Kraft Cardboard Inventory Boxes */}
      {[-width * 0.25, width * 0.25].map((boxX, bxIdx) => (
        <group key={`box-stack-${bxIdx}`} position={[boxX, 0.42, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width * 0.4, 0.5, depth * 0.7]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} />
          </mesh>
          {/* Top smaller box */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[width * 0.35, 0.4, depth * 0.6]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Product items if defined on shelves */}
      {shelves.map((shelf) => (
        <group key={`shelf-${shelf.levelIndex}`} position={[0, shelf.heightOffset, 0]}>
          {shelf.slots.map((slot, sIdx) => {
            const product = slot.productId ? productsMap.get(slot.productId) : null;
            if (!product) return null;
            return (
              <ProductItem
                key={slot.id}
                product={product}
                position={[-width * 0.3 + sIdx * 0.3, 0.02, 0]}
                facingCount={slot.facingCount}
                isSelected={selectedProductId === product.id}
                isHovered={hoveredSlotId === slot.id}
                onClick={() => onSelectProduct(product.id)}
              />
            );
          })}
        </group>
      ))}
    </group>
  );
}
