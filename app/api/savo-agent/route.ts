import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { streamText } from "ai";

import { devModelOn, mainModel } from "@/lib/ai/constants";
import { localChatModel } from "@/lib/ai/providers/ollama";
import { googleProvider } from "@/lib/ai/providers/google";
import { savoAgentTools } from "@/lib/savo-ai-agent/tools";
import { savoSystemPrompt } from "@/lib/savo-ai-agent/system-prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const d = await clerkClient();

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    if (devModelOn) {
      console.log("Using development model for Savo agent:", mainModel);
    }

    const result = streamText({
      model: devModelOn
        ? localChatModel
        : googleProvider("gemini-2.5-flash", {
            useSearchGrounding: false,
          }),
      tools: savoAgentTools,
      toolCallStreaming: true,
      toolChoice: "auto",
      maxSteps: 5,
      system: savoSystemPrompt,
      maxTokens: 4096,
      messages,
      temperature: 0.1, // Slightly higher for more natural responses while maintaining accuracy
      onFinish: async ({ usage, response }) => {
        // const msg = appendResponseMessages({
        //   messages,
        //   responseMessages: response.messages,
        // });
        // // Store Savo agent conversations with a specific chat ID prefix
        // await createOrUpdateUserChat({
        //   chatId: `savo-${user.id}`,
        //   userId: user.id,
        //   messages: msg,
        // });
        //
        // await updateUserUsage({
        //   usage,
        //   model: model,
        //   user,
        //   clerkClientInstance: d,
        //   messages,
        // });
      },
    });

    console.log("Savo agent streaming response started for user:", user.id);
    return result.toDataStreamResponse({
      sendUsage: true,
    });
  } catch (error) {
    console.error("[SAVO_AGENT_API_ERROR]", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your KYC request",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
