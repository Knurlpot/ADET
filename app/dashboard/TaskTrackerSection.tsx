const statCards = [
  {
    value: "20",
    label: "Total Tasks",
    className:
      "flex flex-col w-[166px] h-40 items-center justify-center p-[21.46px] absolute top-[83px] left-6 bg-[#002a8b] rounded-[15px]",
    valueClassName:
      "self-stretch text-[49.4px] relative [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-center tracking-[0] leading-[normal]",
    labelClassName:
      "relative self-stretch [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[14.6px] text-center tracking-[0] leading-[normal]",
  },
  {
    value: "5",
    label: "Completed Tasks",
    className:
      "flex flex-col w-[166px] h-[159px] items-center justify-center p-[21.46px] absolute top-[84px] left-[196px] bg-[#3e5ba1] rounded-[15px]",
    valueClassName:
      "self-stretch text-[49.4px] relative [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-center tracking-[0] leading-[normal]",
    labelClassName:
      "relative self-stretch [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[14.6px] text-center tracking-[0] leading-[normal]",
  },
  {
    value: "6",
    label: "Pending Tasks",
    className:
      "flex flex-col w-[166px] h-[101px] items-center justify-center p-[21.46px] absolute top-[248px] left-6 bg-[#7c8db6] rounded-[15px]",
    valueClassName:
      "w-fit mt-[-3.03px] text-[32.2px] relative [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-center tracking-[0] leading-[normal]",
    labelClassName:
      "relative w-[99.73px] mb-[-0.89px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[11.8px] text-center tracking-[0] leading-[normal]",
  },
  {
    value: "4",
    label: "In-Progress",
    className:
      "flex flex-col w-[166px] h-[101px] items-center justify-center p-[21.46px] absolute top-[248px] left-[196px] bg-[#7c8db6] rounded-[15px]",
    valueClassName:
      "w-fit mt-[-3.03px] text-[32.2px] relative [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-center tracking-[0] leading-[normal]",
    labelClassName:
      "relative w-[99.73px] mb-[-0.89px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[11.8px] text-center tracking-[0] leading-[normal]",
  },
];

export const TaskTrackerSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="task-tracker-heading"
      className="absolute top-[212px] left-[450px] sm:left-[516px] w-[calc(100vw-480px)] sm:w-[387px] h-auto sm:h-[371px] max-w-[400px]"
    >
      <div className="absolute top-0 left-0 w-[385px] h-[371px] flex bg-[#f8f0e2] rounded-[25.5px] border-[2.55px] border-solid border-[#002a8b]" />
      <div className="absolute top-0 left-0 w-[385px] h-[371px]">
        <header className="absolute top-0 left-0 w-full">
          <div className="mt-[34px] ml-[33px] flex w-[169.46px]">
            <h2
              id="task-tracker-heading"
              className="w-[167.46px] h-[32.92px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-[normal]"
            >
              Task Tracker
            </h2>
          </div>
          <button
            type="button"
            aria-label="View my tasks"
            className="absolute top-10 left-64 w-24 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[13.6px] text-right tracking-[0] leading-[normal]"
          >
            &gt;&gt; my tasks
          </button>
        </header>
        <div aria-label="Task statistics">
          {statCards.map((card) => (
            <article
              key={card.label}
              className={card.className}
              aria-label={`${card.label}: ${card.value}`}
            >
              <div className={card.valueClassName}>{card.value}</div>
              <div className={card.labelClassName}>{card.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
