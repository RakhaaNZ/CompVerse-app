"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// export const metadata = {
//   title: "CompVerse",
//   description: "Step Into the Universe of Competitions.",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {!isAuthPage && <Navbar />}
        {children}
      </body>
    </html>
  );
}
