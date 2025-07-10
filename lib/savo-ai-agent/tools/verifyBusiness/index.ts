import { tool } from "ai";
import { z } from "zod";
import { performWebSearch } from "@/lib/ai/tools/web-search/ai-google-search";

export type BusinessVerificationResult = Awaited<
  ReturnType<typeof verifyBusinessTool.execute>
>;

interface SearchResult {
  title: string;
  content: string;
  url: string;
}

export const verifyBusinessTool = tool({
  description:
    "Verify if a client's claimed business exists and gather credibility information to support KYC scoring.",
  parameters: z.object({
    businessName: z.string().describe("The name of the business to verify"),
    ownerName: z.string().optional().describe("The claimed owner's name"),
    location: z
      .string()
      .optional()
      .describe("Business location (city/country)"),
  }),
  execute: async ({ businessName, ownerName, location }) => {
    const searchQuery = `${businessName} ${location || ""} ${ownerName || ""} company business`;

    try {
      // Use the web search tool directly
      const searchResult = await performWebSearch(searchQuery);

      // Extract results from the search
      const searchResults: SearchResult[] = searchResult.toolResults || [];

      // Analyze results for business legitimacy indicators
      const credibilityScore = analyzeBusinessCredibility(
        searchResults,
        businessName,
        ownerName,
      );

      return {
        businessName,
        searchQuery,
        credibilityScore,
        findings: searchResults.slice(0, 5),
        verificationSummary: generateVerificationSummary(credibilityScore),
        riskFlags: identifyRiskFlags(searchResults),
      };
    } catch {
      return {
        businessName,
        error: "Failed to verify business information",
        credibilityScore: 0,
        findings: [],
        verificationSummary: "Unable to verify business due to search error",
        riskFlags: ["Search verification failed"],
      };
    }
  },
});

function analyzeBusinessCredibility(
  results: SearchResult[],
  businessName: string,
  ownerName?: string,
): number {
  let score = 0;
  const businessNameLower = businessName.toLowerCase();

  for (const result of results) {
    const content = (result.content || "").toLowerCase();
    const title = (result.title || "").toLowerCase();

    // Positive indicators
    if (title.includes(businessNameLower)) score += 2;
    if (content.includes("company") || content.includes("business")) score += 1;
    if (
      content.includes("ceo") ||
      content.includes("founder") ||
      content.includes("director")
    )
      score += 1;
    if (ownerName && content.includes(ownerName.toLowerCase())) score += 2;
    if (content.includes("linkedin") || content.includes("professional"))
      score += 1;
    if (content.includes("website") || content.includes("official")) score += 1;

    // Negative indicators
    if (content.includes("scam") || content.includes("fraud")) score -= 3;
    if (content.includes("closed") || content.includes("bankrupt")) score -= 2;
  }

  return Math.max(0, Math.min(10, score));
}

function generateVerificationSummary(score: number): string {
  if (score >= 7)
    return "Strong business presence found online with credible information";
  if (score >= 4) return "Some business information found, appears legitimate";
  if (score >= 2)
    return "Limited business information available, verification inconclusive";
  return "No credible business information found, may require additional verification";
}

function identifyRiskFlags(results: SearchResult[]): string[] {
  const flags: string[] = [];

  for (const result of results) {
    const content = (result.content || "").toLowerCase();

    if (content.includes("scam") || content.includes("fraud")) {
      flags.push("Potential fraud indicators found");
    }
    if (content.includes("lawsuit") || content.includes("legal action")) {
      flags.push("Legal issues mentioned");
    }
    if (content.includes("closed") || content.includes("bankrupt")) {
      flags.push("Business closure indicators");
    }
  }

  if (results.length === 0) {
    flags.push("No online presence found");
  }

  return flags;
}
