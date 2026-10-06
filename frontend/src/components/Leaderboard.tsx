"use client";


const sessions = [
  {
    initials: "V",
    name: "Vinay",
    avatar: "bg-emerald-500",
    activity: "React Frontend Coding",
    activityIcon: "</>",
    activityBg: "bg-blue-50 text-blue-600",
    duration: "45 mins",
    streak: "14 days",
    time: "2m ago",
  },
  {
    initials: "H",
    name: "Himanshu",
    avatar: "bg-violet-500",
    activity: "UI/UX Figma Design",
    activityIcon: "✎",
    activityBg: "bg-violet-50 text-violet-600",
    duration: "1h 30m",
    streak: "12 days",
    time: "8m ago",
  },
  {
    initials: "N",
    name: "Nitin",
    avatar: "bg-amber-500",
    activity: "DSA Practice",
    activityIcon: "◇",
    activityBg: "bg-orange-50 text-orange-600",
    duration: "2h 10m",
    streak: "18 days",
    time: "15m ago",
  },
  {
    initials: "R",
    name: "Ravi",
    avatar: "bg-blue-500",
    activity: "Backend Development",
    activityIcon: "⌘",
    activityBg: "bg-blue-50 text-blue-600",
    duration: "1h 05m",
    streak: "11 days",
    time: "24m ago",
  },
  {
    initials: "M",
    name: "Manish",
    avatar: "bg-red-400",
    activity: "System Design",
    activityIcon: "▤",
    activityBg: "bg-red-50 text-red-600",
    duration: "50 mins",
    streak: "9 days",
    time: "42m ago",
  },
  {
    initials: "S",
    name: "Sumit",
    avatar: "bg-purple-500",
    activity: "JavaScript Practice",
    activityIcon: "JS",
    activityBg: "bg-yellow-50 text-yellow-600",
    duration: "1h 20m",
    streak: "15 days",
    time: "1h ago",
  },
  {
    initials: "K",
    name: "Kamdev",
    avatar: "bg-cyan-500",
    activity: "Machine Learning",
    activityIcon: "AI",
    activityBg: "bg-cyan-50 text-cyan-600",
    duration: "2h 25m",
    streak: "21 days",
    time: "1h ago",
  },
  {
    initials: "V",
    name: "Virat",
    avatar: "bg-orange-500",
    activity: "TypeScript Development",
    activityIcon: "TS",
    activityBg: "bg-blue-50 text-blue-600",
    duration: "1h 45m",
    streak: "8 days",
    time: "2h ago",
  },
  {
    initials: "A",
    name: "Ayush",
    avatar: "bg-pink-500",
    activity: "Project Development",
    activityIcon: "⌁",
    activityBg: "bg-pink-50 text-pink-600",
    duration: "1h 15m",
    streak: "13 days",
    time: "2h ago",
  },
  {
    initials: "S",
    name: "Shivam",
    avatar: "bg-indigo-500",
    activity: "AI & GenAI Learning",
    activityIcon: "✦",
    activityBg: "bg-indigo-50 text-indigo-600",
    duration: "2h 00m",
    streak: "16 days",
    time: "3h ago",
  },
];

function Leaderboard() {
  return (
    <section
      className="relative overflow-hidden px-6 py-32"
      style={{
        backgroundColor: "#F8FCFF",
        backgroundImage: `
      linear-gradient(rgba(125, 181, 210, 0.14) 1px, transparent 1px),
      linear-gradient(90deg, rgba(125, 181, 210, 0.14) 1px, transparent 1px)
    `,
        backgroundSize: "40px 40px",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/35">
            Live productivity
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-7xl">
            Live Focus Sessions
            <br />
            <span className="text-black/30">with users.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-black/45">
            Real-time updates of deep work, consistency streaks, and task
            completions from users.
          </p>
        </div>

        <div className="mt-20 overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_20px_60px_rgba(15,15,15,0.06)]">
          <div className="hidden grid-cols-[1.5fr_1.7fr_1fr_1fr_0.8fr_1fr] border-b border-black/[0.07] px-8 py-5 text-xs font-medium text-black/35 md:grid">
            <span>User</span>
            <span>Activity</span>
            <span>Duration</span>
            <span>Streak</span>
            <span>Time</span>
            <span>Status</span>
          </div>

          {sessions.map((session, index) => (
            <div
              key={session.name}
              className={`px-6 py-5 md:grid md:grid-cols-[1.5fr_1.7fr_1fr_1fr_0.8fr_1fr] md:items-center md:px-8 ${
                index !== sessions.length - 1
                  ? "border-b border-black/[0.06]"
                  : ""
              }`}
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${session.avatar} text-xs font-semibold text-white`}
                >
                  {session.initials}
                </div>

                <div>
                  <p className="text-sm font-semibold text-black/90">
                    {session.name}
                  </p>
                  <p className="mt-1 text-xs text-black/30 md:hidden">User</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 md:mt-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${session.activityBg}`}
                >
                  {session.activityIcon}
                </div>

                <div>
                  <p className="text-sm text-black/60">{session.activity}</p>
                  <p className="mt-1 text-xs text-black/30 md:hidden">
                    Activity
                  </p>
                </div>
              </div>

              <div className="mt-5 md:mt-0">
                <p className="text-sm font-semibold text-black/85">
                  {session.duration}
                </p>
                <p className="mt-1 text-xs text-black/30 md:hidden">Duration</p>
              </div>

              <div className="mt-5 md:mt-0">
                <p className="flex items-center gap-2 text-sm font-medium text-orange-500">
                  <span>🔥</span>
                  {session.streak}
                </p>

                <p className="mt-1 text-xs text-black/30 md:hidden">Streak</p>
              </div>

              <div className="mt-5 md:mt-0">
                <p className="text-sm text-black/40">{session.time}</p>

                <p className="mt-1 text-xs text-black/30 md:hidden">Time</p>
              </div>

              <div className="mt-5 md:mt-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white">
                    ✓
                  </span>
                  Completed
                </span>

                <p className="mt-1 text-xs text-black/30 md:hidden">Status</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs text-black/30">
            Showing the latest focus sessions
          </p>

          <p className="text-xs text-black/30">
            Live updates
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </p>
        </div>
      </div>
    </section>
  );
}

export default Leaderboard;
