
export default function Hero() {
  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Turn Your Time Into Productivity
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Track your progress, stay consistent, and become the best version of
          yourself.
        </p>

        <div className="mt-8 flex justify-center gap-5">
          <button className="rounded-full border bg-black px-4 py-2 text-white">
            Start
          </button>

          <button className="rounded-full border px-4 py-2">
            Explore
          </button>
        </div>
      </section>

      {/* Dashboard Preview */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="min-h-96 rounded-2xl border bg-white p-8 shadow-lg">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div className="font-semibold">Today</div>

            <div className="text-sm text-gray-500">
              Focus Mode
            </div>
          </div>

          <div className="mt-4 border-t" />

          {/* Current Session */}
          <div className="mt-8 rounded-xl border bg-white p-6 text-center">
            <div className="text-sm text-gray-500">
              Current Session
            </div>

            <div className="mt-2 text-3xl font-semibold">
              25:00
            </div>

            <button className="mt-5 rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
              Start Session
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">
                Focus
              </div>

              <div className="mt-1 text-xl font-semibold">
                2h 30m
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">
                Tasks
              </div>

              <div className="mt-1 text-xl font-semibold">
                8
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">
                Streak
              </div>

              <div className="mt-1 text-xl font-semibold">
                7 days
              </div>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Daily Goal
              </div>

              <div className="text-sm text-gray-500">
                70%
              </div>
            </div>

            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div className="h-2 w-[70%] rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

