"use client";

import { useState } from "react";
import Image from "next/image";
import BG from "../../../../public/profile-assets/background.png";
import SideBar from "../../../components/sidebar-profile/page";
import UserInfoSection from "./user-section";
import UserCompetitionsSection from "./user-competition";
import UserTeamsSection from "./user-teams";

export default function Profile() {
  const [selectedSection, setSelectedSection] = useState("profile");

  const renderSection = () => {
    switch (selectedSection) {
      case "profile":
        return <UserInfoSection />;
      case "competitions":
        return <UserCompetitionsSection />;
      case "teams":
        return <UserTeamsSection />;
      default:
        return <UserInfoSection />;
    }
  };

  return (
    <section
      id="profile"
      className="relative w-screen min-h-screen bg-[#030210] flex justify-center items-center overflow-hidden"
    >
      <div className="z-0 absolute bottom-0 left-0 w-full h-full">
        <Image src={BG} alt="" className="w-full h-full" />
      </div>

      <div className="z-10 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5 sm:gap-15 min-h-full max-w-[1800px] w-full px-[40px] sm:px-[62px] pt-[80px] md:pt-[100px] lg:pt-[120px] pb-[20px]">
        <div id="sidebar" className="w-full">
          <SideBar onSelect={setSelectedSection} selected={selectedSection} />
        </div>

        <div id="content" className="w-full">
          {renderSection()}
        </div>
      </div>
    </section>
  );
}
