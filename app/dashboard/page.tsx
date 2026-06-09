"use client";

import { useEffect, useState } from "react";
import { DashboardGreetingSection } from "./DashboardGreetingSection";
import { PomodoroTimerSection } from "./PomodoroTimerSection";
import { SidebarNavigationSection } from "./SidebarNavigationSection";
import { TaskCompletionHeatmapSection } from "./TaskCompletionHeatmapSection";
import { TaskSummarySection } from "./TaskSummarySection";
import { TaskTrackerSection } from "./TaskTrackerSection";
import { TimeOfDaySection } from "./TimeOfDaySection";

export const Dashboard = (): JSX.Element => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("userUsername") || "User";
    setUsername(storedUsername);
  }, []);

  const handleAddTask = () => {
    return;
  };

  return (
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
        className="fixed top-0 left-0 w-[1440px] h-[212px] bg-[#f8f0e2] blur-[20px]"
        aria-hidden="true"
      />

      <section aria-label="Task summary">
        <TaskSummarySection />
      </section>

      <section aria-label="Dashboard greeting">
        <DashboardGreetingSection username={username} />
      </section>

      <div className="inline-flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 fixed top-20 left-[1192px] bg-[#002a8b] rounded-[15px]">
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

      <aside aria-label="Sidebar navigation">
        <SidebarNavigationSection />
      </aside>

      <button
        type="button"
        onClick={handleAddTask}
        className="flex w-[855px] h-[50px] items-center justify-center gap-[4.41px] px-[22.06px] py-[4.41px] absolute top-[926px] left-[516px] rounded-[22.06px] bg-[linear-gradient(0deg,rgba(0,42,139,1)_0%,rgba(0,42,139,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] cursor-pointer"
      >
        <span className="relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[21.3px] tracking-[0] leading-[normal]">
          add task!
        </span>
      </button>
    </main>
  );
};

export default Dashboard;