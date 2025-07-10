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
import {
  Building2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { BusinessVerificationResult } from "@/lib/savo-ai-agent/tools/verifyBusiness";
import { ToolInvocation } from "ai";
import { Badge } from "@/components/ui/badge";
import { getSacoAgentToolByName } from "@/lib/savo-ai-agent/tools";

type Props = {
  result: BusinessVerificationResult;
  toolCall: ToolInvocation;
};

export function VerifyBusiness({ result, toolCall }: Props) {
  const name = getSacoAgentToolByName(toolCall.toolName);

  const getCredibilityColor = (score: number) => {
    if (score >= 7) return "text-green-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 7) return { variant: "default", text: "High Credibility" };
    if (score >= 4) return { variant: "secondary", text: "Medium Credibility" };
    return { variant: "destructive", text: "Low Credibility" };
  };

  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={
          name.description ||
          "Verify business ownership claims and assess credibility"
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
            error={result.error}
            result={
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="business-verification">
                  <AccordionTrigger
                    className="text-xs bg-secondary justify-start items-center px-4 w-full font-semibold text-primary hover:text-primary focus-visible:text-primary"
                    value={"business-verification"}
                  >
                    <span className={"w-12"}>
                      <Building2 />
                    </span>
                    <span className="text-xs w-full font-semibold text-primary hover:text-primary focus-visible:text-primary">
                      Business Verification Results
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <AccordionHeader className="flex items-center justify-between w-full py-2 rounded-t-md text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:text-primary">
                      <div>
                        <p>
                          <span className="font-semibold">Business Name:</span>
                          {` ${result.businessName}`}
                        </p>
                        <p className="mt-1 text-sm">
                          {result.verificationSummary}
                        </p>
                      </div>
                    </AccordionHeader>

                    <div className="space-y-4">
                      {/* Credibility Score */}
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Credibility Score
                          </span>
                          <Badge
                            variant={
                              getCredibilityBadge(result.credibilityScore)
                                .variant as any
                            }
                            className="text-xs"
                          >
                            {getCredibilityBadge(result.credibilityScore).text}
                          </Badge>
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
                              getCredibilityColor(result.credibilityScore),
                            )}
                          >
                            {result.credibilityScore}/10
                          </span>
                        </div>
                      </div>

                      {/* Risk Flags */}
                      {result.riskFlags && result.riskFlags.length > 0 && (
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              Risk Flags
                            </span>
                          </div>
                          <div className="space-y-2">
                            {result.riskFlags.map((flag, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                                {flag}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Findings */}
                      {result.findings && result.findings.length > 0 && (
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">
                              Search Findings ({result.findings.length})
                            </span>
                          </div>
                          <div className="space-y-3">
                            {result.findings.map((finding, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-blue-200 pl-3"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium mb-1">
                                      {finding.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {finding.content}
                                    </p>
                                  </div>
                                  {finding.url && (
                                    <a
                                      href={finding.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
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
