"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function HistoryPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token")

      try {
        const res = await fetch("http://127.0.0.1:8000/api/competitions/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch competitions")

        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Error fetching competitions:", err)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 5000)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLottieReact
          src="https://lottie.host/afd9163d-713b-4b31-8f06-2236827ce447/xbaGGksnLJ.lottie"
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
      </div>
    )
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="relative bg-white rounded-2xl border-2 border-gray-300 hover:border-blue-500 shadow-md hover:shadow-xl transition duration-500 overflow-visible group w-full h-[300px] cursor-pointer"
          onClick={() => router.push(`/dashboard/history/edit/${item.id}`)}
        >
          <div className="h-40 overflow-hidden rounded-t-2xl">
            {item.poster_competition ? (
              <img
                src={item.poster_competition}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="p-4 grid gap-1 text-black">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {item.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.start_date} → {item.end_date}
            </p>
          </div>
          <button
            className="absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/dashboard/history/edit/${item.id}`)
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  )
}
