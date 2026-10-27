export interface Box3Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

export interface ModelFit {
  scale: number;
  offset: [number, number, number];
}

const noNegativeZero = (v: number) => (Object.is(v, -0) ? 0 : v);

/**
 * Calculates fit scale and offset from pure min/max extents without requiring Three.js runtime.
 */
export function calculateFitFromBounds(bounds: Box3Bounds, targetSize: number): ModelFit {
  const sizeX = bounds.max[0] - bounds.min[0];
  const sizeY = bounds.max[1] - bounds.min[1];
  const sizeZ = bounds.max[2] - bounds.min[2];

  const maxDim = Math.max(sizeX, sizeY, sizeZ, 1e-4);
  const scale = targetSize / maxDim;

  const centerX = (bounds.min[0] + bounds.max[0]) / 2;
  const centerZ = (bounds.min[2] + bounds.max[2]) / 2;
  const minY = bounds.min[1];

  return {
    scale,
    offset: [
      noNegativeZero(-centerX * scale),
      noNegativeZero(-minY * scale),
      noNegativeZero(-centerZ * scale),
    ],
  };
}
