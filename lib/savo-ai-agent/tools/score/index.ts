import { tool } from "ai";
import { z } from "zod";

export type GetScoreLeadResult = Awaited<
  ReturnType<typeof scoreClientProfileTool.execute>
>;

// Location data structure aligned with the spec
const locationTiers: Record<string, { tier: number; cities?: string[] }> = {
  "south africa": { tier: 1, cities: ["johansburg", "cpt", "dbn"] },
  kenya: { tier: 1, cities: ["nairobi"] },
  nigeria: { tier: 1, cities: ["lagos", "abuja"] },
  egypt: { tier: 1 },
  morocco: { tier: 1 },
  ghana: { tier: 1, cities: ["accra"] },
  botswana: { tier: 2 },
  tunisia: { tier: 2 },
  algeria: { tier: 2 },
  namibia: { tier: 2 },
  rwanda: { tier: 2 },
  zambia: { tier: 2 },
  senegal: { tier: 2 },
  "cote divoire": { tier: 2, cities: ["abidjan"] }, // Changed from côte d'ivoire to avoid non-ASCII
  zimbabwe: { tier: 3 },
  "dr congo": { tier: 3 },
  sudan: { tier: 3 },
  somalia: { tier: 3 },
  malawi: { tier: 3 },
  mozambique: { tier: 3 },
  "central african republic": { tier: 3 },
  "sierra leone": { tier: 3 },
};

