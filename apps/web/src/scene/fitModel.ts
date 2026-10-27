import * as THREE from "three";
import { computeModelFit, ModelFit } from "./modelBounds";

/**
 * Normalizes any loaded GLTF/GLB scene node into standard shelf dimensions.
 */
export function fitModelToShelfSlot(
  model: THREE.Object3D,
  targetHeight = 0.25
): ModelFit {
  return computeModelFit(model, targetHeight);
}
