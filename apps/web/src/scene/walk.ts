import type { Camera, Vector3 } from "three";

export const EYE_HEIGHT = 1.7; // standard human eye level (1.7m)
export const WALK_SPEED = 4.5;
export const RUN_SPEED = 8.0;

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function moveWithCollisions(
  colliders: BoundingBox2D[],
  x: number,
  z: number,
  dx: number,
  dz: number,
  radius = 0.4
): { x: number; z: number } {
  let newX = x + dx;
  let newZ = z + dz;

  for (const box of colliders) {
    // Check X slide
    if (
      newX + radius > box.minX &&
      newX - radius < box.maxX &&
      z + radius > box.minZ &&
      z - radius < box.maxZ
    ) {
      newX = dx > 0 ? box.minX - radius : box.maxX + radius;
    }

    // Check Z slide
    if (
      newX + radius > box.minX &&
      newX - radius < box.maxX &&
      newZ + radius > box.minZ &&
      newZ - radius < box.maxZ
    ) {
      newZ = dz > 0 ? box.minZ - radius : box.maxZ + radius;
    }
  }

  return { x: newX, z: newZ };
}

export function stepWalk(
  camera: Camera,
  forward: Vector3,
  keys: Record<string, boolean>,
  dt: number,
  colliders: BoundingBox2D[]
) {
  let ax = 0;
  let az = 0;
  if (keys["KeyW"] || keys["ArrowUp"]) az += 1;
  if (keys["KeyS"] || keys["ArrowDown"]) az -= 1;
  if (keys["KeyD"] || keys["ArrowRight"]) ax += 1;
  if (keys["KeyA"] || keys["ArrowLeft"]) ax -= 1;

  if (ax === 0 && az === 0) return;

  const isRunning = !!keys["ShiftLeft"] || !!keys["ShiftRight"];
  const speed = (isRunning ? RUN_SPEED : WALK_SPEED) * dt;

  // forward is (forward.x, 0, forward.z)
  // right is (-forward.z, 0, forward.x)
  let dx = forward.x * az - forward.z * ax;
  let dz = forward.z * az + forward.x * ax;
  const len = Math.hypot(dx, dz);
  if (len <= 0.001) return;

  dx = (dx / len) * speed;
  dz = (dz / len) * speed;

  const next = moveWithCollisions(colliders, camera.position.x, camera.position.z, dx, dz);
  camera.position.x = next.x;
  camera.position.z = next.z;
}
