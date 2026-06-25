import type { PropertyCondition, PropertySummary } from "./types";

const PROPERTY_TYPES = [
  "Single Family",
  "Townhouse",
  "Condo",
  "Duplex",
  "Multi-Family",
] as const;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(items: readonly T[], seed: number, index: number): T {
  return items[(seed + index) % items.length];
}

function inferCondition(seed: number): PropertyCondition {
  const conditions: PropertyCondition[] = ["poor", "fair", "good", "excellent"];
  return conditions[seed % conditions.length];
}

export function buildMockPropertySummary(address: string): PropertySummary {
  const normalized = normalizeAddress(address);
  const seed = hashString(normalized);

  const bedrooms = 2 + (seed % 4);
  const bathrooms = 1 + (seed % 3) * 0.5;
  const squareFeet = 900 + (seed % 25) * 100;
  const yearBuilt = 1950 + (seed % 70);
  const lotSizeSqFt = 3000 + (seed % 12) * 500;
  const propertyType = pick(PROPERTY_TYPES, seed, 1);
  const condition = inferCondition(seed);

  const basePrice = squareFeet * (120 + (seed % 80));
  const lastSalePrice = Math.round(basePrice * (0.85 + (seed % 20) / 100));
  const taxAssessed = Math.round(lastSalePrice * 0.82);

  const monthsAgo = 6 + (seed % 48);
  const saleDate = new Date();
  saleDate.setMonth(saleDate.getMonth() - monthsAgo);

  return {
    address: address.trim(),
    bedrooms,
    bathrooms,
    squareFeet,
    yearBuilt,
    lotSizeSqFt,
    propertyType,
    condition,
    lastSalePrice,
    lastSaleDate: saleDate.toISOString().split("T")[0],
    taxAssessed,
    dataSource: "Simulated data (add RENTCAST_API_KEY for real records)",
    isLiveData: false,
  };
}

export function normalizeAddress(address: string): string {
  return address.trim().toLowerCase().replace(/\s+/g, " ");
}
