import { getBurnRate } from "@/lib/ai/tools/get-burn-rate";
import { getWebSearchTool } from "@/lib/ai/tools/web-search/search-web";
import { getBulgarianLegalInfo } from "@/lib/ai/tools/law-info/getLawInformation";
import { parseLeadData } from "@/lib/savo-ai-agent/tools/parseLeadData";
import { scoreClientProfileTool } from "@/lib/savo-ai-agent/tools/score";
import { verifyBusinessTool } from "@/lib/savo-ai-agent/tools/verifyBusiness";
import { assessLocationRiskTool } from "@/lib/savo-ai-agent/tools/assessLocationRisk";
import { verifyIncomeTool } from "@/lib/savo-ai-agent/tools/verifyIncome";

export const tools = {
  getBurnRate: getBurnRate,
  getInformationFromTheWeb: getWebSearchTool,
  getBulgarianLegalInfo: getBulgarianLegalInfo,
  parseLeadData: parseLeadData,
  scoreClientProfile: scoreClientProfileTool,
  verifyBusiness: verifyBusinessTool,
  assessLocationRisk: assessLocationRiskTool,
  verifyIncome: verifyIncomeTool,
};

export const toolActions = {
  getBurnRate: {
    name: "getBurnRate",
    id: "getBurnRate",
    description: "Get the Burn",
  },
  getInformationFromTheWeb: {
    name: "Взимане на информация от мрежата",
    id: "getInformationFromTheWeb",
    description: "Взимане на информация от google и анализиране на резултатите",
  },
  getBulgarianLegalInfo: {
    name: "Търсене на правна информация",
    id: "getBulgarianLegalInfo",
    description: "Търсене на правна информация във вътрешен ресурс",
  },
  parseLeadData: {
    name: "Parse Lead Data",
    id: "parseLeadData",
    description:
      "Extract structured client information from raw text templates",
  },
  scoreClientProfile: {
    name: "Score Client Profile",
    id: "scoreClientProfile",
    description:
      "Calculate KYC score for client profile based on CFD trading criteria",
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

export const getToolByName = (name: string) => {
  // find by key
  const tool = toolActions[name as keyof typeof toolActions];
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
