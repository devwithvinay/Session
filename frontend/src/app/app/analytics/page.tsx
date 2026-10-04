"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [analyticsResponse, dailyResponse] = await Promise.all([
          apiFetch<AnalyticsResponse>("/analytics"),

          apiFetch<DailyFocusResponse>("/analytics/daily"),
        ]);

        setAnalytics(analyticsResponse.analytics);
        setDailyFocus(dailyResponse.dailyFocus);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load analytics",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const maxFocusTime = useMemo(() => {
    if (dailyFocus.length === 0) {
      return 1;
    }

    return Math.max(...dailyFocus.map((item) => item.totalDuration), 1);
  }, [dailyFocus]);

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

                const date = new Date(`${item.date}T00:00:00`);

                const day = date.toLocaleDateString("en-IN", {
                  weekday: "short",
                });

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
              {dailyFocus.map((item) => {
                const date = new Date(`${item.date}T00:00:00`);

                return (
                  <div
                    key={item.date}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {date.toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "2-digit",
                          month: "short",
                        })}
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
                );
              })}
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
