import Image from "next/image";
import { CircleUser } from "lucide-react";
import ProfileIcon from "../../../public/profile-assets/profile-icon.svg";
import CompetitionIcon from "../../../public/profile-assets/competition-icon.svg";
import TeamsIcon from "../../../public/profile-assets/teams-icon.svg";
import { LogOut } from "lucide-react";

export default function SideBar() {
  return (
    <div
      id="profile"
      className="relative w-full h-full border-2 border-white rounded-[40px] flex flex-col justify-between items-center py-[40px]"
    >
      <div className="w-full h-full flex flex-col justify-cente items-center gap-[40px]">
        <div className="w-15 h-15">
          <Image src={ProfileIcon} alt="" className="w-full h-full" />
        </div>
        <div className="w-15 h-15">
          <Image src={CompetitionIcon} alt="" className="w-full h-full" />
        </div>
        <div className="w-15 h-15">
          <Image src={TeamsIcon} alt="" className="w-full h-full" />
        </div>
      </div>
      <div>
        <div className="w-25 h-15 border-2 border-white rounded-[36px] flex justify-center items-center">
          <LogOut size={40} className="text-white stroke-2" />
        </div>
      </div>
    </div>
  );
}
