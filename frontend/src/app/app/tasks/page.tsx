
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "../../../lib/api";

type Priority = "low" | "medium" | "high";

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TasksResponse {
  message: string;
  success: boolean;
  tasks: Task[];
}

interface TaskResponse {
  message: string;
  success: boolean;
  task: Task;
}

interface DeleteResponse {
  message: string;
  success: boolean;
}

type View = "all" | "today" | "upcoming" | "completed";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<View>("all");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null);

  const [editTitle, setEditTitle] =
    useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editPriority, setEditPriority] =
    useState<Priority>("medium");
  const [editDueDate, setEditDueDate] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ---------------- FETCH TASKS ---------------- */

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await apiFetch<TasksResponse>("/tasks");

      setTasks(data.tasks);
    } catch (error) {
      console.error(
        "Failed to load tasks:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ---------------- SYNC WITH DASHBOARD ---------------- */

  useEffect(() => {
    const handleTaskUpdated = () => {
      fetchTasks();
    };

    window.addEventListener(
      "task-updated",
      handleTaskUpdated,
    );

    return () => {
      window.removeEventListener(
        "task-updated",
        handleTaskUpdated,
      );
    };
  }, [fetchTasks]);

  /* ---------------- HELPERS ---------------- */

  const isToday = (date?: string) => {
    if (!date) return false;

    const normalizedDate =
      date.length >= 10
        ? date.slice(0, 10)
        : date;

    return (
      normalizedDate === getTodayDate()
    );
  };

  const isUpcoming = (date?: string) => {
    if (!date) return false;

    const normalizedDate =
      date.length >= 10
        ? date.slice(0, 10)
        : date;

    return normalizedDate > getTodayDate();
  };

  const isOverdue = (task: Task) => {
    if (
      !task.dueDate ||
      task.completed
    ) {
      return false;
    }

    const normalizedDate =
      task.dueDate.length >= 10
        ? task.dueDate.slice(0, 10)
        : task.dueDate;

    return normalizedDate < getTodayDate();
  };

  const formatDate = (date?: string) => {
    if (!date) return "";

    const normalizedDate =
      date.length >= 10
        ? date.slice(0, 10)
        : date;

    const [year, month, day] =
      normalizedDate.split("-").map(Number);

    if (
      !year ||
      !month ||
      !day
    ) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      },
    ).format(
      new Date(
        year,
        month - 1,
        day,
      ),
    );
  };

  /* ---------------- ADD TASK ---------------- */

  const handleAddTask = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(
        "Task title is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const body: {
        title: string;
        description?: string;
        priority: Priority;
        dueDate?: string;
      } = {
        title: title.trim(),
        priority,
      };

      if (description.trim()) {
        body.description =
          description.trim();
      }

      if (dueDate) {
        body.dueDate = dueDate;
      }

      const data =
        await apiFetch<TaskResponse>(
          "/tasks",
          {
            method: "POST",
            body: JSON.stringify(body),
          },
        );

      if (!data.success || !data.task) {
        throw new Error(
          "Task could not be created",
        );
      }

      /*
       * IMPORTANT:
       * Fetch the actual server state instead
       * of only modifying local state.
       */
      await fetchTasks();

      /*
       * Tell Dashboard and other task
       * components that the task list changed.
       */
      window.dispatchEvent(
        new Event("task-updated"),
      );

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- COMPLETE / UNCOMPLETE ---------------- */

  const toggleTask = async (
    task: Task,
  ) => {
    try {
      setError("");

      const data =
        await apiFetch<TaskResponse>(
          `/tasks/${task._id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              completed:
                !task.completed,
            }),
          },
        );

      if (!data.success || !data.task) {
        throw new Error(
          "Task could not be updated",
        );
      }

      /*
       * Get the same state that the
       * backend has stored.
       */
      await fetchTasks();

      /*
       * Synchronize Dashboard.
       */
      window.dispatchEvent(
        new Event("task-updated"),
      );
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task",
      );
    }
  };

  /* ---------------- EDIT TASK ---------------- */

  const startEditing = (
    task: Task,
  ) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(
      task.description || "",
    );
    setEditPriority(task.priority);

    setEditDueDate(
      task.dueDate
        ? task.dueDate
            .slice(0, 10)
        : "",
    );

    setError("");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("medium");
    setEditDueDate("");
  };

  const saveEdit = async (
    taskId: string,
  ) => {
    if (!editTitle.trim()) {
      setError(
        "Task title cannot be empty.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const body: {
        title: string;
        description: string;
        priority: Priority;
        dueDate?: string;
      } = {
        title: editTitle.trim(),
        description:
          editDescription.trim(),
        priority: editPriority,
      };

      if (editDueDate) {
        body.dueDate = editDueDate;
      }

      const data =
        await apiFetch<TaskResponse>(
          `/tasks/${taskId}`,
          {
            method: "PATCH",
            body: JSON.stringify(body),
          },
        );

      if (!data.success || !data.task) {
        throw new Error(
          "Task could not be updated",
        );
      }

      await fetchTasks();

      window.dispatchEvent(
        new Event("task-updated"),
      );

      cancelEditing();
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DELETE TASK ---------------- */

  const deleteTask = async (
    taskId: string,
  ) => {
    if (
      !window.confirm(
        "Delete this task?",
      )
    ) {
      return;
    }

    try {
      setError("");

      const data =
        await apiFetch<DeleteResponse>(
          `/tasks/${taskId}`,
          {
            method: "DELETE",
          },
        );

      if (!data.success) {
        throw new Error(
          "Task could not be deleted",
        );
      }

      await fetchTasks();

      window.dispatchEvent(
        new Event("task-updated"),
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete task",
      );
    }
  };

  /* ---------------- COUNTS ---------------- */

  const activeTasks =
    tasks.filter(
      (task) => !task.completed,
    );

  const completedTasks =
    tasks.filter(
      (task) => task.completed,
    );

  const todayTasks =
    activeTasks.filter(
      (task) =>
        isToday(task.dueDate),
    );

  const upcomingTasks =
    activeTasks.filter(
      (task) =>
        isUpcoming(task.dueDate),
    );

  /* ---------------- FILTER ---------------- */

  const filteredTasks =
    useMemo(() => {
      let result = [...tasks];

      if (view === "today") {
        result = result.filter(
          (task) =>
            !task.completed &&
            isToday(task.dueDate),
        );
      }

      if (view === "upcoming") {
        result = result.filter(
          (task) =>
            !task.completed &&
            isUpcoming(task.dueDate),
        );
      }

      if (view === "completed") {
        result = result.filter(
          (task) =>
            task.completed,
        );
      }

      if (search.trim()) {
        const query =
          search.toLowerCase();

        result = result.filter(
          (task) =>
            task.title
              .toLowerCase()
              .includes(query) ||
            task.description
              ?.toLowerCase()
              .includes(query),
        );
      }

      return result;
    }, [tasks, view, search]);

  /* ---------------- PRIORITY ---------------- */

  const priorityConfig = {
    high: {
      label: "High",
      dot: "bg-red-400",
      text: "text-red-300",
    },

    medium: {
      label: "Medium",
      dot: "bg-amber-400",
      text: "text-amber-300",
    },

    low: {
      label: "Low",
      dot: "bg-emerald-400",
      text: "text-emerald-300",
    },
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="overflow-hidden rounded-[30px] border border-white/20 bg-white/[0.075] shadow-2xl shadow-black/20 backdrop-blur-2xl">

          {/* HEADER */}

          <div className="border-b border-white/10 px-6 py-7 sm:px-8 md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/45">
                  Productivity
                </p>

                <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Tasks
                </h1>

                <p className="mt-3 text-base text-white/55 sm:text-lg">
                  Organize your work and focus on what matters.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(true)
                }
                className="rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-white/90"
              >
                + Add task
              </button>
            </div>

            {/* STATS */}

            <div className="mt-7 grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
                <p className="text-sm text-white/45">
                  Active
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {activeTasks.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
                <p className="text-sm text-white/45">
                  Today
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {todayTasks.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
                <p className="text-sm text-white/45">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {completedTasks.length}
                </p>
              </div>

            </div>
          </div>

          {/* CONTENT */}

          <div className="grid md:grid-cols-[210px_1fr]">

            {/* SIDEBAR */}

            <aside className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6">

              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
                Views
              </p>

              <div className="space-y-1">

                {[
                  {
                    id: "all" as View,
                    label: "All tasks",
                    count:
                      activeTasks.length,
                    icon: "☰",
                  },
                  {
                    id: "today" as View,
                    label: "Today",
                    count:
                      todayTasks.length,
                    icon: "◷",
                  },
                  {
                    id: "upcoming" as View,
                    label: "Upcoming",
                    count:
                      upcomingTasks.length,
                    icon: "→",
                  },
                  {
                    id: "completed" as View,
                    label: "Completed",
                    count:
                      completedTasks.length,
                    icon: "✓",
                  },
                ].map((item) => (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setView(item.id)
                    }
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-base transition ${
                      view === item.id
                        ? "bg-white/12 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-sm">
                        {item.icon}
                      </span>

                      {item.label}
                    </span>

                    <span className="text-sm text-white/30">
                      {item.count}
                    </span>
                  </button>

                ))}

              </div>
            </aside>

            {/* TASK AREA */}

            <section className="min-w-0 p-5 sm:p-7 md:p-8">

              {/* SEARCH */}

              <div className="relative mb-6">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/30">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value,
                    )
                  }
                  placeholder="Search your tasks..."
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.06] py-3.5 pl-12 pr-4 text-base text-white outline-none backdrop-blur-xl transition placeholder:text-white/30 focus:border-white/30 focus:bg-white/[0.09]"
                />

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {/* ADD TASK */}

              {showAddForm && (
                <form
                  onSubmit={handleAddTask}
                  className="mb-6 rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl"
                >

                  <input
                    autoFocus
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value,
                      )
                    }
                    placeholder="What do you need to do?"
                    className="w-full bg-transparent text-xl font-medium text-white outline-none placeholder:text-white/25"
                  />

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value,
                      )
                    }
                    placeholder="Add a description..."
                    rows={2}
                    className="mt-4 w-full resize-none bg-transparent text-base text-white/70 outline-none placeholder:text-white/25"
                  />

                  <div className="mt-5 flex flex-wrap gap-3">

                    <select
                      value={priority}
                      onChange={(e) =>
                        setPriority(
                          e.target.value as Priority,
                        )
                      }
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none"
                    >
                      <option
                        value="high"
                        className="bg-slate-900"
                      >
                        High priority
                      </option>

                      <option
                        value="medium"
                        className="bg-slate-900"
                      >
                        Medium priority
                      </option>

                      <option
                        value="low"
                        className="bg-slate-900"
                      >
                        Low priority
                      </option>
                    </select>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) =>
                        setDueDate(
                          e.target.value,
                        )
                      }
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none"
                    />

                    <div className="ml-auto flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          setShowAddForm(
                            false,
                          )
                        }
                        className="rounded-xl px-4 py-2.5 text-sm text-white/45 hover:text-white"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-50"
                      >
                        {saving
                          ? "Adding..."
                          : "Create task"}
                      </button>

                    </div>
                  </div>
                </form>
              )}

              {/* TASK LIST */}

              <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.035]">

                {loading ? (
                  <div className="p-14 text-center text-base text-white/45">
                    Loading tasks...
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="p-16 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.07] text-xl text-white/40">
                      ✓
                    </div>

                    <h3 className="mt-5 text-lg font-medium">
                      No tasks here
                    </h3>

                    <p className="mt-2 text-base text-white/40">
                      Add a task and start making progress.
                    </p>

                  </div>
                ) : (
                  filteredTasks.map((task) => {

                    const editing =
                      editingTaskId ===
                      task._id;

                    const config =
                      priorityConfig[
                        task.priority
                      ];

                    return (
                      <div
                        key={task._id}
                        className="group border-b border-white/[0.08] last:border-b-0"
                      >

                        {editing ? (
                          <div className="p-5">

                            <input
                              value={editTitle}
                              onChange={(e) =>
                                setEditTitle(
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none"
                            />

                            <textarea
                              value={
                                editDescription
                              }
                              onChange={(e) =>
                                setEditDescription(
                                  e.target.value,
                                )
                              }
                              rows={2}
                              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none"
                            />

                            <div className="mt-4 flex flex-wrap gap-3">

                              <select
                                value={
                                  editPriority
                                }
                                onChange={(e) =>
                                  setEditPriority(
                                    e.target
                                      .value as Priority,
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none"
                              >
                                <option
                                  value="high"
                                  className="bg-slate-900"
                                >
                                  High
                                </option>

                                <option
                                  value="medium"
                                  className="bg-slate-900"
                                >
                                  Medium
                                </option>

                                <option
                                  value="low"
                                  className="bg-slate-900"
                                >
                                  Low
                                </option>
                              </select>

                              <input
                                type="date"
                                value={
                                  editDueDate
                                }
                                onChange={(e) =>
                                  setEditDueDate(
                                    e.target
                                      .value,
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none"
                              />

                              <div className="ml-auto flex gap-2">

                                <button
                                  type="button"
                                  onClick={
                                    cancelEditing
                                  }
                                  className="rounded-xl px-4 py-2.5 text-sm text-white/45 hover:text-white"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    saveEdit(
                                      task._id,
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-50"
                                >
                                  Save
                                </button>

                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-4 px-4 py-5 transition hover:bg-white/[0.045] sm:px-5">

                            {/* CHECKBOX */}

                            <button
                              type="button"
                              onClick={() =>
                                toggleTask(
                                  task,
                                )
                              }
                              className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                                task.completed
                                  ? "border-white bg-white text-slate-900"
                                  : "border-white/30 bg-white/[0.03] hover:border-white/60"
                              }`}
                            >
                              {task.completed && (
                                <span className="text-xs font-bold">
                                  ✓
                                </span>
                              )}
                            </button>

                            {/* DETAILS */}

                            <div className="min-w-0 flex-1">

                              <div className="grid grid-cols-[1fr_auto_80px] items-center gap-4">

                                <div className="min-w-0">

                                  <h3
                                    className={`text-lg font-medium ${
                                      task.completed
                                        ? "text-white/70 line-through decoration-white/40"
                                        : "text-white"
                                    }`}
                                  >
                                    {task.title}
                                  </h3>

                                  {task.description && (
                                    <p className="mt-1.5 text-sm leading-6 text-white/40">
                                      {
                                        task.description
                                      }
                                    </p>
                                  )}

                                </div>

                                {/* PRIORITY */}

                                <div
                                  className={`flex min-w-[100px] items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm ${config.text}`}
                                >
                                  <span
                                    className={`h-2 w-2 rounded-full ${config.dot}`}
                                  />

                                  {config.label}
                                </div>

                                {/* DUE DATE */}

                                <div className="text-right">

                                  {task.dueDate ? (
                                    <span
                                      className={`text-sm ${
                                        isOverdue(task)
                                          ? "text-red-300"
                                          : "text-white/40"
                                      }`}
                                    >
                                      {isOverdue(
                                        task,
                                      )
                                        ? `Overdue · ${formatDate(
                                            task.dueDate,
                                          )}`
                                        : `Due ${formatDate(
                                            task.dueDate,
                                          )}`}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-white/25">
                                      No date
                                    </span>
                                  )}

                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-4">

                                <span
                                  className={`text-sm ${
                                    isOverdue(task)
                                      ? "text-red-300"
                                      : "text-white/40"
                                  }`}
                                >
                                  {task.dueDate
                                    ? isOverdue(
                                        task,
                                      )
                                      ? `Overdue · ${formatDate(
                                          task.dueDate,
                                        )}`
                                      : `Due ${formatDate(
                                          task.dueDate,
                                        )}`
                                    : "No due date"}
                                </span>

                                {task.completed && (
                                  <span className="text-sm text-emerald-300/80">
                                    Completed
                                  </span>
                                )}

                              </div>
                            </div>

                            {/* ACTIONS */}

                            <div className="flex shrink-0 gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">

                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    task,
                                  )
                                }
                                className="rounded-lg px-3 py-2 text-sm text-white/40 hover:bg-white/10 hover:text-white"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteTask(
                                    task._id,
                                  )
                                }
                                className="rounded-lg px-3 py-2 text-sm text-red-300/50 hover:bg-red-400/10 hover:text-red-300"
                              >
                                Delete
                              </button>

                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}

              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- HELPERS ---------------- */

function getTodayDate() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    today.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

