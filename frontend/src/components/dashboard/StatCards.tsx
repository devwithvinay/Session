"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

interface Analytics {
  todayTime: number;
  todaySessions: number;
  totalTime: number;
  averageTime: number;
  currentStreak: number;
  bestStreak: number;
}

interface AnalyticsResponse {
  success: boolean;
  analytics: Analytics;
}

export default function StatCards() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiFetch<AnalyticsResponse>("/analytics");
        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const focusTime = analytics ? formatTime(analytics.todayTime) : "0m";

  const sessions = analytics?.todaySessions ?? 0;

  const streak = analytics?.currentStreak ?? 0;

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {/* Focus Time */}
      <div className="rounded-2xl border border-white/35 bg-white/[0.30] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Focus Time</p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
              {loading ? "..." : focusTime}
            </h3>

            <p className="mt-1 text-xs text-slate-400">Today</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100/70 text-sky-600">
            <ClockIcon />
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-200/60">
          <div className="h-full w-[68%] rounded-full bg-sky-500/70" />
        </div>
      </div>

      {/* Sessions */}
      <div className="rounded-2xl border border-white/35 bg-white/[0.30] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Sessions</p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
              {loading ? "..." : sessions}
            </h3>

            <p className="mt-1 text-xs text-slate-400">Completed today</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100/70 text-violet-600">
            <SessionIcon />
          </div>
        </div>

        <div className="mt-5 flex items-end gap-1">
          {[35, 55, 42, 70, 50, 82, 62].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-full bg-violet-400/50"
              style={{ height: `${height / 2}px` }}
            />
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className="rounded-2xl border border-white/35 bg-white/[0.30] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Streak</p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
              {loading ? "..." : `${streak} days`}
            </h3>

            <p className="mt-1 text-xs text-slate-400">Current streak</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/70 text-orange-500">
            <FireIcon />
          </div>
        </div>

        <div className="mt-5 flex gap-1.5">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full ${
                index < Math.min(streak, 7)
                  ? "bg-orange-400/70"
                  : "bg-slate-200/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ICONS ---------------- */

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />

      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SessionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 9h8M8 13h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21c4.2 0 7-2.8 7-6.7 0-3.2-1.8-5.3-4.4-7.8.1 2.1-.8 3.4-2 4.1.1-3.8-1.7-6.3-4-8.6.2 3.5-2.6 5.5-2.6 9.2C6 17.5 8.4 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
