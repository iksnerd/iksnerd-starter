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
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { IncomeVerificationResult } from "@/lib/savo-ai-agent/tools/verifyIncome";
import { ToolInvocation } from "ai";
import { Badge } from "@/components/ui/badge";
import { getSacoAgentToolByName } from "@/lib/savo-ai-agent/tools";

type Props = {
  result: IncomeVerificationResult;
  toolCall: ToolInvocation;
};

export function VerifyIncome({ result, toolCall }: Props) {
  const name = getSacoAgentToolByName(toolCall.toolName);

  const getCredibilityBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case "HIGH":
        return {
          variant: "default" as const,
          text: "High Credibility",
          icon: CheckCircle,
        };
      case "MEDIUM":
        return {
          variant: "secondary" as const,
          text: "Medium Credibility",
          icon: AlertCircle,
        };
      case "LOW":
        return {
          variant: "destructive" as const,
          text: "Low Credibility",
          icon: AlertCircle,
        };
      case "UNCERTAIN":
        return {
          variant: "outline" as const,
          text: "Uncertain",
          icon: AlertCircle,
        };
      default:
        return {
          variant: "outline" as const,
          text: "Unknown",
          icon: AlertCircle,
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const badge = getCredibilityBadge(result.credibilityLevel);
  const IconComponent = badge.icon;

  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={
          name.description || "Validate income claims against market benchmarks"
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
                <AccordionItem value="income-verification">
                  <AccordionTrigger
                    className="text-xs bg-secondary justify-start items-center px-4 w-full font-semibold text-primary hover:text-primary focus-visible:text-primary"
                    value={"income-verification"}
                  >
                    <span className={"w-12"}>
                      <DollarSign />
                    </span>
                    <span className="text-xs w-full font-semibold text-primary hover:text-primary focus-visible:text-primary">
                      Income Verification Results
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <AccordionHeader className="flex items-center justify-between w-full py-2 rounded-t-md text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:text-primary">
                      <div>
                        <p>
                          <span className="font-semibold">Occupation:</span>
                          {` ${result.occupation}`}
                        </p>
                        <p className="mt-1 text-sm">
                          Claimed Income: {formatCurrency(result.claimedIncome)}{" "}
                          /month
                        </p>
                        <p className="mt-1 text-sm">
                          Location: {result.location}
                        </p>
                      </div>
                    </AccordionHeader>

                    <div className="space-y-4">
                      {/* Credibility Status */}
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Credibility Assessment
                          </span>
                          <Badge
                            variant={badge.variant}
                            className="text-xs flex items-center gap-1"
                          >
                            <IconComponent className="w-3 h-3" />
                            {badge.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.searchSummary}
                        </p>
                      </div>

                      {/* Credibility Score */}
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            Credibility Score
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-400 rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                result.credibilityScore >= 7
                                  ? "bg-green-500"
                                  : result.credibilityScore >= 4
                                    ? "bg-yellow-500"
                                    : "bg-red-500",
                              )}
                              style={{
                                width: `${(result.credibilityScore / 10) * 100}%`,
                              }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-bold",
                              result.credibilityScore >= 7
                                ? "text-green-600"
                                : result.credibilityScore >= 4
                                  ? "text-yellow-600"
                                  : "text-red-600",
                            )}
                          >
                            {result.credibilityScore}/10
                          </span>
                        </div>
                      </div>

                      {/* Market Benchmarks */}
                      {result.benchmarkIncome &&
                        result.benchmarkIncome.average > 0 && (
                          <div className="p-4 rounded-lg border bg-card">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">
                                Market Benchmarks
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="text-center p-2 bg-secondary rounded">
                                <p className="text-xs text-muted-foreground">
                                  Minimum
                                </p>
                                <p className="text-sm font-semibold text-red-600">
                                  {formatCurrency(result.benchmarkIncome.min)}
                                </p>
                              </div>
                              <div className="text-center p-2 bg-secondary rounded">
                                <p className="text-xs text-muted-foreground">
                                  Average
                                </p>
                                <p className="text-sm font-semibold text-green-600">
                                  {formatCurrency(
                                    result.benchmarkIncome.average,
                                  )}
                                </p>
                              </div>
                              <div className="text-center p-2 bg-secondary rounded">
                                <p className="text-xs text-muted-foreground">
                                  Maximum
                                </p>
                                <p className="text-sm font-semibold text-blue-600">
                                  {formatCurrency(result.benchmarkIncome.max)}
                                </p>
                              </div>
                            </div>
                            {result.benchmarkIncome.source &&
                              result.benchmarkIncome.source !==
                                "unavailable" && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Source: {result.benchmarkIncome.source}
                                </p>
                              )}
                          </div>
                        )}

                      {/* Risk Flags */}
                      {result.riskFlags && result.riskFlags.length > 0 && (
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">
                              Risk Flags ({result.riskFlags.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {result.riskFlags.map(
                              (flag: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{flag}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Recommendation */}
                      {result.recommendation && (
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">
                              Recommendation
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{result.recommendation}</span>
                          </div>
                        </div>
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
