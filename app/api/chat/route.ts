import { CoreMessage, Message, streamText } from "ai";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { systemPrompt } from "@/lib/ai/system-prompt";
import {
  devModelOn,
  GoogleGenerativeAIModelId,
  mainModel,
} from "@/lib/ai/constants";
import { localChatModel } from "@/lib/ai/providers/ollama";
import {
  googleProvider,
  googleProviderOptions,
} from "@/lib/ai/providers/google";
import { updateUserUsage } from "@/lib/ai/update-user-usage";
import { tools } from "@/lib/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export type Language = {
  name: string;
  code: string;
};

export type RequestBody = {
  messages?: CoreMessage[] | Omit<Message, "id">[];
  language: Language;
  webSearchEnabled: boolean;
  model: GoogleGenerativeAIModelId;
  aboutMe?: string;
  personality?: string;
  creativity?: number[];
  responseFormat?: string;
  customInstructions?: string;
  location: {
    lat: number;
    lon: number;
  };
};

export async function POST(req: Request) {
  try {
    const { messages, model } = (await req.json()) as RequestBody;

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
        : googleProvider(model, {
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
      maxTokens: 2000,
      messages,
      temperature: 0,
      onFinish: async ({ usage }) => {
        await updateUserUsage({
          usage,
          model: model,
          user,
          clerkClientInstance: d,
          messages,
        });
      },
    });

    return result.toDataStreamResponse({
      sendSources: true,
      sendUsage: true,
      sendReasoning: true,
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
