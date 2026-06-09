const legendItems = [
  { label: "Low", color: "bg-[#002a8b33]" },
  { label: "Medium low", color: "bg-[#002a8b80]" },
  { label: "Medium high", color: "bg-[#002a8bbf]" },
  { label: "High", color: "bg-[#002a8b]" },
];

const _heatmapCells = [
  [
    "bg-[#002a8b33]",
    "bg-[#002a8b80]",
    "bg-[#002a8b80]",
    "bg-[#002a8b]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b33]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b80]",
    "bg-[#002a8b33]",
  ],
  [
    "bg-[#002a8b33]",
    "bg-[#002a8b]",
    "bg-[#002a8b80]",
    "bg-[#002a8b33]",
    "bg-[#002a8b80]",
    "bg-[#002a8b33]",
    "bg-[#002a8b80]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b80]",
  ],
  [
    "bg-[#002a8b80]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b33]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b]",
    "bg-[#002a8b80]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b33]",
    "bg-[#002a8b33]",
  ],
  [
    "bg-[#002a8b33]",
    "bg-[#002a8b80]",
    "bg-[#002a8b]",
    "bg-[#002a8b33]",
    "bg-[#002a8bbf]",
    "bg-[#002a8b33]",
    "bg-[#002a8b33]",
    "bg-[#002a8b33]",
    "bg-transparent",
  ],
];

export const TaskCompletionHeatmapSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="task-completion-heatmap-title"
      className="absolute top-[212px] left-[917px] w-[456px] h-[371px]"
    >
      <div className="absolute top-0 left-0 w-[454px] h-[371px] rounded-[25.5px] border-[2.55px] border-solid border-[#002a8b] bg-[#f8f0e2]" />
      <div className="absolute top-[37px] left-8 w-[395px]">
        <div className="absolute top-0 left-0 w-[127px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-[normal]">
          <h2
            id="task-completion-heatmap-title"
            className="m-0 text-inherit font-inherit"
          >
            Last 30 days
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
          className="absolute top-[46px] left-0 grid grid-cols-9 grid-rows-4 gap-x-[10px] gap-y-[13px] w-[389px] h-[198px]"
          role="img"
          aria-label="Heatmap showing summary of task completion over the last 30 days"
        ></div>
      </div>
      <p className="absolute top-[296px] left-8 w-[389px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[15.6px] tracking-[0] leading-[normal]">
        summary of task completion and amount of tasks completed each day.
      </p>
    </section>
  );
};
