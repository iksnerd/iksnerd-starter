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
import { Calculator, TrendingUp, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { GetScoreLeadResult } from "@/lib/savo-ai-agent/tools/score";
import { ToolInvocation } from "ai";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSacoAgentToolByName } from "@/lib/savo-ai-agent/tools";

type Props = {
  result: GetScoreLeadResult;
  toolCall: ToolInvocation;
};

export function ScoreClientProfile({ result, toolCall }: Props) {
  const name = getSacoAgentToolByName(toolCall.toolName);

  const getLeadPotentialColor = (potential: string) => {
    if (potential.includes("High"))
      return "text-red-500 bg-red-50 border-red-200";
    if (potential.includes("Medium"))
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-blue-500 bg-blue-50 border-blue-200";
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  const categoryLabels = {
    age: "Age",
    work: "Occupation",
    maritalAndKids: "Marital & Kids",
    location: "Location",
    workSituation: "Work Situation",
    savings: "Has Savings",
    savingsAmount: "Savings Amount",
    investmentPlatform: "Investment Platform",
  };

  const categoryMaxScores = {
    age: 3,
    work: 3,
    maritalAndKids: 2,
    location: 2,
    workSituation: 2,
    savings: 2,
    savingsAmount: 4,
    investmentPlatform: 3,
  };

  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={
          name.description || "Calculate KYC score for client profile"
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
                <AccordionItem value="kyc-score">
                  <AccordionTrigger
                    className="text-xs bg-secondary justify-start items-center px-4 w-full font-semibold text-primary hover:text-primary focus-visible:text-primary"
                    value={"kyc-score"}
                  >
                    <span className={"w-12"}>
                      <Calculator />
                    </span>
                    <span className="text-xs w-full font-semibold text-primary hover:text-primary focus-visible:text-primary">
                      KYC Score Analysis
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <AccordionHeader className="flex items-center justify-between w-full py-2 rounded-t-md text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:text-primary">
                      <div>
                        <p>
                          <span className="font-semibold">
                            Scoring Results:
                          </span>
                          {
                            " Client assessed according to CFD trading KYC criteria."
                          }
                        </p>
                      </div>
                    </AccordionHeader>

                    {/* Overall Score Summary */}
                    <div className="mb-6 p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-lg">
                            Total Score
                          </span>
                        </div>
                        <Badge
                          className={cn(
                            "text-sm font-bold px-3 py-1",
                            getLeadPotentialColor(result.leadPotential),
                          )}
                        >
                          {result.leadPotential}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold">
                            {result.totalScore} / {result.maxPossibleScore}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(
                              (result.totalScore / result.maxPossibleScore) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (result.totalScore / result.maxPossibleScore) * 100
                          }
                          className="h-3"
                        />
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="font-semibold">
                          Category Breakdown
                        </span>
                      </div>

                      {Object.entries(result.categoryScores).map(
                        ([category, score]) => {
                          const maxScore =
                            categoryMaxScores[
                              category as keyof typeof categoryMaxScores
                            ];
                          const percentage = (score / maxScore) * 100;

                          return (
                            <div key={category} className="group/item">
                              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                      {
                                        categoryLabels[
                                          category as keyof typeof categoryLabels
                                        ]
                                      }
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          "text-sm font-bold",
                                          getScoreColor(score, maxScore),
                                        )}
                                      >
                                        {score} / {maxScore}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {Math.round(percentage)}%
                                      </Badge>
                                    </div>
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className="h-2"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Score Interpretation */}
                    <div className="mt-6 p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">
                          Score Interpretation
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>🔥 High Potential (15-20):</span>
                          <span>Priority conversion target</span>
                        </div>
                        <div className="flex justify-between">
                          <span>⚖️ Medium Potential (10-14):</span>
                          <span>Good prospect, needs nurturing</span>
                        </div>
                        <div className="flex justify-between">
                          <span>❄️ Low Potential (0-9):</span>
                          <span>May not meet suitability criteria</span>
                        </div>
                      </div>
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
