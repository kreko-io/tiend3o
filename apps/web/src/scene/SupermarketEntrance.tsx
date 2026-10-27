import React, { useMemo } from "react";
import * as THREE from "three";
import { createSignTexture, createWelcomeMatTexture } from "./signTextures";

interface SupermarketEntranceProps {
  storeWidth: number;
  storeLength: number;
  ceilingHeight: number;
}

export function SupermarketEntrance({
  storeWidth,
  storeLength,
  ceilingHeight,
}: SupermarketEntranceProps) {
  const frontZ = storeLength / 2; // e.g. 18
  const entranceCenterX = 6.0; // Right side of store entrance

  // Textures
  const headerTexture = useMemo(() => {
    return createSignTexture({
      width: 512,
      height: 128,
      backgroundColor: "#0284c7",
      text: "ENTRADA PRINCIPAL",
      subtitle: "BIENVENIDOS A TIEND3O",
      badge: "ABIERTO",
      badgeBg: "#10b981",
    });
  }, []);

  const welcomeMatTexture = useMemo(() => createWelcomeMatTexture(), []);

  return (
    <group position={[entranceCenterX, 0, frontZ - 1.2]}>
      {/* --- OVERHEAD ENTRANCE ARCH & SIGNAGE --- */}
      <group position={[0, ceilingHeight - 0.9, 0.8]}>
        {/* Sign Board */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[4.4, 0.9, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Front Face with Canvas Texture */}
        <mesh position={[0, 0, -0.055]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.3, 0.82]} />
          <meshBasicMaterial map={headerTexture} />
        </mesh>
        {/* Subtle LED downlight for entrance */}
        <pointLight position={[0, -0.6, 0]} intensity={15} distance={8} color="#e0f2fe" />
      </group>

      {/* --- SLIDING GLASS DOORS (AUTOMATIC) --- */}
      <group position={[0, 1.4, 1.1]}>
        {/* Aluminum Outer Door Frame */}
        <mesh position={[-2.1, 0, 0]}>
          <boxGeometry args={[0.1, 2.8, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.1, 0, 0]}>
          <boxGeometry args={[0.1, 2.8, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[4.3, 0.12, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Motion Radar Sensor */}
        <mesh position={[0, 1.35, -0.1]}>
          <boxGeometry args={[0.4, 0.08, 0.12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Left Fixed Glass Panel */}
        <mesh position={[-1.4, 0, 0]}>
          <boxGeometry args={[1.2, 2.6, 0.04]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Right Fixed Glass Panel */}
        <mesh position={[1.4, 0, 0]}>
          <boxGeometry args={[1.2, 2.6, 0.04]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Center Sliding Glass Door (Slightly Open for entry ambiance) */}
        <mesh position={[-0.45, 0, 0.03]}>
          <boxGeometry args={[0.9, 2.6, 0.03]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.4}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0.45, 0, 0.03]}>
          <boxGeometry args={[0.9, 2.6, 0.03]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.4}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Yellow Safety Eye-Level Vision Strips */}
        <mesh position={[0, -0.1, 0.02]}>
          <boxGeometry args={[4.0, 0.05, 0.06]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>

      {/* --- WELCOME FLOOR WALK-OFF MAT --- */}
      <mesh
        position={[0, 0.008, 0.2]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        receiveShadow
      >
        <planeGeometry args={[3.6, 1.8]} />
        <meshStandardMaterial map={welcomeMatTexture} roughness={0.9} />
      </mesh>

      {/* --- ENTRANCE GUIDE RAILINGS & TURNSTILE SWING GATES --- */}
      <group position={[-0.2, 0, -1.0]}>
        {/* Left Chrome Stanchion Post */}
        <mesh position={[-1.2, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Center Turnstile Post with Motor housing */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Illuminated Green Arrow Status on turnstile top */}
        <mesh position={[0, 1.11, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        {/* Chrome Swing Barrier Arm (open angle inwards) */}
        <group position={[0, 0.85, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <mesh position={[0.45, 0, 0]}>
            <boxGeometry args={[0.9, 0.04, 0.04]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.45, -0.15, 0]}>
            <boxGeometry args={[0.8, 0.22, 0.02]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.65}
              metalness={0.2}
            />
          </mesh>
        </group>

        {/* Right Chrome Stanchion Post */}
        <mesh position={[1.2, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Chrome Horizontal Guide Bars */}
        <mesh position={[-0.6, 0.85, 0]}>
          <boxGeometry args={[1.2, 0.03, 0.03]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-0.6, 0.45, 0]}>
          <boxGeometry args={[1.2, 0.03, 0.03]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* --- SHOPPING CARTS CORRAL (NESTED TROLLEYS) --- */}
      <group position={[3.2, 0, -0.6]}>
        {/* Metal Corral Guard Rails */}
        <mesh position={[-0.7, 0.45, 0]}>
          <boxGeometry args={[0.04, 0.9, 2.6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.7, 0.45, 0]}>
          <boxGeometry args={[0.04, 0.9, 2.6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Row of Nested Wire Shopping Carts */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((zOffset, idx) => (
          <group key={`cart-${idx}`} position={[0, 0, zOffset]}>
            {/* Lower Chassis with Wheels */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.55, 0.05, 0.75]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* 4 Rubber Wheels */}
            {[-0.22, 0.22].map((wx, wIdx) => (
              <React.Fragment key={`wheel-${idx}-${wIdx}`}>
                <mesh position={[wx, 0.06, 0.3]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>
                <mesh position={[wx, 0.06, -0.3]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>
              </React.Fragment>
            ))}

            {/* Wire Basket Upper */}
            <mesh position={[0, 0.55, -0.05]}>
              <boxGeometry args={[0.52, 0.48, 0.68]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.15}
                wireframe={false}
              />
            </mesh>

            {/* Red Ergonomic Push Handle */}
            <mesh position={[0, 0.92, -0.42]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.56, 12]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- HAND BASKET STACK STATION --- */}
      <group position={[-2.4, 0, -1.0]}>
        {/* Metal Wire Stand Base */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.45, 0.8, 0.35]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Stack of Red Shopping Baskets */}
        {[0, 1, 2, 3, 4, 5].map((bIdx) => (
          <group key={`basket-${bIdx}`} position={[0, 0.45 + bIdx * 0.055, 0]}>
            <mesh>
              <boxGeometry args={[0.42, 0.16, 0.32]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
            {/* Folding Black Handle */}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.44, 0.02, 0.02]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
