/**
 * Zerodha OAuth Initiation
 * 
 * Redirects user to Zerodha login page
 * URL: /api/providers/zerodha/connect
 */

import { NextRequest, NextResponse } from "next/server";
import { ProviderFactory } from "@/lib/financial-providers";

// Initialize provider factory with environment variables
ProviderFactory.initialize({
  zerodha: {
    apiKey: process.env.ZERODHA_API_KEY!,
    apiSecret: process.env.ZERODHA_API_SECRET!,
    redirectUrl: process.env.ZERODHA_REDIRECT_URL!,
  },
});

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (you'll need to implement this)
    // For now, we'll use a state parameter to track the user
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get Zerodha provider
    const zerodha = ProviderFactory.getProvider("zerodha");

    // Generate OAuth URL with user ID as state
    const authUrl = zerodha.getAuthUrl(userId);

    // Redirect to Zerodha login
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Zerodha OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 }
    );
  }
}
