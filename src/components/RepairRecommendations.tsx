import { formatCurrency, titleCase } from "@/lib/format";
import type { RepairRecommendation } from "@/lib/analysis/types";

interface Props {
  repairs: RepairRecommendation[];
  totalRepairCost: number;
}

const priorityStyles = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-700",
};

const roiStyles = {
  high: "text-emerald-700",
  medium: "text-amber-700",
  low: "text-slate-600",
};

export function RepairRecommendationsSection({ repairs, totalRepairCost }: Props) {
  return (
    <section className="print-break rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Repair Recommendations</h2>
          <p className="mt-1 text-sm text-slate-600">
            Suggested improvements ranked by priority and ROI impact
          </p>
        </div>
        <div className="rounded-lg bg-slate-900 px-4 py-2 text-right text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Total Repair Cost
          </p>
          <p className="text-2xl font-bold">{formatCurrency(totalRepairCost)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {repairs.map((repair) => (
          <article
            key={repair.id}
            className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {repair.category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[repair.priority]}`}
                  >
                    {titleCase(repair.priority)} priority
                  </span>
                  <span className={`text-xs font-medium ${roiStyles[repair.roiImpact]}`}>
                    {titleCase(repair.roiImpact)} ROI impact
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{repair.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{repair.description}</p>
              </div>
              <p className="text-lg font-bold text-slate-900 sm:text-right">
                {formatCurrency(repair.estimatedCost)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
