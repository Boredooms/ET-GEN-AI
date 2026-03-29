import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRecommendationsForProfile } from "@/lib/services/et-content";

const RecommendSchema = z.object({
  userType: z.string(),
  interests: z.array(z.string()),
  goals: z.array(z.string()).optional(),
  limit: z.number().min(1).max(12).default(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RecommendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { userType, interests, limit } = parsed.data;

    // Rule-based recommendations — no Gemini call needed
    const items = getRecommendationsForProfile(userType, interests, limit);

    const recommendations = items.map((item, index) => ({
      id: `rec_${Date.now()}_${index}`,
      contentId: item.id,
      item,
      reason: buildReason(userType, interests, item.topic),
      score: (1 - index * 0.1).toFixed(2),
      actionType: item.isPremium ? "subscribe" : "read",
      ctaLabel: item.isPremium ? "Read on ET Prime" : "Read Article",
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: { recommendations, total: recommendations.length },
    });
  } catch (error) {
    console.error("[/api/recommend] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations." },
      { status: 500 }
    );
  }
}

function buildReason(userType: string, interests: string[], topic: string): string {
  const interestMatch = interests.includes(topic);

  if (interestMatch) {
    return `Matches your interest in ${topic.replace(/-/g, " ")}.`;
  }

  const audienceReasons: Record<string, string> = {
    investor: "Relevant to your investment focus.",
    founder: "Useful intelligence for your business context.",
    student: "Helps build your business and finance knowledge.",
    professional: "Aligned with your professional domain.",
    general: "Trending in the ET ecosystem.",
  };

  return audienceReasons[userType] ?? "Recommended based on your profile.";
}
