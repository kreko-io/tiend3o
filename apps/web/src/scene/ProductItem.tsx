import React, { useMemo } from "react";
import type { Product } from "@tiend3o/shared";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { getProductPackagingTexture } from "./productTextures";

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
  const { overlayMode } = usePlanogramStore();
  const { width, height, depth } = product.dimensions;

  const outlineColor = isSelected ? "#38bdf8" : isHovered ? "#facc15" : null;
  const isHeatmap = overlayMode === "heatmap";

  // Calculate financial score: margin * price * sales velocity
  const financialScore = product.price * product.margin * product.historicalSalesVelocity;

  // Compute active color (Realistic vs Heatmap)
  const { activeColor, emissiveColor, emissiveIntensity } = useMemo(() => {
    if (isHeatmap) {
      if (financialScore >= 55) {
        return { activeColor: "#22c55e", emissiveColor: "#15803d", emissiveIntensity: 0.4 }; // Hot/Green
      } else if (financialScore >= 22) {
        return { activeColor: "#eab308", emissiveColor: "#a16207", emissiveIntensity: 0.25 }; // Warm/Amber
      } else {
        return { activeColor: "#ef4444", emissiveColor: "#b91c1c", emissiveIntensity: 0.25 }; // Cold/Red
      }
    }
    return { activeColor: product.color || "#0284c7", emissiveColor: "#000000", emissiveIntensity: 0 };
  }, [isHeatmap, financialScore, product.color]);

  // Product realistic packaging wrap texture
  const packagingTexture = useMemo(() => {
    return getProductPackagingTexture(product);
  }, [product]);

  // Render individual product shape depending on category
  const renderShape = (key: string, offsetZ: number) => {
    switch (product.category) {
      case "dairy": // Gable-Top Milk Carton
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            {/* Main Carton Body */}
            <mesh castShadow receiveShadow userData={{ noMerge: true }}>
              <boxGeometry args={[width, height * 0.8, depth]} />
              <meshStandardMaterial
                color={isHeatmap ? activeColor : "#ffffff"}
                map={isHeatmap ? null : packagingTexture}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                roughness={0.3}
              />
            </mesh>
            {/* Slanted Gable Top */}
            <mesh position={[0, height * 0.45, 0]}>
              <boxGeometry args={[width * 0.96, height * 0.15, depth * 0.6]} />
              <meshStandardMaterial color={isHeatmap ? activeColor : "#ffffff"} roughness={0.4} />
            </mesh>
            {/* Plastic Pour Spout Cap */}
            <mesh position={[width * 0.2, height * 0.48, depth * 0.15]}>
              <cylinderGeometry args={[0.012, 0.012, 0.015, 12]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.3} />
            </mesh>
          </group>
        );

      case "beverages": // Bottle or Can
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            {/* Main Bottle Cylinder Body with printed label */}
            <mesh castShadow receiveShadow userData={{ noMerge: true }}>
              <cylinderGeometry args={[width / 2, width / 2, height * 0.75, 16]} />
              <meshStandardMaterial
                color={isHeatmap ? activeColor : "#ffffff"}
                map={isHeatmap ? null : packagingTexture}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                metalness={0.2}
                roughness={0.25}
              />
            </mesh>
            {/* Fluted Bottle Neck */}
            <mesh position={[0, height * 0.42, 0]}>
              <cylinderGeometry args={[width / 4, width / 2.2, height * 0.2, 16]} />
              <meshStandardMaterial
                color={isHeatmap ? activeColor : activeColor}
                roughness={0.2}
                transparent={!isHeatmap}
                opacity={0.85}
              />
            </mesh>
            {/* Crown Bottle Cap / Screw Cap */}
            <mesh position={[0, height / 2 + 0.01, 0]}>
              <cylinderGeometry args={[width / 3.6, width / 3.6, 0.02, 12]} />
              <meshStandardMaterial color={isHeatmap ? activeColor : "#facc15"} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );

      case "canned_goods": // Tin Can
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            {/* Printed Body Label */}
            <mesh castShadow receiveShadow userData={{ noMerge: true }}>
              <cylinderGeometry args={[width / 2, width / 2, height * 0.88, 16]} />
              <meshStandardMaterial
                color={isHeatmap ? activeColor : "#ffffff"}
                map={isHeatmap ? null : packagingTexture}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            {/* Silver Metal Top Rim & Pull Tab */}
            <mesh position={[0, height * 0.45, 0]}>
              <cylinderGeometry args={[width / 2.02, width / 2.02, 0.01, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, -height * 0.45, 0]}>
              <cylinderGeometry args={[width / 2.02, width / 2.02, 0.01, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        );

      case "snacks": // Puffed Foil Chip Bag
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            {/* Puffed Foil Bag Body */}
            <mesh castShadow receiveShadow userData={{ noMerge: true }}>
              <boxGeometry args={[width * 0.92, height * 0.88, depth * 0.7]} />
              <meshStandardMaterial
                color={isHeatmap ? activeColor : "#ffffff"}
                map={isHeatmap ? null : packagingTexture}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                metalness={0.35}
                roughness={0.2}
              />
            </mesh>
            {/* Crimped Metallic Top and Bottom Edge */}
            <mesh position={[0, height * 0.47, 0]}>
              <boxGeometry args={[width * 0.95, 0.02, depth * 0.15]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -height * 0.47, 0]}>
              <boxGeometry args={[width * 0.95, 0.02, depth * 0.15]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );

      default: // Retail Box / Sacks / Jugs
        return (
          <group key={key} position={[0, height / 2, offsetZ]}>
            <mesh castShadow receiveShadow userData={{ noMerge: true }}>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial
                color={isHeatmap ? activeColor : "#ffffff"}
                map={isHeatmap ? null : packagingTexture}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                roughness={0.35}
                metalness={0.1}
              />
            </mesh>
            {/* Top Cap if it's a heavy jug (weight > 2kg) */}
            {product.weightKg >= 2.0 && (
              <mesh position={[width * 0.25, height / 2 + 0.02, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
              </mesh>
            )}
          </group>
        );
    }
  };

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Selection / Hover Indicator Halo */}
      {outlineColor && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width * 1.08, height * 1.08, depth * 1.08]} />
          <meshBasicMaterial
            color={outlineColor}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Render Facings along Depth */}
      {Array.from({ length: facingCount }).map((_, fIdx) =>
        renderShape(`facing-${fIdx}`, -fIdx * depth * 0.95)
      )}
    </group>
  );
}
