
const stats = [
  {
    value: "10K+",
    label: "Focus Sessions",
  },
  {
    value: "5K+",
    label: "Active Users",
  },
  {
    value: "95%",
    label: "Daily Goal Rate",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

export default function Stats() {
  return (
    <section className="border-y bg-gray-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 px-6 py-20 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-r px-6 text-center last:border-r-0"
          >
            <div className="text-3xl font-bold tracking-tight md:text-4xl">
              {stat.value}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

