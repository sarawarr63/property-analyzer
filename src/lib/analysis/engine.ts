import type {
  AnalysisResult,
  ProfitAnalysis,
  RepairRecommendation,
} from "./types";
import { fetchPublicPropertyData, normalizeAddress } from "./property-data";
import { estimatePropertyValue } from "./valuation";
import {
  generateRepairRecommendations,
  sumRepairCosts,
} from "./repairs";

function calculateArv(
  estimatedValue: number,
  repairs: RepairRecommendation[]
): number {
  const highRoiBoost = repairs
    .filter((r) => r.roiImpact === "high")
    .reduce((sum, r) => sum + r.estimatedCost * 0.65, 0);

  const mediumRoiBoost = repairs
    .filter((r) => r.roiImpact === "medium")
    .reduce((sum, r) => sum + r.estimatedCost * 0.35, 0);

  const lowRoiBoost = repairs
    .filter((r) => r.roiImpact === "low")
    .reduce((sum, r) => sum + r.estimatedCost * 0.15, 0);

  return Math.round(estimatedValue + highRoiBoost + mediumRoiBoost + lowRoiBoost);
}

function calculateProfit(
  estimatedValue: number,
  totalRepairCost: number,
  arv: number
): ProfitAnalysis {
  const holdingCostsEstimate = Math.round(estimatedValue * 0.03);
  const potentialProfit = arv - estimatedValue - totalRepairCost;
  const netProfitAfterHolding = potentialProfit - holdingCostsEstimate;
  const profitMarginPct =
    arv > 0 ? Math.round((netProfitAfterHolding / arv) * 1000) / 10 : 0;

  return {
    estimatedValue,
    totalRepairCost,
    arv,
    potentialProfit,
    profitMarginPct,
    holdingCostsEstimate,
    netProfitAfterHolding,
  };
}

/**
 * Orchestrates the full property analysis pipeline.
 */
export async function runPropertyAnalysis(address: string): Promise<AnalysisResult> {
  const { summary, rentCastValueEstimate } = await fetchPublicPropertyData(address);
  const valuation = estimatePropertyValue(summary, rentCastValueEstimate);
  const repairs = generateRepairRecommendations(summary);
  const totalRepairCost = sumRepairCosts(repairs);
  const arv = calculateArv(valuation.estimatedValue, repairs);
  const profit = calculateProfit(
    valuation.estimatedValue,
    totalRepairCost,
    arv
  );

  return {
    summary,
    valuation,
    repairs,
    profit,
    generatedAt: new Date().toISOString(),
  };
}

export { normalizeAddress };
