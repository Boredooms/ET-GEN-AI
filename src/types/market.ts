// Market data types

export interface IndexSnapshot {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePct: number;
  trend: "up" | "down" | "flat";
  updatedAt: string;
}

export interface SectorMove {
  sector: string;
  change: number;
  changePct: number;
  leaders: string[];
  laggards: string[];
  signal: string;
}

export interface MarketSignal {
  id: string;
  type: "filing" | "deal" | "earnings" | "policy" | "macro";
  headline: string;
  summary: string;
  impact: "high" | "medium" | "low";
  entities: string[];
  publishedAt: string;
  source: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice?: number;
  change?: number;
  changePct?: number;
  notes?: string;
  addedAt: string;
}
