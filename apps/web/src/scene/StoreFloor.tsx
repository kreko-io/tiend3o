import React from "react";
import type { StoreSpace } from "@tiend3o/shared";

interface StoreFloorProps {
  space: StoreSpace;
}

export function StoreFloor({ space }: StoreFloorProps) {
  const { width, length, ceilingHeight } = space;

  return (
    <group>
      {/* Polished Store Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Grid Floor Overlay for measurement */}
      <gridHelper
        args={[Math.max(width, length), Math.max(width, length), "#334155", "#0f172a"]}
        position={[0, 0.005, 0]}
      />

      {/* North Wall */}
      <mesh position={[0, ceilingHeight / 2, -length / 2]} receiveShadow>
        <boxGeometry args={[width, ceilingHeight, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* South Wall (Entrance side) */}
      <mesh position={[0, ceilingHeight / 2, length / 2]} receiveShadow>
        <boxGeometry args={[width, ceilingHeight, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* West Wall */}
      <mesh position={[-width / 2, ceilingHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, ceilingHeight, length]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* East Wall */}
      <mesh position={[width / 2, ceilingHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, ceilingHeight, length]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Overhead High-Bay LED Lights */}
      {[-length / 3, 0, length / 3].map((zPos, idx) => (
        <group key={`light-row-${idx}`} position={[0, ceilingHeight - 0.2, zPos]}>
          <mesh>
            <boxGeometry args={[width * 0.8, 0.08, 0.2]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight
            position={[0, -0.5, 0]}
            intensity={45}
            distance={25}
            decay={2}
            color="#f8fafc"
          />
        </group>
      ))}
    </group>
  );
}
