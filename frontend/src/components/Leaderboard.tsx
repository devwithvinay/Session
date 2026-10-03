
const users = [
  {
    rank: 1,
    name: "Alex Morgan",
    initials: "AM",
    focus: "18h 42m",
    streak: "24 days",
  },
  {
    rank: 2,
    name: "Sarah Chen",
    initials: "SC",
    focus: "17h 15m",
    streak: "21 days",
  },
  {
    rank: 3,
    name: "David Kim",
    initials: "DK",
    focus: "15h 48m",
    streak: "18 days",
  },
  {
    rank: 4,
    name: "James Wilson",
    initials: "JW",
    focus: "14h 32m",
    streak: "16 days",
  },
  {
    rank: 5,
    name: "Emma Davis",
    initials: "ED",
    focus: "13h 20m",
    streak: "14 days",
  },
];

export default function Leaderboard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            Stay motivated
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Compete with yourself.
            <br />
            Grow together.
          </h2>

          <p className="mt-5 max-w-lg text-lg leading-8 text-gray-600">
            See how your focus compares with others, maintain your streak,
            and stay motivated to make progress every day.
          </p>

          <button className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
            View Leaderboard
          </button>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl border bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Weekly Leaderboard
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Top focusers this week
              </p>
            </div>

            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
              This Week
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {users.map((user) => (
              <div
                key={user.rank}
                className="flex items-center gap-4 rounded-xl border p-3 transition-colors hover:bg-gray-50"
              >
                {/* Rank */}
                <div className="w-6 text-center text-sm font-semibold text-gray-500">
                  {user.rank}
                </div>

                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {user.initials}
                </div>

                {/* User */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {user.name}
                  </div>

                  <div className="text-xs text-gray-500">
                    🔥 {user.streak}
                  </div>
                </div>

                {/* Focus */}
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {user.focus}
                  </div>

                  <div className="text-xs text-gray-500">
                    focus time
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

