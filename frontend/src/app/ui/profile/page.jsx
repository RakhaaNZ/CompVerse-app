import Image from "next/image";
import BG from "../../../../public/profile-assets/background.png";
import SideBar from "../../../components/sidebar-profile/page";
import UserSection from "./user-section";

export default function Profile() {
  return (
    <section
      id="profile"
      className="relative w-screen h-screen bg-[#030210] flex justify-center items-center"
    >
      <div className="z-0 absolute bottom-0 left-0 w-full h-full">
        <Image src={BG} alt="" className="w-full h-full" />
      </div>

      <div className="z-10 relative w-full max-w-[1800px] h-full flex flex-row gap-15 justify-center items-center px-[40px] sm:px-[62px] pt-[80px] md:pt-[100px] lg:pt-[120px] pb-[20px]">
        <div className="w-[10%] h-full flex justify-center items-center">
          <SideBar />
        </div>
        <div className="w-[90%] h-full">
          <UserSection />
        </div>
      </div>
    </section>
  );
}
