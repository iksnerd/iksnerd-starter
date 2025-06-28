import { tool } from "ai";
import { subMonths } from "date-fns";
import { z } from "zod";

export type GetBurnRateResult = Awaited<ReturnType<typeof getBurnRate.execute>>;

export const getBurnRate = tool({
  description: "Get burn rate",
  parameters: z.object({
    from: z.coerce
      .date()
      .describe("The start date of the burn rate, in ISO-8601 format")
      // Default to 12 months ago
      .default(subMonths(new Date(), 12)),
    to: z.coerce
      .date()
      .describe("The end date of the burn rate, in ISO-8601 format")
      .default(new Date()),
    currency: z.string().describe("The currency for the burn rate").optional(),
  }),
  execute: async (params) => {
    // const queryClient = getQueryClient();
    //
    // const [months, burnRateData] = await Promise.all([
    //   queryClient.fetchQuery(
    //     trpc.metrics.runway.queryOptions({
    //       currency: params.currency,
    //       from: startOfMonth(new Date(params.from)).toISOString(),
    //       to: params.to.toISOString(),
    //     }),
    //   ),
    //   queryClient.fetchQuery(
    //     trpc.metrics.burnRate.queryOptions({
    //       from: startOfMonth(new Date(params.from)).toISOString(),
    //       to: new Date(params.to).toISOString(),
    //       currency: params.currency,
    //     }),
    //   ),
    // ]);
    //
    // const averageBurnRate = calculateAvgBurnRate(burnRateData);

    const averageBurnRate = 1000; // Placeholder for average burn rate calculation
    const months = Math.floor(
      (params.to.getTime() - params.from.getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    );
    return {
      result: `The average burn rate is ${averageBurnRate} ${params.currency} per month and ${months} months of runway left`,
      params: {
        from: params.from.toISOString(),
        to: params.to.toISOString(),
        currency: params.currency,
      },
    };
  },
});
