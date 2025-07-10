import { generateText } from "ai";
import { googleProvider } from "@/lib/ai/providers/google";
import { mainModel } from "@/lib/ai/constants";

export const performWebSearch = async (query: string) => {
  return await generateText({
    model: googleProvider(mainModel, {
      useSearchGrounding: true,
    }),
    system: `You are an advanced search assistant designed to provide helpful, accurate, and comprehensive information. You can search the web for information related to user queries and provide a summary of the most relevant results. Always respond in the specified language.`,
    prompt: `Search the web for information related to the following query: "${query}". Provide a summary of the most relevant results.
    If no relevant information is found, respond with respectfully that you couldn't find any information.`,
  });
};
