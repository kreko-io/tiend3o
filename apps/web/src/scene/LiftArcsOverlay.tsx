import React, { useMemo } from "react";
import * as THREE from "three";
import { usePlanogramStore } from "../store/usePlanogramStore";
import { HISTORICAL_AFFINITIES_10Y } from "@tiend3o/core";

interface SlotLocation {
  worldPos: [number, number, number];
  productId: string;
}

export function LiftArcsOverlay() {
  const { space, overlayMode, optimizationState } = usePlanogramStore();

  const isVisible = overlayMode === "lift_arcs";

  // Build a map of productId -> world positions
  const productWorldPositions = useMemo(() => {
    if (!isVisible) return new Map<string, [number, number, number][]>();

    const map = new Map<string, [number, number, number][]>();

    for (const gondola of space.gondolas) {
      const gX = gondola.start.x;
      const gZ = gondola.start.z;
      const isLeft = gondola.side === "left";
      const shelfDepth = gondola.depth * 0.9;
      const slotX = isLeft ? gX - shelfDepth / 2 : gX + shelfDepth / 2;

      for (const bay of gondola.bays) {
        const bayZ = gZ + bay.bayIndex * bay.width + bay.width / 2;
        const slotStep = (bay.width * 0.9) / Math.max(1, bay.shelves[0]?.slots.length || 6);

        for (const shelf of bay.shelves) {
          const shelfY = shelf.heightOffset;

          for (let sIdx = 0; sIdx < shelf.slots.length; sIdx++) {
            const slot = shelf.slots[sIdx];
            if (!slot.productId) continue;

            const slotZ = bayZ - bay.width / 2 + slotStep / 2 + sIdx * slotStep;
            const pos: [number, number, number] = [slotX, shelfY + 0.1, slotZ];

            const existing = map.get(slot.productId) ?? [];
            existing.push(pos);
            map.set(slot.productId, existing);
          }
        }
      }
    }

    return map;
  }, [space, isVisible]);

  // Generate curves between high-lift pairs
  const arcs = useMemo(() => {
    if (!isVisible) return [];

    const highLiftAffinities = HISTORICAL_AFFINITIES_10Y.filter((a) => a.lift >= 2.0);
    const result: Array<{
      curve: THREE.QuadraticBezierCurve3;
      lift: number;
      label: string;
      isClose: boolean;
    }> = [];

    for (const aff of highLiftAffinities) {
      const positionsA = productWorldPositions.get(aff.productAId);
      const positionsB = productWorldPositions.get(aff.productBId);

      if (positionsA && positionsA.length > 0 && positionsB && positionsB.length > 0) {
        // Take the closest pair of positions for this affinity
        let bestDist = Infinity;
        let bestA = positionsA[0];
        let bestB = positionsB[0];

        for (const posA of positionsA.slice(0, 3)) {
          for (const posB of positionsB.slice(0, 3)) {
            const dx = posA[0] - posB[0];
            const dy = posA[1] - posB[1];
            const dz = posA[2] - posB[2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < bestDist) {
              bestDist = dist;
              bestA = posA;
              bestB = posB;
            }
          }
        }

        const vA = new THREE.Vector3(...bestA);
        const vB = new THREE.Vector3(...bestB);
        const midX = (vA.x + vB.x) / 2;
        const midZ = (vA.z + vB.z) / 2;
        // Arc peak height depends on distance
        const arcHeight = Math.min(2.5, Math.max(0.6, bestDist * 0.35));
        const midY = Math.max(vA.y, vB.y) + arcHeight;

        const curve = new THREE.QuadraticBezierCurve3(
          vA,
          new THREE.Vector3(midX, midY, midZ),
          vB
        );

        result.push({
          curve,
          lift: aff.lift,
          label: `+${aff.lift}x Lift`,
          isClose: bestDist <= 3.5,
        });
      }
    }

    return result;
  }, [productWorldPositions, isVisible]);

  if (!isVisible || arcs.length === 0) return null;

  return (
    <group name="lift-arcs-overlay">
      {arcs.map((arc, i) => {
        // Cyan for close/optimized, Amber for distant/suboptimal
        const color = arc.isClose ? "#06b6d4" : "#f59e0b";
        return (
          <mesh key={i}>
            <tubeGeometry args={[arc.curve, 32, 0.025, 8, false]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.2}
              roughness={0.2}
              transparent
              opacity={0.88}
            />
          </mesh>
        );
      })}
    </group>
  );
}
