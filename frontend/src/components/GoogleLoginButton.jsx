"use client";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";
import GoogleIcon from "../../public/auth-assets/google-icon.png";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <button className="w-full h-[55px]" onClick={handleGoogleLogin}>
      <div className="cursor-pointer w-full h-[44px] sm:h-[55px] text-black text-[16px] md:text-[18px] lg:text-[20px] text-white lg:text-black hover:text-white font-[500] sm:font-[600] ring-1 sm:ring-2 ring-black rounded-[16px] sm:rounded-[20px] flex gap-4 justify-center items-center hover:bg-[#2541CD] bg-[#2541CD] lg:bg-transparent transition">
        <span>Continue with Google</span>
        <Image
          src={GoogleIcon}
          alt="Google Icon"
          className="w-[20px] sm:w-[30px] h-[20px] sm:h-[30px]"
        />
      </div>
    </button>
  );
}
