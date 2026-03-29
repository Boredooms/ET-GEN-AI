"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader2, CheckCircle2, Clock, XCircle, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}> = {
  pending: {
    label: "Under Review",
    icon: Clock,
    color: "oklch(0.75 0.15 85)",
    bgColor: "oklch(0.75 0.15 85 / 10%)",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "oklch(0.7 0.15 142)",
    bgColor: "oklch(0.7 0.15 142 / 10%)",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "oklch(0.6 0.15 25)",
    bgColor: "oklch(0.6 0.15 25 / 10%)",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "oklch(0.6 0.15 142)",
    bgColor: "oklch(0.6 0.15 142 / 10%)",
  },
};

export default function ApplicationsPage() {
  const { profile, isLoading: profileLoading } = useUserProfile();

  const applications = useQuery(
    api.userApplications.getApplications,
    profile?.userId 
      ? { userId: profile.userId as any }
      : typeof window !== "undefined" && localStorage.getItem("deviceId")
      ? { deviceId: localStorage.getItem("deviceId")! }
      : "skip"
  );

  const isLoading = profileLoading || applications === undefined;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasApplications = applications && applications.length > 0;

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-editorial text-3xl text-foreground">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your financial product applications
        </p>
      </div>

      {!hasApplications ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-12 text-center">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">No Applications Yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            You haven't applied for any financial products. Browse our marketplace to find the perfect match.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        /* Applications List */
        <div className="space-y-4">
          {applications.map((application: any) => {
            const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.pending;
            const Icon = statusConfig.icon;

            return (
              <div
                key={application._id}
                className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6 transition-all hover:border-[oklch(1_0_0_/_15%)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: statusConfig.bgColor,
                          color: statusConfig.color,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {statusConfig.label}
                      </div>
                    </div>
                    
                    <h3 className="mb-1 text-lg font-semibold text-foreground">
                      {application.product?.name || "Product"}
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {application.product?.partnerName || "Partner"} • {application.product?.subCategory}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Application ID:</span> {application.applicationId}
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span>{" "}
                        {new Date(application.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      {application.approvedAt && (
                        <div>
                          <span className="font-medium">Approved:</span>{" "}
                          {new Date(application.approvedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>

                    {application.partnerStatus && (
                      <div className="mt-3 rounded-lg bg-[oklch(0.12_0_0)] p-3 text-sm">
                        <span className="text-muted-foreground">Partner Status:</span>{" "}
                        <span className="font-medium text-foreground">{application.partnerStatus}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 sm:flex-col">
                    <Link
                      href={`/marketplace/${application.productId}`}
                      className="flex items-center gap-2 rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[oklch(0.12_0_0)]"
                    >
                      View Product
                    </Link>
                    {application.product?.applicationUrl && (
                      <a
                        href={application.product.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[oklch(0.12_0_0)]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Track
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-gradient-to-br from-[oklch(0.15_0_0)] to-[oklch(0.09_0_0)] p-8 text-center">
        <h3 className="mb-2 text-xl font-bold text-foreground">Need Help with Your Application?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Our AI concierge can help you track your application status and answer questions.
        </p>
        <Link
          href="/concierge"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90"
        >
          Talk to Concierge
        </Link>
      </div>
    </div>
  );
}
