import type { PropertyCondition } from "./types";

/**
 * Estimates visual/physical condition when no inspection data exists.
 * Uses age as the primary signal for repair recommendations.
 */
export function inferPropertyCondition(
  yearBuilt: number,
  features?: Record<string, unknown>
): PropertyCondition {
  const age = new Date().getFullYear() - yearBuilt;
  const hasPool = features?.pool === true;
  const hasGarage = features?.garage === true;

  if (age <= 8) return "excellent";
  if (age <= 20) return hasPool && hasGarage ? "excellent" : "good";
  if (age <= 40) return "fair";
  return "poor";
}
