function Features() {
  return (
    <section
      id="features"
      className="px-6 py-32 text-[#151515] md:py-40"
      style={{
        backgroundColor: "#F5F4EF",
        backgroundImage: `
      linear-gradient(rgba(40, 40, 40, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(40, 40, 40, 0.045) 1px, transparent 1px)
    `,
        backgroundSize: "48px 48px",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* INTRO */}
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-black/35">
              Built around your time
            </p>

            <h2 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-7xl">
              Focus less on
              <br />
              <span className="text-black/30">managing time.</span>
            </h2>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-7 text-black/50">
              Session brings your clock, focus sessions, progress and
              productivity insights into one simple workspace.
            </p>
          </div>
        </div>

        {/* FEATURE 01 — TIMER */}
        <div className="mt-28 grid overflow-hidden rounded-[28px] border border-black/10 bg-white md:grid-cols-2">
          {/* COPY */}
          <div className="flex min-h-[500px] flex-col justify-between p-8 md:p-12">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/30">
                01 — Focus
              </span>

              <h3 className="mt-8 max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl">
                Give your
                <br />
                attention a timer.
              </h3>

              <p className="mt-6 max-w-md text-sm leading-7 text-black/45">
                Start a focused session, put everything else aside, and let
                Session keep track of the time for you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="text-xs text-black/40">Simple by design</span>
            </div>
          </div>

          {/* TIMER MOCKUP */}
          <div className="relative min-h-[500px] overflow-hidden bg-[#191919]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08),transparent_42%)]" />

            <div className="relative flex h-full items-center justify-center p-8">
              <div className="w-full max-w-[390px] rounded-[24px] border border-white/10 bg-[#202020] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Focus
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      Deep work session
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/35">
                    25 MIN
                  </div>
                </div>

                <div className="my-12 flex justify-center">
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10">
                    <div className="absolute inset-3 rounded-full border border-dashed border-white/10" />

                    <div className="text-center">
                      <p className="font-mono text-5xl tracking-[-0.04em] text-white">
                        24:18
                      </p>

                      <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-white/25">
                        remaining
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button className="rounded-full bg-white px-7 py-3 text-xs font-medium text-black">
                    Pause session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 02 — CONSISTENCY */}
        <div className="mt-5 grid overflow-hidden rounded-[28px] border border-black/10 bg-[#EDEBE5] md:grid-cols-12">
          <div className="relative min-h-[460px] overflow-hidden md:col-span-7">
            <div className="absolute left-10 top-10">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/35">
                14 day streak
              </span>
            </div>

            <div className="absolute bottom-12 left-10 right-10">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-7xl font-semibold tracking-[-0.06em]">
                    14
                  </p>
                  <p className="mt-1 text-sm text-black/40">consecutive days</p>
                </div>

                <p className="text-xs text-black/35">Best · 28 days</p>
              </div>

              {/* Consistency grid */}
              <div className="grid grid-cols-14 gap-1.5">
                {Array.from({ length: 56 }).map((_, index) => {
                  const level = index % 5;

                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-[3px] ${
                        level === 0
                          ? "bg-black/[0.06]"
                          : level === 1
                            ? "bg-black/[0.14]"
                            : level === 2
                              ? "bg-black/[0.25]"
                              : level === 3
                                ? "bg-black/[0.42]"
                                : "bg-black/[0.70]"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex min-h-[460px] flex-col justify-between p-8 md:col-span-5 md:p-12">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/30">
                02 — Consistency
              </span>

              <h3 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.04em]">
                Progress
                <br />
                compounds.
              </h3>

              <p className="mt-6 text-sm leading-7 text-black/45">
                Your streak isn't just a number. It's proof that you showed up
                when it mattered.
              </p>
            </div>

            <p className="text-xs text-black/35">Keep showing up.</p>
          </div>
        </div>

        {/* FEATURE 03 — ANALYTICS */}
        <div className="mt-5 grid overflow-hidden rounded-[28px] border border-black/10 bg-[#E7F0FA] md:grid-cols-12">
          {/* COPY */}
          <div className="flex min-h-[500px] flex-col justify-between p-8 md:col-span-5 md:p-12">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/30">
                03 — Analytics
              </span>

              <h3 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl">
                Know where
                <br />
                your hours go.
              </h3>

              <p className="mt-6 max-w-sm text-sm leading-7 text-black/45">
                Turn your sessions into useful patterns. See how much time you
                focus and how your habits change over time.
              </p>
            </div>

            <div>
              <p className="text-4xl font-semibold tracking-[-0.04em]">
                42h 18m
              </p>

              <p className="mt-1 text-xs text-black/35">
                total focus this month
              </p>
            </div>
          </div>

          {/* CHART */}
          <div className="relative min-h-[500px] bg-[#F8FBFF] md:col-span-7">
            <div className="absolute inset-x-10 top-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Focus time</p>

                <p className="mt-1 text-xs text-black/35">Last 12 months</p>
              </div>

              <span className="rounded-full bg-black px-3 py-1.5 text-[10px] text-white">
                +18.4%
              </span>
            </div>

            <div className="absolute bottom-16 left-10 right-10 top-36 flex items-end gap-2">
              {[28, 42, 36, 55, 48, 62, 57, 72, 64, 82, 74, 94].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className={`w-full rounded-t-md transition ${
                        index === 11 ? "bg-black" : "bg-black/10"
                      }`}
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                ),
              )}
            </div>

            <div className="absolute bottom-6 left-10 right-10 flex justify-between text-[9px] text-black/25">
              <span>JAN</span>
              <span>MAR</span>
              <span>MAY</span>
              <span>JUL</span>
              <span>SEP</span>
              <span>NOV</span>
            </div>
          </div>
        </div>

        {/* FEATURE 04 — EVERYTHING TOGETHER */}
        <div className="relative mt-5 overflow-hidden rounded-[28px] bg-[#171717] px-8 py-16 text-white md:px-12 md:py-20">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
              04 — Your workspace
            </span>

            <h3 className="mt-8 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-6xl">
              One place for
              <br />
              your time.
            </h3>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
              Clock. Stopwatch. Countdown. Analytics. Everything you need to
              build a better relationship with your time.
            </p>

            <button className="mt-8 rounded-full bg-white px-6 py-3 text-xs font-medium text-black">
              Get Started →
            </button>
          </div>

          {/* ABSTRACT UI STACK */}
          <div className="absolute -bottom-32 right-[-80px] hidden h-[420px] w-[600px] rotate-[-6deg] md:block">
            <div className="absolute right-20 top-20 h-64 w-96 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex justify-between">
                <span className="text-[10px] text-white/25">TODAY</span>

                <span className="text-[10px] text-white/25">04:32:18</span>
              </div>

              <div className="mt-12 h-2 w-3/4 rounded-full bg-white/10" />
              <div className="mt-3 h-2 w-1/2 rounded-full bg-white/5" />

              <div className="mt-10 grid grid-cols-4 gap-3">
                <div className="h-20 rounded-xl bg-white/5" />
                <div className="h-20 rounded-xl bg-white/5" />
                <div className="h-20 rounded-xl bg-white/5" />
                <div className="h-20 rounded-xl bg-white/5" />
              </div>
            </div>

            <div className="absolute right-0 top-0 h-64 w-96 rounded-2xl border border-white/10 bg-[#202020] p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">FOCUS</span>

                <span className="h-2 w-2 rounded-full bg-white" />
              </div>

              <div className="mt-12 text-center">
                <p className="font-mono text-5xl">24:18</p>

                <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-white/20">
                  remaining
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CLOSING LINE */}
        <div className="mt-24 border-t border-black/10 pt-8">
          <p className="max-w-2xl text-sm leading-7 text-black/40">
            Designed for people who want to spend their time intentionally — not
            constantly think about how they're spending it.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
