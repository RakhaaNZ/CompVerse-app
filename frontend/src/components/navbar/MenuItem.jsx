import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const variants = {
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

const colors = ["#fff", "#fff"];

export const MenuItem = ({ label, i, link, closeSidebar }) => {
  const style = { border: `2px solid ${colors[i]}` };

  const handleClick = () => {
    closeSidebar();
  };

  return (
    <Link href={link} onClick={handleClick} passHref>
      <motion.li
        variants={variants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="h-10 w-40 rounded bg-[#EEEEEE] flex items-center justify-center rounded-lg hover:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#F7F7F7,0_0_15px_#F7F7F7,0_0_30px_#F7F7F7] cursor-pointer"
        style={style}
      >
        <h1 className="text-[16px] text-[#000] text-center font-bold">
          {label}
        </h1>
      </motion.li>
    </Link>
  );
};
