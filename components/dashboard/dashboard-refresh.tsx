"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { refreshDashboard } from "@/actions/refresh-dashboard";
import { toast } from "sonner";

export function DashboardRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<number>(30);
  const router = useRouter();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshDashboard();

      router.refresh();
      setLastRefresh(new Date());

      toast.success("Dashboard refreshed successfully");
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast.error("Failed to refresh dashboard");
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  // Auto refresh with countdown
  useEffect(() => {
    if (!autoRefresh) {
      setCountdown(30);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, handleRefresh]);

  const formatLastRefresh = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  const getDataFreshnessStatus = () => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastRefresh.getTime()) / 60000
    );

    if (diffInMinutes < 1) return { color: "text-green-600", status: "Fresh" };
    if (diffInMinutes < 5)
      return { color: "text-yellow-600", status: "Recent" };
    return { color: "text-red-600", status: "Stale" };
  };

  const { color, status } = getDataFreshnessStatus();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 lg:order-1">
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Last updated:</span>
        <span className="sm:hidden">Updated:</span>
        {formatLastRefresh(lastRefresh)}
        <span
          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${color}`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 order-1 lg:order-2">
        <div className="flex items-center gap-2">
          <Switch
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
          <Label htmlFor="auto-refresh" className="text-sm">
            <span className="hidden sm:inline">Auto refresh</span>
            <span className="sm:hidden">Auto</span>
            {autoRefresh ? ` (${countdown}s)` : " (30s)"}
          </Label>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </span>
          <span className="sm:hidden">{isRefreshing ? "..." : "Refresh"}</span>
        </Button>
      </div>
    </div>
  );
}
