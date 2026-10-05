"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface MeResponse {
  success: boolean;
  user: User;
}

interface UpdateUsernameResponse {
  success: boolean;
  message: string;
  user: User;
}

interface LogoutResponse {
  message: string;
}

export default function SettingsPage() {
  const router = useRouter();

  const [theme, setTheme] = useState("system");
  const [focusDuration, setFocusDuration] = useState("25");
  const [shortBreak, setShortBreak] = useState("5");
  const [longBreak, setLongBreak] = useState("15");

  const [taskNotifications, setTaskNotifications] = useState(true);
  const [sessionNotifications, setSessionNotifications] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [savingUsername, setSavingUsername] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const data = await apiFetch<MeResponse>("/users/getme");

        if (data.success && data.user) {
          setUsername(data.user.username);
          setEmail(data.user.email);
        } else {
          setProfileError("Unable to load profile.");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setProfileError("Unable to load profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveChanges = async () => {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      setSaveMessage("Username must be at least 3 characters.");
      return;
    }

    try {
      setSavingUsername(true);
      setSaveMessage("");
      setProfileError("");

      const data = await apiFetch<UpdateUsernameResponse>(
        "/users/updateusername",
        {
          method: "PUT",
          body: JSON.stringify({
            username: trimmedUsername,
          }),
        },
      );

      if (data.success && data.user) {
        setUsername(data.user.username);
        setEmail(data.user.email);
        setSaveMessage("Changes saved successfully.");
      } else {
        setSaveMessage("Unable to save changes.");
      }
    } catch (error) {
      console.error("Failed to update username:", error);

      if (error instanceof Error) {
        setSaveMessage(error.message);
      } else {
        setSaveMessage("Failed to save changes.");
      }
    } finally {
      setSavingUsername(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await apiFetch<LogoutResponse>("/users/logout", {
        method: "GET",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setSaveMessage("Failed to logout. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-white/55">Preferences</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-white/55">
            Manage your Session preferences and account.
          </p>
        </div>

        <div className="space-y-5">
          {/* Profile */}
          <SettingsCard
            icon={<UserIcon />}
            title="Profile"
            description="Manage your personal information."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SettingInput
                label="Username"
                value={profileLoading ? "Loading..." : username}
                onChange={setUsername}
                placeholder="Your username"
                disabled={profileLoading || savingUsername}
              />

              <SettingInput
                label="Email"
                value={profileLoading ? "Loading..." : email}
                placeholder="Your email"
                disabled
              />
            </div>

            {profileError && (
              <p className="mt-3 text-xs text-red-500">{profileError}</p>
            )}

            {saveMessage && (
              <p
                className={`mt-3 text-xs ${
                  saveMessage.includes("successfully")
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {saveMessage}
              </p>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={profileLoading || savingUsername}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingUsername ? "Saving..." : "Save changes"}
              </button>
            </div>
          </SettingsCard>

          {/* Appearance */}
          <SettingsCard
            icon={<PaletteIcon />}
            title="Appearance"
            description="Customize how Session looks."
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Theme
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <ThemeOption
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                  icon={<SunIcon />}
                  title="Light"
                  description="Bright interface"
                />

                <ThemeOption
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                  icon={<MoonIcon />}
                  title="Dark"
                  description="Dark interface"
                />

                <ThemeOption
                  active={theme === "system"}
                  onClick={() => setTheme("system")}
                  icon={<MonitorIcon />}
                  title="System"
                  description="Use device theme"
                />
              </div>
            </div>
          </SettingsCard>

          {/* Focus */}
          <SettingsCard
            icon={<TimerIcon />}
            title="Focus"
            description="Configure your focus timer."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <SettingSelect
                label="Focus duration"
                value={focusDuration}
                onChange={setFocusDuration}
                options={[
                  ["15", "15 minutes"],
                  ["25", "25 minutes"],
                  ["30", "30 minutes"],
                  ["45", "45 minutes"],
                  ["50", "50 minutes"],
                  ["60", "60 minutes"],
                ]}
              />

              <SettingSelect
                label="Short break"
                value={shortBreak}
                onChange={setShortBreak}
                options={[
                  ["5", "5 minutes"],
                  ["10", "10 minutes"],
                  ["15", "15 minutes"],
                ]}
              />

              <SettingSelect
                label="Long break"
                value={longBreak}
                onChange={setLongBreak}
                options={[
                  ["15", "15 minutes"],
                  ["20", "20 minutes"],
                  ["30", "30 minutes"],
                ]}
              />
            </div>
          </SettingsCard>

          {/* Notifications */}
          <SettingsCard
            icon={<BellIcon />}
            title="Notifications"
            description="Choose what Session should notify you about."
          >
            <div className="divide-y divide-slate-300/20">
              <ToggleRow
                title="Task reminders"
                description="Get reminded about upcoming tasks."
                enabled={taskNotifications}
                onChange={setTaskNotifications}
              />

              <ToggleRow
                title="Focus sessions"
                description="Notify when a focus session starts or ends."
                enabled={sessionNotifications}
                onChange={setSessionNotifications}
              />
            </div>
          </SettingsCard>

          {/* Account */}
          <SettingsCard
            icon={<ShieldIcon />}
            title="Account"
            description="Manage your Session account."
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Sign out of Session
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  You can sign back in anytime.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl border border-red-200 bg-red-50/60 px-5 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </SettingsCard>

          {/* Version */}
          <div className="pb-6 text-center text-xs text-white/35">
            Session · Settings
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/30 bg-white/[0.30] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/45 text-slate-700">
          {icon}
        </div>

        <div>
          <h2 className="text-[16px] font-semibold text-slate-800">{title}</h2>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function SettingInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={!onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/40 bg-white/45 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400/60 focus:bg-white/60 disabled:cursor-not-allowed disabled:opacity-70"
      />
    </div>
  );
}

function SettingSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/40 bg-white/45 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400/60"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? "border-slate-500/50 bg-white/65 shadow-sm"
          : "border-white/35 bg-white/25 hover:bg-white/45"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          active ? "bg-slate-800 text-white" : "bg-white/50 text-slate-600"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>

        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-slate-800" : "bg-slate-300/70"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-10h-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="7" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <circle cx="15" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 9v4l2.5 1.5M9 3h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
