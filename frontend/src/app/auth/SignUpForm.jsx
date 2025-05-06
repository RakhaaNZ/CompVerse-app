import React from "react";
import Image from "next/image";
import BG2 from "../../../public/auth-assets/bg2-signup.png";
import Logo from "../../../public/CompVerse-logo.svg";
import { motion } from "framer-motion";

export default function SignUpForm({ toggle }) {
  return (
    <section
      id="SignUp"
      className="w-full h-full overflow-hidden flex justify-center items-center"
    >
      <div className="relative z-10 w-full h-full flex flex-row p-[10px]">
        <motion.div
          key="signup"
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 1, x: -1000 }}
          transition={{ duration: 0.6, type: "spring", delay: 0.3 }}
          className="hidden lg:flex relative z-10 w-[60%] h-full "
        >
          <div className="hidden lg:block relative w-full rounded-[38px] overflow-hidden px-6 py-4">
            <Image
              src={BG2}
              alt="Background"
              className="absolute inset-0 w-full h-full "
            />

            <div className="relative z-10 flex flex-row justify-between items-center px-4">
              <Image src={Logo} alt="Logo" className="w-[200px] h-[60px]" />
              <div className="text-white text-[20px] font-[400] h-[50px] items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className="py-3 px-10 rounded-[20px] border-white border-[1px] rounded-[20px] cursor-pointer"
                    onClick={toggle}
                  >
                    <p>Sign In</p>
                  </div>
                </motion.button>
              </div>
            </div>

            <div className="relative z-10 text-white h-[93%] flex justify-start items-end">
              <h1 className="pl-[12px] text-left text-[40px] w-[80%] xl:w-[75%] font-bold text-white drop-shadow-[0px_0px_7px_rgba(255,255,255,1)]">
                Explore, Compete, Achieve!
              </h1>
            </div>
          </div>
        </motion.div>

        <motion.div
          key="signinForm"
          initial={{ opacity: 0, x: 1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 1, x: 1000 }}
          transition={{ duration: 0.6, type: "spring", delay: 0.3 }}
          className="relative w-full lg:w-[40%] h-full flex items-center justify-center"
        >
          <form className="flex flex-col w-full lg:w-[90%] justify-center items-center gap-4 sm:gap-[24px] p-4 sm:p-8 lg:p-0">
            {/* Title */}
            <div className="text-black text-[22px] sm:text-[26px] lg:text-[32px] font-[500] mb-[20px] sm:mb-[50px]">
              <h1>Create an Account</h1>
            </div>

            {/* Name Fields */}
            <div className="w-full flex flex-col sm:flex-row justify-between gap-4 sm:gap-8">
              {/* First Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="first-name"
                  required
                  className="text-[14px] sm:text-[18px] peer w-full h-[44px] sm:h-[55px] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
                />
                <label
                  htmlFor="first-name"
                  className="absolute bg-white left-4 top-7.5 sm:top-9.5 -translate-y-4 sm:-translate-y-5 text-black text-[10px] sm:text-[14px] transition-all px-2
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
                  className="text-[14px] sm:text-[18px] peer w-full h-[44px] sm:h-[55px] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
                />
                <label
                  htmlFor="last-name"
                  className="absolute bg-white left-4 top-7.5 sm:top-9.5 -translate-y-4 sm:-translate-y-5 text-black text-[10px] sm:text-[14px] transition-all px-2
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
                className="text-[14px] sm:text-[18px] peer w-full h-[44px] sm:h-[55px] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
              />
              <label
                htmlFor="email"
                className="absolute bg-white left-4 top-7.5 sm:top-9.5 -translate-y-4 sm:-translate-y-5 text-black text-[10px] sm:text-[14px] transition-all px-2
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
                className="text-[14px] sm:text-[18px] peer w-full h-[44px] sm:h-[55px] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] px-4 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
              />
              <label
                htmlFor="password"
                className="absolute bg-white left-4 top-7.5 sm:top-9.5 -translate-y-4 sm:-translate-y-5 text-black text-[10px] sm:text-[14px] transition-all px-2
                  peer-valid:top-2 peer-valid:text-black 
                  peer-focus:top-2 peer-focus:text-[#2541CD] peer-focus:px-4"
              >
                Password
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-[55px]"
              type="submit"
            >
              <div className="cursor-pointer w-full h-[44px] sm:h-[55px] text-black text-[16px] md:text-[18px] lg:text-[20px] text-white lg:text-black hover:text-white font-[500] sm:font-[600] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] flex justify-center items-center hover:bg-[#2541CD] bg-[#2541CD] lg:bg-transparent transition">
                Sign Up
              </div>
            </motion.button>

            <div className="text-[12px] sm:text-[16px]">
              <p>
                Have an account?{" "}
                <span>
                  <a
                    className="underline text-[#2541CD] cursor-pointer"
                    onClick={toggle}
                  >
                    Sign In
                  </a>
                </span>
              </p>
            </div>

            <div className="w-full h-[1px] md:h-[2px] bg-black flex justify-center items-center relative">
              <p className="relative top-1/2 w-[50px] bg-white text-center absolute -top-2 px-1">
                or
              </p>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full h-[44px] sm:h-[55px] text-black text-[16px] md:text-[18px] lg:text-[20px] text-white lg:text-black hover:text-white font-[500] sm:font-[600] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] flex justify-center items-center hover:bg-[#2541CD] bg-[#2541CD] lg:bg-transparent transition"
            >
              Connect With \
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
