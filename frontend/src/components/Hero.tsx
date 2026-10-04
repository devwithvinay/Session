function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-15 text-center md:pt-20">
      <h1 className="max-w-4xl text-5xl font-bold text-white drop-shadow-lg md:text-7xl">
        Turn Your Time Into Productivity
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
        Track your progress, stay consistent, and become the best version of
        yourself.
      </p>

      <button className="mt-10 rounded-lg border border-white/30 bg-white/20 px-6 py-3 font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-white/40">
        Get Started →
      </button>
    </section>
  );
}

export default Hero;
