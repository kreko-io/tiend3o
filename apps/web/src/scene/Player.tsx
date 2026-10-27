import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { stepWalk, EYE_HEIGHT, BoundingBox2D } from "./walk";

interface PlayerProps {
  initialPosition?: [number, number, number];
  colliders?: BoundingBox2D[];
  active?: boolean;
}

export function Player({
  initialPosition = [0, EYE_HEIGHT, 12],
  colliders = [],
  active = true,
}: PlayerProps) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    camera.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);
    camera.lookAt(0, EYE_HEIGHT, 0);
  }, [camera, initialPosition]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [active]);

  useFrame((_, delta) => {
    if (!active) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    stepWalk(camera, forward, keys.current, delta, colliders);
    camera.position.y = EYE_HEIGHT;
  });

  if (!active) return null;

  return <PointerLockControls />;
}
