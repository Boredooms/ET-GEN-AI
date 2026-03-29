import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ActionSchema = z.object({
  actionType: z.enum(["save", "subscribe", "register", "explore", "share"]),
  contentId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid action data" }, { status: 400 });
    }

    // In production: log to analytics + DB
    const entry = {
      id: `action_${Date.now()}`,
      ...parsed.data,
      timestamp: new Date().toISOString(),
    };
    console.log("[Action]", entry);

    return NextResponse.json({ success: true, data: { actionId: entry.id } });
  } catch (error) {
    console.error("[/api/actions] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to log action." }, { status: 500 });
  }
}
