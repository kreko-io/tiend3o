import type {
  StoreSpace,
  StoreFormat,
  StoreFixture,
  FloorZone,
  ScanDetection,
  ShelfLevel,
  FacingSlot,
} from "./schema";
import { generateStoreLayout } from "./grid";

export interface StoreScanPreset {
  id: string;
  name: string;
  subtitle: string;
  format: StoreFormat;
  badge: string;
  description: string;
  photoTitle: string;
  photoUrl: string;
  photoDimensions: { width: number; height: number };
  detections: ScanDetection[];
  diagnostics: string[];
  optimizationGains: {
    revenueImprovement: string;
    hotZoneGain: string;
    hazardsResolved: number;
    mbaPairsAdjacent: number;
  };
  generateSpace: (isOptimized: boolean) => StoreSpace;
}

/**
 * Helper to build a shelf level with slots
 */
function createShelf(levelIndex: number, heightOffset: number, productIds: (string | null)[]): ShelfLevel {
  return {
    levelIndex,
    heightOffset,
    slots: productIds.map((pid, idx) => ({
      id: `slot-lvl${levelIndex}-${idx}`,
      slotIndex: idx,
      productId: pid,
      facingCount: 1,
      capacityDepth: 4,
    })),
  };
}

// -------------------------------------------------------------
// PRESET 1: BODEGA / ABASTO DE ESQUINA (INTERIOR MOSTRADOR)
// -------------------------------------------------------------
export const PRESET_BODEGA_ESQUINA: StoreScanPreset = {
  id: "preset-bodega-esquina",
  name: "Bodega / Abasto de Esquina",
  subtitle: "Mostrador en L, Vitrina con QR y Estante de Pared",
  format: "corner_bodega",
  badge: "Comercio Tradicional",
  description:
    "Típica bodega/abasto de barrio latinoamericano. Atención tras mostrador en L con vitrina exhibidora de vidrio, balanza digital, código QR de pago, estantería saturada a la pared y exhibidor de alambre para snacks.",
  photoTitle: "Foto de Escaneo: Mostrador y Estantería Bodega Central",
  photoUrl: "/assets/scan_bodega.svg",
  photoDimensions: { width: 800, height: 500 },
  detections: [
    {
      id: "det-1",
      label: "Vitrina Mostrador de Vidrio (con Balanza y QR)",
      fixtureType: "glass_counter_case",
      confidence: 0.984,
      bbox: { x: 120, y: 180, width: 340, height: 260 },
      color: "#22c55e",
      skusDetected: 18,
    },
    {
      id: "det-2",
      label: "Estantería de Pared tras Mostrador",
      fixtureType: "wall_shelving",
      confidence: 0.976,
      bbox: { x: 60, y: 30, width: 520, height: 180 },
      color: "#38bdf8",
      skusDetected: 42,
    },
    {
      id: "det-3",
      label: "Exhibidor Metálico de Snacks",
      fixtureType: "wire_snack_rack",
      confidence: 0.958,
      bbox: { x: 500, y: 190, width: 140, height: 270 },
      color: "#f59e0b",
      skusDetected: 12,
    },
    {
      id: "det-4",
      label: "Nevera Vertical de Bebidas y Lácteos",
      fixtureType: "cooler_unit",
      confidence: 0.991,
      bbox: { x: 650, y: 80, width: 130, height: 380 },
      color: "#a855f7",
      skusDetected: 24,
    },
    {
      id: "det-5",
      label: "Isla / Mueble de Panadería y Arepas",
      fixtureType: "produce_island",
      confidence: 0.942,
      bbox: { x: 20, y: 260, width: 110, height: 200 },
      color: "#ec4899",
      skusDetected: 8,
    },
  ],
  diagnostics: [
    "⚠️ RIESGO ERGONÓMICO CRÍTICO: Galones pesados de Aceite Vegetal (5kg) y sacos de harina colocados en el nivel superior del estante de pared (riesgo de caída sobre el bodeguero).",
    "📉 MARGEN OCULTO: Chocolates finos, afeitadoras y atún de alto margen almacenados en el fondo oscuro de la vitrina en lugar de frente a la vista del cliente junto al QR.",
    "🔗 LIFT MBA PERDIDO: Exhibidor de snacks salados colocado en la esquina izquierda alejado del punto de cobro y de las bebidas frías (Lift 2.8 desaprovechado).",
  ],
  optimizationGains: {
    revenueImprovement: "+24.8%",
    hotZoneGain: "+76%",
    hazardsResolved: 2,
    mbaPairsAdjacent: 6,
  },
  generateSpace: (isOptimized: boolean): StoreSpace => {
    const width = 8.6;
    const length = 10.2;
    const ceilingHeight = 3.2;

    const zones: FloorZone[] = [
      {
        id: "zone-sales",
        name: "Área de Clientes y Espera",
        zoneType: "retail_sales",
        minX: -4.0,
        maxX: 4.0,
        minZ: 0.6,
        maxZ: 4.8,
        material: "terrazzo",
        color: "#e2e8f0",
      },
      {
        id: "zone-cashier",
        name: "Área de Bodeguero tras Mostrador",
        zoneType: "checkout_counter",
        minX: -4.0,
        maxX: 1.5,
        minZ: -4.8,
        maxZ: 0.3,
        material: "wood",
        color: "#78350f",
      },
      {
        id: "zone-backroom",
        name: "Depósito / Trastienda",
        zoneType: "backroom_storage",
        minX: 1.8,
        maxX: 4.0,
        minZ: -4.8,
        maxZ: -0.6,
        material: "concrete",
        color: "#94a3b8",
      },
      {
        id: "zone-porch",
        name: "Acera y Entrada",
        zoneType: "entrance_porch",
        minX: -2.0,
        maxX: 2.0,
        minZ: 4.8,
        maxZ: 5.6,
        material: "brick",
        color: "#cbd5e1",
      },
    ];

    // Fixtures definition based on As-Is vs Optimized
    const fixtures: StoreFixture[] = [];

    // 1. Vitrina Mostrador de Vidrio (Frontal)
    fixtures.push({
      id: "fixture-glass-counter-front",
      name: "Vitrina Mostrador Frontal (con Balanza y QR)",
      fixtureType: "glass_counter_case",
      position: { x: -1.2, y: 0, z: 0.4 },
      dimensions: { width: 2.6, height: 1.05, depth: 0.75 },
      rotationY: 0,
      metadata: { hasScale: true, hasQr: true, hasPosTerminal: true },
      shelves: isOptimized
        ? [
            // Level 0 (Piso): Servilletas, bolsas
            createShelf(0, 0.25, ["prod-paper-towels", "prod-paper-towels", "prod-rice-jasmine"]),
            // Level 1 (Nivel Ojos en Vitrina frente a QR): Atún, Chocolates, Afeitadoras (Alto margen)
            createShelf(1, 0.65, [
              "prod-tuna-can",
              "prod-tuna-can",
              "prod-chocolate-dark",
              "prod-chocolate-dark",
              "prod-shampoo",
            ]),
          ]
        : [
            // As-Is: Chocolates abajo ocultos, servilletas arriba
            createShelf(0, 0.25, ["prod-chocolate-dark", "prod-shampoo", "prod-tuna-can"]),
            createShelf(1, 0.65, ["prod-paper-towels", "prod-paper-towels", "prod-rice-jasmine"]),
          ],
    });

    // 2. Vitrina Mostrador en L (Lateral)
    fixtures.push({
      id: "fixture-glass-counter-side",
      name: "Mostrador Retorno Lateral",
      fixtureType: "glass_counter_case",
      position: { x: 0.45, y: 0, z: -0.75 },
      dimensions: { width: 1.6, height: 1.05, depth: 0.75 },
      rotationY: Math.PI / 2,
      metadata: { hasScale: false, hasQr: false },
      shelves: [
        createShelf(0, 0.25, ["prod-tomato-sauce", "prod-tomato-sauce"]),
        createShelf(1, 0.65, ["prod-cookies-artisan", "prod-cookies-artisan"]),
      ],
    });

    // 3. Exhibidor Metálico de Snacks (WireSnackRack)
    fixtures.push({
      id: "fixture-snack-rack",
      name: "Exhibidor Metálico Vertical de Snacks",
      fixtureType: "wire_snack_rack",
      // As-Is: en la esquina izquierda trasera; Optimized: justo al lado del cliente frente al QR!
      position: isOptimized ? { x: 1.45, y: 0, z: 0.75 } : { x: -3.6, y: 0, z: 2.5 },
      dimensions: { width: 0.65, height: 1.65, depth: 0.45 },
      rotationY: isOptimized ? -Math.PI / 8 : 0,
      metadata: { frameColor: "#0284c7" },
      shelves: [
        createShelf(0, 0.35, ["prod-pretzels", "prod-pretzels"]),
        createShelf(1, 0.75, ["prod-chips-salted", "prod-chips-salted"]),
        createShelf(2, 1.15, ["prod-chips-salted", "prod-pretzels"]),
      ],
    });

    // 4. Estantería de Pared tras Mostrador (WallShelving)
    fixtures.push({
      id: "fixture-wall-shelving",
      name: "Estantería de Pared Bodeguero",
      fixtureType: "wall_shelving",
      position: { x: -1.4, y: 0, z: -4.8 },
      dimensions: { width: 4.8, height: 2.8, depth: 0.45 },
      rotationY: 0,
      shelves: isOptimized
        ? [
            // Level 0 (Piso): Galones pesados de Aceite 5L y Harina
            createShelf(0, 0.15, [
              "prod-olive-oil",
              "prod-olive-oil",
              "prod-cereal-oats",
              "prod-cereal-oats",
            ]),
            // Level 1: Café molido y Leche condensada
            createShelf(1, 0.85, ["prod-milk-almond", "prod-milk-almond", "prod-bread-artisan", "prod-bread-artisan"]),
            // Level 2 (Nivel Ojos): Salsas, Conservas, Licores
            createShelf(2, 1.55, ["prod-pasta-spaghetti", "prod-pasta-spaghetti", "prod-beer-craft", "prod-beer-craft"]),
            // Level 3 (Tope liviano): Fósforos, servilletas
            createShelf(3, 2.25, ["prod-dish-soap", "prod-dish-soap"]),
          ]
        : [
            // As-Is (Infracción ergonómica): Aceite pesado arriba, papel abajo
            createShelf(0, 0.15, ["prod-dish-soap", "prod-dish-soap", "prod-milk-almond"]),
            createShelf(1, 0.85, ["prod-pasta-spaghetti", "prod-bread-artisan"]),
            createShelf(2, 1.55, ["prod-beer-craft", "prod-tomato-sauce"]),
            createShelf(3, 2.25, [
              "prod-olive-oil",
              "prod-olive-oil",
              "prod-cereal-oats",
            ]),
          ],
    });

    // 5. Nevera Vertical de Bebidas y Lácteos (CoolerUnit)
    fixtures.push({
      id: "fixture-cooler-unit",
      name: "Nevera Vertical Doble Puerta (Bebidas Frías)",
      fixtureType: "cooler_unit",
      position: { x: -3.9, y: 0, z: -1.8 },
      dimensions: { width: 1.7, height: 2.1, depth: 0.75 },
      rotationY: Math.PI / 2,
      metadata: { isRefrigerated: true, lightColor: "#38bdf8" },
      shelves: [
        createShelf(0, 0.25, ["prod-soda-cola", "prod-soda-cola", "prod-juice-orange"]),
        createShelf(1, 0.75, ["prod-beer-craft", "prod-beer-craft", "prod-beer-craft"]),
        createShelf(2, 1.25, ["prod-milk-whole", "prod-milk-whole"]),
        createShelf(3, 1.75, ["prod-juice-orange", "prod-juice-orange"]),
      ],
    });

    // 6. Isla / Canasta de Panadería y Arepas (ProduceIsland)
    fixtures.push({
      id: "fixture-produce-bread",
      name: "Exhibidor Inclinado de Pan y Arepas",
      fixtureType: "produce_island",
      position: { x: 3.2, y: 0, z: 1.8 },
      dimensions: { width: 1.4, height: 1.1, depth: 0.9 },
      rotationY: -Math.PI / 6,
      shelves: [
        createShelf(0, 0.35, ["prod-bread-artisan", "prod-bread-artisan"]),
        createShelf(1, 0.75, ["prod-cookies-artisan", "prod-cookies-artisan"]),
      ],
    });

    // 7. Área de Trastienda / Depósito
    fixtures.push({
      id: "fixture-backroom-rack",
      name: "Estantería de Almacén Trastienda",
      fixtureType: "backroom_storage",
      position: { x: 2.9, y: 0, z: -3.5 },
      dimensions: { width: 2.0, height: 2.4, depth: 0.8 },
      rotationY: 0,
      shelves: [
        createShelf(0, 0.2, ["prod-laundry-detergent", "prod-laundry-detergent"]),
        createShelf(1, 1.1, ["prod-charcoal-bag", "prod-charcoal-bag"]),
      ],
    });

    // 8. Estación de Café & Espresso Bar
    fixtures.push({
      id: "fixture-cafe-station",
      name: "Estación de Cafetería & Espresso Bar",
      fixtureType: "cafe_station",
      position: { x: 2.8, y: 0, z: -1.2 },
      dimensions: { width: 2.0, height: 1.05, depth: 0.8 },
      rotationY: 0,
      shelves: [],
    });

    return {
      id: "space-bodega-esquina",
      name: "Bodega / Abasto de Esquina",
      format: "corner_bodega",
      width,
      length,
      ceilingHeight,
      entrancePosition: { x: 0, y: 0, z: length / 2 - 0.5 },
      checkoutPosition: { x: -1.2, y: 0, z: 0.4 },
      aisleWidth: 1.8,
      gondolas: [], // In bodega, fixtures handle product placement
      fixtures,
      zones,
    };
  },
};

