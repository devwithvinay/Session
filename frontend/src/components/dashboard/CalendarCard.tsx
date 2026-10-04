"use client";

const weeks = [
  [
    { day: 28, muted: true },
    { day: 29, muted: true },
    { day: 30, muted: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4, selected: true },
  ],
  [
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
  ],
  [
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
  ],
  [
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
  ],
  [
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
    { day: 1, muted: true },
  ],
];

export default function CalendarCard() {
  return (
    <div className="min-h-[385px] rounded-2xl border border-white/35 bg-white/[0.30] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarIcon />

        <h2 className="text-[17px] font-medium text-slate-800">Calendar</h2>
      </div>

      {/* Month */}
      <div className="mt-6 flex items-center justify-between">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/30">
          <ChevronLeft />
        </button>

        <span className="text-sm font-medium text-slate-700">October 2026</span>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/30">
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
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 text-center">
            {week.map((item, index) => (
              <div key={index} className="flex h-7 items-center justify-center">
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

            <p className="mt-1 text-xs text-slate-400">3 tasks scheduled</p>
          </div>

          {/* Avatars */}
          <div className="flex -space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/70 bg-slate-800 text-[9px] text-white">
              V
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/70 bg-slate-500 text-[9px] text-white">
              A
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/70 bg-slate-300 text-[9px] text-slate-700">
              R
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
