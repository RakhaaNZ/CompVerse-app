"use client";
import React, { useRef, useState } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimension";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
    backgroundColor: "#2541CD",
    opacity: 0.9,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      duration: 0.8,
    },
  }),
  closed: {
    clipPath: "circle(0px at calc(100% - 43px) 47px)",
    backgroundColor: "#F7F7F7",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      duration: 0.8,
    },
  },
};

export default function MainNavbar() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [showNavigation, setShowNavigation] = useState(false);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  const handleToggle = () => {
    if (!isOpen) {
      toggleOpen();
      setTimeout(() => setShowNavigation(true), 800);
    } else {
      setTimeout(() => setShowNavigation(false), 800);
      toggleOpen();
    }
  };

  const closeSidebar = () => {
    setTimeout(() => {
      setShowNavigation(false);
    }, 800);
    toggleOpen();
  };

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className={`fixed top-[-17px] md:top-[-9px] lg:top-0 right-0 w-full h-screen z-[100] scroll-none flex items-start overflow-hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        variants={sidebarVariants}
      />
      {showNavigation && (
        <Navigation isOpen={isOpen} closeSidebar={closeSidebar} />
      )}
      <MenuToggle toggle={handleToggle} />
    </motion.nav>
  );
}
