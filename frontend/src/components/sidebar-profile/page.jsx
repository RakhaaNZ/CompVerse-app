import Image from "next/image";
import ProfileIcon from "../../../public/profile-assets/profile-icon.svg";
import ProfileIconActive from "../../../public/profile-assets/profile-icon-active.svg";
import CompetitionIcon from "../../../public/profile-assets/competition-icon.svg";
import CompetitionIconActive from "../../../public/profile-assets/competition-icon-active.svg";
import TeamsIcon from "../../../public/profile-assets/teams-icon.svg";
import TeamsIconActive from "../../../public/profile-assets/teams-icon-active.svg";

export default function SideBar({ onSelect, selected }) {
  const menuItems = [
    { key: "profile", icon: ProfileIcon, activeIcon: ProfileIconActive },
    {
      key: "competitions",
      icon: CompetitionIcon,
      activeIcon: CompetitionIconActive,
    },
    { key: "teams", icon: TeamsIcon, activeIcon: TeamsIconActive },
  ];

  return (
    <div
      id="sidebar"
      className="w-full h-full border-2 border-white rounded-[40px] flex flex-row md:flex-col justify-center items-center py-[40px]"
    >
      <div className="w-full h-full flex flex-row lg:flex-col justify-around lg:justify-start items-center md:gap-[40px]">
        {menuItems.map((item) => {
          const isActive = selected === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`
                w-10 xl:w-15 h-10 xl:h-15 rounded-full flex items-center justify-center cursor-pointer
                transition-transform duration-200
                hover:scale-110 active:scale-95
                ${
                  isActive
                    ? "border-2 border-white bg-white"
                    : "hover:bg-white/5"
                }
              `}
            >
              <Image
                src={isActive ? item.activeIcon : item.icon}
                alt={item.key}
                className="w-full h-full"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
