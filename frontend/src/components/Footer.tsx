function Footer() {
  return (
    <footer id="about" className="bg-[#2F3133] px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Main Footer */}
        <div className="grid gap-16 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Session
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
              A simple workspace to track your time, stay focused, and build
              better productivity habits.
            </p>

            <a
              href="#"
              className="mt-8 inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Get Started
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            {/* Product */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                Product
              </h3>

              <div className="mt-6 space-y-4">
                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Features
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Analytics
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Sessions
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Leaderboard
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                Company
              </h3>

              <div className="mt-6 space-y-4">
                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  About
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Contact
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Blog
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                Legal
              </h3>

              <div className="mt-6 space-y-4">
                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Privacy
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Terms
                </a>

                <a
                  href="#"
                  className="block text-sm text-white/60 transition hover:text-white"
                >
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} Session. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-white/40 transition hover:text-white"
              >
                X
              </a>

              <a
                href="#"
                className="text-xs text-white/40 transition hover:text-white"
              >
                GitHub
              </a>

              <a
                href="#"
                className="text-xs text-white/40 transition hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
