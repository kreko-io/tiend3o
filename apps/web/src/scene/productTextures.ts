import * as THREE from "three";
import type { Product } from "@tiend3o/shared";

const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Generates an ultra-crisp retail packaging wrap texture for each product.
 * Produces realistic labels with brand crests, barcodes, nutritional badges, and volume stamps.
 */
export function getProductPackagingTexture(product: Product): THREE.CanvasTexture {
  if (textureCache.has(product.id)) {
    return textureCache.get(product.id)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    textureCache.set(product.id, fallback);
    return fallback;
  }

  const { name, category, color, price } = product;

  // Base background color
  ctx.fillStyle = color || "#0284c7";
  ctx.fillRect(0, 0, 512, 512);

  // Top decorative band
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, 512, 70);

  // Brand Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.textAlign = "center";
  const brandName = name.split(" ")[0].toUpperCase();
  ctx.fillText(brandName, 256, 45);

  // Center Product Title Plaque
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(40, 110, 432, 180);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 114, 424, 172);

  // Product Main Name
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 34px sans-serif";
  const words = name.split(" ");
  const line1 = words.slice(0, 2).join(" ");
  const line2 = words.slice(2, 5).join(" ");
  ctx.fillText(line1, 256, 175);
  if (line2) {
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText(line2, 256, 220);
  }

  // Category Icon / Graphical Stamp in Center
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(256, 260, 16, 0, Math.PI * 2);
  ctx.fill();

  // Category specific graphics
  if (category === "dairy") {
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("🥛 100% PURA LECHE", 256, 335);
  } else if (category === "beverages") {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("★ BEBIDA REFRESCANTE ★", 256, 335);
  } else if (category === "snacks") {
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("CRUJIENTE & DELICIOSO", 256, 335);
  } else if (category === "canned_goods") {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("SELECCIÓN PREMIUM", 256, 335);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("CALIDAD GARANTIZADA", 256, 335);
  }

  // Price & Weight Badge
  ctx.fillStyle = "#facc15"; // Golden yellow badge
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(160, 365, 192, 54, 12) : ctx.fillRect(160, 365, 192, 54);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(`$${price.toFixed(2)}`, 256, 403);

  // Barcode Graphic at Bottom Right
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(320, 440, 150, 55);
  ctx.fillStyle = "#000000";
  for (let i = 0; i < 28; i++) {
    const w = (i % 3 === 0) ? 4 : 2;
    ctx.fillRect(330 + i * 4.6, 445, w, 35);
  }
  ctx.font = "10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("7 701234 567890", 395, 490);

  // Nutritional / Seal Badge on Left
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(40, 440, 140, 55);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("CALORÍAS: 140", 50, 458);
  ctx.fillText("AZÚCARES: 2g", 50, 473);
  ctx.fillText("ORIGEN CERTIFICADO", 50, 488);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  textureCache.set(product.id, texture);
  return texture;
}
