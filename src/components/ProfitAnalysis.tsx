import { formatCurrency } from "@/lib/format";
import type { ProfitAnalysis } from "@/lib/analysis/types";

interface Props {
  profit: ProfitAnalysis;
}

export function ProfitAnalysisSection({ profit }: Props) {
  const isPositive = profit.netProfitAfterHolding >= 0;

  const rows = [
    { label: "Current Estimated Value", value: profit.estimatedValue, type: "neutral" as const },
    { label: "Total Repair Costs", value: -profit.totalRepairCost, type: "cost" as const },
    { label: "After-Repair Value (ARV)", value: profit.arv, type: "highlight" as const },
    {
      label: "Est. Holding Costs (3%)",
      value: -profit.holdingCostsEstimate,
      type: "cost" as const,
    },
    {
      label: "Net Profit (after holding)",
      value: profit.netProfitAfterHolding,
      type: isPositive ? ("profit" as const) : ("loss" as const),
    },
  ];

  return (
    <section className="print-break rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Profit Analysis</h2>
        <p className="mt-1 text-sm text-slate-600">
          Investment scenario based on estimated value, repairs, and projected ARV
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Potential Profit"
          value={formatCurrency(profit.potentialProfit)}
          sublabel="Before holding costs"
          tone={profit.potentialProfit >= 0 ? "positive" : "negative"}
        />
        <MetricCard
          label="After-Repair Value"
          value={formatCurrency(profit.arv)}
          sublabel="Projected sale price"
          tone="neutral"
        />
        <MetricCard
          label="Profit Margin"
          value={`${profit.profitMarginPct}%`}
          sublabel="Net profit / ARV"
          tone={isPositive ? "positive" : "negative"}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-600">{row.label}</td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    row.type === "profit"
                      ? "text-emerald-700"
                      : row.type === "loss"
                        ? "text-red-700"
                        : row.type === "highlight"
                          ? "text-sky-800"
                          : row.type === "cost"
                            ? "text-red-600"
                            : "text-slate-900"
                  }`}
                >
                  {row.value < 0
                    ? `(${formatCurrency(Math.abs(row.value))})`
                    : formatCurrency(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        ARV is calculated by adding estimated value recovery from high-, medium-, and low-ROI
        repairs. Holding costs assume ~3% of property value for a 3-month flip scenario.
      </p>
    </section>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  tone,
}: {
  label: string;
  value: string;
  sublabel: string;
  tone: "positive" | "negative" | "neutral";
}) {
  const toneClasses = {
    positive: "border-emerald-200 bg-emerald-50",
    negative: "border-red-200 bg-red-50",
    neutral: "border-sky-200 bg-sky-50",
  };

  const valueClasses = {
    positive: "text-emerald-800",
    negative: "text-red-800",
    neutral: "text-sky-900",
  };

  return (
    <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClasses[tone]}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
    </div>
  );
}
