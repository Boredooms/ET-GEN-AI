"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { UserProfile } from "@/types/profile";
import { useSession } from "@/lib/auth-client";

export function useUserProfile() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const { data: session, isPending: sessionLoading } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("deviceId");
      if (!id) {
        id = "dev_" + Date.now();
        localStorage.setItem("deviceId", id);
      }
      setDeviceId(id);
    }
  }, []);

  // First, get the Convex user by Better Auth ID
  const convexUser = useQuery(
    api.users.getByAuthProviderId,
    session?.user?.id ? { authProviderId: session.user.id } : "skip"
  );

  // Then fetch profile by Convex userId or fallback to deviceId
  const dbProfile = useQuery(
    api.profiles.getByUserOrDevice,
    convexUser?._id 
      ? { userId: convexUser._id }
      : deviceId 
      ? { deviceId } 
      : "skip"
  );

  // Cast Convex profile to generic UserProfile shape if it exists
  const profile: UserProfile | null = dbProfile
    ? {
        id: dbProfile._id,
        userId: dbProfile.userId,
        deviceId: dbProfile.deviceId,
        userType: dbProfile.userType as any,
        interests: dbProfile.interests as any,
        goals: dbProfile.goals as any,
        language: dbProfile.language as any,
        riskLevel: dbProfile.riskLevel as any,
        consentGiven: dbProfile.consentGiven,
        createdAt: new Date(dbProfile.createdAt).toISOString(),
        updatedAt: new Date(dbProfile.updatedAt).toISOString(),
      }
    : null;

  return { 
    profile, 
    deviceId,
    convexUserId: convexUser?._id, // Expose the Convex userId
    isLoading: sessionLoading || (convexUser === undefined && session?.user?.id !== undefined) || (dbProfile === undefined && (convexUser?._id || deviceId !== null))
  };
}
