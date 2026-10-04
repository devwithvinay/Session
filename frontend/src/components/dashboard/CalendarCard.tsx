"use client";

import { useMemo, useState } from "react";

export default function CalendarCard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Monday = 0 ... Sunday = 6
    const firstDayIndex = (firstDay.getDay() + 6) % 7;

    const previousMonthDays = new Date(year, month, 0).getDate();

    const cells = [];

    // Previous month's trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: previousMonthDays - i,
        muted: true,
        selected: false,
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();

      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      cells.push({
        day,
        muted: false,
        selected: isToday,
      });
    }

    // Next month's leading days
    const remainingCells =
      35 - cells.length <= 0 ? 42 - cells.length : 35 - cells.length;

    for (let day = 1; day <= remainingCells; day++) {
      cells.push({
        day,
        muted: true,
        selected: false,
      });
    }

    const weeks = [];

    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return {
      year,
      month,
      weeks,
    };
  }, [currentDate]);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  const goPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-[385px] rounded-2xl border border-white/35 bg-white/[0.30] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarIcon />

        <h2 className="text-[17px] font-medium text-slate-800">Calendar</h2>
      </div>

      {/* Month */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goPreviousMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/30"
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>

        <button
          type="button"
          onClick={goToday}
          className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
        >
          {monthName}
        </button>

        <button
          type="button"
          onClick={goNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/30"
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Week names */}
      <div className="mt-5 grid grid-cols-7 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <span key={index} className="text-xs font-medium text-slate-400">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar */}
      <div className="mt-3 space-y-2">
        {calendar.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 text-center">
            {week.map((item, index) => (
              <div
                key={`${weekIndex}-${index}`}
                className="flex h-7 items-center justify-center"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                    item.selected
                      ? "bg-slate-700 font-medium text-white shadow-md"
                      : item.muted
                        ? "text-slate-300"
                        : "text-slate-600"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-slate-400/15 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Today</p>

            <p className="mt-1 text-xs text-slate-400">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              }).format(new Date())}
            </p>
          </div>

          <div className="flex -space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/70 bg-slate-800 text-[9px] text-white">
              V
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/70 bg-slate-500 text-[9px] text-white">
              S
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function CalendarIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="text-slate-700"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />

      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
