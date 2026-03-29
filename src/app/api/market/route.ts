import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "^NSEI"; // Default to Nifty 50
  const range = searchParams.get("range") || "1d";
  const interval = searchParams.get("interval") || "2m";

  try {
    // Yahoo Finance unofficial chart API
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `Symbol not found: ${symbol}` },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch from Yahoo Finance: ${response.statusText}`);
    }

    const rawData = await response.json();
    const result = rawData.chart.result[0];
    
    // Transform Yahoo data for Recharts
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;
    const previousClose = result.meta.previousClose;

    const data = timestamps.map((ts: number, i: number) => ({
      time: new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(prices[i] * 100) / 100,
      predicted: null, // We'll add prediction logic in the component or here
    })).filter((d: { value: number | null }) => d.value !== null);

    return NextResponse.json({
      symbol: result.meta.symbol,
      price: result.meta.regularMarketPrice,
      change: result.meta.regularMarketPrice - previousClose,
      changePercent: ((result.meta.regularMarketPrice - previousClose) / previousClose) * 100,
      history: data,
    });
  } catch (error) {
    console.error("Market API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
