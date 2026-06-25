import { formatCurrency, formatDate, formatNumber, titleCase } from "@/lib/format";
import type { PropertySummary, ValuationResult } from "@/lib/analysis/types";

interface Props {
  summary: PropertySummary;
  valuation: ValuationResult;
  generatedAt: string;
}

export function PropertySummarySection({ summary, valuation, generatedAt }: Props) {
  const stats = [
    { label: "Bedrooms", value: String(summary.bedrooms) },
    { label: "Bathrooms", value: String(summary.bathrooms) },
    { label: "Square Feet", value: formatNumber(summary.squareFeet) },
    { label: "Year Built", value: String(summary.yearBuilt) },
    { label: "Lot Size", value: `${formatNumber(summary.lotSizeSqFt)} sq ft` },
    { label: "Property Type", value: summary.propertyType },
    { label: "Condition", value: titleCase(summary.condition) },
    {
      label: "Last Sale",
      value: summary.lastSalePrice
        ? `${formatCurrency(summary.lastSalePrice)} (${summary.lastSaleDate})`
        : "N/A",
    },
    {
      label: "Tax Assessed",
      value: summary.taxAssessed ? formatCurrency(summary.taxAssessed) : "N/A",
    },
  ];

  return (
    <section className="print-break rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Property Summary</h2>
          <p className="mt-1 text-sm text-slate-600">{summary.address}</p>
        </div>
        <div className="rounded-lg bg-teal-50 px-4 py-2 text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
            Estimated Value
          </p>
          <p className="text-2xl font-bold text-teal-900">
            {formatCurrency(valuation.estimatedValue)}
          </p>
          <p className="text-xs text-teal-700">
            {formatCurrency(valuation.pricePerSqFt)}/sq ft · {titleCase(valuation.confidence)}{" "}
            confidence
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {stat.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-slate-500">
        Source: {summary.dataSource}
        {summary.county ? ` · ${summary.county} County` : ""}
        {" · "}Report generated {formatDate(generatedAt)}
      </p>
      {summary.isLiveData && (
        <p className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          Live property records
        </p>
      )}
      <p className="mt-1 text-xs text-slate-400">{valuation.methodology}</p>
    </section>
  );
}
