import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMarketSignals } from "@/lib/services/market-data";
import { searchContent } from "@/lib/services/et-content";

const InsightsRequestSchema = z.object({
  userType: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InsightsRequestSchema.safeParse(body);
    const { userType = "general", interests = [] } = parsed.success ? parsed.data : {};

    const signals = getMarketSignals(5);
    const stories = searchContent(interests.join(" ") || userType, 4);

    return NextResponse.json({
      success: true,
      data: { signals, stories, generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("[/api/insights] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load insights." }, { status: 500 });
  }
}

export async function GET() {
  const signals = getMarketSignals(5);
  return NextResponse.json({ success: true, data: { signals } });
}
