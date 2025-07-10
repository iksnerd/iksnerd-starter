import { generateObject, tool } from "ai";
import { z } from "zod";
import { googleProvider } from "@/lib/ai/providers/google";

export type GenerateLeadTemplateResult = Awaited<
  ReturnType<typeof parseLeadData.execute>
>;

export const parseLeadData = tool({
  type: "function",
  description:
    "Extracts structured client information from a raw, unstructured text string.",
  parameters: z.object({
    rawText: z.string().describe("The raw client information string."),
  }),
  execute: async ({ rawText }) => {
    const { object: extractedData } = await generateObject({
      model: googleProvider("gemini-2.5-pro-preview-05-06"),
      schema: z.object({
        age: z.number().nullable().describe("The age of the client"),
        work: z.string().nullable().describe("The client's occupation"),
        income: z
          .number()
          .nullable()
          .describe(
            "The client's monthly income in USD, if stated numerically",
          ),
        city: z.string().nullable().describe("The client's city"),
        country: z
          .string()
          .nullable()
          .describe(
            "The client's country, inferred from city if possible or explicitly stated",
          ),
        marital_status: z
          .enum(["single", "married", "separated", "widowed", "unknown"])
          .nullable(),
        num_kids: z
          .number()
          .nullable()
          .describe("The number of children the client has"),
        has_savings_investments: z
          .boolean()
          .nullable()
          .describe(
            "True if the client explicitly states having savings or investments.",
          ),
        savings_investments_amount: z
          .number()
          .nullable()
          .describe(
            "The amount of savings/investments in USD, if stated numerically",
          ),
        investment_platforms: z
          .string()
          .nullable()
          .describe(
            "Where the money is invested (e.g., Crypto, Stocks, Bank savings, Real Estate)",
          ),
      }),
      prompt: `Extract all relevant client information from the following text into a structured JSON object. Ensure numerical values are parsed as numbers. Infer marital status and number of kids from family descriptions where possible. If a piece of information is not present or cannot be inferred, set its value to null.
      Client Notes:
      ${rawText}`,
    });
    return { parsedData: extractedData }; // Return the structured data
  },
});
