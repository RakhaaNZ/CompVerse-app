import React from "react";
import Image from "next/image";
import BG from "../../../../public/auth-assets/bg-signup.png";
import BG2 from "../../../../public/auth-assets/bg2-signup.png";
import Logo from "../../../../public/CompVerse-logo.svg";

export default function SignIn() {
  return (
    <section
      id="SignIn"
      className="bg-[#CACACA] w-screen h-screen overflow-hidden flex justify-center items-center px-[60px]"
    >
      <div className="absolute left-0 w-[70%] h-screen">
        <Image src={BG} alt="Background" className="w-full h-full" />
      </div>

      <div className="block lg:hidden absolute top-4 left-8">
        <Image src={Logo} alt="Logo" className="w-[200px] h-[60px]" />
      </div>

      <div className="z-10 w-full max-w-[1280px] h-[70%] lg:h-[80%] bg-white rounded-[40px] flex flex-row p-[10px]">
        <div className="hidden lg:block relative w-[60%] rounded-[38px] overflow-hidden px-6 py-4">
          <Image
            src={BG2}
            alt="Background"
            className="absolute inset-0 w-full h-full "
          />

          <div className="relative z-10 flex flex-row justify-between items-center px-4">
            <Image src={Logo} alt="Logo" className="w-[200px] h-[60px]" />
            <div className="flex flex-row gap-4 text-white text-[20px] font-[400] h-[50px] items-center">
              <div className="py-3 px-10 rounded-[20px]">
                <p>Sign in</p>
              </div>
              <div className="py-3 px-10 border-white border-[1px] rounded-[20px]">
                <p>Sign Up</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-white h-[93%] flex justify-end items-end">
            <h1 className="text-[40px] w-[75%] font-bold text-white drop-shadow-[0px_0px_7px_rgba(255,255,255,1)]">
              Explore, Compete, Achieve!
            </h1>
          </div>
        </div>

        <div className="w-full lg:w-[40%] flex justify-center">
          <form className="flex flex-col w-[90%] justify-center items-center gap-[24px]">
            {/* Title */}
            <div className="text-black text-[32px] font-[500] mb-[50px]">
              <h1>Create an Account</h1>
            </div>

            {/* Name Fields */}
            <div className="w-full flex flex-row justify-between gap-8">
              {/* First Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="first-name"
                  required
                  className="peer w-full h-[55px] ring-2 ring-black rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
                />
                <label
                  htmlFor="first-name"
                  className="absolute bg-white left-4 top-9.5 -translate-y-5 text-black text-[14px] transition-all px-2
                    peer-valid:top-2 peer-valid:text-black 
                    peer-focus:top-2 peer-focus:text-[#2541CD] peer-focus:px-4"
                >
                  First Name
                </label>
              </div>

              {/* Last Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="last-name"
                  required
                  className="peer w-full h-[55px] ring-2 ring-black rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
                />
                <label
                  htmlFor="last-name"
                  className="absolute bg-white left-4 top-9.5 -translate-y-5 text-black text-[14px] transition-all px-2
                    peer-valid:top-2 peer-valid:text-black 
                    peer-focus:top-2 peer-focus:text-[#2541CD] peer-focus:px-4"
                >
                  Last Name
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                required
                className="peer w-full h-[55px] ring-2 ring-black rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
              />
              <label
                htmlFor="email"
                className="absolute bg-white left-4 top-9.5 -translate-y-5 text-black text-[14px] transition-all px-2
                  peer-valid:top-2 peer-valid:text-black 
                  peer-focus:top-2 peer-focus:text-[#2541CD] peer-focus:px-4"
              >
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                type="password"
                id="password"
                required
                className="peer w-full h-[55px] ring-2 ring-black rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
              />
              <label
                htmlFor="password"
                className="absolute bg-white left-4 top-9.5 -translate-y-5 text-black text-[14px] transition-all px-2
                  peer-valid:top-2 peer-valid:text-black 
                  peer-focus:top-2 peer-focus:text-[#2541CD] peer-focus:px-4"
              >
                Password
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="cursor-pointer w-full h-[55px] text-black text-[20px] hover:text-white font-[600] ring-2 ring-black rounded-[20px] flex justify-center items-center hover:bg-[#2541CD] transition"
            >
              Sign Up
            </button>

            {/* Sign In Redirect */}
            <div>
              <p>
                Have an account?{" "}
                <span>
                  <a href="#" className="underline hover:text-[#2541CD]">
                    Sign In
                  </a>
                </span>
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-[2px] bg-black flex justify-center items-center relative">
              <p className="relative top-1/2 w-[50px] bg-white text-center absolute -top-2 px-1">
                or
              </p>
            </div>

            {/* Connect */}
            <button
              type="submit"
              className="cursor-pointer w-full h-[55px] text-black text-[20px] hover:text-white font-[600] ring-2 ring-black rounded-[20px] flex justify-center items-center hover:bg-[#2541CD] transition"
            >
              Connect With \
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
