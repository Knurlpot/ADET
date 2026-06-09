export const TimeOfDaySection = (): JSX.Element => {
  const title = "Time of Day";
  const primaryText = "Morning";
  const secondaryText = "tasks most completed!";

  return (
    <section
      aria-labelledby="time-of-day-title"
      className="absolute top-[598px] left-[516px] w-[257px] h-[305px]"
    >
      <div className="relative w-[257px] h-[305px]">
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-[251px] h-[305px] bg-[#f8f0e2] rounded-[25.5px] border-[2.55px] border-solid border-[#002a8b]"
        />
        <h2
          id="time-of-day-title"
          className="absolute top-11 left-[66px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-[normal]"
        >
          {title}
        </h2>
        <img
          className="absolute top-[86px] left-[70px] w-28 h-[117px]"
          alt="Sun icon representing morning"
          src="/sun.png"
        />
        <p className="absolute top-[212px] left-[84px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-[normal]">
          {primaryText}
        </p>
        <p className="absolute top-[239px] left-11 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[15.6px] tracking-[0] leading-[normal]">
          {secondaryText}
        </p>
      </div>
    </section>
  );
};
