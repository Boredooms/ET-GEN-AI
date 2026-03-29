/**
 * Financial Provider Integration Types
 * 
 * Unified types for integrating multiple Indian investment platforms
 * Currently supports: Zerodha (Kite Connect), Upstox
 */

export type ProviderType = "zerodha" | "upstox";

export interface ProviderConfig {
  id: ProviderType;
  name: string;
  logo: string;
  apiKey: string;
  apiSecret: string;
  redirectUrl: string;
  authUrl: string;
  tokenUrl: string;
  apiBaseUrl: string;
}

export interface ProviderCredentials {
  userId: string;
  providerId: ProviderType;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp
  createdAt: number;
  updatedAt: number;
}

export interface Holding {
  symbol: string;
  exchange: string;
  isin?: string;
  quantity: number;
  averagePrice: number;
  lastPrice: number;
  currentValue: number;
  investedValue: number;
  pnl: number;
  pnlPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

export interface Position {
  symbol: string;
  exchange: string;
  product: string; // "MIS", "NRML", "CNC", etc.
  quantity: number;
  averagePrice: number;
  lastPrice: number;
  pnl: number;
  unrealised: number;
  realised: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  holdings: Holding[];
  positions: Position[];
}

export interface UserFunds {
  availableCash: number;
  usedMargin: number;
  netWorth: number;
  collateral: number;
}

export interface ProviderAPI {
  /**
   * Initialize OAuth login flow
   * Returns the authorization URL to redirect user to
   */
  getAuthUrl(state?: string): string;

  /**
   * Exchange authorization code for access token
   */
  exchangeToken(requestToken: string): Promise<ProviderCredentials>;

  /**
   * Fetch user's holdings (long-term equity)
   */
  getHoldings(accessToken: string): Promise<Holding[]>;

  /**
   * Fetch user's positions (short-term, intraday)
   */
  getPositions(accessToken: string): Promise<Position[]>;

  /**
   * Fetch user's funds and margin information
   */
  getFunds(accessToken: string): Promise<UserFunds>;

  /**
   * Get complete portfolio summary
   */
  getPortfolioSummary(accessToken: string): Promise<PortfolioSummary>;

  /**
   * Refresh access token (if supported)
   */
  refreshAccessToken?(refreshToken: string): Promise<ProviderCredentials>;
}
