"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  icon: string;
  darkIcon?: string;
  lightIcon?: string;
  iconClassName: string;
  top: string;
  active?: boolean;
};

const generalItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: "/dashboard.svg",
    lightIcon: "/DashboardLight.svg",
    iconClassName: "relative w-7 h-[25.01px]",
    top: "top-[190px]",
    active: true,
  },
  {
    label: "My Tasks",
    icon: "/tasks.svg",
    darkIcon: "/TasksDark.svg",
    iconClassName: "relative w-[27.93px] h-[35.67px]",
    top: "top-[250px]",
  },
  {
    label: "Pomodoro Timer",
    icon: "/pomodoro.svg",
    darkIcon: "/TimerDark.svg",
    iconClassName: "relative w-[27.93px] h-[28.44px]",
    top: "top-[320px]",
  },
];

const otherItems: NavItem[] = [
  {
    label: "Settings",
    icon: "/settings.svg",
    darkIcon: "/SettingsDark.svg",
    iconClassName: "relative w-[29.2px] h-[27.24px]",
    top: "top-[490px]",
  },
  {
    label: "Log out",
    icon: "/logout.svg",
    iconClassName: "relative w-7 h-[34.29px]",
    top: "top-[550px]",
  },
];

export const SidebarNavigationSection = (): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<string>("Dashboard");
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === "/settings") {
      setActiveButton("Settings");
    } else if (pathname === "/dashboard") {
      setActiveButton("Dashboard");
    } else {
      setActiveButton("Dashboard");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userUsername");
    router.push("/login");
  };

  const handleButtonClick = (label: string) => {
    if (label !== "Log out") {
      setActiveButton(label);
      if (label === "Dashboard") {
        router.push("/dashboard");
      }
    }
  };

  const getIconSrc = (item: NavItem, isActive: boolean, isHovered: boolean) => {
    // Dashboard uses light icon when not active
    if (item.label === "Dashboard" && !isActive) {
      return item.lightIcon || item.icon;
    }
    // Other items with dark icons use them when active or hovered
    if ((isActive || isHovered) && item.darkIcon) {
      return item.darkIcon;
    }
    return item.icon;
  };

  const getIconFilter = (item: NavItem, isActive: boolean, isHovered: boolean) => {
    // Logout icon should change to dark blue on hover
    if (item.label === "Log out" && isHovered) {
      return "brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(3270%) hue-rotate(237deg)";
    }
    return "none";
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="fixed top-6 left-10 w-[411px] h-[650px]"
    >
      <div
        aria-hidden="true"
        className="absolute top-[296px] left-[-296px] w-[1000px] h-[407px] bg-[#002a8b] rounded-[0px_100px_100px_0px] -rotate-90"
      />
      <div className="absolute top-[50px] left-[120px] w-[168px] h-[67px] flex">
        <div className="flex-1 w-[168px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#f8f0e2] text-[48.2px] tracking-[0] leading-[normal]">
          nudge.
        </div>
      </div>
      <div className="absolute top-[140px] left-12 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[21.5px] text-center tracking-[0] leading-[normal]">
        General
      </div>
      <nav aria-label="General navigation">
        <ul className="m-0 p-0 list-none">
          {generalItems.map((item) => {
            const isActive = activeButton === item.label;
            const isHovered = hoveredButton === item.label;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => handleButtonClick(item.label)}
                  onMouseEnter={() => setHoveredButton(item.label)}
                  onMouseLeave={() => setHoveredButton(null)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex w-[335px] items-center gap-[30.22px] p-[12.09px] absolute ${item.top} left-9 rounded-[6.04px] transition-all duration-200 ${
                    isActive ? "bg-[#f8f0e2]" : "hover:bg-[#f8f0e2]"
                  }`}
                >
                  <img
                    className={item.iconClassName}
                    alt=""
                    aria-hidden="true"
                    src={getIconSrc(item, isActive, isHovered)}
                    style={{ filter: getIconFilter(item, isActive, isHovered) }}
                  />
                  <div
                    className={`relative w-fit text-[21.5px] text-center tracking-[0] leading-[normal] transition-all duration-200 ${
                      isActive
                        ? "mt-[-0.46px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b]"
                        : item.label === "Pomodoro Timer"
                          ? "mt-[-0.25px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] group-hover:text-[#002a8b]"
                          : "[font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] group-hover:text-[#002a8b]"
                    }`}
                  >
                    {item.label}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute top-[445px] left-12 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[21.5px] text-center tracking-[0] leading-[normal]">
        Other
      </div>
      <nav aria-label="Other navigation">
        <ul className="m-0 p-0 list-none">
          {otherItems.map((item) => {
            const isActive = activeButton === item.label;
            const isHovered = hoveredButton === item.label;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    handleButtonClick(item.label);
                    if (item.label === "Log out") handleLogout();
                    if (item.label === "Settings") router.push("/settings");
                  }}
                  onMouseEnter={() => setHoveredButton(item.label)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`group flex w-[335px] items-center gap-[30.22px] p-[12.09px] absolute ${item.top} left-9 rounded-[6.04px] transition-all duration-200 ${
                    isActive ? "bg-[#f8f0e2]" : "hover:bg-[#f8f0e2]"
                  }`}
                >
                  <img
                    className={item.iconClassName}
                    alt=""
                    aria-hidden="true"
                    src={getIconSrc(item, isActive, isHovered)}
                    style={{ filter: getIconFilter(item, isActive, isHovered) }}
                  />
                  <div
                    className={`relative w-fit [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[21.5px] text-center tracking-[0] leading-[normal] transition-all duration-200 ${
                      isActive
                        ? "text-[#002a8b] font-bold"
                        : "text-[#f8f0e2] group-hover:text-[#002a8b]"
                    } ${item.label === "Settings" ? "mt-[-0.46px]" : ""}`}
                  >
                    {item.label}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div
        aria-hidden="true"
        className="absolute top-[600px] left-28 w-[183px] h-[7px] bg-[#d9d9d9] rounded-[10px]"
      />
    </aside>
  );
};
