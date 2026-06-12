"use client";

import React, { FormEvent, useMemo, useState, useEffect, useId } from "react";
import { SidebarNavigationSection } from "@/app/components/SidebarNavigationSection";
import { DashboardGreetingSection } from "@/app/components/DashboardGreetingSection";
import { TaskModal } from "@/app/components/TaskModal";
import { getTaskStyles } from "@/app/components/TaskStyles";

type TaskStatus = "completed" | "in-progress" | "pending";
type TaskPriority = "low-prio" | "med-prio" | "high-prio";
type TaskCategory = "all" | "personal" | "school" | "work" | "fitness" | "others";

type Task = {
  id: number;
  name: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
};

type UserProfile = {
  UserID: number;
  Username: string;
  Email: string;
};

// Database schema types
type DBTask = {
  TaskID: number;
  TaskName: string;
  TaskDesc: string;
  TaskCategory: "Personal" | "School" | "Work" | "Fitness" | "Others";
  PriorityLevel: "Low" | "Medium" | "High";
  TaskStatus: "Pending" | "In-Progress" | "Completed";
};

// Mapping functions between frontend and database
function mapDBCategoryToFrontend(dbCategory: string): Exclude<TaskCategory, "all"> {
  const categoryMap: { [key: string]: Exclude<TaskCategory, "all"> } = {
    "Personal": "personal",
    "School": "school",
    "Work": "work",
    "Fitness": "fitness",
    "Others": "others",
  };
  return categoryMap[dbCategory] || "others";
}

function mapFrontendCategoryToDB(frontendCategory: string): "Personal" | "School" | "Work" | "Fitness" | "Others" {
  const categoryMap: { [key: string]: "Personal" | "School" | "Work" | "Fitness" | "Others" } = {
    "personal": "Personal",
    "school": "School",
    "work": "Work",
    "fitness": "Fitness",
    "others": "Others",
  };
  return categoryMap[frontendCategory] || "Others";
}

function mapDBPriorityToFrontend(dbPriority: string): TaskPriority {
  const priorityMap: { [key: string]: TaskPriority } = {
    "Low": "low-prio",
    "Medium": "med-prio",
    "High": "high-prio",
  };
  return priorityMap[dbPriority] || "med-prio";
}

function mapFrontendPriorityToDB(frontendPriority: string): "Low" | "Medium" | "High" {
  const priorityMap: { [key: string]: "Low" | "Medium" | "High" } = {
    "low-prio": "Low",
    "med-prio": "Medium",
    "high-prio": "High",
  };
  return priorityMap[frontendPriority] || "Medium";
}

function mapDBStatusToFrontend(dbStatus: string): TaskStatus {
  const statusMap: { [key: string]: TaskStatus } = {
    "Completed": "completed",
    "In-Progress": "in-progress",
    "Pending": "pending",
  };
  return statusMap[dbStatus] || "pending";
}

function mapFrontendStatusToDB(frontendStatus: string): "Completed" | "In-Progress" | "Pending" {
  const statusMap: { [key: string]: "Completed" | "In-Progress" | "Pending" } = {
    "completed": "Completed",
    "in-progress": "In-Progress",
    "pending": "Pending",
  };
  return statusMap[frontendStatus] || "Pending";
}

// Convert DB task to frontend task
function convertDBTaskToFrontendTask(dbTask: DBTask): Task {
  return {
    id: dbTask.TaskID,
    name: dbTask.TaskName,
    description: dbTask.TaskDesc,
    category: mapDBCategoryToFrontend(dbTask.TaskCategory) as Exclude<TaskCategory, "all">,
    priority: mapDBPriorityToFrontend(dbTask.PriorityLevel),
    status: mapDBStatusToFrontend(dbTask.TaskStatus),
  };
}

// ─── Expanded card accent colours ────────────────────────────────────────────
// Matches the design: blue for completed/low-prio, orange for med-prio, red for high-prio pending
function getAccentColor(priority: TaskPriority, status: TaskStatus): string {
  if (status === "completed") return "#002a8b";
  if (priority === "high-prio") return "#c0392b";
  if (priority === "med-prio") return "#e07b2a";
  return "#22c55e"; // low-prio
}

