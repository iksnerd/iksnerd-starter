import { tool } from "ai";
import { performWebSearch } from "@/lib/ai/tools/web-search/ai-google-search";
import { z } from "zod";

export type GetWebSearchResult = Awaited<
  ReturnType<typeof getWebSearchTool.execute>
>;

export const getWebSearchTool = tool({
  type: "function",
  description: `Performs a general web search using Google. Use this for queries about recent news, current events, general market trends, unconfirmed information, or when the internal legal database cannot provide a specific answer. This tool provides access to publicly available information on the internet.`,
  parameters: z.object({
    query: z
      .string()
      .describe(
        "The search query for Google. Formulate it as a natural language question or a concise keyword phrase relevant to the user\\'s request.",
      ),
  }),
  execute: async ({ query }) => await performWebSearch(query),
});
