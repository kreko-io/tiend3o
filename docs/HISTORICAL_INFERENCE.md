# 📊 10-Year Historical Inference & Basket Analysis

`tiend3o` leverages transaction history from retail point-of-sale (POS) systems over a 10-year period to optimize product placement, category adjacency, and cross-merchandising.

---

## 🧮 Statistical Foundation: Market Basket Analysis

The association between products is modeled using three core metrics:

### 1. Support
The proportion of all shopping baskets that contain both Product $A$ and Product $B$:

$$\text{Support}(A \rightarrow B) = \frac{\text{Baskets containing } A \text{ and } B}{\text{Total Baskets}}$$

### 2. Confidence
The likelihood that a shopper who purchases Product $A$ also purchases Product $B$:

$$\text{Confidence}(A \rightarrow B) = \frac{\text{Support}(A \rightarrow B)}{\text{Support}(A)}$$

### 3. Lift
The ratio of observed joint purchase compared to what would be expected if $A$ and $B$ were statistically independent:

$$\text{Lift}(A \rightarrow B) = \frac{\text{Confidence}(A \rightarrow B)}{\text{Support}(B)}$$

- **Lift = 1.0**: $A$ and $B$ are completely independent.
- **Lift > 1.2**: Strong positive affinity / complementary purchase (e.g. Milk + Cereal, Beer + Chips, Pasta + Tomato Sauce).
- **Lift < 1.0**: Substitutive relationship (buying $A$ decreases likelihood of buying $B$).

---

## 🏬 Merchandising Strategy Rules

Based on 10-year transaction logs, `tiend3o` enforces the following slotting logic:

| Rule | Rationale | Example Placement |
|---|---|---|
| **Complementary Eye-Level Pairings** | Products with Lift > 2.0 are placed in facing gondolas or adjacent bays. | Whole Milk (Aisle 1A, Bay 0) opposite Toasted Oats (Aisle 1B, Bay 0) |
| **Destination vs. Impulse Placement** | High sales velocity staples are positioned toward the rear to encourage foot traffic through high-margin impulse aisles. | Milk cartons located in rear bays; premium snacks at aisle endcaps |
| **Eye-Level Margin Maximization** | Shelves at 1.2m–1.6m (Levels 1 and 2) receive products with the highest $\text{Margin} \times \text{Price} \times \text{Velocity}$ score. | Premium organic milk and craft beer placed at eye level |
| **Heavy / Bulky Base Shelving** | Items with high cubic volume or weight are placed on Level 0 to minimize ergonomic strain and maximize stability. | 2L Soda bottles and 5L laundry jugs on bottom shelf |
