import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertySummarySection } from "@/components/PropertySummary";
import { RepairRecommendationsSection } from "@/components/RepairRecommendations";
import { ProfitAnalysisSection } from "@/components/ProfitAnalysis";
import { PrintButton } from "@/components/PrintButton";
import { prisma } from "@/lib/db";
import { mapRecordToAnalysis } from "@/lib/analysis/mappers";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await prisma.propertyAnalysis.findUnique({ where: { id } });

  if (!record) {
    notFound();
  }

  const analysis = mapRecordToAnalysis(record);
  const isProfitable = analysis.profit.netProfitAfterHolding >= 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="no-print mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-teal-700 hover:text-teal-600"
        >
          ← Back to Dashboard
        </Link>
        <PrintButton />
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
              Investment Report
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {analysis.summary.address}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Generated {formatDate(analysis.generatedAt)}
            </p>
          </div>
          <div
            className={`rounded-xl px-5 py-3 text-center ${
              isProfitable
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide">Verdict</p>
            <p className="text-lg font-bold">
              {isProfitable ? "Potential Deal" : "Low Margin"}
            </p>
            <p className="text-sm">
              Net: {formatCurrency(analysis.profit.netProfitAfterHolding)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <PropertySummarySection
          summary={analysis.summary}
          valuation={analysis.valuation}
          generatedAt={analysis.generatedAt}
        />
        <RepairRecommendationsSection
          repairs={analysis.repairs}
          totalRepairCost={analysis.profit.totalRepairCost}
        />
        <ProfitAnalysisSection profit={analysis.profit} />
      </div>
    </div>
  );
}
