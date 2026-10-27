import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const CHECK_EVERY = 15;
const KEEP = ["position", "normal", "uv"];

type Candidate = { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; key: string };

function materialKey(m: THREE.MeshStandardMaterial, mesh: THREE.Mesh) {
  return [
    m.color.getHexString(),
    m.roughness,
    m.metalness,
    m.flatShading ? 1 : 0,
    m.map?.uuid ?? "",
    mesh.castShadow ? 1 : 0,
    mesh.receiveShadow ? 1 : 0,
  ].join("|");
}

function eligible(o: THREE.Object3D): Candidate | null {
  const mesh = o as THREE.Mesh;
  if (!mesh.isMesh || (mesh as THREE.InstancedMesh).isInstancedMesh || (mesh as THREE.SkinnedMesh).isSkinnedMesh) {
    return null;
  }
  if (mesh.userData.noMerge) return null;
  const mat = mesh.material as THREE.MeshStandardMaterial;
  if (Array.isArray(mat) || !mat.isMeshStandardMaterial) return null;
  if (mat.transparent || mat.opacity < 1) return null;
  const g = mesh.geometry;
  if (!g?.attributes?.position || g.attributes.position.itemSize !== 3) return null;
  return { mesh, mat, key: materialKey(mat, mesh) };
}

/**
 * Merges static store geometries (gondola uprights, shelves, baseplates) into single draw calls per material.
 * Reduces 1,000s of shelf draw calls to <10, maintaining 60+ FPS on large supermarket floors.
 */
export function StaticMerge({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const state = useRef({
    frame: 0,
    offset: Math.floor(Math.random() * CHECK_EVERY),
    merged: [] as THREE.Mesh[],
    hidden: [] as THREE.Mesh[],
    printMerged: "",
  });

  const unmerge = () => {
    const s = state.current;
    for (const m of s.hidden) {
      m.visible = true;
      delete m.userData.staticMerged;
    }
    for (const m of s.merged) {
      m.removeFromParent();
      m.geometry.dispose();
    }
    s.hidden = [];
    s.merged = [];
    s.printMerged = "";
  };

  useEffect(
    () => () => {
      const s = state.current;
      for (const m of s.merged) {
        m.removeFromParent();
        m.geometry.dispose();
      }
      s.merged = [];
      s.hidden = [];
    },
    []
  );

  useFrame(() => {
    const g = group.current;
    const s = state.current;
    if (!g) return;
    if ((s.frame++ + s.offset) % CHECK_EVERY !== 0) return;

    g.updateWorldMatrix(true, true);
    const cands: Candidate[] = [];
    const walk = (o: THREE.Object3D) => {
      if (o.userData.noMerge || o.userData.isMergedOutput) return;
      if (o !== g && (o as THREE.Mesh).isMesh) {
        const hiddenByUs = !!o.userData.staticMerged;
        if (!hiddenByUs && !o.visible) return;
        const saved = o.visible;
        if (hiddenByUs) o.visible = true;
        const c = eligible(o);
        if (hiddenByUs) o.visible = saved;
        if (c) cands.push(c);
      }
      for (const ch of o.children) walk(ch);
    };
    walk(g);

    if (cands.length < 2) return;

    const print = cands
      .map((c) => `${c.mesh.id}:${c.mesh.geometry.id}:${c.key}`)
      .sort()
      .join(";");
    if (print === s.printMerged) return;

    unmerge();

    const byKey = new Map<string, Candidate[]>();
    for (const c of cands) {
      const list = byKey.get(c.key) ?? [];
      list.push(c);
      byKey.set(c.key, list);
    }

    const groupWorldInv = g.matrixWorld.clone().invert();

    for (const [, list] of byKey) {
      if (list.length < 2) continue;

      const geoms: THREE.BufferGeometry[] = [];
      for (const { mesh } of list) {
        const clone = mesh.geometry.clone();
        for (const name of Object.keys(clone.attributes)) {
          if (!KEEP.includes(name)) clone.deleteAttribute(name);
        }
        mesh.updateWorldMatrix(true, false);
        const rel = mesh.matrixWorld.clone().premultiply(groupWorldInv);
        clone.applyMatrix4(rel);
        geoms.push(clone);
      }

      const merged = mergeGeometries(geoms, false);
      geoms.forEach((geom) => geom.dispose());
      if (!merged) continue;

      const refMesh = list[0].mesh;
      const refMat = list[0].mat;
      const mesh = new THREE.Mesh(merged, refMat);
      mesh.castShadow = refMesh.castShadow;
      mesh.receiveShadow = refMesh.receiveShadow;
      mesh.userData.isMergedOutput = true;

      g.add(mesh);
      s.merged.push(mesh);

      for (const { mesh: orig } of list) {
        orig.visible = false;
        orig.userData.staticMerged = true;
        s.hidden.push(orig);
      }
    }

    s.printMerged = print;
  });

  return <group ref={group}>{children}</group>;
}
