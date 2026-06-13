"use client";

import { useEffect, useState } from "react";

const legendItems = [
  { label: "Low", color: "bg-[#002a8b33]" },
  { label: "Medium low", color: "bg-[#002a8b80]" },
  { label: "Medium high", color: "bg-[#002a8bbf]" },
  { label: "High", color: "bg-[#002a8b]" },
];

type CompletedTask = {
  TaskID: number;
  TaskName: string;
  TaskStatus: string;
  DateCompleted: string | null;
};

export const TaskCompletionHeatmapSection = (): JSX.Element => {
  const [tasksPerDay, setTasksPerDay] = useState<{ [day: number]: number }>({});
  const [monthYear, setMonthYear] = useState<string>("");
  const [daysInMonth, setDaysInMonth] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  console.log("TaskCompletionHeatmapSection component rendered");

  const fetchCompletedTasks = async () => {
    console.log("fetchCompletedTasks called");
    try {
      const userId = localStorage.getItem("userId");
      console.log("userId from localStorage:", userId);
      
      if (!userId) {
        console.log("No userId found");
        return;
      }

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      console.log("Current month:", currentMonth, "Current year:", currentYear);

      // Set month/year display
      const monthName = today.toLocaleString("default", { month: "short" });
      setMonthYear(`${monthName} ${currentYear}`);

      console.log("Fetching tasks from API...");
      const response = await fetch(`/api/tasks?userId=${userId}`);
      console.log("API Response status:", response.status);
      
      const data = await response.json();
      console.log("All tasks from API:", data.tasks);
      console.log("Total tasks count:", data.tasks?.length);
      
      if (response.ok && data.tasks) {
        // Log first task to see structure
        if (data.tasks.length > 0) {
          console.log("First task structure:", data.tasks[0]);
        }
        
        const completedTasks = data.tasks.filter(
          (task: CompletedTask) => {
            const isCompleted = task.TaskStatus === "Completed";
            const hasDate = task.DateCompleted !== null;
            console.log(`Task ${task.TaskID} (${task.TaskName}): Status=${task.TaskStatus}, DateCompleted=${task.DateCompleted}, Passes filter=${isCompleted && hasDate}`);
            return isCompleted && hasDate;
          }
        );

        console.log("After filter - Completed tasks count:", completedTasks.length);
        console.log("Completed tasks:", completedTasks);

        // Count tasks by day of month for the current month
        const taskCounts: { [day: number]: number } = {};
        completedTasks.forEach((task: CompletedTask) => {
          if (task.DateCompleted) {
            console.log(`Processing task ${task.TaskID}: DateCompleted = "${task.DateCompleted}"`);
            const date = new Date(task.DateCompleted);
            console.log(`Parsed date object:`, date, `Valid: ${!isNaN(date.getTime())}`);
            
            const taskMonth = date.getMonth();
            const taskYear = date.getFullYear();
            const day = date.getDate();

            console.log(`Task date breakdown - Day: ${day}, Month: ${taskMonth}, Year: ${taskYear}`);
            console.log(`Current date breakdown - Month: ${currentMonth}, Year: ${currentYear}`);

            // Only count tasks from the current month and year
            if (taskMonth === currentMonth && taskYear === currentYear) {
              taskCounts[day] = (taskCounts[day] || 0) + 1;
              console.log(`Added to day ${day}, count now: ${taskCounts[day]}`);
            } else {
              console.log(`Skipped - month/year mismatch`);
            }
          }
        });

        console.log("📊 Final task counts:", taskCounts);
        setTasksPerDay(taskCounts);
      }
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Calculate days in month on client side
    const today = new Date();
    const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    setDaysInMonth(days);
    
    // Initial fetch
    fetchCompletedTasks();

    // Refetch every 3 seconds to keep data in sync
    const interval = setInterval(() => {
      fetchCompletedTasks();
    }, 3000);

    // Also refetch when window regains focus
    const handleFocus = () => {
      fetchCompletedTasks();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getColorForDay = (taskCount: number): string => {
    if (taskCount === 0) return "bg-[#002a8b33]";
    if (taskCount <= 2) return "bg-[#002a8b80]";
    if (taskCount <= 5) return "bg-[#002a8bbf]";
    return "bg-[#002a8b]";
  };

  // Get the array of days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return (
    <section
      aria-labelledby="task-completion-heatmap-title"
      className="absolute top-[212px] left-[900px] sm:left-[917px] w-[calc(100vw-930px)] sm:w-[456px] h-auto sm:h-[400px] max-w-[470px]"
    >
      <div className="absolute top-0 left-0 w-[454px] h-[370px] rounded-[25.5px] border-[2.55px] border-solid border-[#002a8b] bg-[#f8f0e2]" />
      <div className="absolute top-[37px] left-8 w-[395px]">
        <div className="absolute top-0 left-0 w-[200px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[18.6px] tracking-[0] leading-[normal]">
          <h2
            id="task-completion-heatmap-title"
            className="m-0 text-inherit font-inherit"
          >
            {monthYear || "This Month"}
          </h2>
        </div>
        <div
          className="absolute top-1.5 left-[212px] flex items-center gap-[9px]"
          aria-label="Task completion intensity legend"
        >
          <span className="w-7 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b80] text-[12.3px] tracking-[0] leading-[normal]">
            Less
          </span>
          <div className="flex items-center gap-[10px]">
            {legendItems.map((item) => (
              <span
                key={item.label}
                className={`block w-[17px] h-5 rounded-[1.45px] ${item.color}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="w-[33px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[12.3px] tracking-[0] leading-[normal]">
            More
          </span>
        </div>
        <div
          className="absolute top-[46px] left-0 grid grid-cols-7 gap-x-[10px] gap-y-[13px] w-[389px]"
          role="img"
          aria-label={`Heatmap showing task completion for ${monthYear}`}
        >
          {days.map((day) => (
            <div
              key={day}
              className={`w-[45px] h-[40px] rounded-[4px] ${getColorForDay(
                tasksPerDay[day] || 0
              )}`}
              title={`Day ${day}: ${tasksPerDay[day] || 0} tasks completed`}
            />
          ))}
        </div>
      </div>
      <p className="absolute top-[296px] right-8 w-[270px] text-right [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[15px] tracking-[0] leading-[normal]">
        summary of task completion and amount of tasks completed each day.
      </p>
    </section>
  );
};