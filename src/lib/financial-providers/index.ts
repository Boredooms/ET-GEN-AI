/**
 * Financial Provider Factory
 * 
 * Central manager for financial provider integrations
 * Currently supports: Zerodha (Upstox coming soon)
 */

import { ZerodhaProvider } from "./zerodha";
import type { ProviderType, ProviderAPI } from "./types";

export class ProviderFactory {
  private static providers: Map<ProviderType, ProviderAPI> = new Map();

  static initialize(config: {
    zerodha?: { apiKey: string; apiSecret: string; redirectUrl: string };
  }) {
    if (config.zerodha) {
      this.providers.set(
        "zerodha",
        new ZerodhaProvider(
          config.zerodha.apiKey,
          config.zerodha.apiSecret,
          config.zerodha.redirectUrl
        )
      );
    }
  }

  static getProvider(providerId: ProviderType): ProviderAPI {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} is not configured`);
    }
    return provider;
  }

  static getAllProviders(): Map<ProviderType, ProviderAPI> {
    return this.providers;
  }

  static isProviderConfigured(providerId: ProviderType): boolean {
    return this.providers.has(providerId);
  }
}

// Export everything from types for convenience
export * from "./types";
export { ZerodhaProvider } from "./zerodha";
