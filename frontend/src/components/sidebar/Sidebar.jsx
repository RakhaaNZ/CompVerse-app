"use client"

import Link from "next/link"
import { supabase } from "../../lib/supabaseClient"
import { usePathname } from "next/navigation"
import { BarChart2, Clock, LayoutDashboard, LogOut } from "lucide-react"
import Image from "next/image"

export default function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    window.location.href = "/"
  }

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "History", href: "/dashboard/history", icon: <Clock size={18} /> },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart2 size={18} />,
    },
    {
      name: "Logout",
      onClick: handleLogout,
      icon: <LogOut size={18} />,
    },
  ]

  return (
    <aside
      className="w-64 h-205 border border-gray-200 px-6 py-8 shadow-sm mt-5 ml-5 mb-3 rounded-4xl text-white backdrop-blur"
      style={{ backgroundColor: "rgba(25, 27, 67, 0.7)" }}
    >
      <div className="flex items-center gap-3 mb-10">
        <Image src="/CompVerse-logo.svg" alt="logo" width={300} height={300} />
      </div>
      <nav className="space-y-2">
        {menu.map((item) =>
          item.href ? (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2 rounded-xl font-medium transition-colors ${
                pathname === item.href
                  ? "bg-blue-400 text-white rounded-l"
                  : "hover:bg-gray-100 hover:text-black rounded-l"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ) : (
            <button
              key={item.name}
              onClick={item.onClick}
              className="flex items-center gap-3 px-5 py-2 rounded-xl font-medium transition-colors hover:bg-gray-100 hover:text-black rounded-l w-full text-left"
            >
              {item.icon}
              {item.name}
            </button>
          )
        )}
      </nav>
    </aside>
  )
}
