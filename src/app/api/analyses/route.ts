import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const analyses = await prisma.propertyAnalysis.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        address: true,
        estimatedValue: true,
        arv: true,
        potentialProfit: true,
        createdAt: true,
      },
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    return NextResponse.json(
      { error: "Failed to load recent analyses." },
      { status: 500 }
    );
  }
}
