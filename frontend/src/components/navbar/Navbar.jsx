"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/CompVerse-logo.svg";
import MiniNavbar from "./MiniNavbar";
import { useRouter } from "next/navigation";
import { CircleUser } from "lucide-react";
import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");

      if (!accessToken) return;

      try {
        const res = await fetch("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Session expired. Please sign in again");
      }

      const res = await fetch(
        `http://localhost:8000/api/users/${profile.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            profile_picture: `${publicUrl}?t=${Date.now()}`,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Error: ${error.message || "Failed to upload image"}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        return;
      }

      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        try {
          const response = await fetch("http://localhost:8000/api/users/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const profile = await response.json();
            setUser(profile);
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setUser(null);
          }
        } catch (error) {
          console.error("JWT validation failed:", error);
        }
      }
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
    router.push("/auth");
  };

  return (
    <div
      id="Nav"
      className="nav w-full h-[60px] md:h-[80px] lg:h-[100px] flex fixed z-50"
    >
      <div className="w-screen h-full relative flex flex-row justify-between bg-[#030210]">
        <div className="pl-[30px] pl-[20px] md:pl-[70px] lg:pl-[60px] flex justify-start items-center">
          <Link href="/ui/home" className="flex items-center">
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
          {!user ? (
            <>
              <Link
                href="/auth"
                className="flex justify-center items-center w-[140px] xl:w-[150px] h-[45px] xl:h-[50px] text-[18px] xl:text-[20px] font-medium text-white rounded-[20px] hover:ring-1 hover:ring-[#2541CD] transition-all duration-300 ease-in-out hover:shadow-[10px_10px_33px_#121212,#2541CD_0px_0px_30px_5px] hover:scale-95"
              >
                Sign In
              </Link>
              <Link
                href="/auth?form=signup"
                className="flex justify-center items-center w-[120px] lg:w-[140px] xl:w-[150px] h-[40px] lg:h-[45px] xl:h-[50px] text-[15px] lg:text-[18px] xl:text-[20px] font-medium text-white rounded-[20px] ring-1 ring-white hover:ring-[#2541CD] transition-all duration-300 ease-in-out hover:shadow-[10px_10px_33px_#121212,#2541CD_0px_0px_30px_5px] hover:scale-95"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="w-full flex justify-end items-center gap-4 p-4">
              <Link
                href="/ui/profile"
                className="text-white hover:text-[#2541CD] transition duration-300 ease-in-out"
              >
                {profile.profile_picture ? (
                  <div className="w-11 h-11 rounded-full ring-2 ring-white hover:ring-[#2541CD] overflow-hidden">
                    <Image
                      src={profile.profile_picture || "test"}
                      alt="Profile"
                      width={30}
                      height={30}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CircleUser className="stroke-1 w-13 h-13" />
                  </div>
                )}
              </Link>

              <div
                onClick={handleLogout}
                className="group cursor-pointer px-3 py-3 rounded-full border-2 border-white hover:border-[#2541CD] transition duration-300 ease-in-out"
              >
                <LogOut className="w-5 h-5 text-white stroke-3 group-hover:text-[#2541CD]" />
              </div>
            </div>
          )}
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
