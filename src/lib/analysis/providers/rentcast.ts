export interface RentCastPropertyRecord {
  id: string;
  formattedAddress: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: number;
  yearBuilt: number;
  lastSaleDate?: string;
  lastSalePrice?: number;
  taxAssessments?: Record<string, { year: number; value: number }>;
  features?: Record<string, unknown>;
}

export interface RentCastValueEstimate {
  price: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  subjectProperty?: RentCastPropertyRecord;
}

function getApiKey(): string | undefined {
  return process.env.RENTCAST_API_KEY?.trim() || undefined;
}

export function isRentCastConfigured(): boolean {
  return Boolean(getApiKey());
}

async function rentCastFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("RENTCAST_API_KEY is not configured");
  }

  const url = new URL(`https://api.rentcast.io/v1${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Api-Key": apiKey,
    },
    next: { revalidate: 0 },
  });

  if (response.status === 404) {
    throw new PropertyNotFoundError(
      "No property records found for this address. Include street, city, state, and ZIP."
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`RentCast API error (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

export class PropertyNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PropertyNotFoundError";
  }
}

export async function fetchRentCastProperty(
  address: string
): Promise<RentCastPropertyRecord | null> {
  const records = await rentCastFetch<RentCastPropertyRecord[]>("/properties", {
    address,
  });

  return records[0] ?? null;
}

export async function fetchRentCastValueEstimate(
  address: string
): Promise<RentCastValueEstimate | null> {
  try {
    return await rentCastFetch<RentCastValueEstimate>("/avm/value", {
      address,
      lookupSubjectAttributes: "true",
    });
  } catch {
    return null;
  }
}

export function latestTaxAssessment(
  taxAssessments?: Record<string, { year: number; value: number }>
): number | null {
  if (!taxAssessments) return null;

  const entries = Object.values(taxAssessments);
  if (entries.length === 0) return null;

  return entries.sort((a, b) => b.year - a.year)[0]?.value ?? null;
}
