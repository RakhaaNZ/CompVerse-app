import React from "react";
import Image from "next/image";
import LogoCompVerse from "../../../public/CompVerse-logo.svg";

export default function Navbar() {
  return (
    <Navbar>
      <div>
        <Image
          src={LogoCompVerse}
          alt="CompVerse Logo"
          // className="w-[30px] h-[30px]"
        />
      </div>

      <div></div>
    </Navbar>
  );
}
