import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FeedbackSchema = z.object({
  messageId: z.string(),
  sessionId: z.string().optional(),
  rating: z.enum(["up", "down"]),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = FeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid feedback data" }, { status: 400 });
    }

    // In production: store to DB
    console.log("[Feedback]", parsed.data);

    return NextResponse.json({ success: true, message: "Feedback recorded. Thank you." });
  } catch (error) {
    console.error("[/api/feedback] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to record feedback." }, { status: 500 });
  }
}
