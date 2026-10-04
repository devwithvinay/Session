"use client";

import { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Build authentication API",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Solve 5 DSA problems",
    priority: "High",
    completed: false,
  },
  {
    id: 3,
    title: "Finish landing page",
    priority: "Done",
    completed: true,
  },
  {
    id: 4,
    title: "Build dashboard",
    priority: "Medium",
    completed: false,
  },
  {
    id: 5,
    title: "Fix login bug",
    priority: "Done",
    completed: true,
  },
];

export default function TodayTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              priority: !task.completed ? "Done" : "Medium",
            }
          : task,
      ),
    );
  };

  return (
    <div className="min-h-[385px] rounded-2xl border border-white/35 bg-white/[0.30] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-400/15 pb-5">
        <div className="flex items-center gap-3">
          <div className="text-slate-700">
            <TaskIcon />
          </div>

          <h2 className="text-[17px] font-medium text-slate-800">
            Today&apos;s Tasks
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">4 Oct 2026</span>

          <button className="text-slate-400 hover:text-slate-700">
            <MoreIcon />
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="divide-y divide-slate-400/10">
        {tasks.map((task) => (
          <div key={task.id} className="flex min-h-[50px] items-center gap-4">
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                task.completed
                  ? "border-slate-700 bg-slate-700 text-white"
                  : "border-slate-400/70 bg-white/10"
              }`}
            >
              {task.completed && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              )}
            </button>

            {/* Task */}
            <p
              className={`min-w-0 flex-1 text-[14px] ${
                task.completed
                  ? "text-slate-600 line-through decoration-slate-500"
                  : "text-slate-700"
              }`}
            >
              {task.title}
            </p>

            {/* Priority */}
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                task.priority === "High"
                  ? "bg-red-100/80 text-red-500"
                  : task.priority === "Medium"
                    ? "bg-amber-100/80 text-amber-600"
                    : "bg-emerald-100/80 text-emerald-600"
              }`}
            >
              {task.priority}
            </span>

            {/* Date */}
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <MiniCalendarIcon />
              Today
            </div>
          </div>
        ))}
      </div>

      {/* Add task */}
      <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-500 transition hover:text-slate-800">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/60 text-lg">
          +
        </span>
        Add new task
      </button>
    </div>
  );
}

/* ---------------- ICONS ---------------- */

function TaskIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m8 12 2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniCalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 2v4M16 2v4M3 10h18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}
