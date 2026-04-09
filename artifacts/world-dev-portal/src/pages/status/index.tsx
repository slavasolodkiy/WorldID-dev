import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw } from "lucide-react";
import { useGetApiStatus } from "@workspace/api-client-react";
import { getGetApiStatusQueryKey } from "@workspace/api-client-react";

const statusConfig = {
  operational: {
    label: "Operational",
    icon: CheckCircle,
    dotColor: "bg-green-500",
    badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
    textColor: "text-green-600 dark:text-green-400",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    dotColor: "bg-amber-500",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  outage: {
    label: "Outage",
    icon: XCircle,
    dotColor: "bg-red-500",
    badgeClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
    textColor: "text-red-600 dark:text-red-400",
  },
  maintenance: {
    label: "Maintenance",
    icon: Clock,
    dotColor: "bg-blue-500",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
};

function UptimeBar({ uptime }: { uptime: number }) {
  const bars = 30;
  const goodBars = Math.round((uptime / 100) * bars);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`h-4 w-1.5 rounded-sm ${i < goodBars ? "bg-green-500/70" : "bg-red-500/60"}`}
        />
      ))}
    </div>
  );
}

export default function Status() {
  const { data: endpoints, isLoading, refetch, isFetching } = useGetApiStatus({
    query: {
      queryKey: getGetApiStatusQueryKey(),
      refetchInterval: 30000,
    },
  });

  const allOperational = endpoints?.every((e) => e.status === "operational") ?? false;
  const hasIssues = endpoints?.some((e) => e.status === "outage" || e.status === "degraded") ?? false;

  const overallStatus = hasIssues ? "degraded" : allOperational ? "operational" : "operational";
  const overallConfig = statusConfig[overallStatus];
  const OverallIcon = overallConfig.icon;

  return (
    <div className="min-h-screen">
      {/* Disclaimer */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 py-3">
          <p className="text-xs text-muted-foreground font-mono">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Note: </span>
            This page reflects simulated status data for the developer portal's own services. It does not represent live telemetry from production World ID infrastructure. For official production status, see{" "}
            <a href="https://status.worldcoin.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
              status.worldcoin.org
            </a>.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className={`border-b border-border/40 ${hasIssues ? "bg-amber-500/5" : ""}`}>
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasIssues ? "bg-amber-500/15" : "bg-green-500/15"}`}>
              <OverallIcon className={`w-6 h-6 ${hasIssues ? "text-amber-500" : "text-green-500"}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {hasIssues ? "Service disruption detected" : "All systems operational"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {endpoints?.length ?? 0} services monitored
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${overallConfig.dotColor} ${!hasIssues ? "animate-pulse" : ""}`} />
            <span className={`text-sm font-medium ${overallConfig.textColor}`}>{overallConfig.label}</span>
            <span className="text-muted-foreground text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Services Table */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6">Service Status</h2>
          <div className="border border-border/40 rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="divide-y divide-border/30">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-6 flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {endpoints?.map((endpoint) => {
                  const config = statusConfig[endpoint.status as keyof typeof statusConfig] ?? statusConfig.operational;
                  const Icon = config.icon;
                  return (
                    <div key={endpoint.name} className="p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dotColor} ${endpoint.status === "operational" ? "animate-pulse" : ""}`} />
                          <span className="font-medium text-sm">{endpoint.name}</span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground pl-4">{endpoint.endpoint}</span>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="hidden md:block text-right">
                          <div className="text-xs text-muted-foreground mb-1">30-day uptime</div>
                          <div className="text-xs font-mono">{endpoint.uptime.toFixed(2)}%</div>
                        </div>
                        <div className="hidden lg:block text-right">
                          <div className="text-xs text-muted-foreground mb-1">Latency</div>
                          <div className="text-xs font-mono">{endpoint.latencyMs}ms</div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${config.badgeClass}`}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Uptime history */}
        {endpoints && (
          <div>
            <h2 className="text-lg font-semibold mb-6">30-Day Uptime</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.name} className="flex items-center gap-4">
                  <span className="text-sm w-48 flex-shrink-0 truncate">{endpoint.name}</span>
                  <UptimeBar uptime={endpoint.uptime} />
                  <span className="text-xs font-mono text-muted-foreground w-14 text-right flex-shrink-0">
                    {endpoint.uptime.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
