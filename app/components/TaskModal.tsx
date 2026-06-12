"use client";

import React, { FormEvent } from "react";

type TaskCategory = "all" | "personal" | "school" | "work" | "fitness" | "others";
type TaskPriority = "low-prio" | "med-prio" | "high-prio";

interface TaskModalProps {
  showModal: boolean;
  onClose: () => void;
  taskName: string;
  onTaskNameChange: (name: string) => void;
  taskDescription: string;
  onTaskDescriptionChange: (description: string) => void;
  taskCategory: TaskCategory | "";
  onTaskCategoryChange: (category: TaskCategory | "") => void;
  taskPriority: TaskPriority | "";
  onTaskPriorityChange: (priority: TaskPriority | "") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formId: string;  mode?: "add" | "edit";
  editingTaskId?: number | null;}

export function TaskModal({
  showModal,
  onClose,
  taskName,
  onTaskNameChange,
  taskDescription,
  onTaskDescriptionChange,
  taskCategory,
  onTaskCategoryChange,
  taskPriority,
  onTaskPriorityChange,
  onSubmit,
  formId,
  mode = "add",
  editingTaskId = null,
}: TaskModalProps) {
  if (!showModal) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[8] bg-[#d9d9d933] backdrop-blur-[2.0px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        aria-label="Add a task modal"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-[#f8f0e2] rounded-[40px] border-[5px] border-solid border-[#002a8b] p-8 z-[9] flex flex-col items-center gap-6"
      >
        <div className="w-full flex justify-between items-center">
          <h2 className="text-[#002a8b] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[30px]">
            {mode === "edit" ? "edit task" : "add a task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add task modal"
          >
            <img
              className="w-[23px] h-[23px]"
              alt=""
              aria-hidden="true"
              src="/Exit.png"
            />
          </button>
        </div>

        <form id={formId} onSubmit={onSubmit} className="w-full flex flex-col gap-4">
          <label className="flex h-[45px] items-center px-4 bg-[#f8f0e2] rounded-[7px] border-[1.73px] border-solid border-[#002a8b]">
            <span className="sr-only">task name</span>
            <input
              type="text"
              value={taskName}
              onChange={(event) => onTaskNameChange(event.target.value)}
              placeholder="task name"
              className="w-full bg-transparent outline-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] placeholder:text-[#002a8b80] text-[18px]"
            />
          </label>

          <label className="flex flex-col px-4 py-3 bg-[#f8f0e2] rounded-[7px] border-[1.73px] border-solid border-[#002a8b]">
            <span className="sr-only">task description</span>
            <textarea
              value={taskDescription}
              onChange={(event) => onTaskDescriptionChange(event.target.value)}
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
                  onTaskCategoryChange(event.target.value as TaskCategory | "")
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
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#002a8b] text-[12px]">
                ▼
              </div>
            </label>

            <label className="flex h-[43px] items-center justify-between px-4 bg-[#f8f0e2] rounded-[8px] border-[1.73px] border-solid border-[#002a8b] w-1/2 relative">
              <span className="sr-only">priority level</span>
              <select
                value={taskPriority}
                onChange={(event) =>
                  onTaskPriorityChange(event.target.value as TaskPriority | "")
                }
                className="w-full bg-transparent outline-none appearance-none [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[16px] pr-6"
              >
                <option value="">priority level</option>
                <option value="low-prio">low-prio</option>
                <option value="med-prio">med-prio</option>
                <option value="high-prio">high-prio</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#002a8b] text-[12px]">
                ▼
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-[45px] bg-[#002a8b] rounded-[10px] mt-2 flex items-center justify-center [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[18px] transition-opacity hover:opacity-90"
          >
            {mode === "edit" ? "save changes" : "add task!"}
          </button>
        </form>
      </section>
    </>
  );
}
