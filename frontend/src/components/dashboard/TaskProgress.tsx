"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

export default function TaskProgress() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await apiFetch<TasksResponse>("/tasks");
        setTasks(data.tasks ?? []);
      } catch (error) {
        console.error("Failed to load dashboard tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const { completed, total, progress, remaining } = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    const percentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      completed: completedTasks,
      total: totalTasks,
      progress: percentage,
      remaining: totalTasks - completedTasks,
    };
  }, [tasks]);

  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-[385px] rounded-2xl border border-white/35 bg-white/[0.30] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <TargetIcon />

        <h2 className="text-[17px] font-medium text-slate-800">
          Task Progress
        </h2>
      </div>

      {/* Ring */}
      <div className="mt-6 flex justify-center">
        <div className="relative h-[190px] w-[190px]">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="rgba(100,130,160,0.18)"
              strokeWidth="9"
            />

            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#3182F6"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[34px] font-medium tracking-[-0.05em] text-slate-800">
              {loading ? "..." : `${completed}/${total}`}
            </span>

            <span className="mt-1 text-sm text-slate-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-blue-500" />

            <span className="text-sm text-slate-500">Completed</span>
          </div>

          <span className="text-sm text-slate-500">
            {loading ? "..." : completed}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-slate-400" />

            <span className="text-sm text-slate-500">Remaining</span>
          </div>

          <span className="text-sm text-slate-500">
            {loading ? "..." : remaining}
          </span>
        </div>
      </div>

      {/* Bottom progress */}
      <div className="mt-6 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-300/40">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className="text-sm text-slate-500">
          {loading ? "..." : `${progress}%`}
        </span>
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="text-slate-700"
    >
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
