import { getBurnRate } from "@/lib/ai/tools/get-burn-rate";

export const tools = {
  getBurnRate: getBurnRate,
};

export const toolActions = {
  getBurnRate: {
    name: "getBurnRate",
    id: "getBurnRate",
    description: "Get the Burn",
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
