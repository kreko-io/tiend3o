import React, { useMemo } from "react";
import type { Product } from "@tiend3o/shared";

interface ProductItemProps {
  product: Product;
  position: [number, number, number];
  facingCount?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
}

export function ProductItem({
  product,
  position,
  facingCount = 1,
  isSelected = false,
  isHovered = false,
  onClick,
}: ProductItemProps) {
  const { width, height, depth } = product.dimensions;

  const outlineColor = isSelected ? "#38bdf8" : isHovered ? "#facc15" : null;

  // Render individual product shape depending on category
  const renderShape = (key: string, offsetZ: number) => {
    switch (product.category) {
      case "dairy": // Milk carton
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            {/* Main carton body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.8, depth]} />
              <meshStandardMaterial
                color={product.color}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
            {/* Sloped top crest */}
            <mesh position={[0, height * 0.45, 0]}>
              <boxGeometry args={[width * 0.95, height * 0.15, depth * 0.6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
          </group>
        );

      case "beverages": // Bottle / Can
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[width / 2, width / 2, height, 16]} />
              <meshStandardMaterial
                color={product.color}
                metalness={0.3}
                roughness={0.2}
              />
            </mesh>
            {/* Bottle cap */}
            <mesh position={[0, height / 2 + 0.01, 0]}>
              <cylinderGeometry args={[width / 3.5, width / 3.5, 0.02, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );

      case "canned_goods": // Tin can
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[width / 2, width / 2, height, 16]} />
              <meshStandardMaterial
                color={product.color}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          </group>
        );

      default: // Cereal / Box / Snacks
        return (
          <mesh
            key={key}
            position={[0, height / 2, offsetZ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={product.color}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
        );
    }
  };

  const facings = useMemo(() => {
    const items = [];
    const step = depth * 1.1;
    for (let f = 0; f < Math.min(facingCount, 3); f++) {
      items.push(renderShape(`facing-${f}`, -f * step));
    }
    return items;
  }, [facingCount, product, depth]);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {facings}

      {/* Selection / Hover Indicator */}
      {outlineColor && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width * 1.15, height * 1.05, depth * 1.15]} />
          <meshBasicMaterial
            color={outlineColor}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
