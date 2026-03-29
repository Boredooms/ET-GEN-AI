/**
 * Zerodha OAuth Callback Handler
 * 
 * Handles the redirect after user completes Zerodha login
 * URL: /api/providers/zerodha/callback?request_token=xxx&status=success
 */

import { NextRequest, NextResponse } from "next/server";
import { ProviderFactory } from "@/lib/financial-providers";

// Initialize provider
ProviderFactory.initialize({
  zerodha: {
    apiKey: process.env.ZERODHA_API_KEY!,
    apiSecret: process.env.ZERODHA_API_SECRET!,
    redirectUrl: process.env.ZERODHA_REDIRECT_URL!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestToken = searchParams.get("request_token");
    const status = searchParams.get("status");
    const state = searchParams.get("state"); // This contains the user ID

    // Check for errors
    if (status === "error" || !requestToken) {
      return NextResponse.redirect(
        new URL("/dashboard?provider_error=zerodha_auth_failed", request.url)
      );
    }

    if (!state) {
      return NextResponse.redirect(
        new URL("/dashboard?provider_error=missing_user_id", request.url)
      );
    }

    // Get provider instance
    const zerodha = ProviderFactory.getProvider("zerodha");

    // Exchange request token for access token
    const credentials = await zerodha.exchangeToken(requestToken);

    // Redirect back to dashboard with success and credentials
    const response = NextResponse.redirect(
      new URL("/dashboard?provider_connected=zerodha", request.url)
    );

    // Store credentials temporarily for client-side processing
    response.cookies.set("zerodha_temp_token", JSON.stringify({
      ...credentials,
      userId: state,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 300, // 5 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Zerodha OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?provider_error=zerodha_token_exchange_failed", request.url)
    );
  }
}
