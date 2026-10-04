"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

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
            Welcome back. Continue your focus.
          </p>
        </div>

        {/* Login card */}
        <div className="relative overflow-hidden rounded-[30px] border border-white/40 bg-white/[0.18] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-9">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-white/20 blur-3xl" />

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

            {/* Google */}
            <button
              type="button"
              className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/20 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/30"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.805 12.23c0-.79-.064-1.55-.182-2.28H12v4.31h5.497a4.7 4.7 0 0 1-2.04 3.086v2.568h3.302c1.934-1.78 3.046-4.404 3.046-7.684Z"
                  fill="#4285F4"
                />

                <path
                  d="M12 22c2.76 0 5.077-.913 6.77-2.486l-3.302-2.568c-.916.615-2.084.979-3.468.979-2.664 0-4.922-1.8-5.733-4.218H2.853v2.65A10.22 10.22 0 0 0 12 22Z"
                  fill="#34A853"
                />

                <path
                  d="M6.267 13.707A6.14 6.14 0 0 1 5.946 12c0-.592.11-1.168.321-1.707v-2.65H2.853A10.16 10.16 0 0 0 1.78 12c0 1.637.393 3.185 1.073 4.357l3.414-2.65Z"
                  fill="#FBBC05"
                />

                <path
                  d="M12 6.075c1.5 0 2.847.516 3.91 1.527l2.932-2.932C17.072 2.993 14.76 2 12 2a10.22 10.22 0 0 0-9.147 5.643l3.414 2.65C7.078 7.875 9.336 6.075 12 6.075Z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/20" />

              <span className="text-[11px] font-medium tracking-wider text-white/55">
                OR
              </span>

              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-white">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-white/90 text-sm font-semibold text-[#304856] shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition hover:bg-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-white transition hover:text-white/80"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/60">
          By continuing, you agree to Session&apos;s Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
