type TaskSummarySectionProps = {
  remainingTasks?: number;
};

export const TaskSummarySection = ({
  remainingTasks = 10,
}: TaskSummarySectionProps): JSX.Element => {
  return (
    <section
      aria-label="Task summary"
      className="fixed top-32 left-[516px] w-[494px]"
    >
      <p className="[font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#00000080] text-[17.2px] tracking-[0] leading-[normal]">
        <span className="[font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#00000080] text-[17.2px] tracking-[0]">
          nudge wishes you a nice and productive day! currently, you have{" "}
        </span>
        <strong className="[font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#00000080] text-[17.2px] tracking-[0] leading-[normal]">
          {remainingTasks} tasks remaining.
        </strong>
      </p>
    </section>
  );
};
