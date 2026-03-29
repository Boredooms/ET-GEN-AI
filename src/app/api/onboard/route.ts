import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateProfileSummary } from "@/lib/ai/orchestrator";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const OnboardSchema = z.object({
  name: z.string().optional(),
  userType: z.enum(["student", "investor", "founder", "professional", "general"]),
  interests: z.array(z.string()).min(1).max(10),
  goals: z.array(z.string()).min(1).max(6),
  language: z.enum(["english", "hindi", "both", "en"]).default("english"),
  riskLevel: z.enum(["low", "medium", "high", "moderate"]).default("medium"),
  consentGiven: z.boolean(),
  deviceId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OnboardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid profile data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const profileData = parsed.data;

    if (!profileData.consentGiven) {
      return NextResponse.json(
        { success: false, error: "Consent is required to proceed." },
        { status: 400 }
      );
    }

    const profileSummary = await generateProfileSummary({
      userType: profileData.userType,
      interests: profileData.interests,
      goals: profileData.goals,
    });

    const deviceId = profileData.deviceId || "unknown_device";

    // Save to Convex DB
    if (process.env.NEXT_PUBLIC_CONVEX_URL) {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
      
      await convex.mutation(api.profiles.saveProfile, {
        deviceId,
        userType: profileData.userType,
        interests: profileData.interests,
        goals: profileData.goals,
        language: profileData.language,
        riskLevel: profileData.riskLevel,
        consentGiven: profileData.consentGiven,
        profileSummary,
      });
    } else {
      console.warn("NEXT_PUBLIC_CONVEX_URL is not defined. Skipping database save.");
    }

    return NextResponse.json({
      success: true,
      message: "Profile created successfully.",
    });
  } catch (error) {
    console.error("[/api/onboard] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create profile." },
      { status: 500 }
    );
  }
}
