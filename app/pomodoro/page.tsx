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

type DBTask = {
  TaskID: number;
  TaskName: string;
  TaskDesc: string;
  TaskCategory: "Personal" | "School" | "Work" | "Fitness" | "Others";
  PriorityLevel: "Low" | "Medium" | "High";
  TaskStatus: "Pending" | "In-Progress" | "Completed";
};

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

function getIconsForTask(priority: TaskPriority, status: TaskStatus): { delete: string; edit: string } {
  if (status === "completed") {
    return { delete: "/DeleteBlue.png", edit: "/EditBlue.png" };
  }
  if (priority === "high-prio") {
    return { delete: "/DeleteRed.png", edit: "/EditRed.png" };
  }
  if (priority === "med-prio") {
    return { delete: "/DeleteOrange.png", edit: "/EditOrange.png" };
  }
  return { delete: "/DeleteBlue.png", edit: "/EditBlue.png" };
}

const statusSections: Array<{
  key: TaskStatus;
  label: string;
}> = [
  { key: "pending", label: "pending..." },
  { key: "in-progress", label: "in progress...!" },
  { key: "completed", label: "completed!" },
];

export default function Pomodoro(): React.ReactElement {
  const formId = useId();
  const [tasks, setTasks] = useState<Task[]>([]);
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
  const [currentMode, setCurrentMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskCategory, setEditTaskCategory] = useState<TaskCategory | "">("");
  const [editTaskPriority, setEditTaskPriority] = useState<TaskPriority | "">("");
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

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

        const userResponse = await fetch(`/api/settings?userId=${userId}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData.user) {
          setUser(userData.user);
        } else {
          console.error("Failed to load user information");
          setUser(null);
        }

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

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => {
    if (timeRemaining === 0) {
      const defaultTimes = { pomodoro: 25, short: 5, long: 15 };
      setTimeRemaining(defaultTimes[currentMode] * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const defaultTimes = { pomodoro: 25, short: 5, long: 15 };
    setTimeRemaining(defaultTimes[currentMode] * 60);
  };

  const changeMode = (mode: "pomodoro" | "short" | "long", minutes: number) => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeRemaining(minutes * 60);
  };

  const handleSelectTask = (task: Task, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({ x: rect.right + 10, y: rect.top });
    setSelectedTaskId(task.id);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTaskId(null);
    setDropdownPosition(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskName(task.name);
    setEditTaskDescription(task.description);
    setEditTaskCategory(task.category);
    setEditTaskPriority(task.priority);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTaskName("");
    setEditTaskDescription("");
    setEditTaskCategory("");
    setEditTaskPriority("");
  };

  const handleSaveEditTask = async (taskId: number) => {
    if (!editTaskName.trim() || !editTaskDescription.trim() || !editTaskCategory || !editTaskPriority) {
      console.warn("Form validation failed");
      return;
    }

    try {
      const payload = {
        name: editTaskName.trim(),
        description: editTaskDescription.trim(),
        category: mapFrontendCategoryToDB(editTaskCategory),
        priority: mapFrontendPriorityToDB(editTaskPriority),
      };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  name: editTaskName.trim(),
                  description: editTaskDescription.trim(),
                  category: editTaskCategory,
                  priority: editTaskPriority,
                }
              : task
          )
        );
        handleCancelEdit();
        setSelectedTaskId(null);
      } else {
        console.error("Failed to update task");
      }
    } catch (err) {
      console.error("Exception in handleSaveEditTask:", err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((current) => current.filter((task) => task.id !== taskId));
        setSelectedTaskId(null);
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Exception in handleDeleteTask:", err);
    }
  };

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


  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timeRemaining]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !taskName.trim() ||
      !taskDescription.trim() ||
      !taskCategory ||
      !taskPriority
    ) {
      console.warn("Form validation failed - missing required fields");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
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
      }
    } catch (err) {
      console.error("Exception in handleSubmit:", err);
    }
  };

  const handleToggleTaskCompletion = async (taskId: number, currentStatus: TaskStatus) => {
    try {
      const newStatus: TaskStatus = currentStatus === "completed" ? "pending" : "completed";

      const payload: { status: string; dateCompleted?: string | null } = {
        status: mapFrontendStatusToDB(newStatus),
      };

      if (newStatus === "completed") {
        const isoString = new Date().toISOString();
        payload.dateCompleted = isoString.substring(0, 19).replace("T", " ");
      } else {
        payload.dateCompleted = null;
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const payload: { status: string; dateCompleted?: string | null } = {
        status: mapFrontendStatusToDB(newStatus),
      };

      if (newStatus === "completed") {
        payload.dateCompleted = new Date().toISOString().substring(0, 19).replace("T", " ");
      } else {
        payload.dateCompleted = null;
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Failed to update status:", response.status, text);
        return false;
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      );

      return true;
    } catch (err) {
      console.error("Exception in handleUpdateTaskStatus:", err);
      return false;
    }
  };

  const handleDragOverStatus = (event: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    event.preventDefault();
    setDragOverStatus(status);
  };

  const handleDropStatus = async (event: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    event.preventDefault();
    setDragOverStatus(null);

    if (draggedTaskId === null) {
      return;
    }

    const draggedTask = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTask || draggedTask.status === status || draggedTask.status === "completed") {
      setDraggedTaskId(null);
      return;
    }

    const updated = await handleUpdateTaskStatus(draggedTaskId, status);
    if (!updated) {
      setDraggedTaskId(null);
      return;
    }

    setDraggedTaskId(null);
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
          
          {/* Header Blur element */}
          <div className="fixed top-0 left-0 right-0 w-full h-[320px] bg-[#f8f0e2] blur-[20px]" aria-hidden="true" />
          
          {/* Main Layout Header & User Profiling */}
          <header className="contents">
            <DashboardGreetingSection
              username=""
              greetingText="a pomodoro-ductive day!"
              showUsername={false}
              position="fixed top-[77px] left-[500px] sm:left-[566px] px-8"
              ariaLabel="Pomodoro page header"
            />
            <p className="fixed top-[130px] left-[500px] sm:left-[566px] right-[120px] px-8 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#00000080] text-[15px] tracking-[0] leading-[normal]">
              quickly finish up works with our integrated pomodoro timer!
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

          {/* Integrated Pomodoro Timer Component Block */}
          <section className="flex z-[7] flex-col items-center justify-center gap-4 fixed top-[174px] left-[500px] sm:left-[566px] right-[120px] px-8 py-3 bg-[#f8f0e2] rounded-[30px] border-[3px] border-solid border-[#002a8b]">
            
            {/* Session Configuration Tabs */}
            <div className="flex gap-3 items-center justify-center w-full max-w-[430px]">
              <button
                type="button"
                onClick={() => changeMode("pomodoro", 25)}
                className={`px-5 py-1.5 rounded-[40px] border-2 border-solid border-[#002a8b] font-bold [font-family:'TT_Fors_Trial-Bold',Helvetica] text-[15px] transition-colors ${
                  currentMode === "pomodoro"
                    ? "bg-[#002a8b] text-[#f8f0e2]"
                    : "bg-transparent text-[#002a8b] hover:bg-[#002a8b]/10"
                }`}
              >
                pomodoro
              </button>
              <button
                type="button"
                onClick={() => changeMode("short", 5)}
                className={`px-5 py-1.5 rounded-[40px] border-2 border-solid border-[#002a8b] font-bold [font-family:'TT_Fors_Trial-Bold',Helvetica] text-[13px] transition-colors ${
                  currentMode === "short"
                    ? "bg-[#002a8b] text-[#f8f0e2]"
                    : "bg-transparent text-[#002a8b] hover:bg-[#002a8b]/10"
                }`}
              >
                short break
              </button>
              <button
                type="button"
                onClick={() => changeMode("long", 15)}
                className={`px-5 py-1.5 rounded-[40px] border-2 border-solid border-[#002a8b] font-bold [font-family:'TT_Fors_Trial-Bold',Helvetica] text-[13px] transition-colors ${
                  currentMode === "long"
                    ? "bg-[#002a8b] text-[#f8f0e2]"
                    : "bg-transparent text-[#002a8b] hover:bg-[#002a8b]/10"
                }`}
              >
                long break
              </button>
            </div>

            <div className="text-[82px] font-bold text-[#0038b4] tracking-tight leading-none my-1">
              {formattedTime}
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleStartPause}
                className="px-6 py-1.5 bg-[#0038b4] text-[#f8f0e2] rounded-[40px] border-2 border-solid border-[#0038b4] font-bold [font-family:'TT_Fors_Trial-Bold',Helvetica] text-[14px] hover:bg-transparent hover:text-[#0038b4] transition-colors"
                aria-label={isRunning ? "Pause timer" : "Start timer"}
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-1.5 bg-[#0038b4] text-[#f8f0e2] rounded-[40px] border-2 border-solid border-[#0038b4] font-bold [font-family:'TT_Fors_Trial-Bold',Helvetica] text-[14px] hover:bg-transparent hover:text-[#0038b4] transition-colors"
                aria-label="Reset timer"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Main Task Feed Container */}
          <main className="flex z-[1] max-h-[560px] overflow-y-auto fixed top-[415px] left-[500px] sm:left-[566px] right-[120px] px-8 flex-col items-start gap-[25px] pb-12 scrollbar-none">
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
                      dragOverStatus === section.key
                        ? "bg-[#f0f6ff] rounded-[20px] p-3"
                        : ""
                    }`}
                    onDragOver={(event) => handleDragOverStatus(event, section.key)}
                    onDrop={(event) => handleDropStatus(event, section.key)}
                  >
                    {sectionTasks.length === 0 ? (
                      <p className="text-sm font-normal text-[#00000050] italic px-4">No tasks found.</p>
                    ) : (
                      sectionTasks.map((task) => {
                        const style = getTaskStyles(task.priority, task.status);
                        const targetAction = task.status === "completed" ? "incomplete" : "completed";
                        const isDraggable = task.status !== "completed";

                        return (
                          <article
                            key={task.id}
                            className={`relative w-full h-[55px] ${isDraggable ? "cursor-move" : ""} ${draggedTaskId === task.id ? "opacity-50" : ""}`}
                            draggable={isDraggable}
                            onDragStart={() => isDraggable && handleDragStart(task.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className={style.wrapper}>
                              <button
                                type="button"
                                onClick={() => handleToggleTaskCompletion(task.id, task.status)}
                                aria-label={`Mark ${task.name} as ${targetAction}`}
                                className={style.circle}
                              >
                                {task.status === "completed" && (
                                  <img
                                    className="w-full h-full"
                                    alt="Completed"
                                    aria-hidden="true"
                                    src="/Check.svg"
                                  />
                                )}
                              </button>
                              <div className={style.text}>{task.name}</div>
                              <button
                                type="button"
                                onClick={(e) => handleSelectTask(task, e)}
                                aria-label={`More options for ${task.name}`}
                                className={style.dots}
                              >
                                . . .
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </main>

          {/* Task Details Dropdown */}
          {selectedTaskId !== null && dropdownPosition && (() => {
            const selectedTask = tasks.find((task) => task.id === selectedTaskId);
            if (!selectedTask) return null;

            const icons = getIconsForTask(selectedTask.priority, selectedTask.status);
            const isEditing = editingTaskId === selectedTask.id;

            return (
              <>
                <div 
                  className="fixed inset-0 z-[99]" 
                  onClick={handleCloseTaskDetails}
                />
                <div 
                  className="fixed z-[100] bg-[#f8f0e2] rounded-[20px] border-[2px] border-solid border-[#002a8b] p-6 shadow-lg min-w-[320px] max-w-[380px]"
                  style={{
                    left: `${dropdownPosition.x}px`,
                    top: `${dropdownPosition.y}px`,
                    transform: "translateY(0)"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isEditing ? (
                    <>
                      <h3 className="[font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[16px] mb-4">
                        Edit Task
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[12px] mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editTaskName}
                            onChange={(e) => setEditTaskName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-[8px] border-[1px] border-solid border-[#002a8b] bg-[#f8f0e2] text-[#002a8b] focus:outline-none text-[13px]"
                          />
                        </div>

                        <div>
                          <label className="block [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[12px] mb-1">
                            Description
                          </label>
                          <textarea
                            value={editTaskDescription}
                            onChange={(e) => setEditTaskDescription(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-[8px] border-[1px] border-solid border-[#002a8b] bg-[#f8f0e2] text-[#002a8b] focus:outline-none resize-none text-[13px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[12px] mb-1">
                              Category
                            </label>
                            <select
                              value={editTaskCategory}
                              onChange={(e) => setEditTaskCategory(e.target.value as TaskCategory)}
                              className="w-full px-2 py-1 rounded-[6px] border-[1px] border-solid border-[#002a8b] bg-[#f8f0e2] text-[#002a8b] focus:outline-none text-[12px]"
                            >
                              <option value="">Select</option>
                              <option value="personal">personal</option>
                              <option value="school">school</option>
                              <option value="work">work</option>
                              <option value="fitness">fitness</option>
                              <option value="others">others</option>
                            </select>
                          </div>

                          <div>
                            <label className="block [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[12px] mb-1">
                              Priority
                            </label>
                            <select
                              value={editTaskPriority}
                              onChange={(e) => setEditTaskPriority(e.target.value as TaskPriority)}
                              className="w-full px-2 py-1 rounded-[6px] border-[1px] border-solid border-[#002a8b] bg-[#f8f0e2] text-[#002a8b] focus:outline-none text-[12px]"
                            >
                              <option value="">Select</option>
                              <option value="low-prio">low</option>
                              <option value="med-prio">med</option>
                              <option value="high-prio">high</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => handleSaveEditTask(selectedTask.id)}
                          className="flex-1 px-3 py-1.5 bg-[#002a8b] text-[#f8f0e2] rounded-[10px] font-bold transition hover:bg-[#001f66] text-[12px]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-1.5 bg-[#00000020] text-[#002a8b] rounded-[10px] font-bold transition hover:bg-[#00000030] text-[12px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="[font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[15px] mb-3">
                        {selectedTask.name}
                      </h3>

                      <div className="space-y-2 mb-4 pb-3 border-b border-[#00000010]">
                        <p className="text-[#002a8b] text-[13px]">
                          {selectedTask.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <div className="px-2 py-1 bg-[#002a8b] text-[#f8f0e2] rounded-[6px] text-[11px] font-bold capitalize">
                            {selectedTask.category}
                          </div>
                          <div className="px-2 py-1 bg-[#002a8b] text-[#f8f0e2] rounded-[6px] text-[11px] font-bold capitalize">
                            {selectedTask.priority}
                          </div>
                          <div className="px-2 py-1 bg-[#002a8b] text-[#f8f0e2] rounded-[6px] text-[11px] font-bold capitalize">
                            {selectedTask.status}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditTask(selectedTask)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-[#002a8b] text-[#f8f0e2] rounded-[10px] font-bold transition hover:bg-[#001f66] text-[12px]"
                        >
                          <img
                            src={icons.edit}
                            alt="Edit"
                            className="w-[14px] h-[14px]"
                          />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(selectedTask.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-[#00000020] text-[#002a8b] rounded-[10px] font-bold transition hover:bg-[#00000030] text-[12px]"
                        >
                          <img
                            src={icons.delete}
                            alt="Delete"
                            className="w-[14px] h-[14px]"
                          />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}

          {/* Modal Container */}
          <TaskModal
            showModal={showModal}
            onClose={() => setShowModal(false)}
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
          />

        </div>
      </div>
    </div>
  );
}