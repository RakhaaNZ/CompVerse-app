"use client"

import { usePathname } from "next/navigation"
import Sidebar from "../../components/sidebar/Sidebar"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
