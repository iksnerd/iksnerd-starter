"use client";

import { GetWebSearchResult } from "@/lib/ai/tools/web-search/search-web";
import {
  AITool,
  AIToolContent,
  AIToolHeader,
  AIToolParameters,
  AIToolResult,
} from "@/components/ui/kibo-ui/ai/tool";
import { ToolInvocation } from "ai";
import {
  AISource,
  AISources,
  AISourcesContent,
  AISourcesTrigger,
} from "@/components/ui/kibo-ui/ai/source";
import { getToolByName } from "@/lib/ai/tools";
type Props = {
  result: GetWebSearchResult;
  toolCall: ToolInvocation; // Uncomment if you need to use toolCall directly
};

export function GetWebSearchResults({ result, toolCall }: Props) {
  const name = getToolByName(toolCall.toolName);

  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={name.description || "Разширени резултати от търсене"}
        name={name.name}
        status={
          toolCall.state === "result"
            ? "completed"
            : toolCall.state === "call"
              ? "pending"
              : "pending"
        }
      />

      <AIToolContent>
        <AIToolParameters parameters={toolCall.args} />
        {result && (
          <AIToolResult
            error={undefined}
            result={
              <AISources>
                <AISourcesTrigger count={result.sources.length} />
                <AISourcesContent>
                  {result.sources.map((source) => (
                    <AISource
                      href={source.url}
                      key={source.id}
                      title={source.title}
                    />
                  ))}
                </AISourcesContent>
              </AISources>
            }
          />
        )}
      </AIToolContent>
    </AITool>
  );
}
