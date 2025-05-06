"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignInForm";
import SignUp from "./SignUpForm";
import BG from "../../../public/auth-assets/bg-signup.png";
import Logo from "../../../public/CompVerse-logo.svg";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-[#CACACA] flex items-center justify-center px-[15px] sm:px-[60px]">
      <AnimatePresence mode="wait">
        {isSignIn ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: 2000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 1, x: 2000 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="absolute right-0 w-[1200px] lg:w-[100%] h-screen"
          >
            <div className="absolute scale-x-[-1] right-0 w-[1200px] lg:w-[70%] h-screen">
              <Image src={BG} alt="Background" className="w-full h-full" />
            </div>

            <div className="flex lg:hidden absolute top-2 sm:top-4 right-8">
              <Image
                src={Logo}
                alt="Logo"
                className="w-[100px] sm:w-[200px] h-[60px]"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: -2000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 1, x: -2000 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="absolute left-0 w-[1200px] lg:w-[100%] h-screen"
          >
            <div className="absolute left-0 w-[1200px] lg:w-[70%] h-screen">
              <Image src={BG} alt="Background" className="w-full h-full" />
            </div>

            <div className="flex lg:hidden absolute top-2 sm:top-4 left-8">
              <Image
                src={Logo}
                alt="Logo"
                className="w-[100px] sm:w-[200px] h-[60px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[1280px] h-[80%] min-h-[550px] sm:min-h-[600px] bg-white rounded-[40px] flex items-center justify-center ">
        <AnimatePresence mode="wait">
          {isSignIn ? (
            <motion.div key="signin" className="w-full h-full">
              <SignIn toggle={() => setIsSignIn(false)} />
            </motion.div>
          ) : (
            <motion.div key="signup" className="w-full h-full">
              <SignUp toggle={() => setIsSignIn(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
