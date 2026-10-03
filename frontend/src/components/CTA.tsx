
export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="rounded-3xl bg-black px-6 py-16 text-center text-white md:px-12">
        <p className="text-sm font-medium text-gray-400">
          Start today
        </p>

        <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Take control of your time.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Build better habits, stay focused, and make meaningful progress
          every single day.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
            Get Started
          </button>

          <button className="rounded-full border border-gray-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

