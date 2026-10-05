"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

interface Analytics {
  todayTime: number;
  totalTime: number;
  averageTime: number;
  currentStreak: number;
  bestStreak: number;
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  analytics: Analytics;
}

interface DailyFocus {
  date: string;
  totalDuration: number;
  sessions: number;
}

interface DailyFocusResponse {
  success: boolean;
  message: string;
  dailyFocus: DailyFocus[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const [dailyFocus, setDailyFocus] = useState<DailyFocus[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Load all analytics data.
   */
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, dailyResponse] = await Promise.all([
        apiFetch<AnalyticsResponse>("/analytics"),
        apiFetch<DailyFocusResponse>("/analytics/daily"),
      ]);

      if (!analyticsResponse?.analytics) {
        throw new Error("Invalid analytics response");
      }

      const safeAnalytics = analyticsResponse.analytics;

      const safeDailyFocus = Array.isArray(dailyResponse?.dailyFocus)
        ? dailyResponse.dailyFocus
        : [];

      /*
       * Always keep daily activity
       * in chronological order.
       */
      const sortedDailyFocus = [...safeDailyFocus].sort((a, b) =>
        a.date.localeCompare(b.date),
      );

      setAnalytics({
        todayTime: Number(safeAnalytics.todayTime) || 0,

        totalTime: Number(safeAnalytics.totalTime) || 0,

        averageTime: Number(safeAnalytics.averageTime) || 0,

        currentStreak: Number(safeAnalytics.currentStreak) || 0,

        bestStreak: Number(safeAnalytics.bestStreak) || 0,
      });

      setDailyFocus(
        sortedDailyFocus.map((item) => ({
          date: item.date,
          totalDuration: Number(item.totalDuration) || 0,
          sessions: Number(item.sessions) || 0,
        })),
      );
    } catch (err) {
      console.error("Failed to load analytics:", err);

      setError(err instanceof Error ? err.message : "Unable to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Initial load.
   */
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  /*
   * Keep Analytics synchronized with
   * Focus and Task pages.
   */
  useEffect(() => {
    const handleDataUpdate = () => {
      loadAnalytics();
    };

    window.addEventListener("session-completed", handleDataUpdate);

    window.addEventListener("task-updated", handleDataUpdate);

    return () => {
      window.removeEventListener("session-completed", handleDataUpdate);

      window.removeEventListener("task-updated", handleDataUpdate);
    };
  }, [loadAnalytics]);

  /*
   * Also refresh when the Analytics
   * tab becomes visible again.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadAnalytics();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadAnalytics]);

  const formatDuration = (seconds: number) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);

    const hours = Math.floor(safeSeconds / 3600);

    const minutes = Math.floor((safeSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  /*
   * Maximum daily focus value.
   */
  const maxFocusTime = useMemo(() => {
    if (dailyFocus.length === 0) {
      return 1;
    }

    return Math.max(...dailyFocus.map((item) => item.totalDuration), 1);
  }, [dailyFocus]);

  /*
   * Format a backend date without
   * timezone conversion.
   */
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);

    if (!year || !month || !day) {
      return dateString;
    }

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
  };

  /*
   * Format weekday without timezone
   * shifting.
   */
  const formatWeekday = (dateString: string) => {
    const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);

    if (!year || !month || !day) {
      return "";
    }

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      weekday: "short",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen px-5 py-8 text-white md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-sm text-white/40">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-5 py-8 text-white md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>

          <button
            onClick={loadAnalytics}
            className="mt-4 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="min-h-screen px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Insights
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Analytics
          </h1>

          <p className="mt-2 text-white/50">
            Understand your focus and consistency.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Today" value={formatDuration(analytics.todayTime)} />

          <StatCard
            label="Total Focus"
            value={formatDuration(analytics.totalTime)}
          />

          <StatCard
            label="Average Session"
            value={formatDuration(analytics.averageTime)}
          />

          <StatCard
            label="Current Streak"
            value={`${analytics.currentStreak} days`}
          />
        </div>

        {/* Best streak */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">Best streak</span>

            <span className="text-sm font-medium text-white/80">
              {analytics.bestStreak} days
            </span>
          </div>
        </div>

        {/* Focus chart */}
        <div className="mt-6 rounded-[28px] border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
              Activity
            </p>

            <h2 className="mt-2 text-xl font-medium">Daily focus</h2>
          </div>

          {dailyFocus.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-sm text-white/35">
                Complete a focus session to see your activity.
              </p>
            </div>
          ) : (
            <div className="mt-10 flex h-[280px] items-end gap-3 overflow-x-auto pb-2">
              {dailyFocus.map((item) => {
                const height =
                  item.totalDuration === 0
                    ? 4
                    : Math.max(12, (item.totalDuration / maxFocusTime) * 210);

                const day = formatWeekday(item.date);

                return (
                  <div
                    key={item.date}
                    className="flex min-w-[58px] flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-2 text-xs text-white/35">
                      {formatDuration(item.totalDuration)}
                    </div>

                    <div
                      className="w-full max-w-[42px] rounded-t-xl bg-sky-200/75 transition-all duration-500"
                      style={{
                        height: `${height}px`,
                      }}
                    />

                    <div className="mt-3 text-xs text-white/40">{day}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily breakdown */}
        <div className="mt-6 rounded-[28px] border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
              Breakdown
            </p>

            <h2 className="mt-2 text-xl font-medium">Daily activity</h2>
          </div>

          {dailyFocus.length === 0 ? (
            <p className="mt-8 text-sm text-white/35">
              No completed sessions yet.
            </p>
          ) : (
            <div className="mt-6 divide-y divide-white/[0.07]">
              {dailyFocus.map((item) => (
                <div
                  key={item.date}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      {formatDate(item.date)}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {item.sessions}{" "}
                      {item.sessions === 1 ? "session" : "sessions"}
                    </p>
                  </div>

                  <p className="text-sm text-white/65">
                    {formatDuration(item.totalDuration)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/15 bg-white/[0.07] p-6 shadow-xl shadow-black/10 backdrop-blur-2xl">
      <p className="text-xs uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {value}
      </p>
    </div>
  );
}