// -------------------------------------------------------------
// PRESET 2: TIENDA DE BARRIO CON EXHIBICIÓN EXTERIOR
// -------------------------------------------------------------
export const PRESET_TIENDA_BARRIO: StoreScanPreset = {
  id: "preset-tienda-barrio",
  name: "Tienda con Exhibición Exterior",
  subtitle: "Atención por Ventana / Reja y Snack Rack en Acera",
  format: "neighborhood_store",
  badge: "Venta Exterior / Reja",
  description:
    "Comercio de barrio con rejas metálicas de seguridad y venta al público exterior. Mostrador asomado a la fachada, exhibidor de paquetes en la acera y estantería profunda al fondo.",
  photoTitle: "Foto de Escaneo: Fachada Comercial con Reja y Vitrina",
  photoUrl: "/assets/scan_fachada.svg",
  photoDimensions: { width: 800, height: 500 },
  detections: [
    {
      id: "det-b1",
      label: "Ventana / Mostrador de Atención Exterior",
      fixtureType: "glass_counter_case",
      confidence: 0.978,
      bbox: { x: 220, y: 160, width: 360, height: 240 },
      color: "#22c55e",
      skusDetected: 14,
    },
    {
      id: "det-b2",
      label: "Rack de Snacks en la Acera",
      fixtureType: "wire_snack_rack",
      confidence: 0.965,
      bbox: { x: 100, y: 220, width: 110, height: 250 },
      color: "#f59e0b",
      skusDetected: 16,
    },
    {
      id: "det-b3",
      label: "Estantería Trasera de Granos y Enlatados",
      fixtureType: "wall_shelving",
      confidence: 0.952,
      bbox: { x: 240, y: 50, width: 340, height: 130 },
      color: "#38bdf8",
      skusDetected: 36,
    },
    {
      id: "det-b4",
      label: "Nevera de Helados y Refrescos en la Entrada",
      fixtureType: "cooler_unit",
      confidence: 0.985,
      bbox: { x: 590, y: 180, width: 140, height: 260 },
      color: "#a855f7",
      skusDetected: 18,
    },
  ],
  diagnostics: [
    "⚠️ EXPOSICIÓN Y RIESGO: Snacks de alta demanda ubicados fuera del alcance visual del mostrador.",
    "📉 FLUJO DE PAGO: Falta de señalización de pagos QR visible desde el exterior de la reja.",
    "🔗 VENTA CRUZADA: Bebidas frías desconectadas de los combos de galletas y ponqués.",
  ],
  optimizationGains: {
    revenueImprovement: "+21.4%",
    hotZoneGain: "+68%",
    hazardsResolved: 1,
    mbaPairsAdjacent: 5,
  },
  generateSpace: (isOptimized: boolean): StoreSpace => {
    const width = 9.0;
    const length = 11.0;
    const ceilingHeight = 3.2;

    const zones: FloorZone[] = [
      {
        id: "zone-ext-sidewalk",
        name: "Acera Exterior / Transeúntes",
        zoneType: "entrance_porch",
        minX: -4.5,
        maxX: 4.5,
        minZ: 2.0,
        maxZ: 5.5,
        material: "concrete",
        color: "#94a3b8",
      },
      {
        id: "zone-counter-window",
        name: "Mostrador Fachada",
        zoneType: "checkout_counter",
        minX: -2.0,
        maxX: 2.0,
        minZ: 1.0,
        maxZ: 2.0,
        material: "terrazzo",
        color: "#cbd5e1",
      },
      {
        id: "zone-interior-stock",
        name: "Interior de Tienda / Despensa",
        zoneType: "retail_sales",
        minX: -4.5,
        maxX: 4.5,
        minZ: -5.5,
        maxZ: 1.0,
        material: "tiles",
        color: "#f1f5f9",
      },
    ];

    const fixtures: StoreFixture[] = [
      {
        id: "fixture-exterior-counter",
        name: "Mostrador de Reja con Ventana Comercial",
        fixtureType: "glass_counter_case",
        position: { x: 0, y: 0, z: 1.6 },
        dimensions: { width: 3.2, height: 1.1, depth: 0.8 },
        rotationY: 0,
        metadata: { hasQr: true, hasScale: true, isGrilleWindow: true },
        shelves: [
          createShelf(0, 0.25, ["prod-tuna-can", "prod-tomato-sauce"]),
          createShelf(1, 0.65, isOptimized ? ["prod-chocolate-dark", "prod-chips-salted"] : ["prod-dish-soap"]),
        ],
      },
      {
        id: "fixture-sidewalk-rack",
        name: "Exhibidor en Acera para Transeúntes",
        fixtureType: "wire_snack_rack",
        position: isOptimized ? { x: -2.2, y: 0, z: 2.4 } : { x: -3.8, y: 0, z: 3.5 },
        dimensions: { width: 0.65, height: 1.65, depth: 0.45 },
        rotationY: Math.PI / 6,
        shelves: [
          createShelf(0, 0.35, ["prod-chips-salted", "prod-chips-salted"]),
          createShelf(1, 0.75, ["prod-pretzels", "prod-pretzels"]),
          createShelf(2, 1.15, ["prod-chocolate-dark", "prod-chocolate-dark"]),
        ],
      },
      {
        id: "fixture-back-wall-shelves",
        name: "Estantería Interior Profunda",
        fixtureType: "wall_shelving",
        position: { x: 0, y: 0, z: -5.1 },
        dimensions: { width: 6.0, height: 2.8, depth: 0.5 },
        rotationY: 0,
        shelves: [
          createShelf(0, 0.15, ["prod-olive-oil", "prod-cereal-oats"]),
          createShelf(1, 0.85, ["prod-milk-almond", "prod-pasta-spaghetti"]),
          createShelf(2, 1.55, ["prod-beer-craft", "prod-bread-artisan"]),
          createShelf(3, 2.25, ["prod-laundry-detergent", "prod-paper-towels"]),
        ],
      },
      {
        id: "fixture-icecream-cooler",
        name: "Nevera de Helados y Bebidas",
        fixtureType: "cooler_unit",
        position: { x: 2.6, y: 0, z: 2.2 },
        dimensions: { width: 1.6, height: 1.8, depth: 0.75 },
        rotationY: -Math.PI / 4,
        shelves: [
          createShelf(0, 0.25, ["prod-soda-cola", "prod-juice-orange"]),
          createShelf(1, 0.75, ["prod-beer-craft", "prod-milk-whole"]),
        ],
      },
    ];

    return {
      id: "space-tienda-barrio",
      name: "Tienda con Exhibición Exterior",
      format: "neighborhood_store",
      width,
      length,
      ceilingHeight,
      entrancePosition: { x: 0, y: 0, z: 3.0 },
      checkoutPosition: { x: 0, y: 0, z: 1.6 },
      aisleWidth: 2.0,
      gondolas: [],
      fixtures,
      zones,
    };
  },
};

