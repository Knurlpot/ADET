"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const PomodoroTimerSection = (): JSX.Element => {
  const router = useRouter();
  const defaultDurationInSeconds = 25 * 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(
    defaultDurationInSeconds,
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timeRemaining]);

  const handleStartPause = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(defaultDurationInSeconds);
    }

    setIsRunning((currentValue) => !currentValue);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(defaultDurationInSeconds);
  };

  const actionButtons = [
    {
      id: "start-pause",
      label: isRunning ? "pause" : "start",
      onClick: handleStartPause,
      ariaLabel: isRunning ? "Pause pomodoro timer" : "Start pomodoro timer",
      topClassName: "top-[78px]",
    },
    {
      id: "reset",
      label: "reset",
      onClick: handleReset,
      ariaLabel: "Reset pomodoro timer",
      topClassName: "top-[137px]",
    },
  ];

  return (
    <section
      aria-labelledby="pomodoro-timer-heading"
      className="absolute top-[598px] left-[750px] sm:left-[785px] w-[calc(100vw-780px)] sm:w-[592px] h-auto sm:h-[305px] max-w-[600px]"
    >
      <div className="absolute top-0 left-0 w-[586px] h-[305px] bg-[#f8f0e2] rounded-[25.5px] border-[2.55px] border-solid border-[#002a8b]" />
      <h2
        id="pomodoro-timer-heading"
        className="absolute top-11 left-[45px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-[normal]"
      >
        Pomodoro Timer
      </h2>
      <p className="absolute top-[50px] left-[359px] w-[190px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[13.6px] text-right tracking-[0] leading-[normal] cursor-pointer hover:underline" onClick={() => router.push("/pomodoro")}>
        &gt;&gt; try our pomodoro timer
      </p>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="absolute top-[67px] left-[43px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#0038b4] text-[120px] tracking-[0] leading-[normal]"
      >
        {formattedTime}
      </div>
      <div className="absolute top-0 left-0">
        {actionButtons.map((button) => (
          <button
            key={button.id}
            type="button"
            aria-label={button.ariaLabel}
            onClick={button.onClick}
            className={`absolute left-[402px] w-[144px] h-[40px] bg-[#0038b4] rounded-[19px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-white text-[15.6px] tracking-[0] leading-[normal] ${button.topClassName}`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <p className="absolute top-[239px] left-[45px] w-[454px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[15.6px] tracking-[0] leading-[normal]">
        try our *new* integrated pomodoro timer for a more productive time!
      </p>
    </section>
  );
};
