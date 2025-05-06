"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/CompVerse-logo.svg";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full h-[80px] flex justify-between items-center px-4 sm:px-8 lg:px-16 bg-white shadow-md">
      <Link href="/" className="flex items-center">
        <Image
          src={Logo}
          alt="CompVerse Logo"
          className="w-[120px] sm:w-[150px] h-auto"
        />
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/auth"
          className="px-4 py-2 text-sm sm:text-base font-medium text-[#2541CD] hover:text-white hover:bg-[#2541CD] rounded-lg transition duration-300"
        >
          Sign In
        </Link>
        <Link
          href="/auth?form=signup"
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-[#2541CD] hover:bg-[#1a2f9a] rounded-lg transition duration-300"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
