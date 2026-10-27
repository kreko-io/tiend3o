export class AffinityScore {
  constructor(
    public readonly support: number,
    public readonly confidence: number,
    public readonly lift: number,
    public readonly coOccurrenceCount: number
  ) {
    if (support < 0 || support > 1) {
      throw new Error("Support must be between 0 and 1");
    }
    if (confidence < 0 || confidence > 1) {
      throw new Error("Confidence must be between 0 and 1");
    }
  }

  /**
   * Lift > 1.2 indicates strong complementary purchase relationship
   * (e.g. Milk + Cereal or Beer + Snacks).
   */
  isComplementary(): boolean {
    return this.lift >= 1.2;
  }
}
