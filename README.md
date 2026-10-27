# 🛒 tiend3o

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-3D-black?style=for-the-badge&logo=threedotjs)](https://r3f.docs.pmnd.rs/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean_%2F_Hexagonal-emerald?style=for-the-badge)](./docs/ARCHITECTURE.md)
[![pnpm](https://img.shields.io/badge/Package_Manager-pnpm-orange?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![Anthropic](https://img.shields.io/badge/AI-Claude_Sonnet_4-purple?style=for-the-badge)](https://www.anthropic.com/)

**tiend3o** is a next-generation 3D retail space planning and planogram optimization platform. It converts raw store spatial dimensions and 10-year transaction history into fully interactive 3D supermarkets, convenience stores, and commercial planograms.

Inspired by the modular 3D spatial assembly of **mus3o**, `tiend3o` repurposes high-performance 3D batching, automatic asset normalization, and first-person walkthroughs for modern retail merchandising.

---

## 📸 Key Features

- **🏬 Procedural Store Floor Discretization:** Generates symmetrical, clearance-compliant gondola aisles, modular 1.2m bays, and multi-tier shelf levels based on store width and length.
- **🥛 Real-World Retail Asset Pipeline:** Automatic bounding-box normalization (`computeModelFit`) ensures milk cartons, cereal boxes, bottles, and cans match precise physical dimensions without clipping.
- **⚡ 60+ FPS Draw-Call Merging:** `StaticMerge` combines thousands of modular shelf plates and uprights into single draw calls per material.
- **📊 10-Year Historical Basket Inference:** Leverages point-of-sale association rules (Support, Confidence, Lift) to co-locate complementary products (Milk + Cereal, Beer + Snacks).
- **🕹️ Multi-Perspective Viewport:**
  - **3D Orbit:** Full perspective view with free rotation.
  - **Top-Down:** 2D/3D architectural planogram view for space allocation.
  - **Walk Mode (WASD):** First-person customer walkthrough with collision detection.
- **🤖 Claude 4 Strategic Merchandising Advisor:** Ingests store geometry and category affinity scores to provide recommendations for revenue density and traffic flow.

---

## 🏗️ Architecture

`tiend3o` strictly implements **Clean Architecture** across a PNPM monorepo:

```text
tiend3o/
├── packages/
│   ├── core/      # Domain entities, Use Cases, Heuristic Slotting Engine
│   └── shared/    # Zod schemas, spatial grid generator, pure math bounds
├── apps/
│   ├── web/       # React 19 + Vite + React Three Fiber + TailwindCSS + Zustand
│   └── server/    # Express API + Anthropic Claude Sonnet 4 Integration
└── docs/          # Architecture, Planogram DSL, and Historical Inference guides
```

For full architecture details, refer to [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js:** `v20+` or `v24+`
- **Package Manager:** `pnpm` (required)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Jrgil20/tiend3o.git
cd tiend3o

# Install workspace dependencies with pnpm
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Optional: Add your ANTHROPIC_API_KEY for generative merchandising advice.
# Operates with deterministic heuristic optimizer if no API key is set.
```

### 3. Run Development Server

```bash
# Runs both apps/server (port 3001) and apps/web (port 5173) concurrently
pnpm run dev
```

- **Web Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`
- **Health Check:** `http://localhost:3001/health`

### 4. Run Tests & Typechecks

```bash
# Run unit tests across all packages and apps
pnpm run test

# Typecheck TypeScript codebase
pnpm run typecheck
```

---

## 📚 Documentation

- [System Architecture & Layer Separation](./docs/ARCHITECTURE.md)
- [Planogram Domain-Specific Language (DSL)](./docs/PLANOGRAM_DSL.md)
- [10-Year Historical Basket Inference](./docs/HISTORICAL_INFERENCE.md)

---

## 📄 License

MIT © [Jrgil20](https://github.com/Jrgil20)
