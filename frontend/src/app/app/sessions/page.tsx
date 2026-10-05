"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

type SessionMode = "focus" | "short" | "long";

interface Session {
  _id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  targetDuration?: number;
  mode?: SessionMode;
  status: "active" | "paused" | "completed" | "cancelled";
}

interface SessionHistoryResponse {
  success: boolean;
  message: string;
  sessions: Session[];
  pagination: {
    page: number;
    limit: number;
    totalSessions: number;
    totalPages: number;
  };
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch<SessionHistoryResponse>(
        `/session/history?page=${page}&limit=10`,
      );

      setSessions(response.sessions ?? []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load session history",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    const handleSessionCompleted = () => {
      loadSessions();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadSessions();
      }
    };

    window.addEventListener("session-completed", handleSessionCompleted);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("session-completed", handleSessionCompleted);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadSessions]);

  const formatDuration = (seconds: number) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);

    const hours = Math.floor(safeSeconds / 3600);

    const minutes = Math.floor((safeSeconds % 3600) / 60);

    const secs = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const getSessionLabel = (mode?: SessionMode) => {
    if (mode === "short") {
      return "Short Break";
    }

    if (mode === "long") {
      return "Long Break";
    }

    return "Focus Session";
  };

  return (
    <div className="min-h-screen px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Productivity
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Session History
          </h1>

          <p className="mt-2 text-white/50">
            Review your previous focus sessions.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur-2xl">
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-white/40">Loading sessions...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
              <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>

              <button
                type="button"
                onClick={loadSessions}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && sessions.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl">
                ◷
              </div>

              <h2 className="mt-5 text-lg font-medium">No sessions yet</h2>

              <p className="mt-2 max-w-sm text-sm text-white/40">
                Complete your first focus session and it will appear here.
              </p>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <>
              <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr] border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.15em] text-white/35 md:grid">
                <span>Session</span>
                <span>Time</span>
                <span>Duration</span>
                <span>Status</span>
              </div>

              <div>
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="grid gap-4 border-b border-white/[0.07] px-6 py-5 last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_0.8fr] md:items-center"
                  >
                    <div>
                      <p className="font-medium text-white/90">
                        {getSessionLabel(session.mode)}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {formatDate(session.startTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-white/65">
                        {formatTime(session.startTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {formatDuration(session.duration)}
                      </p>
                    </div>

                    <div>
                      <StatusBadge status={session.status} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                <p className="text-sm text-white/35">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={page === 1}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page === totalPages}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Session["status"] }) {
  const styles: Record<Session["status"], string> = {
    completed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    cancelled: "border-red-300/20 bg-red-300/10 text-red-200",
    active: "border-sky-300/20 bg-sky-300/10 text-sky-200",
    paused: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
