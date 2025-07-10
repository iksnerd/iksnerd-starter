import { tool } from "ai";
import { z } from "zod";
import { performWebSearch } from "@/lib/ai/tools/web-search/ai-google-search";

export type IncomeVerificationResult = Awaited<
  ReturnType<typeof verifyIncomeTool.execute>
>;

interface SearchResult {
  title: string;
  content: string;
  url: string;
}

interface BenchmarkData {
  min: number;
  max: number;
  average: number;
  source: string;
}

export const verifyIncomeTool = tool({
  description:
    "Verify if a client's claimed income aligns with their profession and location for enhanced KYC validation.",
  parameters: z.object({
    occupation: z.string().describe("The client's claimed occupation"),
    claimedIncome: z
      .number()
      .describe("Monthly income claimed by client in USD"),
    country: z.string().describe("Client's country"),
    city: z.string().optional().describe("Client's city"),
  }),
  execute: async ({ occupation, claimedIncome, country, city }) => {
    const searchQuery = `${occupation} salary ${country} ${city || ""} average income monthly wage`;

    try {
      const searchResult = await performWebSearch(searchQuery);

      const searchResults: SearchResult[] = searchResult.toolResults || [];

      const benchmarkData = extractIncomeBenchmarks(
        searchResults,
        occupation,
        country,
      );
      const credibilityAssessment = assessIncomeCredibility(
        claimedIncome,
        benchmarkData,
        occupation,
      );

      return {
        occupation,
        claimedIncome,
        location: `${city || ""} ${country}`.trim(),
        benchmarkIncome: benchmarkData,
        credibilityScore: credibilityAssessment.score,
        credibilityLevel: credibilityAssessment.level,
        riskFlags: credibilityAssessment.flags,
        recommendation: credibilityAssessment.recommendation,
        searchSummary: summarizeIncomeFindings(
          searchResults,
          occupation,
          country,
        ),
      };
    } catch {
      return {
        occupation,
        claimedIncome,
        location: `${city || ""} ${country}`.trim(),
        benchmarkIncome: { min: 0, max: 0, average: 0, source: "unavailable" },
        credibilityScore: 5,
        credibilityLevel: "UNCERTAIN",
        riskFlags: ["Income verification failed due to search error"],
        recommendation: "Manual income verification required",
        searchSummary: "Unable to retrieve income benchmarks",
      };
    }
  },
});

function extractIncomeBenchmarks(
  results: SearchResult[],
  occupation: string,
  country: string,
): BenchmarkData {
  const totalSalaries: number[] = [];
  const source = "web search analysis";

  for (const result of results) {
    const content = (result.content || "").toLowerCase();

    // Look for salary ranges and numbers
    const salaryMatches = content.match(/\$?\d{1,3}[,\d]*\.?\d*/g);
    if (salaryMatches) {
      for (const match of salaryMatches) {
        const num = parseFloat(match.replace(/[$,]/g, ""));
        // Filter for reasonable salary ranges (100-50000 monthly)
        if (num >= 100 && num <= 50000) {
          totalSalaries.push(num);
        }
      }
    }
  }

  if (totalSalaries.length === 0) {
    // Fallback based on known profession averages
    return getFallbackSalaryData(occupation, country);
  }

  totalSalaries.sort((a, b) => a - b);

  return {
    min: totalSalaries[0] || 0,
    max: totalSalaries[totalSalaries.length - 1] || 0,
    average: totalSalaries.reduce((a, b) => a + b, 0) / totalSalaries.length,
    source: "market data",
  };
}

function getFallbackSalaryData(
  occupation: string,
  country: string,
): BenchmarkData {
  const occupationLower = occupation.toLowerCase();

  // Basic salary estimates for African markets
  const baseSalaries: Record<
    string,
    { min: number; max: number; avg: number }
  > = {
    doctor: { min: 2000, max: 8000, avg: 4000 },
    engineer: { min: 1200, max: 5000, avg: 2500 },
    teacher: { min: 500, max: 2000, avg: 1000 },
    lawyer: { min: 1500, max: 6000, avg: 3000 },
    manager: { min: 1000, max: 4000, avg: 2000 },
    accountant: { min: 800, max: 3000, avg: 1500 },
    nurse: { min: 600, max: 2500, avg: 1200 },
    business: { min: 500, max: 10000, avg: 3000 }, // Wide range for business owners
  };

  for (const [key, data] of Object.entries(baseSalaries)) {
    if (occupationLower.includes(key)) {
      return {
        min: data.min,
        max: data.max,
        average: data.avg,
        source: "fallback estimates",
      };
    }
  }

  return { min: 500, max: 3000, average: 1500, source: "general estimate" };
}

function assessIncomeCredibility(
  claimed: number,
  benchmark: BenchmarkData,
  occupation: string,
): {
  score: number;
  level: string;
  flags: string[];
  recommendation: string;
} {
  const flags: string[] = [];
  let score = 5; // Neutral

  if (benchmark.average === 0) {
    flags.push("Unable to verify income benchmarks");
    return {
      score: 5,
      level: "UNCERTAIN",
      flags,
      recommendation: "Request income documentation for verification",
    };
  }

  const ratio = claimed / benchmark.average;

  if (ratio >= 3) {
    score = 2; // Low credibility
    flags.push("Claimed income significantly above market average");
  } else if (ratio >= 1.5) {
    score = 6; // Slightly above average, good sign
    flags.push("Above average income for profession");
  } else if (ratio >= 0.5) {
    score = 8; // Reasonable range
  } else {
    score = 4; // Below average
    flags.push("Claimed income below typical range for profession");
  }

  // Adjust for high-variance professions
  if (
    occupation.toLowerCase().includes("business") ||
    occupation.toLowerCase().includes("entrepreneur")
  ) {
    score += 1; // More tolerance for business owners
    flags.push("Business income can vary significantly");
  }

  let level = "REASONABLE";
  if (score <= 3) level = "QUESTIONABLE";
  else if (score >= 7) level = "CREDIBLE";
  else if (score >= 4 && score <= 6) level = "UNCERTAIN";

  const recommendation = generateIncomeRecommendation(level, ratio, occupation);

  return { score, level, flags, recommendation };
}

function generateIncomeRecommendation(
  level: string,
  ratio: number,
  occupation: string,
): string {
  switch (level) {
    case "CREDIBLE":
      return "Income appears reasonable for stated profession - proceed with standard verification";
    case "QUESTIONABLE":
      return "Income claim requires additional documentation - request pay slips or tax returns";
    case "UNCERTAIN":
      return "Income verification inconclusive - consider additional due diligence";
    default:
      return "Manual review recommended for income validation";
  }
}

function summarizeIncomeFindings(
  results: SearchResult[],
  occupation: string,
  country: string,
): string {
  if (results.length === 0) {
    return `No specific income data found for ${occupation} in ${country}`;
  }

  return `Found ${results.length} relevant sources discussing ${occupation} compensation in ${country}`;
}
