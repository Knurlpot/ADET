"use client";

import React, { useEffect, useState } from "react";
// Import useRouter from next/navigation
import { useRouter } from "next/navigation"; 
import { DashboardGreetingSection } from "@/app/components/DashboardGreetingSection";
import { PomodoroTimerSection } from "@/app/components/PomodoroTimerSection";
import { SidebarNavigationSection } from "@/app/components/SidebarNavigationSection";
import { TaskCompletionHeatmapSection } from "@/app/components/TaskCompletionHeatmapSection";
import { TaskSummarySection } from "@/app/components/TaskSummarySection";
import { TaskTrackerSection } from "@/app/components/TaskTrackerSection";
import { TimeOfDaySection } from "@/app/components/TimeOfDaySection";

export const Dashboard = (): JSX.Element => {
  const router = useRouter(); // Initialize the router
  const [username, setUsername] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [remainingTasksCount, setRemainingTasksCount] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
    fetchTasksCount();

    const updateScale = () => {
      setScale(Math.min(window.innerWidth / 1440, window.innerHeight / 1024));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUsername("User");
        return;
      }

      const response = await fetch(`/api/settings?userId=${userId}`);
      const data = await response.json();

      if (response.ok && data.user) {
        setUsername(data.user.Username || "User");
        localStorage.setItem("userUsername", data.user.Username);
      } else {
        const storedUsername = localStorage.getItem("userUsername") || "User";
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      const storedUsername = localStorage.getItem("userUsername") || "User";
      setUsername(storedUsername);
    }
  };

  const fetchTasksCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setRemainingTasksCount(0);
        return;
      }

      const response = await fetch(`/api/tasks?userId=${userId}`);
      const data = await response.json();

      if (response.ok && data.tasks) {
        const pendingAndInProgressTasks = data.tasks.filter(
          (task: any) => task.TaskStatus === "Pending" || task.TaskStatus === "In-Progress"
        );
        setRemainingTasksCount(pendingAndInProgressTasks.length);
      }
    } catch (error) {
      console.error("Error fetching tasks count:", error);
      setRemainingTasksCount(0);
    }
  };

  // Handler to redirect the user to your MyTasks route
  const handleNavigateToTasks = () => {
    // Adjust this path if your route is structured differently (e.g., "/dashboard/tasks")
    router.push("/mytasks"); 
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
        <main className="bg-[#f8f0e2] w-full min-w-[1440px] min-h-[1024px] relative">
          <section aria-label="Task completion heatmap">
            <TaskCompletionHeatmapSection />
          </section>

          <section aria-label="Task tracker">
            <TaskTrackerSection />
          </section>

          <section aria-label="Pomodoro timer details">
            <PomodoroTimerSection />
          </section>

          <section aria-label="Time of day">
            <TimeOfDaySection />
          </section>

          <div
            className="fixed top-0 left-0 right-0 w-full h-[212px] bg-[#f8f0e2] blur-[20px]"
            aria-hidden="true"
          />

          <section aria-label="Task summary">
            <TaskSummarySection remainingTasks={remainingTasksCount} />
          </section>

          {isMounted && (
            <section aria-label="Dashboard greeting">
              <DashboardGreetingSection username={username} remainingTasksCount={remainingTasksCount} />
            </section>
          )}

          {isMounted && (
            <div className="inline-flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 fixed top-20 right-4 sm:right-8 bg-[#002a8b] rounded-[15px]">
              <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
                <img
                  className="relative w-[19.19px] h-[20.13px]"
                  alt="user avatar"
                  aria-hidden="true"
                  src="/user.svg"
                />
                <div className="mt-[-1.00px] text-[#f8f0e2] text-[15px] relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold tracking-[0] leading-[normal]">
                  {username}
                </div>
              </div>
            </div>
          )}

          <aside aria-label="Sidebar navigation">
            <SidebarNavigationSection />
          </aside>

          <section aria-label="Pomodoro controls">
            <div className="absolute top-[713px] left-[1070px] w-[295px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[106.1px] tracking-[0] leading-[normal]" />
          </section>

          {/* Cleaned up: Removed hidden form element and turned button into a semantic click handler */}
          <button
            type="button"
            onClick={handleNavigateToTasks}
            className="flex w-[855px] h-[50px] items-center justify-center gap-[4.41px] px-[22.06px] py-[4.41px] absolute top-[926px] left-[516px] rounded-[22.06px] bg-[linear-gradient(0deg,rgba(0,42,139,1)_0%,rgba(0,42,139,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[21.3px] tracking-[0] leading-[normal]">
              add task!
            </span>
          </button>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;