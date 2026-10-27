# 📐 Planogram & Retail Spatial DSL

`tiend3o` avoids having AI or external systems invent unconstrained 3D floating-point coordinates. Instead, space is represented through a deterministic **Planogram Domain-Specific Language (DSL)**.

---

## 🏬 Spatial Hierarchy

```text
StoreSpace (Width x Length x Height)
  └── Perimeter Corridors & Checkout Zone
  └── GondolaAisle (Aisle 1A, Aisle 1B...)
        └── GondolaBay (Modular 1.2m section)
              └── ShelfLevel (0 = Bottom, 1 = Knee, 2 = Eye-Level, 3 = Top)
                    └── FacingSlot (Specific product facing & depth capacity)
```

---

## 🗂️ Data Schema Example

```typescript
{
  "id": "store-main-layout",
  "width": 24.0,       // 24 meters wide (X axis)
  "length": 36.0,      // 36 meters long (Z axis)
  "ceilingHeight": 4.5,
  "aisleWidth": 2.4,   // 2.4 meter walkway between gondolas
  "gondolas": [
    {
      "id": "aisle-1-left",
      "code": "Aisle 1A",
      "side": "left",
      "start": { "x": -8.4, "y": 0, "z": -9.6 },
      "length": 19.2,
      "height": 2.1,
      "depth": 0.6,
      "bays": [
        {
          "id": "aisle-1-left-bay-0",
          "bayIndex": 0,
          "width": 1.2,
          "shelves": [
            {
              "levelIndex": 2, // Eye-level (Premium revenue slot)
              "heightOffset": 1.45,
              "slots": [
                {
                  "id": "aisle-1-left-bay0-shelf2-slot0",
                  "slotIndex": 0,
                  "productId": "prod-milk-whole",
                  "facingCount": 2,
                  "capacityDepth": 6
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🎯 Coordinate Discretization Benefits

1. **Zero Mesh Interpenetration**:
   Products never overlap or clip through shelves; slot dimensions are bound to real-world bounding boxes.
2. **Deterministic Regeneration**:
   The store floor can be resized dynamically (e.g. from 16m to 32m) and aisles will re-tile symmetrically with standard retail clearances.
3. **Low Token Overhead**:
   AI recommendations operate over semantic identifiers (`Aisle 1A, Bay 0, Shelf 2`) rather than calculating float matrices.
