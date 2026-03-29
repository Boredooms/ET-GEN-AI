/**
 * Save Zerodha Credentials
 * 
 * Reads credentials from temporary cookie and returns them
 * Client will then save to Convex
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const credentialsCookie = cookieStore.get("zerodha_temp_token");

    if (!credentialsCookie) {
      return NextResponse.json(
        { error: "No credentials found" },
        { status: 404 }
      );
    }

    const credentials = JSON.parse(credentialsCookie.value);

    // Delete the temporary cookie
    const response = NextResponse.json(credentials);
    response.cookies.delete("zerodha_temp_token");

    return response;
  } catch (error) {
    console.error("Failed to retrieve credentials:", error);
    return NextResponse.json(
      { error: "Failed to retrieve credentials" },
      { status: 500 }
    );
  }
}
