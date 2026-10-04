"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  totalFocusTime: number;
  totalSessions: number;
}

interface LeaderboardResponse {
  success: boolean;
  message: string;
  leaderboard: LeaderboardUser[];
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch<LeaderboardResponse>("/leaderboard");

        setUsers(response.leaderboard);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load leaderboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  return (
    <div className="min-h-screen px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Community
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Leaderboard
          </h1>

          <p className="mt-2 text-white/50">
            See who's putting in the most focused work.
          </p>
        </div>

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-white/15 bg-white/[0.07] backdrop-blur-2xl">
            <p className="text-sm text-white/40">Loading leaderboard...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-white/15 bg-white/[0.07] px-6 text-center backdrop-blur-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl">
              🏆
            </div>

            <h2 className="mt-5 text-lg font-medium">No rankings yet</h2>

            <p className="mt-2 max-w-sm text-sm text-white/40">
              Complete a focus session to appear on the leaderboard.
            </p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <>
            {/* Top 3 */}
            <div className="grid gap-4 md:grid-cols-3">
              {topThree.map((user) => (
                <TopUser key={user.userId} user={user} />
              ))}
            </div>

            {/* Rankings */}
            {remainingUsers.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur-2xl">
                <div className="hidden grid-cols-[80px_1fr_180px_150px] border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.15em] text-white/35 md:grid">
                  <span>Rank</span>
                  <span>User</span>
                  <span>Focus Time</span>
                  <span>Sessions</span>
                </div>

                {remainingUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="grid gap-3 border-b border-white/[0.07] px-6 py-5 last:border-b-0 md:grid-cols-[80px_1fr_180px_150px] md:items-center"
                  >
                    <span className="text-sm font-medium text-white/40">
                      #{user.rank}
                    </span>

                    <div className="flex items-center gap-3">
                      <Avatar username={user.username} />

                      <span className="font-medium text-white/85">
                        {user.username}
                      </span>
                    </div>

                    <span className="text-sm text-white/65">
                      {formatDuration(user.totalFocusTime)}
                    </span>

                    <span className="text-sm text-white/45">
                      {user.totalSessions}{" "}
                      {user.totalSessions === 1 ? "session" : "sessions"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TopUser({ user }: { user: LeaderboardUser }) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const rankStyles = {
    1: "border-yellow-300/25 bg-yellow-300/[0.08]",
    2: "border-white/20 bg-white/[0.07]",
    3: "border-orange-300/20 bg-orange-300/[0.07]",
  };

  return (
    <div
      className={`rounded-[26px] border p-6 shadow-xl shadow-black/10 backdrop-blur-2xl ${
        rankStyles[user.rank as 1 | 2 | 3] ?? "border-white/15 bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/40">#{user.rank}</span>

        <span className="text-xl">
          {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Avatar username={user.username} />

        <div>
          <p className="font-medium text-white/90">{user.username}</p>

          <p className="mt-1 text-xs text-white/35">
            {user.totalSessions} sessions
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.15em] text-white/30">
          Focus time
        </p>

        <p className="mt-2 text-2xl font-semibold">
          {formatDuration(user.totalFocusTime)}
        </p>
      </div>
    </div>
  );
}

function Avatar({ username }: { username: string }) {
  const initial = username?.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-sm font-medium text-white/70">
      {initial}
    </div>
  );
}
