import React, { useMemo } from "react";
import * as THREE from "three";
import { createSignTexture, createPosScreenTexture } from "./signTextures";

interface SupermarketCheckoutsProps {
  storeWidth: number;
  storeLength: number;
}

interface CheckoutLaneConfig {
  id: number;
  xPos: number;
  isOpen: boolean;
}

export function SupermarketCheckouts({ storeWidth, storeLength }: SupermarketCheckoutsProps) {
  // 4 parallel checkout lanes situated at the front of the supermarket
  const lanes: CheckoutLaneConfig[] = [
    { id: 1, xPos: -6.6, isOpen: true },
    { id: 2, xPos: -4.2, isOpen: true },
    { id: 3, xPos: -1.8, isOpen: true },
    { id: 4, xPos: 0.6, isOpen: true },
  ];

  const checkoutZ = storeLength / 2 - 6.5; // e.g. 11.5

  const posScreenTexture = useMemo(() => createPosScreenTexture(), []);

  // Lane indicator signs (1, 2, 3, 4)
  const laneTextures = useMemo(() => {
    return lanes.map((lane) =>
      createSignTexture({
        width: 256,
        height: 256,
        backgroundColor: lane.isOpen ? "#15803d" : "#b91c1c",
        text: `${lane.id}`,
        subtitle: lane.isOpen ? "ABIERTA" : "CERRADA",
        subtitleColor: "#ffffff",
        badge: "CAJA",
        badgeBg: "#0f172a",
        badgeColor: "#38bdf8",
      })
    );
  }, []);

  return (
    <group position={[0, 0, checkoutZ]}>
      {lanes.map((lane, idx) => (
        <group key={`checkout-lane-${lane.id}`} position={[lane.xPos, 0, 0]}>
          {/* --- MAIN CHECKOUT COUNTER FURNITURE --- */}
          <group position={[0, 0, 0]}>
            {/* Lower Base Cabinet */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.95, 0.84, 2.9]} />
              <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.2} />
            </mesh>

            {/* Stainless Steel Countertop */}
            <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.98, 0.04, 2.94]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.25} />
            </mesh>

            {/* Black Conveyor Belt Inset */}
            <mesh position={[0.1, 0.875, -0.45]} receiveShadow>
              <boxGeometry args={[0.62, 0.015, 1.6]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>

            {/* Conveyor Belt Separator Bars */}
            {[-0.8, -0.3, 0.2].map((zSep, sIdx) => (
              <mesh key={`sep-${sIdx}`} position={[0.1, 0.89, zSep]}>
                <boxGeometry args={[0.55, 0.015, 0.03]} />
                <meshStandardMaterial color="#facc15" roughness={0.4} />
              </mesh>
            ))}

            {/* Optical Barcode Scanner Window (Flush with Counter) */}
            <mesh position={[0.1, 0.88, 0.55]}>
              <boxGeometry args={[0.26, 0.01, 0.32]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={0.6}
                roughness={0.1}
              />
            </mesh>

            {/* Red Barcode Laser Scan Beam Line */}
            <mesh position={[0.1, 0.885, 0.55]}>
              <boxGeometry args={[0.22, 0.005, 0.015]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>

            {/* Acrylic Sneeze / Divider Screen */}
            <mesh position={[-0.42, 1.25, 0.2]}>
              <boxGeometry args={[0.02, 0.75, 1.2]} />
              <meshStandardMaterial
                color="#e0f2fe"
                transparent
                opacity={0.3}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>

            {/* Bagging Packing Basin at the End */}
            <group position={[0, 0.86, 1.1]}>
              <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[0.85, 0.1, 0.65]} />
                <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
              </mesh>
              {/* White & Kraft Grocery Bags in packing station */}
              <mesh position={[-0.2, 0.08, 0]}>
                <boxGeometry args={[0.25, 0.22, 0.22]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.8} />
              </mesh>
              <mesh position={[0.18, 0.07, 0.05]}>
                <boxGeometry args={[0.22, 0.2, 0.2]} />
                <meshStandardMaterial color="#d97706" roughness={0.9} />
              </mesh>
            </group>
          </group>

          {/* --- POS TERMINAL & TOUCHSCREEN DISPLAY --- */}
          <group position={[-0.32, 0.87, 0.55]}>
            {/* Monitor Articulated Stand Post */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Cashier Touchscreen Monitor */}
            <group position={[0.02, 0.38, 0]} rotation={[0, -Math.PI / 4, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.03, 0.26, 0.34]} />
                <meshStandardMaterial color="#0f172a" roughness={0.4} />
              </mesh>
              {/* POS Screen Face with live simulated receipt texture */}
              <mesh position={[-0.016, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[0.32, 0.24]} />
                <meshBasicMaterial map={posScreenTexture} />
              </mesh>
            </group>

            {/* Customer PIN-pad Payment Reader on Swivel Post */}
            <group position={[0.22, 0.22, 0.15]} rotation={[Math.PI / 6, Math.PI / 6, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.09, 0.16, 0.03]} />
                <meshStandardMaterial color="#1e293b" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.02, 0.018]}>
                <boxGeometry args={[0.07, 0.07, 0.005]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>

            {/* Cash Drawer Base */}
            <mesh position={[0.1, -0.08, 0]}>
              <boxGeometry args={[0.42, 0.12, 0.42]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>

          {/* --- CASHIER ERGONOMIC STOOL --- */}
          <group position={[-0.75, 0, 0.55]}>
            {/* Stool Base & Cylinder */}
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.56, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
            {/* Stool Padded Seat */}
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.08, 20]} />
              <meshStandardMaterial color="#0284c7" roughness={0.6} />
            </mesh>
          </group>

          {/* --- IMPULSE BUY CANDY & GUM MINI-RACK --- */}
          <group position={[0.55, 0, -0.2]}>
            {/* Wire Rack Frame */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[0.2, 1.2, 1.3]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Multi-tier colorful candy/gum packs */}
            {[-0.4, -0.15, 0.1, 0.35].map((zRack, rIdx) => (
              <React.Fragment key={`rack-${rIdx}`}>
                <mesh position={[0, 0.45 + rIdx * 0.18, zRack]}>
                  <boxGeometry args={[0.18, 0.08, 0.18]} />
                  <meshStandardMaterial
                    color={
                      rIdx === 0
                        ? "#eab308"
                        : rIdx === 1
                        ? "#ef4444"
                        : rIdx === 2
                        ? "#10b981"
                        : "#a855f7"
                    }
                    roughness={0.4}
                  />
                </mesh>
              </React.Fragment>
            ))}
          </group>

          {/* --- OVERHEAD ILLUMINATED LANE INDICATOR POLE (CAJA N) --- */}
          <group position={[0.42, 0, 1.2]}>
            {/* Stainless Steel Mast Pole */}
            <mesh position={[0, 1.45, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 2.9, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Glowing Lantern Cube */}
            <group position={[0, 2.8, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.52, 0.52, 0.52]} />
                <meshStandardMaterial
                  color={lane.isOpen ? "#15803d" : "#991b1b"}
                  emissive={lane.isOpen ? "#22c55e" : "#ef4444"}
                  emissiveIntensity={0.6}
                  roughness={0.3}
                />
              </mesh>

              {/* Front Sign Face (Towards Gondolas/Queuing Customers) */}
              <mesh position={[0, 0, -0.265]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[0.48, 0.48]} />
                <meshBasicMaterial map={laneTextures[idx]} />
              </mesh>

              {/* Back Sign Face (Towards Exit/Entrance) */}
              <mesh position={[0, 0, 0.265]}>
                <planeGeometry args={[0.48, 0.48]} />
                <meshBasicMaterial map={laneTextures[idx]} />
              </mesh>

              {/* Point light providing warm green/amber glow under the lane sign */}
              <pointLight
                position={[0, -0.4, 0]}
                intensity={8}
                distance={6}
                color={lane.isOpen ? "#4ade80" : "#f87171"}
              />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}
