/**
 * Zerodha (Kite Connect) API Integration
 * 
 * Documentation: https://kite.trade/docs/connect/v3/
 */

import type {
  ProviderAPI,
  ProviderCredentials,
  Holding,
  Position,
  UserFunds,
  PortfolioSummary,
} from "./types";
import crypto from "crypto";

export class ZerodhaProvider implements ProviderAPI {
  private apiKey: string;
  private apiSecret: string;
  private redirectUrl: string;
  private baseUrl = "https://api.kite.trade";
  private authUrl = "https://kite.zerodha.com/connect/login";

  constructor(apiKey: string, apiSecret: string, redirectUrl: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.redirectUrl = redirectUrl;
  }

  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      v: "3",
      api_key: this.apiKey,
    });

    if (state) {
      params.append("redirect_params", encodeURIComponent(`state=${state}`));
    }

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeToken(requestToken: string): Promise<ProviderCredentials> {
    // Generate checksum: SHA-256(api_key + request_token + api_secret)
    const checksum = crypto
      .createHash("sha256")
      .update(this.apiKey + requestToken + this.apiSecret)
      .digest("hex");

    const response = await fetch(`${this.baseUrl}/session/token`, {
      method: "POST",
      headers: {
        "X-Kite-Version": "3",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        api_key: this.apiKey,
        request_token: requestToken,
        checksum: checksum,
      }),
    });

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to exchange token");
    }

    const now = Date.now();
    // Kite tokens expire at 6 AM next day (regulatory requirement)
    const tomorrow6AM = new Date();
    tomorrow6AM.setDate(tomorrow6AM.getDate() + 1);
    tomorrow6AM.setHours(6, 0, 0, 0);

    return {
      userId: data.data.user_id,
      providerId: "zerodha",
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresAt: tomorrow6AM.getTime(),
      createdAt: now,
      updatedAt: now,
    };
  }

  async getHoldings(accessToken: string): Promise<Holding[]> {
    const response = await fetch(`${this.baseUrl}/portfolio/holdings`, {
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch holdings");
    }

    return data.data.map((holding: any) => ({
      symbol: holding.tradingsymbol,
      exchange: holding.exchange,
      isin: holding.isin,
      quantity: holding.quantity,
      averagePrice: holding.average_price,
      lastPrice: holding.last_price,
      currentValue: holding.last_price * holding.quantity,
      investedValue: holding.average_price * holding.quantity,
      pnl: holding.pnl,
      pnlPercentage: (holding.pnl / (holding.average_price * holding.quantity)) * 100,
      dayChange: holding.day_change,
      dayChangePercentage: holding.day_change_percentage,
    }));
  }

  async getPositions(accessToken: string): Promise<Position[]> {
    const response = await fetch(`${this.baseUrl}/portfolio/positions`, {
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch positions");
    }

    // Return "net" positions (actual current positions)
    return data.data.net.map((position: any) => ({
      symbol: position.tradingsymbol,
      exchange: position.exchange,
      product: position.product,
      quantity: position.quantity,
      averagePrice: position.average_price,
      lastPrice: position.last_price,
      pnl: position.pnl,
      unrealised: position.unrealised,
      realised: position.realised,
    }));
  }

  async getFunds(accessToken: string): Promise<UserFunds> {
    const response = await fetch(`${this.baseUrl}/user/margins`, {
      headers: {
        "X-Kite-Version": "3",
        Authorization: `token ${this.apiKey}:${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch funds");
    }

    const equity = data.data.equity;
    const commodity = data.data.commodity;

    return {
      availableCash: equity.available.cash + commodity.available.cash,
      usedMargin: equity.utilised.debits + commodity.utilised.debits,
      netWorth: equity.net + commodity.net,
      collateral: equity.available.collateral + commodity.available.collateral,
    };
  }

  async getPortfolioSummary(accessToken: string): Promise<PortfolioSummary> {
    const [holdings, positions, funds] = await Promise.all([
      this.getHoldings(accessToken),
      this.getPositions(accessToken),
      this.getFunds(accessToken),
    ]);

    const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
    const dayChange = holdings.reduce((sum, h) => sum + h.dayChange * h.quantity, 0);

    return {
      totalValue,
      totalInvested,
      totalPnl,
      totalPnlPercentage: totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0,
      dayChange,
      dayChangePercentage: totalValue > 0 ? (dayChange / totalValue) * 100 : 0,
      holdings,
      positions,
    };
  }
}
