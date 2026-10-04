"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

interface CreateTaskResponse {
  success: boolean;
  task: Task;
}

interface UpdateTaskResponse {
  success: boolean;
  task: Task;
}

export default function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState(getTodayDate());

  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<TasksResponse>("/tasks");

      const todayTasks = data.tasks.filter((task) => isToday(task.dueDate));

      setTasks(todayTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task title");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const data = await apiFetch<CreateTaskResponse>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: trimmedTitle,
          priority,
          dueDate,
        }),
      });

      if (data.success) {
        setTasks((current) => [...current, data.task]);

        setTitle("");
        setPriority("medium");
        setDueDate(getTodayDate());
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to create task:", error);

      setError(
        error instanceof Error ? error.message : "Failed to create task",
      );
    } finally {
      setCreating(false);
    }
  }

  async function toggleTask(task: Task) {
    try {
      setUpdatingId(task._id);
      setError("");

      const data = await apiFetch<UpdateTaskResponse>(`/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (data.success) {
        setTasks((current) =>
          current.map((item) => (item._id === task._id ? data.task : item)),
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);

      setError("Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleCancel() {
    setShowAddForm(false);
    setTitle("");
    setPriority("medium");
    setDueDate(getTodayDate());
    setError("");
  }

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
          <span className="text-sm text-slate-500">{formatToday()}</span>

          <button
            type="button"
            className="text-slate-400 transition hover:text-slate-700"
          >
            <MoreIcon />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200/50 bg-red-50/50 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[210px] items-center justify-center">
          <p className="text-sm text-slate-500">Loading tasks...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && tasks.length === 0 && !showAddForm && (
        <div className="flex min-h-[210px] flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 text-slate-500">
            <TaskIcon />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-700">
            No tasks for today
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add a task to get started.
          </p>
        </div>
      )}

      {/* Task list */}
      {!loading && tasks.length > 0 && (
        <div className="divide-y divide-slate-400/10">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex min-h-[58px] items-center gap-4"
            >
              {/* Checkbox */}
              <button
                type="button"
                disabled={updatingId === task._id}
                onClick={() => toggleTask(task)}
                aria-label={
                  task.completed
                    ? `Mark ${task.title} as incomplete`
                    : `Mark ${task.title} as complete`
                }
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                  task.completed
                    ? "border-white bg-white text-slate-900 shadow-sm"
                    : "border-white/30 bg-white/[0.04] hover:border-white/60 hover:bg-white/[0.08]"
                } ${updatingId === task._id ? "cursor-wait opacity-60" : ""}`}
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

              {/* Task title */}
              <p
                className={`min-w-0 flex-1 text-[14px] ${
                  task.completed
                    ? "text-white/70 line-through decoration-white/40"
                    : "text-slate-700"
                }`}
              >
                {task.title}
              </p>

              {/* Priority */}
              <span
                className={`hidden rounded-full px-3 py-1 text-[11px] font-medium sm:inline-flex ${
                  task.priority === "high"
                    ? "bg-red-100/80 text-red-500"
                    : task.priority === "medium"
                      ? "bg-amber-100/80 text-amber-600"
                      : "bg-emerald-100/80 text-emerald-600"
                }`}
              >
                {capitalize(task.priority)}
              </span>

              {/* Date */}
              <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                <MiniCalendarIcon />
                Today
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add task form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateTask}
          className="mt-4 rounded-xl border border-white/30 bg-white/25 p-4 backdrop-blur-xl"
        >
          <div className="space-y-3">
            {/* Title */}
            <div>
              <label
                htmlFor="task-title"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Task
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What do you need to do?"
                autoFocus
                maxLength={200}
                className="w-full rounded-lg border border-white/40 bg-white/40 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400/60 focus:bg-white/60"
              />
            </div>

            {/* Priority + Date */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as "low" | "medium" | "high")
                  }
                  className="w-full rounded-lg border border-white/40 bg-white/40 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400/60"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-date"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Due date
                </label>

                <input
                  id="task-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-lg border border-white/40 bg-white/40 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400/60"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                disabled={creating}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-500 transition hover:bg-white/30 hover:text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating || !title.trim()}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Add task button */}
      {!showAddForm && (
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setError("");
          }}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-500 transition hover:text-slate-800"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/60 text-lg">
            +
          </span>
          Add new task
        </button>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isToday(date?: string) {
  if (!date) return false;

  const taskDate = new Date(date);
  const today = new Date();

  return (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  );
}

function formatToday() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
