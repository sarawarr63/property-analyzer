import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mapRecordToAnalysis } from "@/lib/analysis/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.propertyAnalysis.findUnique({ where: { id } });

    if (!record) {
      return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    }

    return NextResponse.json(mapRecordToAnalysis(record));
  } catch (error) {
    console.error("Failed to fetch analysis:", error);
    return NextResponse.json(
      { error: "Failed to load analysis." },
      { status: 500 }
    );
  }
}
