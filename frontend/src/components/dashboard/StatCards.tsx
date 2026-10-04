const stats = [
  {
    label: "Focus Time",
    value: "2h 35m",
    change: "12%",
    comparison: "vs yesterday",
    type: "focus",
  },
  {
    label: "Sessions",
    value: "6",
    change: "50%",
    comparison: "vs yesterday",
    type: "sessions",
  },
  {
    label: "Streak",
    value: "7 days",
    change: "100%",
    comparison: "vs last week",
    type: "streak",
  },
];

export default function StatCards() {
  return (
    <section className="mt-7 grid gap-5 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative h-[165px] overflow-hidden rounded-2xl border border-white/35 bg-white/[0.28] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl"
        >
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg ${
                stat.type === "focus"
                  ? "bg-indigo-500"
                  : stat.type === "sessions"
                    ? "bg-blue-500"
                    : "bg-orange-400"
              }`}
            >
              {stat.type === "focus" && <ClockIcon />}
              {stat.type === "sessions" && <SessionsIcon />}
              {stat.type === "streak" && <FlameIcon />}
            </div>

            <div>
              <p className="text-[15px] font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-3 text-[29px] font-medium tracking-[-0.05em] text-slate-800">
                {stat.value}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-medium text-emerald-500">
                  ↑ {stat.change}
                </span>

                <span className="text-xs text-slate-400">
                  {stat.comparison}
                </span>
              </div>
            </div>
          </div>

          {/* Decorative mini chart */}
          <div className="absolute bottom-5 right-5 opacity-35">
            {stat.type === "focus" && <FocusChart />}
            {stat.type === "sessions" && <BarsChart />}
            {stat.type === "streak" && <StreakChart />}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------------- ICONS ---------------- */

function ClockIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" />

      <path
        d="M12 8v4l3 2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SessionsIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="4"
        width="14"
        height="16"
        rx="3"
        stroke="white"
        strokeWidth="1.8"
      />

      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21c4.4 0 7-2.8 7-6.5 0-3.5-2.4-5.6-4.7-8.2-.5 2-1.5 3.3-2.8 4.1.1-3.4-1.2-6-3.6-8.1.1 3.2-3.4 5.8-3.4 10.2C4.5 17.8 7.5 21 12 21Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- MINI CHARTS ---------------- */

function FocusChart() {
  return (
    <svg width="100" height="58" viewBox="0 0 100 58" fill="none">
      <path
        d="M3 48C12 42 15 29 24 35C34 42 38 25 47 30C56 35 61 17 70 25C79 34 82 7 97 5"
        stroke="#5B8DEF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BarsChart() {
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
      <rect x="5" y="36" width="10" height="20" rx="5" fill="#6EA2F8" />
      <rect x="25" y="27" width="10" height="29" rx="5" fill="#6EA2F8" />
      <rect x="45" y="18" width="10" height="38" rx="5" fill="#6EA2F8" />
      <rect x="65" y="9" width="10" height="47" rx="5" fill="#6EA2F8" />
      <rect x="85" y="2" width="10" height="54" rx="5" fill="#6EA2F8" />
    </svg>
  );
}

function StreakChart() {
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
      <path
        d="M2 53C17 48 18 34 31 38C43 42 43 18 57 27C69 35 68 6 81 18C89 25 91 9 98 3V58H2V53Z"
        fill="#F6B15B"
        opacity="0.6"
      />
    </svg>
  );
}
