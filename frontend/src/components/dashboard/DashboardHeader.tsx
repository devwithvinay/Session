"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LiveClock from "./LiveClock";
import { apiFetch } from "../../lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface MeResponse {
  success: boolean;
  user: User;
}

export default function DashboardHeader() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [username, setUsername] = useState("Vinay");

  useEffect(() => {
    const updateDate = () => {
      setDate(
        new Date().toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    };

    const fetchUser = async () => {
      try {
        const data = await apiFetch<MeResponse>("/users/getme");

        if (data.success && data.user) {
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    updateDate();
    fetchUser();

    const interval = setInterval(updateDate, 60_000);

    return () => clearInterval(interval);
  }, []);

  const parts = date.split(",");

  const firstName = username.trim().split(" ")[0] || "Vinay";

  const handleProfileClick = () => {
    router.push("/app/settings");
  };

  return (
    <header className="relative">
      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-[24px] font-medium tracking-[-0.03em] text-white md:text-[26px]">
            Good morning, {firstName} <span className="inline-block">👋</span>
          </h1>

          <p className="mt-2 text-[15px] text-white/80">
            Ready to make today count?
          </p>
        </div>

        {/* User */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <BellIcon />

            <span className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full bg-red-400 ring-2 ring-white/20" />
          </button>

          {/* Avatar / Profile */}
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="Open profile settings"
            className="flex items-center gap-3 rounded-full transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/30 bg-slate-800/50">
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </div>

            <span className="hidden text-sm font-medium text-white md:block">
              {firstName}
            </span>

            <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* Clock + date */}
      <div className="mt-3 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div />

        {/* Clock */}
        <div className="text-center">
          <LiveClock />
        </div>

        {/* Date card */}
        <div className="relative -top-4 flex justify-end">
          <div className="relative h-[110px] w-[275px] overflow-hidden rounded-2xl border border-white/35 bg-white/15 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45"
              style={{
                backgroundImage: "url('/images/dashboard-bg.png')",
              }}
            />

            <div className="absolute inset-0 bg-white/20" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[20px] font-medium text-white drop-shadow-sm">
                  {parts[0] || "Today"}
                </p>

                <p className="mt-1 text-[15px] font-medium text-white/90">
                  {parts.slice(1).join(",").trim()}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/35 text-slate-600">
                <CalendarIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- ICONS ---------------- */

function BellIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />

      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
