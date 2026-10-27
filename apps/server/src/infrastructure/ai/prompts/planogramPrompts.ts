export function buildPlanogramRecommendationPrompt(params: {
  storeDimensions: string;
  topCategories: string[];
  highAffinityPairs: string[];
}): string {
  return `You are a Senior Retail Merchandising and Planogram Architect.
Analyze the following store layout constraints and provide strategic placement advice:
- Store dimensions: ${params.storeDimensions}
- Key merchandise categories: ${params.topCategories.join(", ")}
- High historical affinity pairs (10-year purchase history):
${params.highAffinityPairs.map((p) => `  * ${p}`).join("\n")}

Provide concrete guidelines for:
1. Traffic flow and anchor category placement (destination goods vs impulse goods).
2. Cross-merchandising affinity pairings across gondolas.
3. Eye-level facing strategies to maximize revenue per square meter.`;
}
