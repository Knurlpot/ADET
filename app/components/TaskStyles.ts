type TaskStatus = "completed" | "in-progress" | "pending";
type TaskPriority = "low-prio" | "med-prio" | "high-prio";

export interface TaskStyle {
  wrapper: string;
  circle: string;
  text: string;
  dots: string;
  filled?: boolean;
}

// Green styles for low-priority tasks
const lowPriorityStyles: Record<TaskStatus, TaskStyle> = {
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
      "border-[#22c55e] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid border-[#22c55e] cursor-pointer",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#22c55e] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#22c55e] text-[#22c55e] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: false,
  },
  pending: {
    wrapper:
      "border-[#22c55e] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "border-[#22c55e] relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid cursor-pointer",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#22c55e] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#22c55e] text-[#22c55e] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: false,
  },
};

// Orange styles for medium-priority tasks
const mediumPriorityStyles: Record<TaskStatus, TaskStyle> = {
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
      "border-[#de6f20] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid border-[#de6f20] cursor-pointer",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#de6f20] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#de6f20] text-[#de6f20] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: false,
  },
  pending: {
    wrapper:
      "border-[#de6f20] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "border-[#de6f20] relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid cursor-pointer",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#de6f20] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#de6f20] text-[#de6f20] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: false,
  },
};

// Red styles for high-priority tasks
const highPriorityStyles: Record<TaskStatus, TaskStyle> = {
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
      "border-[#cf1515] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid border-[#cf1515] cursor-pointer",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#cf1515] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#cf1515] text-[#cf1515] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: false,
  },
  pending: {
    wrapper:
      "border-[#cf1515] flex w-full h-[55px] items-center justify-between px-[14.97px] py-[7.49px] relative rounded-[40px] border-4 border-solid",
    circle:
      "border-[#cf1515] relative w-[39.67px] h-[39.67px] rounded-[19.84px] border-[3.74px] border-solid cursor-pointer",
    text: "relative w-fit [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#cf1515] text-[20.9px] tracking-[0] leading-[normal]",
    dots: "[-webkit-text-stroke:1px_#cf1515] text-[#cf1515] relative w-fit rotate-90 [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[17.2px] tracking-[0] leading-[normal]",
    filled: false,
  },
};

/**
 * Get task styles based on priority and status
 * @param priority Task priority level (low-prio, med-prio, high-prio)
 * @param status Task status (completed, in-progress, pending)
 * @returns TaskStyle object with wrapper, circle, text, and dots classes
 */
export function getTaskStyles(priority: TaskPriority, status: TaskStatus): TaskStyle {
  switch (priority) {
    case "low-prio":
      return lowPriorityStyles[status];
    case "med-prio":
      return mediumPriorityStyles[status];
    case "high-prio":
      return highPriorityStyles[status];
    default:
      return mediumPriorityStyles[status];
  }
}
