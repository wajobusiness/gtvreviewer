import { IAiProvider, AiAnalysisInput, StructuredAnalysisResult } from "./types";
import { GeminiAiProvider } from "./providers/gemini";
import { OpenAiProvider } from "./providers/openai";
import { AnthropicAiProvider } from "./providers/anthropic";
import { analyzeWithHeuristics } from "./heuristic";

export * from "./types";
export { analyzeWithHeuristics } from "./heuristic";

/**
 * Resolves the active AI provider based on environment variables:
 * AI_PROVIDER=gemini | openai | anthropic
 */
export function getAiProvider(): IAiProvider {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  switch (provider) {
    case "openai":
      return new OpenAiProvider();
    case "anthropic":
    case "claude":
      return new AnthropicAiProvider();
    case "gemini":
    case "google":
    default:
      return new GeminiAiProvider();
  }
}

/**
 * Primary entrypoint for running forensic pre-submission AI analysis
 */
export async function runForensicAiAnalysis(
  input: AiAnalysisInput
): Promise<StructuredAnalysisResult> {
  const provider = getAiProvider();

  // If no API keys are present across providers, use deterministic rule-based audit
  const hasAnyKey =
    !!process.env.GEMINI_API_KEY ||
    !!process.env.OPENAI_API_KEY ||
    !!process.env.ANTHROPIC_API_KEY;

  if (!hasAnyKey) {
    console.info(
      "[AiService] No AI API keys detected in environment. Using deterministic Tech Nation forensic rules engine."
    );
    return analyzeWithHeuristics(input);
  }

  console.info(`[AiService] Executing analysis using provider: ${provider.name}`);
  return await provider.analyze(input);
}

