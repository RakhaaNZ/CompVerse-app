"use client";

import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import "./globals.css";

import Navbar from "../components/navbar/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {!isAuthPage && !isDashboardPage && (
          <>
            <Navbar />
            <main className="pt-[60px] md:pt-[80px] lg:pt-[100px]">
              {children}
            </main>
          </>
        )}

        {(isAuthPage || isDashboardPage) && children}
      </body>
    </html>
  );
}
