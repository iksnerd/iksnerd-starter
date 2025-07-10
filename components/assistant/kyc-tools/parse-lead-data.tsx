"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  AITool,
  AIToolContent,
  AIToolHeader,
  AIToolParameters,
  AIToolResult,
} from "@/components/ui/kibo-ui/ai/tool";
import { User, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { GenerateLeadTemplateResult } from "@/lib/savo-ai-agent/tools/parseLeadData";
import { ToolInvocation } from "ai";
import { Badge } from "@/components/ui/badge";
import { getSacoAgentToolByName } from "@/lib/savo-ai-agent/tools";

type Props = {
  result: GenerateLeadTemplateResult;
  toolCall: ToolInvocation;
};

export function ParseLeadData({ result, toolCall }: Props) {
  const name = getSacoAgentToolByName(toolCall.toolName);

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "Not provided";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toLocaleString();
    return value;
  };

  const getFieldIcon = (field: string) => {
    const iconMap = {
      age: "👤",
      work: "💼",
      income: "💰",
      city: "🏙️",
      country: "🌍",
      marital_status: "💍",
      num_kids: "👶",
      has_savings_investments: "💳",
      savings_investments_amount: "💵",
      investment_platforms: "📈",
    };
    return iconMap[field as keyof typeof iconMap] || "📄";
  };

  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={
          name.description || "Extract structured client data from raw text"
        }
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
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="parsed-data">
                  <AccordionTrigger
                    className="text-xs bg-secondary justify-start items-center px-4 w-full font-semibold text-primary hover:text-primary focus-visible:text-primary"
                    value={"parsed-data"}
                  >
                    <span className={"w-12"}>
                      <User />
                    </span>
                    <span className="text-xs w-full font-semibold text-primary hover:text-primary focus-visible:text-primary">
                      Parsed Client Data
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <AccordionHeader className="flex items-center justify-between w-full py-2 rounded-t-md text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:text-primary">
                      <div>
                        <p>
                          <span className="font-semibold">
                            Extraction Results:
                          </span>
                          {
                            " Successfully parsed client information into structured data."
                          }
                        </p>
                      </div>
                    </AccordionHeader>

                    <div className="space-y-3">
                      {Object.entries(result.parsedData).map(
                        ([field, value]) => (
                          <div key={field} className="group/item">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                              <span className="text-lg">
                                {getFieldIcon(field)}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium capitalize">
                                    {field.replace(/_/g, " ")}
                                  </span>
                                  {value !== null && value !== undefined && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      <Hash className="w-3 h-3 mr-1" />
                                      Extracted
                                    </Badge>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "text-sm",
                                    value === null || value === undefined
                                      ? "text-muted-foreground italic"
                                      : "text-foreground font-medium",
                                  )}
                                >
                                  {formatValue(value)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            }
          />
        )}
      </AIToolContent>
    </AITool>
  );
}
