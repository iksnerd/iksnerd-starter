import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { appendResponseMessages, streamText } from "ai";

import { systemPrompt } from "@/lib/ai/system-prompt";
import { devModelOn, mainModel } from "@/lib/ai/constants";
import { localChatModel } from "@/lib/ai/providers/ollama";
import {
  googleProvider,
  googleProviderOptions,
} from "@/lib/ai/providers/google";
import { updateUserUsage } from "@/lib/ai/update-user-usage";
import { tools } from "@/lib/ai/tools";
import { createOrUpdateUserChat } from "@/lib/ai/update-user-chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export type Language = {
  name: string;
  code: string;
};

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const d = await clerkClient();

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    if (devModelOn) {
      console.log("Using development model:", mainModel);
    }

    const result = streamText({
      model: devModelOn
        ? localChatModel
        : googleProvider("gemini-2.5-flash-preview-04-17", {
            useSearchGrounding: false,
          }),
      tools: tools,
      providerOptions: {
        google: googleProviderOptions,
      },
      toolCallStreaming: true,
      toolChoice: "auto",
      maxSteps: 5,
      system: systemPrompt,
      maxTokens: 4096,
      messages,
      temperature: 0,
      onFinish: async ({ usage, response }) => {
        const msg = appendResponseMessages({
          messages,
          responseMessages: response.messages,
        });

        await createOrUpdateUserChat({
          chatId: user.id,
          userId: user.id,
          messages: msg,
        });

        await updateUserUsage({
          usage,
          model: model,
          user,
          clerkClientInstance: d,
          messages,
        });
      },
    });

    console.log("Streaming response started for user:", user.id);
    return result.toDataStreamResponse({
      sendUsage: true,
    });
  } catch (error) {
    console.error("[CHAT_API_ERROR]", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
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
