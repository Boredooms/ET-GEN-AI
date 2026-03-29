import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: "ok",
      service: "GENZET AI",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
  });
}
