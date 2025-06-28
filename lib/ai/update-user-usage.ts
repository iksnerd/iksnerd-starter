import { CoreMessage, LanguageModelUsage, Message } from "ai";
import { User } from "@clerk/nextjs/server";
import { ClerkClient } from "@clerk/backend";
import { GoogleGenerativeAIModelId } from "@/lib/ai/constants";

export async function updateUserUsage({
  usage,
  model,
  user,
  clerkClientInstance,
  messages,
}: {
  usage: LanguageModelUsage;
  model: GoogleGenerativeAIModelId;
  user: User;
  clerkClientInstance: ClerkClient;
  messages: CoreMessage[] | Omit<Message, "id">[];
}) {
  const { promptTokens, completionTokens, totalTokens } = usage;

  // Retrieve current googleGenerativeAIUsage array
  const prevUsage = Array.isArray(user.publicMetadata?.googleGenerativeAIUsage)
    ? user.publicMetadata.googleGenerativeAIUsage
    : [];

  // Create new usage data for current model
  const newUsageData = {
    promptTokens,
    completionTokens,
    totalTokens,
  };

  // Find if the current model already exists in the usage array
  const modelIndex = prevUsage.findIndex((entry) => entry.model === model);

  // Create updated usage array based on whether the model exists
  const updatedUsage = [...prevUsage];

  if (modelIndex !== -1) {
    // Update existing model's usage data
    updatedUsage[modelIndex] = {
      model,
      usage: {
        promptTokens:
          (prevUsage[modelIndex].usage.promptTokens || 0) + promptTokens,
        completionTokens:
          (prevUsage[modelIndex].usage.completionTokens || 0) +
          completionTokens,
        totalTokens:
          (prevUsage[modelIndex].usage.totalTokens || 0) + totalTokens,
      },
    };
  } else {
    // Add new model entry if it doesn't exist
    updatedUsage.push({
      model,
      usage: newUsageData,
    });
  }

  // Calculate total tokens dynamically from all usage entries
  const dynamicTotalTokens = updatedUsage.reduce(
    (sum, entry) => sum + entry.usage.totalTokens,
    0,
  );

  await clerkClientInstance.users.updateUserMetadata(user?.id, {
    publicMetadata: {
      googleGenerativeAIUsage: updatedUsage,
    },
  });

  console.log("Prompt Tokens:", promptTokens);
  console.log("Completion Tokens:", completionTokens);
  console.log("Dynamic Total Tokens:", dynamicTotalTokens);
  console.log("Message", messages);
  console.log("User's usage array length:", updatedUsage.length);
}