export const scoreClientProfileTool = tool({
  description:
    "Calculates the total KYC score and individual category scores for a structured client profile based on the CFD trading KYC scoring system.",
  parameters: z.object({
    clientProfile: z
      .object({
        age: z.number().nullable(),
        work: z.string().nullable(),
        income: z.number().nullable(),
        city: z.string().nullable(),
        country: z.string().nullable(),
        marital_status: z
          .enum(["single", "married", "separated", "widowed", "unknown"])
          .nullable(),
        num_kids: z.number().nullable(),
        has_savings_investments: z.boolean().nullable(),
        savings_investments_amount: z.number().nullable(),
        investment_platforms: z.string().nullable(),
      })
      .describe("The structured client data to be scored."),
  }),
  execute: async ({ clientProfile }) => {
    let totalScore = 0;
    const categoryScores: Record<string, number> = {};

    // 1. Age Scoring (Max 3 points)
    const ageScore = (() => {
      const age = clientProfile.age;
      if (age === null) return 0;
      if (age >= 35 && age <= 55) return 3; // Golden age
      if ((age >= 25 && age <= 34) || (age >= 56 && age <= 65)) return 2;
      if ((age >= 18 && age <= 24) || age >= 66) return 1;
      return 0;
    })();
    categoryScores.age = ageScore;
    totalScore += ageScore;

    // 2. Work/Occupation Scoring (Max 3 points)
    const workScore = (() => {
      const work = clientProfile.work?.toLowerCase().trim();
      if (!work) return 0;

      // Business owner indicators
      const businessKeywords = [
        "owner",
        "ceo",
        "founder",
        "entrepreneur",
        "business",
        "company",
        "director",
      ];
      if (businessKeywords.some((keyword) => work.includes(keyword))) return 3;

      // Full-time job indicators
      const jobKeywords = [
        "doctor",
        "engineer",
        "manager",
        "teacher",
        "lawyer",
        "accountant",
        "nurse",
        "analyst",
        "developer",
        "consultant",
      ];
      if (
        jobKeywords.some((keyword) => work.includes(keyword)) ||
        work.includes("full-time") ||
        work.includes("employed")
      )
        return 2;

      // Part-time, freelance, student
      if (
        work.includes("part-time") ||
        work.includes("freelance") ||
        work.includes("student") ||
        work.includes("contractor")
      )
        return 1;

      // Unemployed
      if (work.includes("unemployed") || work.includes("jobless")) return 0;

      // Default to full-time job if occupation is mentioned
      return 2;
    })();
    categoryScores.work = workScore;
    totalScore += workScore;

    // 3. Marital Status & Kids (Max 2 points)
    const maritalAndKidsScore = (() => {
      const maritalStatus = clientProfile.marital_status;
      const numKids = clientProfile.num_kids || 0;

      if (maritalStatus === "single" && numKids === 0) return 2;
      if (maritalStatus === "married" && numKids === 0) return 1.5;
      if (
        (maritalStatus === "married" || maritalStatus === "single") &&
        numKids > 0
      )
        return 1;
      if (
        (maritalStatus === "separated" || maritalStatus === "widowed") &&
        numKids > 0
      )
        return 0.5;

      // Default scoring based on kids only if marital status unknown
      if (numKids === 0) return 2;
      return 1;
    })();
    categoryScores.maritalAndKids = maritalAndKidsScore;
    totalScore += maritalAndKidsScore;

    // 4. Location (Country & City) (Max 2 points)
    const locationScore = (() => {
      const city = clientProfile.city;
      const country = clientProfile.country;

      if (!country) return 0;

      const normalizedCountry = country.toLowerCase().trim();
      const normalizedCity = city?.toLowerCase().trim();
      const countryData = locationTiers[normalizedCountry];

      if (countryData) {
        if (countryData.tier === 1) {
          // For tier 1 countries, check if specific cities are required
          if (
            countryData.cities &&
            normalizedCity &&
            countryData.cities.includes(normalizedCity)
          ) {
            return 2;
          } else if (!countryData.cities) {
            // Countries without specific city requirements (Egypt, Morocco)
            return 2;
          }
          // Tier 1 country but not in the specified cities
          return 1;
        } else if (countryData.tier === 2) {
          return 1;
        } else if (countryData.tier === 3) {
          return 0;
        }
      }
      return 0;
    })();
    categoryScores.location = locationScore;
    totalScore += locationScore;

    // 5. Work Situation (Max 2 points) - Similar to work scoring but different scale
    const workSituationScore = (() => {
      const work = clientProfile.work?.toLowerCase().trim();
      if (!work) return 0;

      const businessKeywords = [
        "owner",
        "ceo",
        "founder",
        "entrepreneur",
        "business",
        "company",
        "director",
      ];
      const jobKeywords = [
        "doctor",
        "engineer",
        "manager",
        "teacher",
        "lawyer",
        "accountant",
        "nurse",
        "analyst",
        "developer",
        "consultant",
      ];

      if (
        businessKeywords.some((keyword) => work.includes(keyword)) ||
        jobKeywords.some((keyword) => work.includes(keyword)) ||
        work.includes("full-time") ||
        work.includes("employed")
      )
        return 2;

      if (
        work.includes("freelance") ||
        work.includes("part-time") ||
        work.includes("contractor")
      )
        return 1;

      if (work.includes("unemployed") || work.includes("student")) return 0;

      return 2; // Default to employed if work is mentioned
    })();
    categoryScores.workSituation = workSituationScore;
    totalScore += workSituationScore;

    // 6. Has Savings/Investments (Max 2 points)
    const savingsScore = (() => {
      if (clientProfile.has_savings_investments === true) return 2;
      if (clientProfile.has_savings_investments === false) return 0;
      // If null/unknown, check if amount is provided
      if (
        clientProfile.savings_investments_amount &&
        clientProfile.savings_investments_amount > 0
      )
        return 2;
      return 0;
    })();
    categoryScores.savings = savingsScore;
    totalScore += savingsScore;

    // 7. Savings/Investment Amount (Max 4 points)
    const savingsAmountScore = (() => {
      const amount = clientProfile.savings_investments_amount;
      if (!amount || amount <= 0) return 0;

      if (amount >= 10000) return 4;
      if (amount >= 5000) return 3;
      if (amount >= 1000) return 2;
      if (amount > 0) return 1;
      return 0;
    })();
    categoryScores.savingsAmount = savingsAmountScore;
    totalScore += savingsAmountScore;

    // 8. Investment Platform (Max 3 points)
    const investmentPlatformScore = (() => {
      const platforms = clientProfile.investment_platforms
        ?.toLowerCase()
        .trim();
      if (!platforms) return 0;

      // High-value platforms
      if (
        platforms.includes("crypto") ||
        platforms.includes("stocks") ||
        platforms.includes("trading") ||
        platforms.includes("forex") ||
        platforms.includes("etf") ||
        platforms.includes("mutual fund") ||
        platforms.includes("online") ||
        platforms.includes("platform")
      )
        return 3;

      // Medium-value investments
      if (
        platforms.includes("real estate") ||
        platforms.includes("property") ||
        platforms.includes("business") ||
        platforms.includes("capital")
      )
        return 2;

      // Low-value/traditional savings
      if (
        platforms.includes("bank") ||
        platforms.includes("savings") ||
        platforms.includes("cash") ||
        platforms.includes("fixed deposit")
      )
        return 1;

      return 0;
    })();
    categoryScores.investmentPlatform = investmentPlatformScore;
    totalScore += investmentPlatformScore;

    // Determine lead potential based on total score
    let leadPotential = "Low ❄️";
    if (totalScore >= 15) {
      leadPotential = "High 🔥";
    } else if (totalScore >= 10) {
      leadPotential = "Medium ⚖️";
    }

    return {
      totalScore,
      categoryScores,
      leadPotential,
      maxPossibleScore: 20,
      scoreBreakdown: {
        age: `${categoryScores.age}/3`,
        work: `${categoryScores.work}/3`,
        maritalAndKids: `${categoryScores.maritalAndKids}/2`,
        location: `${categoryScores.location}/2`,
        workSituation: `${categoryScores.workSituation}/2`,
        savings: `${categoryScores.savings}/2`,
        savingsAmount: `${categoryScores.savingsAmount}/4`,
        investmentPlatform: `${categoryScores.investmentPlatform}/3`,
      },
    };
  },
});
