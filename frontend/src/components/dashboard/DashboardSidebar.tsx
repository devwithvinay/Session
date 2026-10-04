"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/app",
    icon: DashboardIcon,
  },
  {
    name: "Tasks",
    href: "/app/tasks",
    icon: TasksIcon,
  },
  {
    name: "Focus Timer",
    href: "/app/focus",
    icon: FocusIcon,
  },
  {
    name: "Sessions",
    href: "/app/sessions",
    icon: SessionsIcon,
  },
  {
    name: "Analytics",
    href: "/app/analytics",
    icon: AnalyticsIcon,
  },
  {
    name: "Leaderboard",
    href: "/app/leaderboard",
    icon: TrophyIcon,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[252px] border-r border-white/20 bg-slate-700/20 px-7 py-7 backdrop-blur-2xl md:block">
      {/* Logo */}
      <Link href="/app" className="flex items-center gap-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center">
          <LogoIcon />
        </div>

        <span className="text-[23px] font-medium tracking-[-0.03em]">
          Session
        </span>
      </Link>

      {/* Navigation */}
      <nav className="mt-12 space-y-2">
        {navigation.map((item) => {
          const active =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-[50px] items-center gap-4 rounded-xl px-4 text-[15px] font-medium transition-all ${
                active
                  ? "bg-slate-800/75 text-white shadow-[0_8px_25px_rgba(15,23,42,0.18)]"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-7 h-px bg-white/15" />

      {/* Settings */}
      <Link
        href="/app/settings"
        className={`flex h-[50px] items-center gap-4 rounded-xl px-4 text-[15px] font-medium transition ${
          pathname.startsWith("/app/settings")
            ? "bg-slate-800/75 text-white"
            : "text-white/85 hover:bg-white/10 hover:text-white"
        }`}
      >
        <SettingsIcon />

        <span>Settings</span>
      </Link>

      {/* Bottom */}
      <div className="absolute bottom-8 left-7 flex items-center gap-3 text-sm text-white/75">
        <SunIcon />

        <span>Focus</span>

        <span>•</span>

        <span>Build</span>

        <span>•</span>

        <span>Grow</span>
      </div>
    </aside>
  );
}

/* ---------------- ICONS ---------------- */

function LogoIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path
        d="M18 2L21.7 14.3L34 18L21.7 21.7L18 34L14.3 21.7L2 18L14.3 14.3L18 2Z"
        stroke="white"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 9.5V21h14V9.5M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m7.5 12 3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />

      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SessionsIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 7h10M7 12h10M7 17h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="m4 7 1 1 2-2M4 12l1 1 2-2M4 17l1 1 2-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20V10M10 20V4M16 20v-7M22 20H2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="m3 8 5-4 5 3 7-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 4h8v5a4 4 0 0 1-8 0V4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v5M8 21h8M9 18h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />

      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.9A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06A1.7 1.7 0 0 0 11.7 6a1.7 1.7 0 0 0 1.03-1.56V4h2.4v.44A1.7 1.7 0 0 0 16.16 6a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.44v2.4h-.44A1.7 1.7 0 0 0 19.4 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />

      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
