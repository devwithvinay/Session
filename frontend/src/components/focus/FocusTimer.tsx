"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

type TimerMode = "focus" | "short" | "long";
type TimerState = "idle" | "active" | "paused";

interface SessionResponse {
  success: boolean;
  session?: {
    _id: string;
    duration: number;
    status: "active" | "paused";
    startTime: string;
    activeStartTime: string;
  };
}

interface Props {
  onSessionComplete?: () => void;
}

const MODES: Record<TimerMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export default function FocusTimer({ onSessionComplete }: Props) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);

  const totalTime = MODES[mode];

  const progress = useMemo(() => {
    if (totalTime <= 0) return 0;

    return ((totalTime - timeLeft) / totalTime) * 100;
  }, [timeLeft, totalTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;

  /*
   * Restore an existing session after page refresh.
   *
   * Backend stores:
   * - duration = already accumulated active seconds
   * - activeStartTime = when the current active period started
   *
   * So for an active session:
   *
   * elapsed = duration + (now - activeStartTime)
   *
   * For a paused session:
   *
   * elapsed = duration
   */
  useEffect(() => {
    const loadExistingSession = async () => {
      try {
        const response = await apiFetch<SessionResponse>("/session");
        console.log("EXISTING SESSION RESPONSE:", response);

        if (!response.session) {
          return;
        }

        const session = response.session;

        setSessionId(session._id);

        let elapsedSeconds = session.duration;

        if (session.status === "active") {
          const activeStart = new Date(session.activeStartTime).getTime();

          const now = Date.now();

          const currentlyActiveSeconds = Math.max(
            0,
            Math.floor((now - activeStart) / 1000),
          );

          elapsedSeconds += currentlyActiveSeconds;
        }

        const remaining = Math.max(0, MODES.focus - elapsedSeconds);

        setTimeLeft(remaining);

        if (remaining <= 0) {
          setTimerState("active");
        } else if (session.status === "paused") {
          setTimerState("paused");
        } else {
          setTimerState("active");
        }
      } catch {
        // No existing session is fine.
      } finally {
        setLoadingSession(false);
      }
    };

    loadExistingSession();
  }, []);

  /*
   * Countdown while the session is active.
   */
  useEffect(() => {
    if (timerState !== "active") {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  /*
   * Automatically complete the backend session
   * when the timer reaches zero.
   */
  useEffect(() => {
    if (timerState !== "active" || timeLeft !== 0) {
      return;
    }

    if (!sessionId) {
      setTimerState("idle");
      setTimeLeft(MODES[mode]);
      return;
    }

    const complete = async () => {
      try {
        setError("");

        await apiFetch(`/session/${sessionId}/complete`, {
          method: "PATCH",
        });

        setTimerState("idle");
        setSessionId(null);
        setTimeLeft(MODES[mode]);

        window.dispatchEvent(new Event("session-completed"));

        onSessionComplete?.();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to complete session",
        );
      }
    };

    complete();
  }, [timeLeft, timerState, sessionId, mode, onSessionComplete]);

  const startSession = async () => {
    try {
      setError("");

      const response = await apiFetch<SessionResponse>("/session/start", {
        method: "POST",
      });

      if (!response.session) {
        throw new Error("Failed to start session");
      }

      setSessionId(response.session._id);
      setTimeLeft(MODES[mode]);
      setTimerState("active");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to start session",
      );
    }
  };

  const pauseSession = async () => {
    if (!sessionId) return;

    try {
      setError("");

      const response = await apiFetch<SessionResponse>(
        `/session/${sessionId}/pause`,
        {
          method: "PATCH",
        },
      );

      if (response.session) {
        const elapsed = response.session.duration;

        setTimeLeft(Math.max(0, MODES[mode] - elapsed));
      }

      setTimerState("paused");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to pause session",
      );
    }
  };

  const resumeSession = async () => {
    if (!sessionId) return;

    try {
      setError("");

      const response = await apiFetch<SessionResponse>(
        `/session/${sessionId}/resume`,
        {
          method: "PATCH",
        },
      );

      if (response.session) {
        const elapsed = response.session.duration;

        setTimeLeft(Math.max(0, MODES[mode] - elapsed));
      }

      setTimerState("active");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to resume session",
      );
    }
  };

const cancelSession = async () => {
  if (!sessionId) {
    resetTimer();
    return;
  }

  try {
    setError("");

    const response = await apiFetch<SessionResponse>(
      `/session/${sessionId}/cancel`,
      {
        method: "PATCH",
      },
    );

    console.log("SESSION CANCEL RESPONSE:", response);

    if (!response.success) {
      throw new Error("Failed to cancel session");
    }

    setSessionId(null);
    setTimerState("idle");
    setTimeLeft(MODES[mode]);
  } catch (error) {
    setError(error instanceof Error ? error.message : "Failed to stop session");
  }
};

  const resetTimer = () => {
    setTimerState("idle");
    setSessionId(null);
    setTimeLeft(MODES[mode]);
    setError("");
  };

  const changeMode = (newMode: TimerMode) => {
    if (timerState !== "idle") return;

    setMode(newMode);
    setTimeLeft(MODES[newMode]);
    setError("");
  };

  const adjustTime = (amount: number) => {
    if (timerState !== "idle") return;

    setTimeLeft((current) => Math.max(60, current + amount * 60));
  };

  if (loadingSession) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center">
        <p className="text-sm text-white/50">Restoring your session...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* Mode selector */}
      <div className="mb-10 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-xl">
        {(
          [
            ["focus", "Focus"],
            ["short", "Short Break"],
            ["long", "Long Break"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => changeMode(value)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              mode === value
                ? "bg-white text-slate-900"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="relative flex h-[330px] w-[330px] items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 330 330"
        >
          <circle
            cx="165"
            cy="165"
            r="145"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />

          <circle
            cx="165"
            cy="165"
            r="145"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 145}
            strokeDashoffset={
              2 * Math.PI * 145 - (progress / 100) * (2 * Math.PI * 145)
            }
            className="transition-all duration-500"
          />
        </svg>

        <div className="relative z-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/45">
            {mode === "focus"
              ? "Focus"
              : mode === "short"
                ? "Short Break"
                : "Long Break"}
          </p>

          <div className="text-7xl font-semibold tracking-[-0.06em] text-white">
            {formattedTime}
          </div>

          <p className="mt-3 text-sm text-white/45">
            {timerState === "active"
              ? "Stay focused"
              : timerState === "paused"
                ? "Paused"
                : "Ready when you are"}
          </p>
        </div>
      </div>

      {/* +/- controls */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => adjustTime(-5)}
          disabled={timerState !== "idle"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>

        <span className="text-xs text-white/40">5 min</span>

        <button
          type="button"
          onClick={() => adjustTime(5)}
          disabled={timerState !== "idle"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>

      {/* Main controls */}
      <div className="mt-8 flex items-center gap-3">
        {timerState === "idle" && (
          <>
            <button
              type="button"
              onClick={startSession}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] hover:bg-white/90"
            >
              Start Focus
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="rounded-full border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Reset
            </button>
          </>
        )}

        {timerState === "active" && (
          <>
            <button
              type="button"
              onClick={pauseSession}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02]"
            >
              Pause
            </button>

            <button
              type="button"
              onClick={cancelSession}
              className="rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Stop
            </button>
          </>
        )}

        {timerState === "paused" && (
          <>
            <button
              type="button"
              onClick={resumeSession}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02]"
            >
              Resume
            </button>

            <button
              type="button"
              onClick={cancelSession}
              className="rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
