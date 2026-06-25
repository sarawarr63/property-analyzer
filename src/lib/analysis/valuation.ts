import type { PropertySummary, ValuationResult } from "./types";

const CONDITION_MULTIPLIERS: Record<PropertySummary["condition"], number> = {
  poor: 0.78,
  fair: 0.88,
  good: 0.97,
  excellent: 1.05,
};

const TYPE_MULTIPLIERS: Record<string, number> = {
  "Single Family": 1.0,
  Townhouse: 0.95,
  Condo: 0.9,
  Duplex: 1.02,
  "Multi-Family": 1.08,
};

function ageAdjustment(yearBuilt: number): number {
  const age = new Date().getFullYear() - yearBuilt;
  if (age <= 10) return 1.04;
  if (age <= 25) return 1.0;
  if (age <= 45) return 0.96;
  return 0.9;
}

/**
 * Estimates current market value using RentCast AVM when available,
 * otherwise a simplified comparable-sales model.
 */
export function estimatePropertyValue(
  summary: PropertySummary,
  rentCastValueEstimate?: number | null
): ValuationResult {
  if (rentCastValueEstimate && rentCastValueEstimate > 0) {
    const pricePerSqFt =
      summary.squareFeet > 0
        ? Math.round(rentCastValueEstimate / summary.squareFeet)
        : 0;

    return {
      estimatedValue: Math.round(rentCastValueEstimate),
      pricePerSqFt,
      confidence: summary.isLiveData ? "high" : "medium",
      methodology:
        "RentCast automated valuation model (AVM) based on local comparable sales",
    };
  }

  const basePricePerSqFt = 165;
  const conditionFactor = CONDITION_MULTIPLIERS[summary.condition];
  const typeFactor = TYPE_MULTIPLIERS[summary.propertyType] ?? 1.0;
  const ageFactor = ageAdjustment(summary.yearBuilt);

  const pricePerSqFt = Math.round(
    basePricePerSqFt * conditionFactor * typeFactor * ageFactor
  );
  const estimatedValue = pricePerSqFt * summary.squareFeet;

  const hasRecentSale =
    summary.lastSalePrice !== null &&
    summary.lastSaleDate !== null &&
    Date.now() - new Date(summary.lastSaleDate).getTime() < 1000 * 60 * 60 * 24 * 365 * 2;

  return {
    estimatedValue: Math.round(estimatedValue),
    pricePerSqFt,
    confidence: hasRecentSale ? "medium" : "low",
    methodology:
      "Comparable sales estimate using sq ft, condition, property type, and age adjustments",
  };
}
