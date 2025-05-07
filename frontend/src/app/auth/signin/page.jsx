"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BG2 from "../../../../public/auth-assets/bg2-signup.png";
import Logo from "../../../../public/CompVerse-logo.svg";
import { motion } from "framer-motion";
import GoogleLoginButton from "../../../components/GoogleLoginButton";

export default function SignInForm({ toggle }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      router.push("/ui/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="SignUp"
      className="w-full h-full overflow-hidden flex justify-center items-center"
    >
      <div className="relative z-10 w-full h-full flex flex-row-reverse p-[10px]">
        <motion.div
          key="signin"
          initial={{ opacity: 0, x: 1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 1, x: 1000 }}
          transition={{ duration: 0.6, type: "spring", delay: 0.3 }}
          className="hidden lg:block relative w-[60%] rounded-[38px] overflow-hidden px-6 py-4"
        >
          <Image
            src={BG2}
            alt="Background"
            className="absolute scale-x-[-1] inset-0 w-full h-full "
          />

          <div className="relative z-10 flex flex-row-reverse justify-between items-center px-4">
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
                  <p>Sign Up</p>
                </div>
              </motion.button>
            </div>
          </div>

          <div className="relative z-10 text-white h-[93%] flex justify-end items-end">
            <h1 className="pr-[12px] text-right text-[40px] w-[80%] xl:w-[75%] font-bold text-white drop-shadow-[0px_0px_7px_rgba(255,255,255,1)]">
              Explore, Compete, Achieve!
            </h1>
          </div>
        </motion.div>

        <motion.div
          key="signinForm"
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 1, x: -1000 }}
          transition={{ duration: 0.6, type: "spring", delay: 0.3 }}
          className="relative w-full lg:w-[40%] h-full flex items-center justify-center"
        >
          <form
            onSubmit={handleLogin}
            className="flex flex-col w-full lg:w-[90%] justify-center items-center gap-4 sm:gap-[24px] p-4 sm:p-8 lg:p-0"
          >
            <div className="text-black text-[22px] sm:text-[26px] lg:text-[32px] font-[500] mb-[20px] sm:mb-[50px]">
              <h1>Welcome, Challenger!</h1>
            </div>

            <div className="relative w-full">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div className="relative w-full">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <button className="hidden lg:flex w-full h-[55px]" type="submit">
              <div className="cursor-pointer w-full h-[44px] sm:h-[55px] text-black text-[16px] md:text-[18px] lg:text-[20px] text-black hover:text-white font-[500] sm:font-[600] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] flex justify-center items-center hover:bg-gradient-to-r from-[#2541CD] via-[#000] to-[#2541CD] bg-transparent transition">
                {loading ? "Signin In..." : "Sign In"}
              </div>
            </button>
            <button className="lg:hidden w-full h-[55px]" type="submit">
              <div className="cursor-pointer w-full h-[44px] sm:h-[55px] text-black text-[16px] md:text-[18px] lg:text-[20px] text-white font-[500] sm:font-[600] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] flex justify-center items-center hover:bg-gradient-to-r from-[#2541CD] via-[#000] to-[#2541CD] bg-gradient-to-r from-[#2541CD] via-[#000] to-[#2541CD] transition">
                {loading ? "Signin In..." : "Sign In"}
              </div>
            </button>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}

            <div className="text-[12px] sm:text-[16px]">
              <p>
                Don’t have an account?{" "}
                <span>
                  <a
                    className="underline text-[#2541CD] cursor-pointer"
                    onClick={toggle}
                  >
                    Sign Up
                  </a>
                </span>
              </p>
            </div>

            <div className="w-full h-[1px] md:h-[2px] bg-black flex justify-center items-center relative">
              <p className="relative top-1/2 w-[50px] bg-white text-center absolute -top-2 px-1">
                or
              </p>
            </div>

            <GoogleLoginButton />
          </form>
        </motion.div>
      </div>
    </section>
  );
}
