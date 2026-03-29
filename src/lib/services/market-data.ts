// Market Data Service — Mock market signals and index data
// In production, this connects to NSE/BSE data APIs

import type { IndexSnapshot, SectorMove, MarketSignal, WatchlistItem } from "@/types";

const MARKET_INDICES: IndexSnapshot[] = [
  {
    name: "NIFTY 50",
    symbol: "^NSEI",
    value: 22_847.5,
    change: 271.3,
    changePct: 1.20,
    trend: "up",
    updatedAt: new Date().toISOString(),
  },
  {
    name: "SENSEX",
    symbol: "^BSESN",
    value: 75_432.8,
    change: 892.6,
    changePct: 1.17,
    trend: "up",
    updatedAt: new Date().toISOString(),
  },
  {
    name: "BANK NIFTY",
    symbol: "^NSEBANK",
    value: 48_125.4,
    change: -143.6,
    changePct: -0.29,
    trend: "down",
    updatedAt: new Date().toISOString(),
  },
  {
    name: "NIFTY IT",
    symbol: "^NSEI_IT",
    value: 36_218.9,
    change: 512.4,
    changePct: 1.43,
    trend: "up",
    updatedAt: new Date().toISOString(),
  },
];

const SECTOR_MOVES: SectorMove[] = [
  {
    sector: "Information Technology",
    change: 2.1,
    changePct: 1.43,
    leaders: ["TCS", "Infosys", "HCL Tech"],
    laggards: ["Wipro"],
    signal: "Strong buy signals on AI-led revenue upgrades",
  },
  {
    sector: "Banking & Finance",
    change: -0.4,
    changePct: -0.29,
    leaders: ["HDFC Bank"],
    laggards: ["ICICI Bank", "Axis Bank"],
    signal: "Caution as NPA data release approaches",
  },
  {
    sector: "Consumer Goods",
    change: 1.8,
    changePct: 0.97,
    leaders: ["HUL", "Nestle"],
    laggards: ["Dabur"],
    signal: "Rural demand recovery story gaining traction",
  },
];

const MARKET_SIGNALS: MarketSignal[] = [
  {
    id: "sig-001",
    type: "policy",
    headline: "RBI Holds Rates at 6.25% — Third Consecutive Pause",
    summary: "The Monetary Policy Committee voted 5-1 to maintain the repo rate, signalling comfort with the current inflation trajectory. Markets rallied on the dovish tone.",
    impact: "high",
    entities: ["RBI", "MPC", "Repo Rate"],
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: "ET Markets",
  },
  {
    id: "sig-002",
    type: "earnings",
    headline: "TCS Q4 Results: Revenue Up 11%, PAT at ₹12,400 Cr",
    summary: "India's largest IT company beat consensus estimates with strong deal wins in BFSI and healthcare verticals. Management guided for continued margin improvement.",
    impact: "high",
    entities: ["TCS", "Tata Group", "IT Sector"],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: "ET Markets",
  },
  {
    id: "sig-003",
    type: "deal",
    headline: "Adani Group Acquires 49% Stake in NDTV World",
    summary: "The conglomerate has signed a binding agreement to acquire nearly half of NDTV's international broadcasting arm, expanding its media footprint.",
    impact: "medium",
    entities: ["Adani Group", "NDTV", "Media"],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: "ET Corporate",
  },
];

export function getMarketIndices(): IndexSnapshot[] {
  // Add slight random variation to simulate live data
  return MARKET_INDICES.map((idx) => ({
    ...idx,
    value: parseFloat((idx.value * (1 + (Math.random() - 0.5) * 0.002)).toFixed(1)),
    updatedAt: new Date().toISOString(),
  }));
}

export function getSectorMoves(): SectorMove[] {
  return SECTOR_MOVES;
}

export function getMarketSignals(limit = 5): MarketSignal[] {
  return MARKET_SIGNALS.slice(0, limit);
}

export function getMarketSignalsByType(type: MarketSignal["type"]): MarketSignal[] {
  return MARKET_SIGNALS.filter((s) => s.type === type);
}
