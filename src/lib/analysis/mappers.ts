import type { AnalysisResult, RepairRecommendation } from "./types";
import type { PropertyAnalysis } from "@prisma/client";

export function mapRecordToAnalysis(
  record: PropertyAnalysis
): AnalysisResult & { id: string } {
  const repairs = record.repairs as RepairRecommendation[];

  return {
    id: record.id,
    summary: {
      address: record.address,
      bedrooms: record.bedrooms,
      bathrooms: record.bathrooms,
      squareFeet: record.squareFeet,
      yearBuilt: record.yearBuilt,
      lotSizeSqFt: record.lotSizeSqFt,
      propertyType: record.propertyType,
      condition: record.condition as AnalysisResult["summary"]["condition"],
      lastSalePrice: record.lastSalePrice,
      lastSaleDate: record.lastSaleDate,
      taxAssessed: record.taxAssessed,
      dataSource: record.dataSource,
      isLiveData: record.isLiveData,
      county: record.county ?? undefined,
    },
    valuation: {
      estimatedValue: record.estimatedValue,
      pricePerSqFt:
        record.squareFeet > 0
          ? Math.round(record.estimatedValue / record.squareFeet)
          : 0,
      confidence: record.isLiveData ? "high" : "medium",
      methodology: record.isLiveData
        ? "RentCast automated valuation model (AVM) based on local comparable sales"
        : "Comparable sales estimate using sq ft, condition, property type, and age adjustments",
    },
    repairs,
    profit: {
      estimatedValue: record.estimatedValue,
      totalRepairCost: record.totalRepairCost,
      arv: record.arv,
      potentialProfit: record.potentialProfit,
      profitMarginPct: record.profitMarginPct,
      holdingCostsEstimate: Math.round(record.estimatedValue * 0.03),
      netProfitAfterHolding:
        record.potentialProfit - Math.round(record.estimatedValue * 0.03),
    },
    generatedAt: record.createdAt.toISOString(),
  };
}
