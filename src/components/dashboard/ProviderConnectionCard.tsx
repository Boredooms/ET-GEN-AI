"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link2, CheckCircle2, AlertCircle, Loader2, TrendingUp, Clock } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from "next/navigation";

interface ProviderConnectionCardProps {
  providerId: "zerodha" | "upstox";
  providerName: string;
  providerLogo?: string;
  description: string;
  userId?: string;
  comingSoon?: boolean;
}

export default function ProviderConnectionCard({
  providerId,
  providerName,
  providerLogo,
  description,
  userId,
  comingSoon = false,
}: ProviderConnectionCardProps) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  // Get connection status from Convex (skip if no userId)
  const connection = useQuery(
    api.providerConnections.getProviderConnection,
    userId ? { userId: userId as any, providerId } : "skip"
  );

  // Save provider credentials mutation
  const saveCredentials = useMutation(api.providerConnections.saveProviderCredentials);

  // Check for OAuth callback success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("provider_connected");
    
    if (connected === providerId) {
      // Process the temporary credentials from cookie
      handleOAuthCallback();
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [providerId]);

  const handleOAuthCallback = async () => {
    try {
      setSyncStatus("syncing");
      
      // Get credentials from cookie (set by API route)
      const response = await fetch("/api/providers/zerodha/save-credentials", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to save credentials");
      }

      const data = await response.json();

      // Save to Convex
      await saveCredentials({
        userId: userId as any,
        providerId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        metadata: data.metadata,
      });

      setSyncStatus("success");
      
      // Trigger portfolio sync
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to process OAuth callback:", error);
      setSyncStatus("error");
    }
  };

  const handleConnect = () => {
    if (comingSoon) return;
    
    setIsConnecting(true);
    
    // Redirect to OAuth flow
    window.location.href = `/api/providers/${providerId}/connect?user_id=${userId}`;
  };

  const handleDisconnect = async () => {
    if (confirm(`Are you sure you want to disconnect ${providerName}?`)) {
      // TODO: Implement disconnect mutation
    }
  };

  const isConnected = connection && connection.isActive;
  const lastSynced = connection?.lastSyncedAt 
    ? new Date(connection.lastSyncedAt).toLocaleString()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-6 ${
        comingSoon
          ? "border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] opacity-60"
          : isConnected
          ? "border-green-500/20 bg-green-500/5"
          : "border-[oklch(1_0_0_/_12%)] bg-[oklch(0.09_0_0)]"
      }`}
    >
      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4 rounded-full bg-[oklch(0.6_0.15_270)] px-3 py-1 text-xs font-medium text-white">
          Coming Soon
        </div>
      )}

      {/* Provider Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {providerLogo ? (
            <img src={providerLogo} alt={providerName} className="h-12 w-12 rounded-lg" />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-[oklch(0.6_0.15_220)] flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-foreground">{providerName}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Connection Status */}
        {!comingSoon && (
          <div className="flex items-center gap-2">
            {isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Last Synced */}
      {isConnected && lastSynced && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span>Last synced: {lastSynced}</span>
        </div>
      )}

      {/* Sync Status */}
      {syncStatus !== "idle" && (
        <div className="mb-4">
          {syncStatus === "syncing" && (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Syncing portfolio data...</span>
            </div>
          )}
          {syncStatus === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Successfully connected!</span>
            </div>
          )}
          {syncStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to sync. Please try again.</span>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {!comingSoon && (
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting || comingSoon}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all ${
            isConnected
              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
              : "bg-foreground text-background hover:opacity-90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : isConnected ? (
            <>
              Disconnect
            </>
          ) : (
            <>
              <Link2 className="h-5 w-5" />
              Connect {providerName}
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
