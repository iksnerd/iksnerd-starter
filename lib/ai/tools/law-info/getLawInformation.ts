import { tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/tools/law-info/find-relevant-info";

export type GetInformationResult = Awaited<
  ReturnType<typeof getBulgarianLegalInfo.execute>
>;

export const getBulgarianLegalInfo = tool({
  type: "function",
  description: `Retrieves specific and detailed legal, tax, and accounting information from the Bulgarian regulatory database. Use this for questions directly related to Bulgarian laws, regulations, ordinances, and official guidance. This tool provides authoritative information from official sources.`,
  parameters: z.object({
    question: z
      .string()
      .describe(
        "The precise legal or accounting question, law article, regulation, or specific term to search for in the Bulgarian legal database. Be as specific as possible to get the most relevant information.",
      ),
  }),
  execute: async ({ question }) => await findRelevantContent(question),
});
