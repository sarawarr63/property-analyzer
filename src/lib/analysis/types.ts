export type PropertyCondition = "poor" | "fair" | "good" | "excellent";

export type RepairPriority = "high" | "medium" | "low";

export interface RepairRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  estimatedCost: number;
  priority: RepairPriority;
  roiImpact: "high" | "medium" | "low";
}

export interface PropertySummary {
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  lotSizeSqFt: number;
  propertyType: string;
  condition: PropertyCondition;
  lastSalePrice: number | null;
  lastSaleDate: string | null;
  taxAssessed: number | null;
  dataSource: string;
  isLiveData: boolean;
  externalId?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
}

export interface ValuationResult {
  estimatedValue: number;
  pricePerSqFt: number;
  confidence: "low" | "medium" | "high";
  methodology: string;
}

export interface ProfitAnalysis {
  estimatedValue: number;
  totalRepairCost: number;
  arv: number;
  potentialProfit: number;
  profitMarginPct: number;
  holdingCostsEstimate: number;
  netProfitAfterHolding: number;
}

export interface AnalysisResult {
  summary: PropertySummary;
  valuation: ValuationResult;
  repairs: RepairRecommendation[];
  profit: ProfitAnalysis;
  generatedAt: string;
}

export interface StoredAnalysis extends AnalysisResult {
  id: string;
}
