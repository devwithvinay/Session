"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

type Mode = "focus" | "short" | "long";

const DURATIONS: Record<Mode, number> = {
  focus: 25,
  short: 5,
  long: 15,
};

interface Session {
  _id: string;
  startTime: string;
  duration: number;
  status: "active" | "paused" | "completed" | "cancelled";
}

interface SessionResponse {
  success: boolean;
  message: string;
  session: Session;
}

export default function FocusPage() {
  const [mode, setMode] = useState<Mode>("focus");

  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "active" | "paused">("idle");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * TIMER
   *
   * The frontend timer controls the visual countdown.
   * MongoDB separately tracks actual focus duration.
   */
  useEffect(() => {
    if (status !== "active") return;

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  /*
   * AUTO COMPLETE
   *
   * When the timer reaches 00:00,
   * complete the backend session.
   */
  useEffect(() => {
    if (secondsLeft === 0 && sessionId && status === "active") {
      completeSession();
    }
  }, [secondsLeft, sessionId, status]);

  /*
   * START
   */
  const startSession = async () => {
    if (loading || sessionId) return;

    try {
      setLoading(true);
      setError("");

      const response = await apiFetch<SessionResponse>("/session/start", {
        method: "POST",
      });

      setSessionId(response.session._id);
      setStatus("active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start session");
    } finally {
      setLoading(false);
    }
  };

  /*
   * PAUSE
   */
  const pauseSession = async () => {
    if (!sessionId || loading || status !== "active") {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiFetch<SessionResponse>(`/session/${sessionId}/pause`, {
        method: "PATCH",
      });

      setStatus("paused");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to pause session");
    } finally {
      setLoading(false);
    }
  };

  /*
   * RESUME
   */
  const resumeSession = async () => {
    if (!sessionId || loading || status !== "paused") {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiFetch<SessionResponse>(`/session/${sessionId}/resume`, {
        method: "PATCH",
      });

      setStatus("active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resume session");
    } finally {
      setLoading(false);
    }
  };

  /*
   * COMPLETE
   */
  const completeSession = async () => {
    if (!sessionId || loading) return;

    try {
      setLoading(true);
      setError("");

      await apiFetch<SessionResponse>(`/session/${sessionId}/complete`, {
        method: "PATCH",
      });

      setSessionId(null);
      setStatus("idle");
      setSecondsLeft(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete session",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * STOP / CANCEL
   */
  const stopSession = async () => {
    if (!sessionId || loading) return;

    try {
      setLoading(true);
      setError("");

      await apiFetch<SessionResponse>(`/session/${sessionId}/cancel`, {
        method: "PATCH",
      });

      setSessionId(null);
      setStatus("idle");
      setSecondsLeft(minutes * 60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to stop session");
    } finally {
      setLoading(false);
    }
  };

  /*
   * CHANGE TIMER
   */
  const adjustTime = (amount: number) => {
    if (status !== "idle" || sessionId) return;

    const nextMinutes = Math.min(120, Math.max(5, minutes + amount));

    setMinutes(nextMinutes);
    setSecondsLeft(nextMinutes * 60);
  };

  /*
   * CHANGE MODE
   */
  const changeMode = (nextMode: Mode) => {
    if (status !== "idle" || sessionId) return;

    setMode(nextMode);

    const nextMinutes = DURATIONS[nextMode];

    setMinutes(nextMinutes);
    setSecondsLeft(nextMinutes * 60);
  };

  /*
   * RESET
   */
  const resetTimer = () => {
    if (sessionId || loading) return;

    setStatus("idle");
    setSecondsLeft(minutes * 60);
  };

  /*
   * FORMAT
   */
  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");

    const secs = (secondsLeft % 60).toString().padStart(2, "0");

    return `${mins}:${secs}`;
  };

  const totalSeconds = minutes * 60;

  const progress =
    totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const statusLabel =
    status === "active" ? "Focusing" : status === "paused" ? "Paused" : "Ready";

  return (
    <div className="min-h-screen px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Focus
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Focus Timer
          </h1>

          <p className="mt-2 text-white/50">Deep work starts here.</p>
        </div>

        {/* Main Card */}
        <div className="rounded-[30px] border border-white/20 bg-white/[0.075] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl md:p-10">
          {/* Mode selector */}
          <div className="flex justify-center">
            <div className="flex rounded-full border border-white/10 bg-black/10 p-1">
              <ModeButton
                active={mode === "focus"}
                disabled={status !== "idle"}
                onClick={() => changeMode("focus")}
              >
                Focus
              </ModeButton>

              <ModeButton
                active={mode === "short"}
                disabled={status !== "idle"}
                onClick={() => changeMode("short")}
              >
                Short Break
              </ModeButton>

              <ModeButton
                active={mode === "long"}
                disabled={status !== "idle"}
                onClick={() => changeMode("long")}
              >
                Long Break
              </ModeButton>
            </div>
          </div>

          {/* Timer */}
          <div className="mx-auto mt-10 flex max-w-[620px] flex-col items-center">
            <div className="relative flex h-[300px] w-[300px] items-center justify-center md:h-[360px] md:w-[360px]">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 360 360"
              >
                <circle
                  cx="180"
                  cy="180"
                  r="158"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />

                <circle
                  cx="180"
                  cy="180"
                  r="158"
                  fill="none"
                  stroke="rgba(186,230,253,0.9)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 158}
                  strokeDashoffset={2 * Math.PI * 158 * (1 - progress / 100)}
                  className="transition-all duration-500"
                />
              </svg>

              <div className="relative flex flex-col items-center">
                <span className="text-sm uppercase tracking-[0.25em] text-white/40">
                  {statusLabel}
                </span>

                <div className="mt-3 text-6xl font-semibold tracking-[-0.04em] md:text-7xl">
                  {formatTime()}
                </div>

                {/* Time adjustment */}
                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => adjustTime(-5)}
                    disabled={status !== "idle" || minutes <= 5}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-lg text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="min-w-[70px] text-center text-sm text-white/40">
                    {minutes} min
                  </span>

                  <button
                    onClick={() => adjustTime(5)}
                    disabled={status !== "idle" || minutes >= 120}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-lg text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Main controls */}
            <div className="mt-6 flex items-center gap-3">
              {/* START */}
              {status === "idle" && (
                <button
                  onClick={startSession}
                  disabled={loading}
                  className="rounded-full bg-white px-8 py-3 font-medium text-slate-900 shadow-lg transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Starting..." : "Start Focus"}
                </button>
              )}

              {/* PAUSE */}
              {status === "active" && (
                <button
                  onClick={pauseSession}
                  disabled={loading}
                  className="rounded-full bg-white px-8 py-3 font-medium text-slate-900 shadow-lg transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Pausing..." : "Pause"}
                </button>
              )}

              {/* RESUME */}
              {status === "paused" && (
                <button
                  onClick={resumeSession}
                  disabled={loading}
                  className="rounded-full bg-white px-8 py-3 font-medium text-slate-900 shadow-lg transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resuming..." : "Resume"}
                </button>
              )}

              {/* STOP */}
              {sessionId && (
                <button
                  onClick={stopSession}
                  disabled={loading}
                  className="rounded-full border border-red-300/20 bg-red-400/10 px-6 py-3 text-sm text-red-100 transition hover:bg-red-400/20 disabled:opacity-40"
                >
                  {loading ? "Stopping..." : "Stop"}
                </button>
              )}

              {/* RESET */}
              {!sessionId && (
                <button
                  onClick={resetTimer}
                  disabled={loading}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            {/* Server status */}
            {sessionId && (
              <p className="mt-4 text-xs text-white/30">
                Session synced with server
              </p>
            )}
          </div>

          {/* Info cards */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <InfoCard label="Current Task" value="Build dashboard" />

            <InfoCard label="Today's Focus" value="1h 35m" />

            <InfoCard label="Sessions" value="4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  disabled,
  children,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active ? "bg-white text-slate-900" : "text-white/50 hover:text-white"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-lg font-medium text-white/85">{value}</p>
    </div>
  );
}
