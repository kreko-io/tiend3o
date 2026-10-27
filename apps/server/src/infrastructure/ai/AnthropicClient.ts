import Anthropic, { APIError } from "@anthropic-ai/sdk";

export const ANTHROPIC_DEFAULT_MODEL = "claude-sonnet-4-20250514";

export class AnthropicLayoutClient {
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async suggestLayoutOptimization(prompt: string): Promise<string> {
    if (!this.client) {
      return "Anthropic API key is not configured. Falling back to deterministic heuristic optimizer.";
    }

    try {
      const response = await this.client.messages.create({
        model: ANTHROPIC_DEFAULT_MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === "text") {
        return firstBlock.text;
      }
      return "";
    } catch (err) {
      if (err instanceof APIError) {
        throw new Error(`Anthropic API Error: ${err.status} - ${err.message}`);
      }
      throw err;
    }
  }
}