// Tag pill styles for the expanded card
function getPillStyle(
  type: "category" | "priority" | "status",
  priority: TaskPriority,
  status: TaskStatus,
): string {
  const accent = getAccentColor(priority, status);
  const base =
    "inline-flex items-center px-[10px] py-[3px] rounded-full text-[11px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold";

  if (type === "category") {
    // Category is always navy-filled white text
    return `${base} bg-[#002a8b] text-[#f8f0e2]`;
  }

  // Priority and status use the accent colour
  if (accent === "#002a8b") {
    return `${base} bg-[#002a8b] text-[#f8f0e2]`;
  }
  if (accent === "#c0392b") {
    return `${base} bg-[#c0392b] text-[#f8f0e2]`;
  }
  // orange
  return `${base} bg-[#e07b2a] text-[#f8f0e2]`;
}

const filterOptions: Array<Exclude<TaskCategory, "all">> = [
  "personal",
  "school",
  "work",
  "fitness",
  "others",
];

const initialTasks: Task[] = [];

const statusSections: Array<{
  key: TaskStatus;
  label: string;
}> = [
  { key: "completed", label: "completed!" },
  { key: "in-progress", label: "in progress...!" },
  { key: "pending", label: "pending..." },
];

export default function MyTasks(): React.ReactElement {
  const formId = useId();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskCategory>("all");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState<TaskCategory | "">("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority | "">("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  // ── NEW: which task card is expanded ──────────────────────────────────────
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  // ── NEW: track editing mode ────────────────────────────────────────────────
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const updateScale = () => {
      setScale(Math.min(window.innerWidth / 1440, window.innerHeight / 1024));
    };
    updateScale();
    window.addEventListener("resize", updateScale);

    async function fetchUserAndTasks() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setUser(null);
          setTasks([]);
          return;
        }

        // Fetch user info
        const userResponse = await fetch(`/api/settings?userId=${userId}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData.user) {
          setUser(userData.user);
        } else {
          console.error("Failed to load user information");
          setUser(null);
        }

        // Fetch tasks
        const tasksResponse = await fetch(`/api/tasks?userId=${userId}`);
        const tasksData = await tasksResponse.json();

        if (tasksResponse.ok && tasksData.tasks) {
          const frontendTasks = tasksData.tasks.map((dbTask: DBTask) =>
            convertDBTaskToFrontendTask(dbTask)
          );
          setTasks(frontendTasks);
        } else {
          console.error("Failed to load tasks:", tasksData);
          setTasks([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setUser(null);
        setTasks([]);
      }
    }

    fetchUserAndTasks();
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        search.trim() === "" ||
        task.name.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = activeFilter === "all" || task.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, activeFilter]);

  const groupedTasks = useMemo(() => {
    return {
      completed: filteredTasks.filter((task) => task.status === "completed"),
      "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
      pending: filteredTasks.filter((task) => task.status === "pending"),
    };
  }, [filteredTasks]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!taskName.trim() || !taskDescription.trim() || !taskCategory || !taskPriority) {
      console.warn("Form validation failed - missing required fields");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      // ── EDIT MODE: PUT request to update existing task ────────────────────
      if (editingTaskId !== null) {
        const payload = {
          name: taskName.trim(),
          description: taskDescription.trim(),
          category: mapFrontendCategoryToDB(taskCategory),
          priority: mapFrontendPriorityToDB(taskPriority),
        };

        const response = await fetch(`/api/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setTasks((current) =>
            current.map((task) =>
              task.id === editingTaskId
                ? {
                    ...task,
                    name: taskName.trim(),
                    description: taskDescription.trim(),
                    category: taskCategory as Exclude<TaskCategory, "all">,
                    priority: taskPriority as TaskPriority,
                  }
                : task
            )
          );
          setTaskName("");
          setTaskDescription("");
          setTaskCategory("");
          setTaskPriority("");
          setEditingTaskId(null);
          setShowModal(false);
        } else {
          const responseText = await response.text();
          console.error("Failed to update task:", responseText);
        }
        return;
      }

      // ── ADD MODE: POST request to create new task ─────────────────────────
      const payload = {
        userId,
        name: taskName.trim(),
        description: taskDescription.trim(),
        category: mapFrontendCategoryToDB(taskCategory),
        priority: mapFrontendPriorityToDB(taskPriority),
        status: mapFrontendStatusToDB("pending"),
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let responseData: any;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch {
          const text = await response.text();
          responseData = { error: "Failed to parse response", rawText: text };
        }
      } else {
        const text = await response.text();
        responseData = { error: "Non-JSON response", rawText: text };
      }

      if (response.ok) {
        const newTask: Task = {
          id: responseData.taskId || Date.now(),
          name: taskName.trim(),
          description: taskDescription.trim(),
          category: taskCategory,
          priority: taskPriority,
          status: "pending",
        };
        setTasks((current) => [...current, newTask]);
        setTaskName("");
        setTaskDescription("");
        setTaskCategory("");
        setTaskPriority("");
        setShowModal(false);
      } else {
        console.error("Failed to create task:", responseData);
      }
    } catch (err) {
      console.error("Exception in handleSubmit:", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const payload: { status: string; dateCompleted?: string | null } = {
        status: mapFrontendStatusToDB(newStatus),
      };

      if (newStatus === "completed") {
        payload.dateCompleted = new Date().toISOString().substring(0, 19).replace("T", " ");
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorData: any;
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch {
          errorData = { error: "Failed to parse response", rawText: responseText };
        }
        console.error("Failed to update task status:", errorData);
        return false;
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      if (expandedTaskId === taskId) setExpandedTaskId(null);
      return true;
    } catch (err) {
      console.error("Exception in handleUpdateTaskStatus:", err);
      return false;
    }
  };

  const handleToggleTaskCompletion = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await handleUpdateTaskStatus(task.id, newStatus);
  };

  const handleDragStart = (taskId: number, event: React.DragEvent<HTMLElement>) => {
    setDraggedTaskId(taskId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  const handleDragOverStatus = (event: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    event.preventDefault();
    setDragOverStatus(status);
  };

  const handleDropStatus = async (event: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    event.preventDefault();
    setDragOverStatus(null);

    if (draggedTaskId === null) return;

    const draggedTask = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTaskId(null);
      return;
    }

    await handleUpdateTaskStatus(draggedTaskId, status);
    setDraggedTaskId(null);
  };

  // ── NEW: Delete handler ───────────────────────────────────────────────────
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((current) => current.filter((task) => task.id !== taskId));
        if (expandedTaskId === taskId) setExpandedTaskId(null);
      } else {
        const text = await response.text();
        console.error("Failed to delete task:", text);
      }
    } catch (err) {
      console.error("Exception in handleDeleteTask:", err);
    }
  };

  // ── NEW: Edit handler (stub — opens modal pre-filled) ────────────────────
  const handleEditTask = (task: Task) => {
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setEditingTaskId(task.id);
    setShowModal(true);
    setExpandedTaskId(null);
  };

  // ── NEW: Toggle expanded card ─────────────────────────────────────────────
  const handleToggleExpand = (taskId: number) => {
    setExpandedTaskId((current) => (current === taskId ? null : taskId));
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#f8f0e2] flex items-center justify-center">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          width: "1440px",
          height: "1024px",
        }}
      >
        <div className="bg-[#f8f0e2] w-full min-w-[1440px] min-h-[1024px] flex relative">

          <div className="fixed top-0 left-0 right-0 w-full h-[320px] bg-[#f8f0e2] blur-[20px]" aria-hidden="true" />

          <header className="contents">
            <DashboardGreetingSection
              username=""
              greetingText="here are today's tasks!"
              showUsername={false}
              position="fixed top-[77px] left-[500px] sm:left-[566px] px-8"
              ariaLabel="Tasks page header"
            />
            <p className="fixed top-[130px] left-[500px] sm:left-[566px] right-[120px] px-8 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#00000080] text-[15px] tracking-[0] leading-[normal]">
              stay on track of everything listed!
            </p>
            <div className="inline-flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 fixed top-20 right-4 sm:right-8 bg-[#002a8b] rounded-[15px]">
              <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
                <img
                  className="relative w-[19.19px] h-[20.13px]"
                  alt=""
                  src="/user.svg"
                  aria-hidden="true"
                />
                <div className="w-fit mt-[-1.00px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[15px] relative tracking-[0] leading-[normal]">
                  {isMounted ? user?.Username || "User" : "User"}
                </div>
              </div>
            </div>
          </header>

          <SidebarNavigationSection />

          {/* Form Actions/Search Segment */}
          <section className="flex z-[7] flex-col items-start gap-4 fixed top-[174px] left-[500px] sm:left-[566px] right-[120px] px-8">

            {/* Row 1: Search */}
            <form
              role="search"
              aria-label="Search tasks"
              className="flex h-[55px] items-center gap-[15px] px-[15px] relative self-stretch w-full bg-[#f8f0e2] rounded-[40px] border-[3px] border-solid border-[#002a8b]"
            >
              <img
                className="relative w-6 h-6 aspect-[1] shrink-0"
                alt=""
                aria-hidden="true"
                src="/Search.png"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="search"
                placeholder="search"
                className="relative w-full h-[25.31px] bg-transparent outline-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#00000080] placeholder:text-[#00000080] text-[17.2px] tracking-[0] leading-[normal]"
              />
            </form>

            {/* Row 2: Category Filter */}
            <div className="flex h-[43px] items-center gap-[10px] relative self-stretch w-full">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                aria-pressed={activeFilter === "all"}
                className={`flex flex-1 w-full h-[30px] items-center justify-center relative rounded-[40px] border-2 border-solid transition-colors ${
                  activeFilter === "all"
                    ? "bg-[#002a8b] border-[#002a8b] text-[#f8f0e2]"
                    : "border-[#002a8b] text-[#002a8b]"
                }`}
              >
                <div className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[13px] tracking-[0] leading-[normal]">
                  all
                </div>
              </button>

              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`flex flex-1 w-full h-[30px] items-center justify-center relative rounded-[40px] border-2 border-solid transition-colors ${
                    activeFilter === filter
                      ? "bg-[#002a8b] border-[#002a8b] text-[#f8f0e2]"
                      : "border-[#002a8b] text-[#002a8b]"
                  }`}
                >
                  <div className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[13px] tracking-[0] leading-[normal]">
                    {filter}
                  </div>
                </button>
              ))}
            </div>

            {/* Row 3: Add Task Button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex h-[55px] items-center justify-between px-[22px] relative self-stretch w-full rounded-[40px] bg-[#002a8b]"
            >
              <img
                className="relative w-[18px] h-[18px]"
                alt=""
                aria-hidden="true"
                src="/Plus.png"
              />
              <div className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[18px] tracking-[0] leading-[normal]">
                add a task!
              </div>
            </button>
          </section>

          {/* Main Task Feed */}
          <main className="flex z-[1] mt-[340px] max-h-[640px] overflow-y-auto fixed top-[40px] left-[500px] sm:left-[566px] right-[120px] px-8 flex-col items-start gap-[25px] pb-12 scrollbar-none">
            {statusSections.map((section) => {
              const sectionTasks = groupedTasks[section.key];

              return (
                <div key={section.key} className="w-full">
                  <div className="flex w-full items-center gap-2.5 pb-2 relative border-b-2 border-solid border-black">
                    <h2 className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#191818] text-lg tracking-[0] leading-[normal]">
                      {section.label}
                    </h2>
                  </div>

                  <div
                    className={`mt-[15px] flex flex-col gap-[12px] ${
                      dragOverStatus === section.key ? "bg-[#f0f6ff] rounded-[20px] p-3" : ""
                    }`}
                    onDragOver={(event) => handleDragOverStatus(event, section.key)}
                    onDrop={(event) => handleDropStatus(event, section.key)}
                  >
                    {sectionTasks.length === 0 ? (
                      <p className="text-sm font-normal text-[#00000050] italic px-4">
                        No tasks found.
                      </p>
                    ) : (
                      sectionTasks.map((task) => {
                        const style = getTaskStyles(task.priority, task.status);
                        const isExpanded = expandedTaskId === task.id;
                        const accent = getAccentColor(task.priority, task.status);

                        return (
                          <article
                            key={task.id}
                            className="w-full flex flex-col gap-0"
                            draggable
                            onDragStart={(event) => handleDragStart(task.id, event)}
                            onDragEnd={handleDragEnd}
                          >

                            {/* ── Collapsed pill row ── */}
                            <div className="relative w-full h-[55px]">
                              <div className={style.wrapper}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleTaskCompletion(task)}
                                  aria-label={
                                    task.status === "completed"
                                      ? `Uncheck ${task.name}`
                                      : `Mark ${task.name} as completed`
                                  }
                                  className={style.circle}
                                >
                                  {task.status === "completed" && (
                                    <img
                                      className="w-full h-full"
                                      alt="Task completed"
                                      aria-hidden="true"
                                      src="/Check.svg"
                                    />
                                  )}
                                </button>
                                <div className={style.text}>{task.name}</div>
                                {/* "..." toggles the expanded panel */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleExpand(task.id)}
                                  aria-expanded={isExpanded}
                                  aria-label={`${isExpanded ? "Collapse" : "Expand"} options for ${task.name}`}
                                  className={style.dots}
                                >
                                  . . .
                                </button>
                              </div>
                            </div>

                            {/* ── Expanded detail card ── */}
                            {isExpanded && (
                              <div
                                className="w-full rounded-b-[20px] rounded-t-none border-[2.5px] border-t-0 px-[18px] pt-[14px] pb-[14px] flex flex-col gap-[12px]"
                                style={{ borderColor: accent }}
                              >
                                {/* Description */}
                                <p
                                  className="[font-family:'TT_Fors_Trial-Regular',Helvetica] text-[13px] leading-[1.5] tracking-[0]"
                                  style={{ color: accent }}
                                >
                                  {task.description || "No description provided."}
                                </p>

                                {/* Footer: tags + action icons */}
                                <div className="flex items-center justify-between w-full">
                                  {/* Tag pills */}
                                  <div className="flex items-center gap-[6px] flex-wrap">
                                    <span className={getPillStyle("category", task.priority, task.status)}>
                                      {task.category}
                                    </span>
                                    <span className={getPillStyle("priority", task.priority, task.status)}>
                                      {task.priority === "low-prio"
                                        ? "low-priority"
                                        : task.priority === "med-prio"
                                        ? "medium-priority"
                                        : "high-priority"}
                                    </span>
                                    <span className={getPillStyle("status", task.priority, task.status)}>
                                      {task.status}
                                    </span>
                                  </div>

                                  {/* Edit + Delete icons */}
                                  <div className="flex items-center gap-[14px] shrink-0 ml-4">
                                    <button
                                      type="button"
                                      onClick={() => handleEditTask(task)}
                                      aria-label={`Edit ${task.name}`}
                                      className="flex items-center justify-center w-[28px] h-[28px] hover:opacity-70 transition-opacity"
                                    >
                                      {/* Pencil icon */}
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="EditBlue.png"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                          fill={accent}
                                        />
                                      </svg>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTask(task.id)}
                                      aria-label={`Delete ${task.name}`}
                                      className="flex items-center justify-center w-[28px] h-[28px] hover:opacity-70 transition-opacity"
                                    >
                                      {/* Trash icon */}
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="DeleteBlue.png"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                          fill={accent}
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </main>

          {/* Modal */}
          <TaskModal
            showModal={showModal}
            onClose={() => {
              setShowModal(false);
              setTaskName("");
              setTaskDescription("");
              setTaskCategory("");
              setTaskPriority("");
              setEditingTaskId(null);
            }}
            taskName={taskName}
            onTaskNameChange={setTaskName}
            taskDescription={taskDescription}
            onTaskDescriptionChange={setTaskDescription}
            taskCategory={taskCategory}
            onTaskCategoryChange={setTaskCategory}
            taskPriority={taskPriority}
            onTaskPriorityChange={setTaskPriority}
            onSubmit={handleSubmit}
            formId={formId}
            mode={editingTaskId !== null ? "edit" : "add"}
            editingTaskId={editingTaskId}
          />

        </div>
      </div>
    </div>
  );
}