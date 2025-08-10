"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { MenuButton } from "./MenuButton";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export const Navigation = ({ isOpen, closeSidebar }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const menuItems = [
    { label: "Competition", link: "/ui/home#competition" },
    { label: "Teams", link: "/ui/teams" },
  ];
  const MenuButtons = [
    { label: "Sign In", link: "/auth" },
    { label: "Sign Up", link: "/auth?form=signup" },
  ];
  const MenuButtonsAuth = [
    { label: "Profile", link: "/ui/profile" },
    { label: "LogOut", link: "/auth" },
  ];

  const containerVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5,
      },
    },
    closed: {
      opacity: 0,
      y: 50,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    closed: { opacity: 0, y: 50, transition: { duration: 0.3 } },
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
    <div className="relative flex flex-col h-full w-full">
      <motion.ul
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        className="relative flex flex-col items-center justify-center h-full w-full gap-[20px]"
      >
        {menuItems.map((item, i) => (
          <div key={i} variants={itemVariants} className="cursor-pointer">
            <MenuItem
              i={i}
              label={item.label}
              link={item.link}
              closeSidebar={closeSidebar}
            />
          </div>
        ))}
      </motion.ul>
      <motion.ul
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        className="relative flex flex-row items-end justify-center h-[100px] w-full bg-[#030210] md:hidden"
      >
        {!user ? (
          <>
            {MenuButtons.map((item, i) => (
              <div
                key={i}
                variants={itemVariants}
                className="cursor-pointer h-[100px] w-full flex items-center justify-center"
              >
                <MenuButton i={i} label={item.label} link={item.link} />
              </div>
            ))}
          </>
        ) : (
          <>
            {MenuButtonsAuth.map((item, i) => (
              <div
                key={i}
                variants={itemVariants}
                className="cursor-pointer h-[100px] w-full flex items-center justify-center"
              >
                <MenuButton i={i} label={item.label} link={item.link} />
              </div>
            ))}
          </>
        )}
      </motion.ul>
    </div>
  );
};
