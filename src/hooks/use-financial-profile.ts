"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useFinancialProfile(userId?: Id<"users">, deviceId?: string) {
  const profile = useQuery(
    api.financialProfiles.getFinancialProfile,
    userId ? { userId } : deviceId ? { deviceId } : "skip"
  );

  const upsertProfile = useMutation(api.financialProfiles.upsertFinancialProfile);

  return {
    profile,
    isLoading: profile === undefined,
    upsertProfile,
  };
}
