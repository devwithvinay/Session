"use client";

import { useEffect, useState } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-10 md:px-6">
      <nav
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-4 transition-all duration-300 md:h-16 md:px-6 ${
          scrolled
            ? "border-white/20 bg-black/40 shadow-lg backdrop-blur-xl"
            : "border-white/25 bg-black/10 backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="px-3 text-base font-semibold tracking-[-0.02em] text-white md:text-lg"
        >
          Session
        </a>

        {/* Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <a
            href="/"
            className="rounded-full px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Home
          </a>

          <a
            href="#features"
            className="rounded-full px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Features
          </a>

          <a
            href="#preview"
            className="rounded-full px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Preview
          </a>

          <a
            href="#about"
            className="rounded-full px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            About
          </a>
        </div>

        {/* Login */}
        <a
          href="/login"
          className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
        >
          Login
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
