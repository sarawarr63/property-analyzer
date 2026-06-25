import type { PropertySummary } from "./types";
import { inferPropertyCondition } from "./condition";
import { buildMockPropertySummary, normalizeAddress } from "./mock-property-data";
import {
  fetchRentCastProperty,
  fetchRentCastValueEstimate,
  isRentCastConfigured,
  latestTaxAssessment,
  PropertyNotFoundError,
  type RentCastPropertyRecord,
} from "./providers/rentcast";

function formatSaleDate(isoDate?: string): string | null {
  if (!isoDate) return null;
  return isoDate.split("T")[0] ?? null;
}

function mapRentCastToSummary(record: RentCastPropertyRecord): PropertySummary {
  const taxAssessed = latestTaxAssessment(record.taxAssessments);

  return {
    address: record.formattedAddress,
    bedrooms: record.bedrooms ?? 0,
    bathrooms: record.bathrooms ?? 0,
    squareFeet: record.squareFootage ?? 0,
    yearBuilt: record.yearBuilt ?? 0,
    lotSizeSqFt: record.lotSize ?? 0,
    propertyType: record.propertyType ?? "Single Family",
    condition: inferPropertyCondition(record.yearBuilt ?? 1980, record.features),
    lastSalePrice: record.lastSalePrice ?? null,
    lastSaleDate: formatSaleDate(record.lastSaleDate),
    taxAssessed,
    dataSource: "RentCast Public Records",
    isLiveData: true,
    externalId: record.id,
    county: record.county,
    latitude: record.latitude,
    longitude: record.longitude,
  };
}

export interface PropertyDataResult {
  summary: PropertySummary;
  rentCastValueEstimate: number | null;
}

/**
 * Fetches property data from RentCast when configured, otherwise uses mock data.
 */
export async function fetchPublicPropertyData(
  address: string
): Promise<PropertyDataResult> {
  if (!isRentCastConfigured()) {
    return {
      summary: buildMockPropertySummary(address),
      rentCastValueEstimate: null,
    };
  }

  const record = await fetchRentCastProperty(address);
  if (!record) {
    throw new PropertyNotFoundError(
      "No property records found for this address. Try the full format: street, city, state, ZIP."
    );
  }

  const avm = await fetchRentCastValueEstimate(record.formattedAddress);

  return {
    summary: mapRentCastToSummary(record),
    rentCastValueEstimate: avm?.price ?? null,
  };
}

export { normalizeAddress, PropertyNotFoundError };
