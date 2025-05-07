"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { MenuButton } from "./MenuButton";

export const Navigation = ({ isOpen, closeSidebar }) => {
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
    { label: "Competition", link: "#competition" },
    { label: "Team’s Up", link: "#teams" },
  ];
  const MenuButtons = [
    { label: "Sign In", link: "/auth" },
    { label: "Sign Up", link: "/auth?form=signup" },
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
        {MenuButtons.map((item, i) => (
          <div
            key={i}
            variants={itemVariants}
            className="cursor-pointer h-[100px] w-full flex items-center justify-center"
          >
            <MenuButton i={i} label={item.label} link={item.link} />
          </div>
        ))}
      </motion.ul>
    </div>
  );
};
