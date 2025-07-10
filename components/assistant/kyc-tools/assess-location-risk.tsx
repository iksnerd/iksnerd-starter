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
import { MapPin, Shield, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { LocationRiskResult } from "@/lib/savo-ai-agent/tools/assessLocationRisk";
import { ToolInvocation } from "ai";
import { Badge } from "@/components/ui/badge";
import { getSacoAgentToolByName } from "@/lib/savo-ai-agent/tools";

type Props = {
  result: LocationRiskResult;
  toolCall: ToolInvocation;
};

export function AssessLocationRisk({ result, toolCall }: Props) {
  const name = getSacoAgentToolByName(toolCall.toolName);

  const getRiskColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "LOW":
        return "text-green-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "HIGH":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case "LOW":
        return { variant: "default", text: "Low Risk", color: "bg-green-500" };
      case "MEDIUM":
        return {
          variant: "secondary",
          text: "Medium Risk",
          color: "bg-yellow-500",
        };
      case "HIGH":
        return {
          variant: "destructive",
          text: "High Risk",
          color: "bg-red-500",
        };
      default:
        return {
          variant: "outline",
          text: "Unknown Risk",
          color: "bg-gray-500",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={
          name.description ||
          "Evaluate regulatory and compliance risks for client location"
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
                <AccordionItem value="location-risk">
                  <AccordionTrigger
                    className="text-xs bg-secondary justify-start items-center px-4 w-full font-semibold text-primary hover:text-primary focus-visible:text-primary"
                    value={"location-risk"}
                  >
                    <span className={"w-12"}>
                      <MapPin />
                    </span>
                    <span className="text-xs w-full font-semibold text-primary hover:text-primary focus-visible:text-primary">
                      Location Risk Assessment
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <AccordionHeader className="flex items-center justify-between w-full py-2 rounded-t-md text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:text-primary">
                      <div>
                        <p>
                          <span className="font-semibold">Location:</span>
                          {` ${result.country}${result.city ? `, ${result.city}` : ""}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs text-muted-foreground">
                            Last updated: {formatDate(result.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </AccordionHeader>

                    <div className="space-y-4">
                      {/* Risk Level Overview */}
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            Risk Level
                          </span>
                          <Badge
                            variant={
                              getRiskBadge(result.riskLevel).variant as any
                            }
                            className="text-xs"
                          >
                            {getRiskBadge(result.riskLevel).text}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={cn(
                                "h-2 rounded-full transition-all",
                                getRiskBadge(result.riskLevel).color,
                              )}
                              style={{
                                width: `${(result.riskScore / 10) * 100}%`,
                              }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-bold",
                              getRiskColor(result.riskLevel),
                            )}
                          >
                            {result.riskScore}/10
                          </span>
                        </div>
                      </div>

                      {/* Sanctions Status */}
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            Sanctions Status
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.sanctionsStatus}
                        </p>
                      </div>

                      {/* Regulatory Compliance */}
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">
                            Regulatory Compliance
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.regulatoryCompliance}
                        </p>
                      </div>

                      {/* Recommendations */}
                      {result.recommendations &&
                        result.recommendations.length > 0 && (
                          <div className="p-4 rounded-lg border bg-card">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-medium">
                                Recommendations ({result.recommendations.length}
                                )
                              </span>
                            </div>
                            <div className="space-y-2">
                              {result.recommendations.map(
                                (recommendation, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{recommendation}</span>
                                  </div>
                                ),
                              )}
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