// -------------------------------------------------------------
// PRESET 3: SUPERMERCADO / RETAIL MODERNO COMPLETO
// -------------------------------------------------------------
export const PRESET_SUPERMERCADO_MODERNO: StoreScanPreset = {
  id: "preset-supermercado-moderno",
  name: "Supermercado / Retail Moderno",
  subtitle: "Pasillos Centrales, Zona de Frutas, Cajas y Trastienda",
  format: "modern_supermarket",
  badge: "Retail Moderno",
  description:
    "Distribución comercial moderna con islas de frescos en la entrada, pasillos centrales de góndolas para secos y limpieza, línea perimetral de frío, batería de cajas de cobro y trastienda con estibas de almacenaje.",
  photoTitle: "Foto de Escaneo: Pasillos y Frescos en Supermercado",
  photoUrl: "/assets/scan_supermercado.svg",
  photoDimensions: { width: 800, height: 500 },
  detections: [
    {
      id: "det-s1",
      label: "Batería de Cajas Registradoras (4 Líneas)",
      fixtureType: "glass_counter_case",
      confidence: 0.992,
      bbox: { x: 80, y: 320, width: 440, height: 140 },
      color: "#22c55e",
      skusDetected: 32,
    },
    {
      id: "det-s2",
      label: "Pasillos Centrales de Góndolas (8 Módulos)",
      fixtureType: "gondola",
      confidence: 0.988,
      bbox: { x: 220, y: 80, width: 380, height: 230 },
      color: "#38bdf8",
      skusDetected: 96,
    },
    {
      id: "det-s3",
      label: "Isla de Frutas y Panadería",
      fixtureType: "produce_island",
      confidence: 0.964,
      bbox: { x: 50, y: 120, width: 160, height: 180 },
      color: "#ec4899",
      skusDetected: 24,
    },
    {
      id: "det-s4",
      label: "Mural Frigorífico Perimetral",
      fixtureType: "cooler_unit",
      confidence: 0.979,
      bbox: { x: 620, y: 60, width: 140, height: 360 },
      color: "#a855f7",
      skusDetected: 48,
    },
  ],
  diagnostics: [
    "⚠️ PRODUCTOS PESADOS EN ALTURA: Detergentes de 4L ubicados en Nivel 3.",
    "📉 ZONA CALIENTE SUB-UTILIZADA: Artículos de bajo margen en los Niveles 1 y 2.",
    "🔗 CO-UBICACIÓN MBA: Cerveza y snacks en pasillos no adyacentes.",
  ],
  optimizationGains: {
    revenueImprovement: "+208%",
    hotZoneGain: "+94%",
    hazardsResolved: 6,
    mbaPairsAdjacent: 8,
  },
  generateSpace: (isOptimized: boolean): StoreSpace => {
    // Generates the full 24x36m modern supermarket with gondolas, zones and perimeter units
    const width = 24.0;
    const length = 36.0;
    const ceilingHeight = 4.5;

    const zones: FloorZone[] = [
      {
        id: "zone-super-retail",
        name: "Planta Principal de Ventas",
        zoneType: "retail_sales",
        minX: -12.0,
        maxX: 12.0,
        minZ: -12.0,
        maxZ: 10.0,
        material: "tiles",
        color: "#f1f5f9",
      },
      {
        id: "zone-super-checkouts",
        name: "Zona de Cajas y Salida",
        zoneType: "checkout_counter",
        minX: -12.0,
        maxX: 4.0,
        minZ: 10.0,
        maxZ: 18.0,
        material: "terrazzo",
        color: "#e2e8f0",
      },
      {
        id: "zone-super-produce",
        name: "Mercado de Frescos y Panadería",
        zoneType: "produce_area",
        minX: 4.0,
        maxX: 12.0,
        minZ: 10.0,
        maxZ: 18.0,
        material: "wood",
        color: "#fef3c7",
      },
      {
        id: "zone-super-backroom",
        name: "Trastienda y Muelle de Carga",
        zoneType: "backroom_storage",
        minX: -12.0,
        maxX: 12.0,
        minZ: -18.0,
        maxZ: -12.0,
        material: "concrete",
        color: "#94a3b8",
      },
    ];

    const fixtures: StoreFixture[] = [
      // Fresh produce islands
      {
        id: "fixture-produce-super-1",
        name: "Isla de Frutas Frescas",
        fixtureType: "produce_island",
        position: { x: 7.5, y: 0, z: 12.5 },
        dimensions: { width: 2.2, height: 1.1, depth: 1.4 },
        rotationY: 0,
        shelves: [
          createShelf(0, 0.35, ["prod-bread-artisan", "prod-bread-artisan"]),
          createShelf(1, 0.75, ["prod-cookies-artisan", "prod-cookies-artisan"]),
        ],
      },
      // Perimeter beverage reach-in coolers
      {
        id: "fixture-super-cooler-wall",
        name: "Línea de Frío Mural (Lácteos y Cervezas)",
        fixtureType: "cooler_unit",
        position: { x: -11.6, y: 0, z: 0 },
        dimensions: { width: 6.8, height: 2.2, depth: 0.8 },
        rotationY: Math.PI / 2,
        metadata: { isRefrigerated: true },
        shelves: [
          createShelf(0, 0.25, ["prod-soda-cola", "prod-soda-cola"]),
          createShelf(1, 0.75, ["prod-beer-craft", "prod-beer-craft"]),
        ],
      },
      // Backroom storage pallets & racks
      {
        id: "fixture-super-backroom-pallet",
        name: "Estibas de Trastienda",
        fixtureType: "backroom_storage",
        position: { x: 0, y: 0, z: -15.5 },
        dimensions: { width: 4.5, height: 2.8, depth: 1.2 },
        rotationY: 0,
        shelves: [],
      },
      // Coffee & Espresso Station
      {
        id: "fixture-super-cafe-station",
        name: "Estación de Cafetería & Espresso Bar",
        fixtureType: "cafe_station",
        position: { x: 7.5, y: 0, z: 6.5 },
        dimensions: { width: 2.6, height: 1.05, depth: 0.85 },
        rotationY: -Math.PI / 2,
        shelves: [],
      },
    ];

    const baseSpace = generateStoreLayout({
      storeWidth: width,
      storeLength: length,
      bayCountPerAisle: 8,
    });

    return {
      ...baseSpace,
      id: "space-supermercado-moderno",
      name: "Supermercado / Retail Moderno",
      format: "modern_supermarket",
      fixtures,
      zones,
    };
  },
};

export const ALL_SCAN_PRESETS: StoreScanPreset[] = [
  PRESET_BODEGA_ESQUINA,
  PRESET_TIENDA_BARRIO,
  PRESET_SUPERMERCADO_MODERNO,
];
