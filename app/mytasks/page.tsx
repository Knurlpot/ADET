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
          // Convert DB tasks to frontend tasks
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
      "in-progress": filteredTasks.filter(
        (task) => task.status === "in-progress",
      ),
      pending: filteredTasks.filter((task) => task.status === "pending"),
    };
  }, [filteredTasks]);

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

      console.log("Submitting task with userId:", userId);
      const payload = {
        userId,
        name: taskName.trim(),
        description: taskDescription.trim(),
        category: mapFrontendCategoryToDB(taskCategory),
        priority: mapFrontendPriorityToDB(taskPriority),
        status: mapFrontendStatusToDB("pending"),
      };
      console.log("Payload:", payload);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response received - Status:", response.status, "StatusText:", response.statusText);

      let responseData: any;
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (contentType?.includes("application/json")) {
        try {
          responseData = await response.json();
          console.log("Parsed JSON response:", responseData);
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          const text = await response.text();
          console.error("Raw response text:", text);
          responseData = { error: "Failed to parse response", rawText: text };
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        responseData = { error: "Non-JSON response", rawText: text };
      }

      if (response.ok) {
        console.log("Task created successfully");
        
        // Add the new task to the local state with the returned ID
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
        console.error("Failed to create task - Status:", response.status);
        console.error("Error response data:", responseData);
        
        // Display detailed error information
        const errorMsg = responseData?.message || responseData?.error || "Unknown error";
        const errorCode = responseData?.code || responseData?.errno || "N/A";
        console.error(`API Error: ${errorMsg} (Code: ${errorCode})`);
        
        if (responseData?.stack && process.env.NODE_ENV === "development") {
          console.error("Stack trace:", responseData.stack);
        }
      }
    } catch (err) {
      console.error("Exception in handleSubmit:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
    }
  };

  const handleToggleTaskCompletion = async (taskId: number, currentStatus: TaskStatus) => {
    try {
      const newStatus: TaskStatus = currentStatus === "completed" ? "pending" : "completed";
      console.log("=== handleToggleTaskCompletion START ===");
      console.log("Task ID:", taskId);
      console.log("Current status:", currentStatus);
      console.log("New status:", newStatus);

      const payload: { status: string; dateCompleted?: string | null } = {
        status: mapFrontendStatusToDB(newStatus),
      };

      if (newStatus === "completed") {
        const isoString = new Date().toISOString();
        payload.dateCompleted = isoString.substring(0, 19).replace("T", " ");
        console.log("Marking completed with dateCompleted:", payload.dateCompleted);
      } else {
        payload.dateCompleted = null;
        console.log("Marking incomplete and clearing dateCompleted");
      }

      console.log("Payload being sent:", JSON.stringify(payload));
      console.log("URL being called:", `/api/tasks/${taskId}`);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("=== Response Received ===");
      console.log("Update response - Status:", response.status);
      console.log("Update response - StatusText:", response.statusText);
      console.log("Update response - OK:", response.ok);

      const responseText = await response.text();
      console.log("Raw response text:", responseText);
      console.log("Raw response text length:", responseText.length);

      let responseData: any;
      if (responseText && responseText.length > 0) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseErr) {
          responseData = { error: "Failed to parse response", rawText: responseText };
        }
      } else {
        responseData = { error: "Empty response from API" };
      }

      console.log("Parsed response data:", responseData);

      if (response.ok) {
        console.log(`✅ Task marked as ${newStatus} successfully`);
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus }
              : task
          )
        );
      } else {
        console.error(`❌ Failed to mark task as ${newStatus}`);
        console.error("Response error:", responseData);
        console.error("Full error details:", {
          status: response.status,
          message: responseData?.message,
          code: responseData?.code,
          errno: responseData?.errno,
          stack: responseData?.stack,
          received: responseData?.received,
        });
      }

      console.log("=== handleToggleTaskCompletion END ===");
    } catch (err) {
      console.error("❌ Exception in handleToggleTaskCompletion:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
    }
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

  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
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

    if (draggedTaskId === null) {
      return;
    }

    const draggedTask = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTask || draggedTask.status === status) {
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
            
            {/* Row 1: Search Form Component */}
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
            
            {/* Row 2: Category Filter Row - Scaled to precisely match the search bar's outer edge */}
            <div className="flex h-[43px] items-center gap-[10px] relative self-stretch w-full">
              
              {/* "All" Filtering Button Element */}
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

              {/* Individual mapped Categories */}
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

            {/* Row 3: Action Trigger Button */}
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

          {/* Main Task Feed Container */}
          <main className="flex z-[1] mt-[340px] max-h-[640px] overflow-y-auto fixed top-[40px] left-[500px] sm:left-[566px] right-[120px] px-8 flex-col items-start gap-[25px] pb-12 scrollbar-none">
            {statusSections.map((section) => {
              const sectionTasks = groupedTasks[section.key];

              return (
                <div key={section.key} className="w-full">
                  <div className="flex w-full items-center gap-2.5 pb-2 relative border-b-2 border-solid border-black">
                    <h2
                      className={`relative w-fit ${
                        section.key === "completed"
                          ? "[font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold"
                          : "[font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold"
                      } text-[#191818] text-lg tracking-[0] leading-[normal]`}
                    >
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

                        return (
                          <article
                            key={task.id}
                            className="relative w-full h-[55px]"
                            draggable
                            onDragStart={() => handleDragStart(task.id)}
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