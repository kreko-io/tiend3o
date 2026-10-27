import * as THREE from "three";

/**
 * Creates a high-resolution, crisp CanvasTexture for 3D signage and displays.
 * Completely self-contained and deterministic without external web font dependencies.
 */
export function createSignTexture({
  width = 512,
  height = 128,
  backgroundColor = "#0284c7",
  textColor = "#ffffff",
  text,
  subtitle,
  subtitleColor = "#e0f2fe",
  borderColor,
  borderWidth = 4,
  badge,
  badgeBg = "#22c55e",
  badgeColor = "#ffffff",
  align = "center",
}: {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  text: string;
  subtitle?: string;
  subtitleColor?: string;
  borderColor?: string;
  borderWidth?: number;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  align?: "left" | "center";
}): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.width = 16;
    fallbackCanvas.height = 16;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Border if defined
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  // Draw optional badge (e.g. "OPEN" or aisle number)
  if (badge) {
    ctx.save();
    ctx.fillStyle = badgeBg;
    ctx.roundRect ? ctx.roundRect(width - 90, 14, 76, 32, 6) : ctx.fillRect(width - 90, 14, 76, 32);
    ctx.fill();
    ctx.fillStyle = badgeColor;
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badge, width - 52, 30);
    ctx.restore();
  }

  // Text setup
  ctx.fillStyle = textColor;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  const startX = align === "center" ? width / 2 : 28;
  const mainY = subtitle ? height * 0.4 : height * 0.5;

  ctx.font = `bold ${Math.round(height * 0.38)}px sans-serif`;
  ctx.fillText(text, startX, mainY);

  if (subtitle) {
    ctx.fillStyle = subtitleColor;
    ctx.font = `600 ${Math.round(height * 0.22)}px sans-serif`;
    ctx.fillText(subtitle, startX, height * 0.74);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates simulated POS screen display for checkout touch monitors.
 */
export function createPosScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - dark modern POS UI
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, 256, 192);

  // Top header bar
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(0, 0, 256, 28);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("TIEND3O POS - CAJA ACTIVA", 10, 19);

  // Simulated items
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Cerveza Artesanal 330ml   x2   $17.00", 12, 54);
  ctx.fillText("Papas Fritas Gourmet 180g x1    $3.90", 12, 74);
  ctx.fillText("Leche Entera 1L          x1    $1.45", 12, 94);
  ctx.fillText("Avena en Hojuelas 500g   x1    $2.10", 12, 114);

  // Divider
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(10, 134);
  ctx.lineTo(246, 134);
  ctx.stroke();

  // Total
  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("TOTAL: $24.45", 12, 160);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "11px sans-serif";
  ctx.fillText("ESPERANDO PAGO...", 12, 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates welcome mat texture for entrance.
 */
export function createWelcomeMatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Rubber ribbed mat border
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, 512, 256);

  // Inner carpet
  ctx.fillStyle = "#334155";
  ctx.fillRect(20, 20, 472, 216);

  // Border line
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.strokeRect(26, 26, 460, 204);

  // Logo text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BIENVENIDOS", 256, 105);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("TIEND3O SMART RETAIL", 256, 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
