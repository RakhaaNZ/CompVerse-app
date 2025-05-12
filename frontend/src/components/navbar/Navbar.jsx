import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/CompVerse-logo.svg";
import MiniNavbar from "./MiniNavbar";

const Navbar = () => {
  return (
    <div
      id="Nav"
      className="nav w-full h-[60px] md:h-[80px] lg:h-[100px] flex fixed z-40"
    >
      <div className="w-screen h-full relative flex flex-row justify-between bg-[#030210]">
        <div className="pl-[30px] pl-[20px] md:pl-[70px] lg:pl-[60px] flex justify-start items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="CompVerse Logo"
              className="w-[120px] sm:w-[150px] md:w-[200px] h-auto flex justify-center items-center"
            />
          </Link>
        </div>
        {/* Desktop */}
        <div className="hidden lg:flex h-full flex-row justify-center gap-18 items-center px-[100px] text-[24px] font-[400]">
          {[
            { name: "Competition", href: "#competition" },
            { name: "Team’s", href: "#teams" },
          ].map((item, index) => (
            <Link key={index} href={item.href} className="relative group">
              <h1 className="w-full transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-gradient-to-r from-[#2541CD] via-[#fff] to-[#2541CD] group-hover:text-transparent group-hover:bg-clip-text text-[20px] xl:text-[22px] text-base text-white leading-[1]">
                {item.name}
                <span className="absolute left-0 -bottom-2 w-0 h-[3px] bg-[#2541CD] transition-all duration-300 group-hover:w-full"></span>
              </h1>
            </Link>
          ))}
        </div>

        <div className="w-full lg:w-auto hidden md:flex items-center justify-end gap-4 lg:gap-6 pr-[100px] lg:pr-[50px]">
          <Link
            href="/auth"
            className="flex justify-center items-center w-[140px] xl:w-[150px] h-[45px] xl:h-[50px] text-[18px] xl:text-[20px] text-base font-medium text-white rounded-[20px] hover:ring-1 hover:ring-[#2541CD] transition-all duration-300 ease-in-out hover:shadow-[10px_10px_33px_#121212,#2541CD_0px_0px_30px_5px] hover:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/auth?form=signup"
            className="flex justify-center items-center w-[120px] lg:w-[140px] xl:w-[150px] h-[40px] lg:h-[45px] xl:h-[50px] text-[15px] lg:text-[18px] xl:text-[20px] text-base font-medium text-white rounded-[20px] ring-1 ring-white hover:ring-[#2541CD] transition-all duration-300 ease-in-out hover:shadow-[10px_10px_33px_#121212,#2541CD_0px_0px_30px_5px] hover:scale-95"
          >
            Sign Up
          </Link>
        </div>

        {/* // Mobile */}
        <div className="lg:hidden lg:-z-50 lg:w-screen lg:h-screen pt-[100px]">
          <MiniNavbar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
