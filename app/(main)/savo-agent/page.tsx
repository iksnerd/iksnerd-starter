"use client";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@/components/ui/kibo-ui/ai/conversation";
import {
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from "@/components/ui/kibo-ui/ai/message";
import {
  AISuggestion,
  AISuggestions,
} from "@/components/ui/kibo-ui/ai/suggestion";

import {
  AITool,
  AIToolContent,
  AIToolHeader,
  AIToolResult,
  // type AIToolStatus,
} from "@/components/ui/kibo-ui/ai/tool";
import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";

import { Spinner } from "@/components/ui/kibo-ui/spinner";

import {
  AISource,
  AISources,
  AISourcesContent,
  AISourcesTrigger,
} from "@/components/ui/kibo-ui/ai/source";
import {
  AIReasoning,
  AIReasoningContent,
  AIReasoningTrigger,
} from "@/components/ui/kibo-ui/ai/reasoning";
// import { serviceHost } from "@/services";
import { MicIcon, PlusIcon, RefreshCwIcon, StopCircle } from "lucide-react";
import { useState } from "react";
import { AIResponse } from "@/components/ui/kibo-ui/ai/response";
import { ToolExecutionError, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { useChatHistory } from "@/hooks/repository-hooks/user-chat/use-user-chat";
import {
  ParseLeadData,
  ScoreClientProfile,
  VerifyBusiness,
  AssessLocationRisk,
  VerifyIncome,
} from "@/components/assistant/kyc-tools";
// const vectorDbService = serviceHost.vectorDbService();
const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

const suggestions = [
  `Verify the business ownership claims for a lead.`,
  `Assess the location risk for a potential client.`,
  `Validate income claims against market benchmarks.`,
];

interface ToolErrorProps {
  error?: Error;
}

const ToolError = (error: ToolErrorProps) => {
  if (ToolExecutionError.isInstance(error)) {
    return (
      <AITool key={error.toolName}>
        <AIToolHeader
          description={`Грешка при изпълнение на инструмента: ${error.name}`}
          name={error.toolName}
          status={"error"}
        />
        <AIToolContent>
          {error && (
            <AIToolResult
              error={error.message}
              result={
                <div className="text-red-500">
                  <p>{error.name}</p>
                  <p className="text-sm text-gray-500">{error.message}</p>
                </div>
              }
            />
          )}
        </AIToolContent>
      </AITool>
    );
  }

  return null;
};
// const demo768Vector = Array.from({ length: 768 }, (_, i) => i + 1);
export default function ChatPage() {
  const [model, setModel] = useState<string>(models[0].id);
  const { user } = useUser();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setInput,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/savo-agent",
    sendExtraMessageFields: true,
  });

  const chatHistory = useChatHistory();

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSubmit();
  };

  console.log("Messages:", messages);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-6 h-screen justify-between">
      <div className="flex justify-between mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow items-center">
        <h1 className="text-2xl font-bold ">Savo Lead Agent</h1>
        {status === "streaming" && <Spinner />}
      </div>

      {chatHistory.data && chatHistory.data.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Chat History</h2>
          <ul className="space-y-2">
            {chatHistory.data.map((chat) => (
              <li
                key={chat.id}
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {chat.title || "Untitled Chat"} -{" "}
                {new Date(chat.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/*{JSON.stringify(messages, null, 2)}*/}
      <div className={" flex-1 overflow-hidden relative"}>
        <AIConversation className="relative size-full rounded-lg border">
          <AIConversationContent>
            <ToolError error={error} />
            {messages.flatMap((message, index) => {
              const messageParts = message.parts;

              return messageParts.map((messagePart, partIndex) => {
                if (messagePart.type === "text") {
                  return (
                    <AIMessage
                      from={message.role === "user" ? "user" : "assistant"}
                      key={`${index}-${partIndex}-${message.id}`}
                    >
                      <AIMessageContent>
                        <AIResponse>{messagePart.text}</AIResponse>
                      </AIMessageContent>

                      <AIMessageAvatar
                        name={message.role === "user" ? "User" : "AI"}
                        src={
                          message.role === "user"
                            ? user?.imageUrl || ""
                            : "https://github.com/openai.png"
                        }
                      />
                    </AIMessage>
                  );
                }

                if (messagePart.type === "tool-invocation") {
                  return (
                    <ToolResult
                      key={`${index}-${partIndex}-${message.id}`}
                      part={messagePart}
                    />
                  );
                }

                if (messagePart.type === "reasoning") {
                  return (
                    <AIReasoning key={`${index}-${partIndex}-${message.id}`}>
                      <AIReasoningTrigger />
                      <AIReasoningContent>
                        {messagePart.reasoning}
                      </AIReasoningContent>
                    </AIReasoning>
                  );
                }

                return null;
              });
            })}
            {messages.flatMap((message, index) => {
              const messageParts = message.parts;
              if (!messageParts || messageParts.length === 0) {
                return null;
              }

              const hasSources = messageParts.some(
                (part) => part.type === "source",
              );
              if (!hasSources) {
                return null;
              }

              const sourceParts = messageParts.filter(
                (part) => part.type === "source",
              );

              return (
                <AIMessage
                  from={message.role === "user" ? "user" : "assistant"}
                  key={`${index}-sources-${message.id}`}
                >
                  <AIMessageContent>
                    {messageParts.map((part, partIndex) => {
                      if (part.type === "source") {
                        return (
                          <AISources key={`${index}-${partIndex}`}>
                            <AISourcesTrigger count={sourceParts.length} />
                            <AISourcesContent>
                              {sourceParts.map((source, sourceIndex) => (
                                <AISource
                                  key={`${index}-${partIndex}-${sourceIndex}`}
                                  href={source.source.url}
                                  title={source.source.title}
                                />
                              ))}
                            </AISourcesContent>
                          </AISources>
                        );
                      }
                      return null;
                    })}
                  </AIMessageContent>
                </AIMessage>
              );
            })}
            {error && (
              <AIMessage from="assistant">
                <AIMessageContent>
                  <div>
                    <p className="text-red-500">{error.name}</p>
                    <p className="text-sm text-gray-500">{error.message}</p>
                  </div>
                </AIMessageContent>
              </AIMessage>
            )}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      </div>

      {messages.some((message) =>
        message.parts.some(
          (part) =>
            part.type === "tool-invocation" &&
            part.toolInvocation.toolName == "scoreClientProfileTool",
        ),
      ) && (
        <AISuggestions>
          {suggestions.map((suggestion) => (
            <AISuggestion
              key={suggestion}
              onClick={handleSuggestionClick}
              suggestion={suggestion}
            />
          ))}
        </AISuggestions>
      )}

      <AIInput
        onSubmit={handleSubmit}
        className={
          "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        }
      >
        <AIInputTextarea onChange={handleInputChange} value={input} />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton>
              <PlusIcon size={16} />
            </AIInputButton>
            <AIInputButton>
              <MicIcon size={16} />
            </AIInputButton>
            <AIInputButton
              disabled={status !== "streaming"}
              onClick={() => {
                stop();
              }}
            >
              <StopCircle size={16} />
              <span>Stop</span>
            </AIInputButton>

            <AIInputButton
              disabled={messages.length === 0}
              onClick={() => {
                setInput("");
                reload();
              }}
            >
              <RefreshCwIcon size={16} />
              <span>Reload</span>
            </AIInputButton>
            <AIInputModelSelect onValueChange={setModel} value={model}>
              <AIInputModelSelectTrigger>
                <AIInputModelSelectValue />
              </AIInputModelSelectTrigger>
              <AIInputModelSelectContent>
                {models.map((model) => (
                  <AIInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </AIInputModelSelectItem>
                ))}
              </AIInputModelSelectContent>
            </AIInputModelSelect>
          </AIInputTools>
          <AIInputSubmit disabled={!input} status={status} />
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}

type ToolResultProps = {
  part: UIMessage["parts"][number];
};

function ToolResult({ part }: ToolResultProps) {
  if (part.type !== "tool-invocation") {
    return null;
  }

  const { toolInvocation } = part;

  if (toolInvocation.state === "call") {
    return (
      <AITool>
        <AIToolHeader
          description={
            toolInvocation.step ? `Step ${toolInvocation.step}` : "Preparing..."
          }
          name={toolInvocation.toolName}
          status="pending"
        />
      </AITool>
    );
  }

  if (toolInvocation.state === "partial-call") {
    return (
      <AITool>
        <AIToolHeader
          description={
            toolInvocation.step ? `Step ${toolInvocation.step}` : "Working..."
          }
          name={toolInvocation.toolName}
          status="running"
        />
      </AITool>
    );
  }

  if (toolInvocation.state === "result") {
    switch (toolInvocation.toolName) {
      case "parseLeadData":
        return (
          <ParseLeadData
            toolCall={toolInvocation}
            result={toolInvocation.result}
          />
        );
      case "scoreClientProfileTool":
        return (
          <ScoreClientProfile
            toolCall={toolInvocation}
            result={toolInvocation.result}
          />
        );
      case "verifyBusiness":
        return (
          <VerifyBusiness
            toolCall={toolInvocation}
            result={toolInvocation.result}
          />
        );
      case "assessLocationRisk":
        return (
          <AssessLocationRisk
            toolCall={toolInvocation}
            result={toolInvocation.result}
          />
        );
      case "verifyIncome":
        return (
          <VerifyIncome
            toolCall={toolInvocation}
            result={toolInvocation.result}
          />
        );
      default:
        return null;
    }
  }
}
