"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Landing from "./landing";

const HomePage = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const landingRef = useRef(null);
  const nextSectionRef = useRef(null);
  const controls = useAnimation();

  const scrollToSection = (sectionRef) => {
    if (isScrolling) return;

    setIsScrolling(true);
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
    });

    setTimeout(() => setIsScrolling(false), 500);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      const landingTop = landingRef.current.getBoundingClientRect().top;
      const nextSectionTop = nextSectionRef.current.getBoundingClientRect().top;

      if (e.deltaY > 0 && Math.abs(landingTop) < window.innerHeight / 2) {
        scrollToSection(nextSectionRef);
        controls.start({
          y: [0, 20, 0],
          opacity: [1],
          transition: { duration: 1 },
        });
      } else if (
        e.deltaY < 0 &&
        Math.abs(nextSectionTop) < window.innerHeight / 2
      ) {
        scrollToSection(landingRef);
        controls.start({
          y: [0, -20, 0],
          opacity: [1],
          transition: { duration: 1 },
        });
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isScrolling, controls]);

  const handleScrollDown = () => {
    scrollToSection(nextSectionRef);
    controls.start({
      y: [0, 20, 0],
      opacity: [1],
      transition: { duration: 1 },
    });
  };

  return (
    <div className="scroll-smooth relative overflow-hidden  bg-[#030210] ">
      <motion.section
        ref={landingRef}
        id="landing"
        className="h-screen flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={controls}
      >
        <Landing onScrollDown={handleScrollDown} />
      </motion.section>

      <motion.section
        ref={nextSectionRef}
        id="next-section"
        className="h-screen flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={controls}
      >
        <div></div>
      </motion.section>
    </div>
  );
};

export default HomePage;
