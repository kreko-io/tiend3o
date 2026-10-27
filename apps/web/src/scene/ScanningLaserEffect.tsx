import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlanogramStore } from "../store/usePlanogramStore";

interface ScanningLaserEffectProps {
  storeWidth: number;
  storeLength: number;
  ceilingHeight: number;
}

export function ScanningLaserEffect({
  storeWidth,
  storeLength,
  ceilingHeight,
}: ScanningLaserEffectProps) {
  const { isScanningAnimationActive } = usePlanogramStore();
  const laserRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!laserRef.current) return;
    if (isScanningAnimationActive) {
      // Oscillate laser beam back and forth across Z axis
      const t = state.clock.getElapsedTime();
      const zPos = Math.sin(t * 3.5) * (storeLength / 2 - 1);
      laserRef.current.position.z = zPos;
      laserRef.current.visible = true;
    } else {
      laserRef.current.visible = false;
    }
  });

  if (!isScanningAnimationActive) return null;

  return (
    <group ref={laserRef} position={[0, 0, 0]}>
      {/* Horizontal Laser Line Beam across store width */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[storeWidth * 0.96, 0.04, 0.08]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Holographic Vertical Laser Curtain */}
      <mesh position={[0, ceilingHeight / 2, 0]}>
        <planeGeometry args={[storeWidth * 0.96, ceilingHeight]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Laser Emitter Bar */}
      <mesh position={[0, ceilingHeight - 0.1, 0]}>
        <boxGeometry args={[storeWidth * 0.96, 0.06, 0.08]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Dynamic Laser Light Glow */}
      <pointLight position={[0, 1.2, 0]} intensity={35} distance={12} color="#22c55e" />
    </group>
  );
}
