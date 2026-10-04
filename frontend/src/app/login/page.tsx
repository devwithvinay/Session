"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(10, 25, 35, 0.12),
            rgba(10, 25, 35, 0.12)
          ),
          url("/images/login.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft background blur */}
      <div className="pointer-events-none absolute inset-0 bg-black/[0.03]" />

      {/* Subtle light glow */}
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[400px] w-[400px] rounded-full bg-white/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-sky-200/20 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[430px]">
        {/* Brand */}
        <div className="mb-7 text-center">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-[-0.05em] text-white drop-shadow-lg"
          >
            Session
          </Link>

          <p className="mt-3 text-sm text-white/80 drop-shadow">
            Welcome back. Continue your focus.
          </p>
        </div>

        {/* ================= GLASS CARD ================= */}
        <div className="relative overflow-hidden rounded-[30px] border border-white/40 bg-white/[0.18] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-9">
          {/* Top glass reflection */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />

          {/* Glass glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-white/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            {/* Heading */}
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white drop-shadow">
                Sign in
              </h1>

              <p className="mt-2 text-sm text-white/75">
                Enter your details to access your workspace.
              </p>
            </div>

            {/* ================= GOOGLE ================= */}
            <button
              type="button"
              className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/20 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/30"
            >
              {/* Google Icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.74 9.74 0 0 0 12 21.5Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.53 13.6A5.86 5.86 0 0 1 6.22 12c0-.56.1-1.1.31-1.6V7.88H3.28A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.12l3.25-2.52Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.37c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.72 5.38l3.25 2.52C7.3 8.09 9.46 6.37 12 6.37Z"
                />
              </svg>
              Continue with Google
            </button>

            {/* ================= DIVIDER ================= */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20" />

              <span className="text-[11px] font-medium tracking-wider text-white/55">
                OR
              </span>

              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* ================= FORM ================= */}
            <form className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/90"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/30 bg-white/20 px-4 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-white/55 focus:border-white/60 focus:bg-white/25 focus:ring-4 focus:ring-white/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/90"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-white/70 transition hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-white/30 bg-white/20 px-4 pr-16 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-white/55 focus:border-white/60 focus:bg-white/25 focus:ring-4 focus:ring-white/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* ================= SIGN IN ================= */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-white/90 text-sm font-semibold text-[#304856] shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition hover:bg-white active:scale-[0.99]"
              >
                Sign in
              </button>
            </form>

            {/* ================= REGISTER ================= */}
            <p className="mt-7 text-center text-sm text-white/70">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-white transition hover:text-white/80"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-xs text-white/60">
          By continuing, you agree to Session's Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
