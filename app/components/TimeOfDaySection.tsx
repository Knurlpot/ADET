"use client";

import React, { useEffect, useState } from "react";

type PhaseConfig = {
  id: string;
  label: string;
  vectorSrc: string;
  sunFilter: string;
};

const phases: PhaseConfig[] = [
  {
    id: "night",
    label: "Night",
    vectorSrc: "/vector-1.png",
    sunFilter: "brightness(0.4) grayscale(1) contrast(1.2)",
  },
  {
    id: "morning",
    label: "Morning",
    vectorSrc: "/vector-1-2.png",
    sunFilter: "sepia(0.15) brightness(1.05) saturate(1.1)",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    vectorSrc: "/vector-1-1.png",
    sunFilter: "brightness(1.1) saturate(1.2)",
  },
  {
    id: "evening",
    label: "Evening",
    vectorSrc: "/vector-1-3.png",
    sunFilter: "hue-rotate(-28deg) saturate(1.8) brightness(0.85)",
  },
];

export const TimeOfDaySection = (): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycles through the time phases every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % phases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Dynamic time of day timeline animation"
      className="absolute top-[598px] left-[450px] sm:left-[516px] w-[251px] h-[321.68px]"
    >
      <div className="relative w-full h-full">
        {phases.map((phase, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={phase.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-[251px] h-[321.68px] bg-[#f8f0e2] rounded-[25.5px] border-[2.55px] border-solid border-[#002a8b] transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <h2 className="absolute top-[32px] left-0 w-full text-center [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-none">
                Time of Day
              </h2>

              <div className="absolute top-[75px] left-0 w-full h-[125px] flex items-center justify-center" aria-hidden="true">
                <div className="relative w-[130px] h-full flex items-center justify-center">
                  
                  <img
                    style={{ filter: phase.sunFilter }}
                    className="absolute top-0 w-[128px] h-[128px] object-contain transition-all duration-1000"
                    alt="Sun phase illustration"
                    src="/base-sun.png"
                  />
                  
                  <img
                    className="absolute bottom-[12px] w-[180px] max-w-none object-contain pointer-events-none"
                    alt=""
                    src={phase.vectorSrc}
                  />
                </div>
              </div>

              <p className="absolute top-[222px] left-0 w-full text-center [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b] text-[19.6px] tracking-[0] leading-none">
                {phase.label}
              </p>

              <p className="absolute top-[248px] left-0 w-full text-center [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#002a8b] text-[15.6px] tracking-[0] leading-none">
                tasks most completed!
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};