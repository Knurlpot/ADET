"use client";

import { useRouter } from "next/navigation";

type NavItem = {
  label: string;
  icon: string;
  iconClassName: string;
  top: string;
  active?: boolean;
};

const generalItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: "/dashboard.svg",
    iconClassName: "relative w-7 h-[28.01px]",
    top: "top-[243px]",
    active: true,
  },
  {
    label: "My Tasks",
    icon: "/tasks.svg",
    iconClassName: "relative w-[27.93px] h-[37.67px]",
    top: "top-[312px]",
  },
  {
    label: "Pomodoro Timer",
    icon: "/pomodoro.svg",
    iconClassName: "relative w-[27.93px] h-[30.44px]",
    top: "top-[389px]",
  },
];

const otherItems: NavItem[] = [
  {
    label: "Settings",
    icon: "/settings.svg",
    iconClassName: "relative w-[29.2px] h-[29.24px]",
    top: "top-[769px]",
  },
  {
    label: "Log out",
    icon: "/logout.svg",
    iconClassName: "relative w-7 h-[36.29px]",
    top: "top-[841px]",
  },
];

export const SidebarNavigationSection = (): JSX.Element => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userUsername");
    router.push("/login");
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="fixed top-6 left-10 w-[411px] h-[1000px]"
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
      <div className="absolute top-[196px] left-12 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[21.5px] text-center tracking-[0] leading-[normal]">
        General
      </div>
      <nav aria-label="General navigation">
        <ul className="m-0 p-0 list-none">
          {generalItems.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex w-[335px] items-center gap-[30.22px] p-[12.09px] absolute ${item.top} left-9 rounded-[6.04px] ${
                  item.active ? "bg-[#f8f0e2]" : ""
                }`}
              >
                <img
                  className={item.iconClassName}
                  alt=""
                  aria-hidden="true"
                  src={item.icon}
                />
                <div
                  className={`relative w-fit text-[21.5px] text-center tracking-[0] leading-[normal] ${
                    item.active
                      ? "mt-[-0.46px] [font-family:'TT_Fors_Trial-Bold',Helvetica] font-bold text-[#002a8b]"
                      : item.label === "Pomodoro Timer"
                        ? "mt-[-0.25px] [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2]"
                        : "[font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2]"
                  }`}
                >
                  {item.label}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute top-[727px] left-12 [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[21.5px] text-center tracking-[0] leading-[normal]">
        Other
      </div>
      <nav aria-label="Other navigation">
        <ul className="m-0 p-0 list-none">
          {otherItems.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={item.label === "Log out" ? handleLogout : undefined}
                className={`flex w-[335px] items-center gap-[30.22px] p-[12.09px] absolute ${item.top} left-9 rounded-[6.04px]`}
              >
                <img
                  className={item.iconClassName}
                  alt=""
                  aria-hidden="true"
                  src={item.icon}
                />
                <div
                  className={`relative w-fit [font-family:'TT_Fors_Trial-Regular',Helvetica] font-normal text-[#f8f0e2] text-[21.5px] text-center tracking-[0] leading-[normal] ${
                    item.label === "Settings" ? "mt-[-0.46px]" : ""
                  }`}
                >
                  {item.label}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div
        aria-hidden="true"
        className="absolute top-[945px] left-28 w-[183px] h-[7px] bg-[#d9d9d9] rounded-[10px]"
      />
    </aside>
  );
};
