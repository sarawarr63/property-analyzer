import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runPropertyAnalysis, normalizeAddress } from "@/lib/analysis/engine";
import { PropertyNotFoundError } from "@/lib/analysis/property-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = typeof body.address === "string" ? body.address.trim() : "";

    if (!address || address.length < 5) {
      return NextResponse.json(
        { error: "Please enter a valid property address (at least 5 characters)." },
        { status: 400 }
      );
    }

    const result = await runPropertyAnalysis(address);
    const normalized = normalizeAddress(address);

    const saved = await prisma.propertyAnalysis.create({
      data: {
        address: result.summary.address,
        normalizedAddress: normalized,
        bedrooms: result.summary.bedrooms,
        bathrooms: result.summary.bathrooms,
        squareFeet: result.summary.squareFeet,
        yearBuilt: result.summary.yearBuilt,
        lotSizeSqFt: result.summary.lotSizeSqFt,
        propertyType: result.summary.propertyType,
        condition: result.summary.condition,
        lastSalePrice: result.summary.lastSalePrice,
        lastSaleDate: result.summary.lastSaleDate,
        taxAssessed: result.summary.taxAssessed,
        dataSource: result.summary.dataSource,
        isLiveData: result.summary.isLiveData,
        county: result.summary.county ?? null,
        estimatedValue: result.valuation.estimatedValue,
        totalRepairCost: result.profit.totalRepairCost,
        arv: result.profit.arv,
        potentialProfit: result.profit.potentialProfit,
        profitMarginPct: result.profit.profitMarginPct,
        repairs: result.repairs,
      },
    });

    return NextResponse.json({
      id: saved.id,
      ...result,
    });
  } catch (error) {
    if (error instanceof PropertyNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Failed to analyze property. Please try again." },
      { status: 500 }
    );
  }
}
