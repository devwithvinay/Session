"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    // Later, connect this to your authentication backend.
    setSent(true);
  };

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
      {/* Background overlays */}
      <div className="pointer-events-none absolute inset-0 bg-black/[0.03]" />

      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[400px] w-[400px] rounded-full bg-white/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-sky-200/20 blur-3xl" />

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
            Get back into your workspace.
          </p>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-[30px] border border-white/40 bg-white/[0.18] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-9">
          {/* Glass highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-white/20 blur-3xl" />

          <div className="relative z-10">
            {!sent ? (
              <>
                {/* Heading */}
                <div>
                  <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white drop-shadow">
                    Forgot password?
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Enter your email and we'll send you a link to reset your
                    password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-xl border border-white/30 bg-white/20 px-4 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-white/55 focus:border-white/60 focus:bg-white/25 focus:ring-4 focus:ring-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-white/90 text-sm font-semibold text-[#304856] shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition hover:bg-white active:scale-[0.99]"
                  >
                    Send reset link
                  </button>
                </form>

                {/* Back to login */}
                <div className="mt-7 text-center">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-white/75 transition hover:text-white"
                  >
                    ← Back to sign in
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-6 w-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4h16v16H4z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4 6 8 6 8-6"
                      />
                    </svg>
                  </div>

                  <h1 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Check your email
                  </h1>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/75">
                    We've sent a password reset link to{" "}
                    <span className="font-medium text-white">{email}</span>.
                  </p>

                  <Link
                    href="/login"
                    className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-white/90 text-sm font-semibold text-[#304856] shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition hover:bg-white"
                  >
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-white/60">
          By continuing, you agree to Session's Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
