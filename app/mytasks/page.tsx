"use client";

import { FormEvent, useMemo, useState, useEffect, useId } from "react";
import { SidebarNavigationSection } from "@/app/components/SidebarNavigationSection";
import { DashboardGreetingSection } from "@/app/components/DashboardGreetingSection";

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

const filterOptions: Array<Exclude<TaskCategory, "all">> = [
  "personal",
  "school",
  "work",
  "fitness",
  "others",
];

const initialTasks: Task[] = [
  {
    id: 1,
    name: "task",
    description: "Completed task",
    category: "personal",
    priority: "med-prio",
    status: "completed",
  },
  {
    id: 2,
    name: "task",
    description: "In progress task",
    category: "school",
    priority: "high-prio",
    status: "in-progress",
  },
  {
    id: 3,
    name: "task",
    description: "Pending task",
    category: "work",
    priority: "low-prio",
    status: "pending",
  },
  {
    id: 4,
    name: "task",
    description: "Pending task",
    category: "others",
    priority: "high-prio",
    status: "pending",
  },
];

const statusSections: Array<{
  key: TaskStatus;
  label: string;
}> = [
  { key: "completed", label: "completed!" },
  { key: "in-progress", label: "in progress...!" },
  { key: "pending", label: "pending..." },
];

const taskStyles: Record<
  TaskStatus,
  {
    wrapper: string;
    circle: string;
    text: string;
    dots: string;
    filled?: boolean;
  }
> = {
  completed: {
    wrapper:
      "flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative bg-[#002a8b] rounded-[40px]",
    circle: "relative w-[41px] h-[41.08px]",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#f8f0e2] text-[#f8f0e2] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: true,
  },
  "in-progress": {
    wrapper:
      "border-[#002a8b] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid border-[#002a8b]",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#002a8b] text-[#002a8b] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
  },
  pending: {
    wrapper:
      "border-[#de6f20] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "border-[#de6f20] relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#de6f20] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#de6f20] text-[#de6f20] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
  },
};

const highPendingTaskStyle = {
  wrapper:
    "border-[#cf1515] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
  circle:
    "border-[#cf1515] relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid",
  text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#cf1515] text-[20.9px] tracking-[0] leading-[normal]",
  dots: "[-webkit-text-stroke:1px_#cf1515] text-[#cf1515] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
};

export default function MyTasks(): JSX.Element {
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

  useEffect(() => {
    setIsMounted(true);
    
    const updateScale = () => {
      setScale(Math.min(window.innerWidth / 1440, window.innerHeight / 1024));
    };
    updateScale();
    window.addEventListener("resize", updateScale);

    async function fetchUser() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setUser(null);
          return;
        }

        const response = await fetch(`/api/settings?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);
        } else {
          console.error("Failed to load user information");
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user information", err);
        setUser(null);
      }
    }
    
    fetchUser();
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !taskName.trim() ||
      !taskDescription.trim() ||
      !taskCategory ||
      !taskPriority
    ) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
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
                  
                  <div className="mt-[15px] flex flex-col gap-[12px]">
                    {sectionTasks.length === 0 ? (
                      <p className="text-sm font-normal text-[#00000050] italic px-4">No tasks found.</p>
                    ) : (
                      sectionTasks.map((task, index) => {
                        const isRedPending =
                          task.status === "pending" &&
                          task.priority === "high-prio" &&
                          index > 0;
                        const style = isRedPending
                          ? highPendingTaskStyle
                          : taskStyles[task.status];

                        return (
                          <article
                            key={task.id}
                            className="relative w-full h-[55px]"
                          >
                            <div className={style.wrapper}>
                              {style.filled ? (
                                <img
                                  className={style.circle}
                                  alt=""
                                  aria-hidden="true"
                                  src="/Check.svg"
                                />
                              ) : (
                                <div className={style.circle} aria-hidden="true" />
                              )}
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
          {showModal && (
            <>
              <div className="fixed inset-0 z-[8] bg-[#d9d9d933] backdrop-blur-[2.0px]" onClick={() => setShowModal(false)} />
              <section
                aria-label="Add a task modal"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-[#f8f0e2] rounded-[40px] border-[5px] border-solid border-[#002a8b] p-8 z-[9] flex flex-col items-center gap-6"
              >
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-[#002a8b] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[30px]">
                    add a task
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    aria-label="Close add task modal"
                  >
                    <img className="w-[23px] h-[23px]" alt="" aria-hidden="true" src="/Exit.png" />
                  </button>
                </div>

                <form id={formId} onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                  <label className="flex h-[45px] items-center px-4 bg-[#f8f0e2] rounded-[7px] border-[1.73px] border-solid border-[#002a8b]">
                    <span className="sr-only">task name</span>
                    <input
                      type="text"
                      value={taskName}
                      onChange={(event) => setTaskName(event.target.value)}
                      placeholder="task name"
                      className="w-full bg-transparent outline-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] placeholder:text-[#002a8b80] text-[18px]"
                    />
                  </label>

                  <label className="flex flex-col px-4 py-3 bg-[#f8f0e2] rounded-[7px] border-[1.73px] border-solid border-[#002a8b]">
                    <span className="sr-only">task description</span>
                    <textarea
                      value={taskDescription}
                      onChange={(event) => setTaskDescription(event.target.value)}
                      placeholder="task description"
                      rows={4}
                      className="w-full bg-transparent outline-none resize-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#000000] placeholder:text-[#002a8b80] text-[18px]"
                    />
                  </label>

                  <div className="flex gap-4 w-full">
                    <label className="flex h-[43px] items-center justify-between px-4 bg-[#f8f0e2] rounded-[8px] border-[1.73px] border-solid border-[#002a8b] w-1/2 relative">
                      <span className="sr-only">category</span>
                      <select
                        value={taskCategory}
                        onChange={(event) =>
                          setTaskCategory(event.target.value as TaskCategory | "")
                        }
                        className="w-full bg-transparent outline-none appearance-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[16px] pr-6"
                      >
                        <option value="">category</option>
                        <option value="personal">personal</option>
                        <option value="school">school</option>
                        <option value="work">work</option>
                        <option value="fitness">fitness</option>
                        <option value="others">others</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#002a8b] text-[12px]">▼</div>
                    </label>

                    <label className="flex h-[43px] items-center justify-between px-4 bg-[#f8f0e2] rounded-[8px] border-[1.73px] border-solid border-[#002a8b] w-1/2 relative">
                      <span className="sr-only">priority level</span>
                      <select
                        value={taskPriority}
                        onChange={(event) =>
                          setTaskPriority(event.target.value as TaskPriority | "")
                        }
                        className="w-full bg-transparent outline-none appearance-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[16px] pr-6"
                      >
                        <option value="">priority level</option>
                        <option value="low-prio">low-prio</option>
                        <option value="med-prio">med-prio</option>
                        <option value="high-prio">high-prio</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#002a8b] text-[12px]">▼</div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[45px] bg-[#002a8b] rounded-[10px] mt-2 flex items-center justify-center [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[18px] transition-opacity hover:opacity-90"
                  >
                    add task!
                  </button>
                </form>
              </section>
            </>
          )}

        </div>
      </div>
    </div>
  );
}