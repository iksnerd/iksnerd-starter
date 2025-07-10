import { tool } from "ai";
import { z } from "zod";
import { performWebSearch } from "@/lib/ai/tools/web-search/ai-google-search";

export type LocationRiskResult = Awaited<
  ReturnType<typeof assessLocationRiskTool.execute>
>;

interface SearchResult {
  title: string;
  content: string;
  url: string;
}

export const assessLocationRiskTool = tool({
  description:
    "Assess regulatory and economic risks for a client's location to support KYC compliance decisions.",
  parameters: z.object({
    country: z.string().describe("The client's country"),
    city: z.string().optional().describe("The client's city"),
  }),
  execute: async ({ country, city }) => {
    const searchQuery = `${country} ${city || ""} economic sanctions FATF CFD trading regulations financial restrictions`;

    try {
      const searchResult = await performWebSearch(searchQuery);

      const searchResults: SearchResult[] = searchResult.toolResults || [];

      const riskAssessment = analyzeLocationRisk(country, searchResults);
      const regulatoryStatus = checkRegulatoryCompliance(
        country,
        searchResults,
      );

      return {
        country,
        city,
        riskLevel: riskAssessment.level,
        riskScore: riskAssessment.score,
        sanctionsStatus: riskAssessment.sanctions,
        regulatoryCompliance: regulatoryStatus,
        recommendations: generateLocationRecommendations(
          riskAssessment,
          regulatoryStatus,
        ),
        lastUpdated: new Date().toISOString(),
      };
    } catch {
      return {
        country,
        city,
        riskLevel: "UNKNOWN",
        riskScore: 5,
        sanctionsStatus: "Unable to verify",
        regulatoryCompliance: "Verification failed",
        recommendations: ["Manual review required due to verification error"],
        lastUpdated: new Date().toISOString(),
      };
    }
  },
});

function analyzeLocationRisk(
  country: string,
  results: SearchResult[],
): { level: string; score: number; sanctions: string } {
  let riskScore = 5; // Default medium risk
  let sanctionsFound = false;

  const countryLower = country.toLowerCase();

  for (const result of results) {
    const content = (result.content || "").toLowerCase();

    // High risk indicators
    if (content.includes("sanctions") && content.includes(countryLower)) {
      riskScore += 3;
      sanctionsFound = true;
    }
    if (
      content.includes("money laundering") ||
      content.includes("terrorist financing")
    )
      riskScore += 2;
    if (content.includes("fatf") && content.includes("grey list"))
      riskScore += 2;
    if (content.includes("restricted") || content.includes("prohibited"))
      riskScore += 2;

    // Low risk indicators
    if (content.includes("compliant") || content.includes("regulated"))
      riskScore -= 1;
    if (content.includes("fsca") || content.includes("financial authority"))
      riskScore -= 1;
  }

  riskScore = Math.max(1, Math.min(10, riskScore));

  let level = "MEDIUM";
  if (riskScore >= 8) level = "HIGH";
  else if (riskScore <= 3) level = "LOW";

  return {
    level,
    score: riskScore,
    sanctions: sanctionsFound
      ? "Sanctions indicators found"
      : "No sanctions detected",
  };
}

function checkRegulatoryCompliance(
  country: string,
  results: SearchResult[],
): string {
  const countryLower = country.toLowerCase();

  for (const result of results) {
    const content = (result.content || "").toLowerCase();

    if (
      content.includes(countryLower) &&
      content.includes("cfd") &&
      content.includes("regulated")
    ) {
      return "CFD trading appears regulated";
    }
    if (
      content.includes(countryLower) &&
      content.includes("financial services") &&
      content.includes("authority")
    ) {
      return "Financial services oversight present";
    }
  }

  return "Regulatory status unclear - requires manual review";
}

function generateLocationRecommendations(
  risk: { level: string; sanctions: string },
  regulatory: string,
): string[] {
  const recommendations: string[] = [];

  if (risk.level === "HIGH") {
    recommendations.push(
      "⚠️ High-risk jurisdiction - enhanced due diligence required",
    );
    recommendations.push("Consider additional documentation and verification");
  }

  if (risk.sanctions.includes("found")) {
    recommendations.push(
      "🚨 Sanctions indicators - compliance team review mandatory",
    );
  }

  if (regulatory.includes("unclear")) {
    recommendations.push(
      "📋 Verify local CFD trading regulations before onboarding",
    );
  }

  if (risk.level === "LOW") {
    recommendations.push(
      "✅ Low-risk location - standard KYC procedures sufficient",
    );
  }

  return recommendations;
}
