import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { computeModelFit } from "./modelBounds";

describe("3D Model Bounds and Auto-Fitter", () => {
  it("fits standard product mesh into target shelf slot height", () => {
    const geom = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(0, 10, 0);

    const fit = computeModelFit(mesh, 0.25);
    expect(fit.scale).toBeCloseTo(0.25 / 0.3);
  });
});
