import { parseLeadData } from "@/lib/savo-ai-agent/tools/parseLeadData";
import { scoreClientProfileTool } from "@/lib/savo-ai-agent/tools/score";
import { verifyBusinessTool } from "@/lib/savo-ai-agent/tools/verifyBusiness";
import { assessLocationRiskTool } from "@/lib/savo-ai-agent/tools/assessLocationRisk";
import { verifyIncomeTool } from "@/lib/savo-ai-agent/tools/verifyIncome";

export const savoAgentTools = {
  parseLeadData: parseLeadData,
  scoreClientProfileTool: scoreClientProfileTool,
  verifyBusiness: verifyBusinessTool,
  assessLocationRisk: assessLocationRiskTool,
  verifyIncome: verifyIncomeTool,
};

export const toolActionsSavo = {
  parseLeadData: {
    name: "Extract Lead Data",
    id: "parseLeadData",
    description: "Extract structured client data from raw text",
  },
  scoreClientProfileTool: {
    name: "Score Client Profile",
    id: "scoreClientProfileTool",
    description: "Calculate KYC score for client profile",
  },
  verifyBusiness: {
    name: "Verify Business",
    id: "verifyBusiness",
    description: "Verify business ownership claims and assess credibility",
  },
  assessLocationRisk: {
    name: "Assess Location Risk",
    id: "assessLocationRisk",
    description: "Evaluate regulatory and compliance risks for client location",
  },
  verifyIncome: {
    name: "Verify Income",
    id: "verifyIncome",
    description: "Validate income claims against market benchmarks",
  },
};

export const getSacoAgentToolByName = (name: string) => {
  // find by key
  const tool = toolActionsSavo[name as keyof typeof toolActionsSavo];
  if (!tool) {
    return {
      name: "Unknown Tool",
      id: "unknown-tool",
      description: "This tool is not recognized or does not exist.",
    };
  }

  // check if tool is a function
  return tool;
};
