"use client";

import { useEffect, useState } from "react";

type Tab = "clock" | "stopwatch" | "countdown" | "analytics";

const monthlyData = [
  { month: "Jan", hours: 18 },
  { month: "Feb", hours: 24 },
  { month: "Mar", hours: 21 },
  { month: "Apr", hours: 31 },
  { month: "May", hours: 28 },
  { month: "Jun", hours: 36 },
  { month: "Jul", hours: 32 },
  { month: "Aug", hours: 41 },
  { month: "Sep", hours: 38 },
  { month: "Oct", hours: 45 },
  { month: "Nov", hours: 42 },
  { month: "Dec", hours: 48 },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("clock");

  const [currentTime, setCurrentTime] = useState(new Date());

  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);

  const [countdown, setCountdown] = useState(25 * 60);
  const [countdownRunning, setCountdownRunning] = useState(false);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Stopwatch
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setStopwatchTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Countdown
  useEffect(() => {
    if (!countdownRunning || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((time) => time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownRunning, countdown]);

  const formatStopwatch = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(secs).padStart(2, "0")}`;
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setStopwatchTime(0);
  };

  const resetCountdown = () => {
    setCountdownRunning(false);
    setCountdown(25 * 60);
  };

  const day = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = currentTime.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const navigation = [
    {
      id: "clock" as Tab,
      label: "Clock",
      icon: "◷",
    },
    {
      id: "stopwatch" as Tab,
      label: "Stopwatch",
      icon: "◴",
    },
    {
      id: "countdown" as Tab,
      label: "Countdown",
      icon: "◫",
    },
    {
      id: "analytics" as Tab,
      label: "Analytics",
      icon: "⌁",
    },
  ];

  return (
    <section
      id="preview"
      className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28"
      style={{
        backgroundColor: "#F8FCFF",
        backgroundImage: `
      linear-gradient(rgba(125, 181, 210, 0.14) 1px, transparent 1px),
      linear-gradient(90deg, rgba(125, 181, 210, 0.14) 1px, transparent 1px)
    `,
        backgroundSize: "48px 48px",
      }}
    >
      {/* Soft green background glow */}
      <div className="pointer-events-none absolute left-[-140px] top-[12%] h-[420px] w-[420px] rounded-full bg-[#DCEBD7]/35 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-160px] right-[-100px] h-[460px] w-[460px] rounded-full bg-[#E2EEDC]/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Dashboard Card */}
        <div className="overflow-hidden rounded-[30px] border border-[#DDE5D9] bg-white shadow-[0_25px_80px_rgba(54,76,55,0.12)]">
          {/* ================= TOP BAR ================= */}
          <div className="flex min-h-[82px] items-center justify-between border-b border-[#E7ECE4] px-6 md:px-9">
            {/* Logo */}
            <p className="text-lg font-semibold tracking-[-0.03em] text-[#263B2A]">
              Session
            </p>

            {/* Date */}
            <div className="text-right">
              <p className="text-sm font-medium text-[#263B2A]">{date}</p>

              <p className="mt-0.5 text-xs text-[#7C897C]">{day}</p>
            </div>
          </div>

          {/* ================= DASHBOARD BODY ================= */}
          <div className="grid min-h-[570px] md:grid-cols-[190px_1fr]">
            {/* ================= SIDEBAR ================= */}
            <aside className="flex flex-col border-b border-[#DCE8EE] bg-[#F1F8FC] md:border-b-0 md:border-r">
              {/* Navigation */}
              <div className="flex-1 p-4">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const active = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all ${
                          active
                            ? "bg-[#DCEEF8] text-[#365568]"
                            : "text-[#788A94] hover:bg-[#EAF5FA] hover:text-[#456476]"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg text-[17px] ${
                            active
                              ? "text-[#5D8197]"
                              : "text-[#899AA3] group-hover:text-[#5D8197]"
                          }`}
                        >
                          {item.icon}
                        </span>

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demo User */}
              <div className="border-t border-[#D8E6EC] p-4">
                <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCEEF8] text-xs font-semibold text-[#52758A]">
                    DU
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#344B58]">
                      Demo User
                    </p>

                    <p className="text-xs text-[#8A9AA3]">Personal</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ================= MAIN DASHBOARD ================= */}
            <main className="relative flex flex-col bg-white">
              {/* ================= CLOCK ================= */}
              {activeTab === "clock" && (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#93A093]">
                      Current time
                    </p>

                    <div className="mt-5 text-6xl font-semibold tracking-[-0.07em] text-[#263B2A] md:text-8xl">
                      {time}
                    </div>

                    <p className="mt-5 text-sm text-[#8A958A]">
                      Stay present. Make your time count.
                    </p>
                  </div>
                </div>
              )}

              {/* ================= STOPWATCH ================= */}
              {activeTab === "stopwatch" && (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#93A093]">
                    Stopwatch
                  </p>

                  <div className="mt-5 text-6xl font-semibold tracking-[-0.07em] text-[#263B2A] md:text-8xl">
                    {formatStopwatch(stopwatchTime)}
                  </div>

                  <div className="mt-10 flex items-center gap-3">
                    {/* Start / Pause */}
                    <button
                      onClick={() => setIsRunning((running) => !running)}
                      className="rounded-full bg-[#D7EBF6] px-7 py-3 text-sm font-medium text-[#365568] shadow-[0_6px_20px_rgba(111,164,193,0.12)] transition hover:bg-[#C8E2F0]"
                    >
                      {isRunning ? "Pause" : "Start"}
                    </button>

                    {/* Reset */}
                    <button
                      onClick={resetStopwatch}
                      className="rounded-full border border-[#DCE8EE] bg-[#F7FBFD] px-7 py-3 text-sm font-medium text-[#536A76] transition hover:bg-[#EDF6FA]"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* ================= COUNTDOWN ================= */}
              {activeTab === "countdown" && (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#93A093]">
                    Focus timer
                  </p>

                  <div className="mt-5 text-7xl font-semibold tracking-[-0.08em] text-[#263B2A] md:text-9xl">
                    {formatCountdown(countdown)}
                  </div>

                  <div className="mt-10 flex items-center gap-3">
                    {/* Start / Pause */}
                    <button
                      onClick={() => setCountdownRunning((running) => !running)}
                      className="rounded-full bg-[#D7EBF6] px-7 py-3 text-sm font-medium text-[#365568] shadow-[0_6px_20px_rgba(111,164,193,0.12)] transition hover:bg-[#C8E2F0]"
                    >
                      {countdownRunning ? "Pause" : "Start"}
                    </button>

                    {/* Reset */}
                    <button
                      onClick={resetCountdown}
                      className="rounded-full border border-[#DCE8EE] bg-[#F7FBFD] px-7 py-3 text-sm font-medium text-[#536A76] transition hover:bg-[#EDF6FA]"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Presets */}
                  <div className="mt-7 flex items-center gap-2">
                    {[15, 25, 45, 60].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => {
                          setCountdown(minutes * 60);
                          setCountdownRunning(false);
                        }}
                        className="rounded-full border border-[#DCE8EE] bg-white px-3.5 py-1.5 text-xs text-[#718692] transition hover:border-[#BFD8E5] hover:bg-[#F1F8FC]"
                      >
                        {minutes}m
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= ANALYTICS ================= */}
              {activeTab === "analytics" && (
                <div className="flex-1 px-6 py-10 md:px-10">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#93A093]">
                      Analytics
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#263B2A]">
                      Your focus over time
                    </h3>
                  </div>

                  {/* Analytics Box */}
                  <div className="mt-10 rounded-2xl border border-[#DCE8EE] bg-[#F7FBFD] p-5 md:p-7">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-[#87969E]">Total focus</p>

                        <p className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-[#263B45]">
                          42h 18m
                        </p>
                      </div>

                      <span className="rounded-full bg-[#DCEEF8] px-3 py-1 text-xs font-medium text-[#557488]">
                        +18.4%
                      </span>
                    </div>

                    {/* Chart */}
                    <div className="mt-10 flex h-56 items-end gap-2 md:gap-3">
                      {monthlyData.map((item) => {
                        const height = `${(item.hours / 50) * 100}%`;

                        return (
                          <div
                            key={item.month}
                            className="flex h-full flex-1 flex-col justify-end"
                          >
                            <div className="flex flex-1 items-end">
                              <div
                                className="w-full rounded-t-md bg-[#AFCBDB] transition hover:bg-[#6F9AB0]"
                                style={{ height }}
                                title={`${item.hours}h`}
                              />
                            </div>

                            <p className="mt-3 text-center text-[10px] text-[#8B979D]">
                              {item.month}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#DCE8EE] bg-white p-5">
                      <p className="text-xs text-[#8A979D]">This month</p>

                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#263B45]">
                        45h
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#DCE8EE] bg-white p-5">
                      <p className="text-xs text-[#8A979D]">Daily average</p>

                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#263B45]">
                        2h 14m
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#DCE8EE] bg-white p-5">
                      <p className="text-xs text-[#8A979D]">Best month</p>

                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#263B45]">
                        48h
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
