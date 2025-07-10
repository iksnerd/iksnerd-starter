import { GetBurnRateResult } from "@/lib/ai/tools/get-burn-rate";

type Props = {
  result: GetBurnRateResult;
};

export function BurnRate({ result }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Burn Rate</h3>
      <p className="text-sm text-gray-600">
        {result.params.from} to {result.params.to}
      </p>
      <p className="text-base">{result.result}</p>
    </div>
  );
}
