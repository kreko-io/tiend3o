import * as THREE from "three";

export interface ModelFit {
  scale: number;
  offset: [number, number, number];
}

/**
 * Computes optimal scale and offset so that any 3D asset (.glb):
 * 1. Centers horizontally at (x = 0, z = 0)
 * 2. Rests cleanly at y = 0
 * 3. Fits exactly within targetSize in its largest dimension
 */
export function computeModelFit(root: THREE.Object3D, targetSize = 0.25): ModelFit {
  root.updateMatrixWorld(true);

  const box = new THREE.Box3();
  let hasMesh = false;

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      if (!mesh.geometry.boundingBox) {
        mesh.geometry.computeBoundingBox();
      }
      if (mesh.geometry.boundingBox) {
        const meshBox = mesh.geometry.boundingBox.clone();
        meshBox.applyMatrix4(mesh.matrixWorld);
        if (!hasMesh) {
          box.copy(meshBox);
          hasMesh = true;
        } else {
          box.union(meshBox);
        }
      }
    }
  });

  if (!hasMesh || box.isEmpty()) {
    box.setFromObject(root);
  }

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 1e-4);
  const scale = targetSize / maxDim;

  const centerX = (box.min.x + box.max.x) / 2;
  const centerZ = (box.min.z + box.max.z) / 2;
  const minY = box.min.y;

  return {
    scale,
    offset: [-centerX * scale, -minY * scale, -centerZ * scale],
  };
}
