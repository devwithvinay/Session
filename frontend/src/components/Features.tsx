
const features = [
  {
    title: "Focus Sessions",
    description:
      "Work with focused sessions that help you stay consistent and avoid distractions.",
  },
  {
    title: "Task Management",
    description:
      "Organize your daily tasks and keep everything you need to accomplish in one place.",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your focus time, completed tasks, and daily streaks to understand your progress.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-gray-500">
          Everything you need
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Build better habits.
          <br />
          Get more done.
        </h2>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Session gives you the tools to manage your time, stay focused, and
          make consistent progress every day.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white">
              ✓
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              {feature.title}
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

