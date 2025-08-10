"use client"

import { useEffect, useState } from "react"
import BGCard from "../../../public/teams-assets/teamsbg.png"
import BTN from "../../components/motion/btn"
import Image from "next/image"
import Link from "next/link"

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [competitions, setCompetitions] = useState({})
  const [loading, setLoading] = useState(true)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [teamsRes, compsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/teams/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/competitions/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!teamsRes.ok)
          throw new Error(`Teams fetch failed: ${teamsRes.status}`)
        if (!compsRes.ok)
          throw new Error(`Competitions fetch failed: ${compsRes.status}`)

        const teamsData = await teamsRes.json()
        const compsData = await compsRes.json()

        const compMap = compsData.reduce((acc, comp) => {
          acc[comp.id] = {
            title: comp.title,
            category: comp.category,
            poster: comp.poster_competition || null,
          }
          return acc
        }, {})

        setTeams(teamsData)
        setCompetitions(compMap)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (loading) return <div className="p-6 text-center">Loading...</div>

  if (!token) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold drop-shadow-[0px_0px_5px_#FF7272]">
        To See Teams Please Create Your Account
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {teams.length === 0 ? (
        <p className="text-gray-500">No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {teams.map((team) => {
            const isObject = typeof team.competition === "object"

            const compTitle = isObject
              ? team.competition.title
              : competitions[team.competition]?.title

            const compCategory = isObject
              ? team.competition.category
              : competitions[team.competition]?.category

            const compPoster = isObject
              ? team.competition.poster_competition
              : competitions[team.competition]?.poster

            return (
              <div
                key={team.id}
                className="relative flex flex-col overflow-hidden min-h-[350px] min-w-[400px] border rounded-xl"
              >
                <div className="absolute inset-0">
                  <Image
                    src={BGCard}
                    alt="BG"
                    fill
                    className="object-cover z-0"
                  />
                </div>

                <div className="p-4 text-white relative z-10">
                  <div className="w-full h-[180px] flex flex-col text-gray-500 bg-gray-200 rounded-xl">
                    {compPoster ? (
                      <img
                        src={compPoster}
                        alt="poster"
                        className="w-full h-[180px] object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = ""
                        }}
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-lg font-bold pt-5">{team.name}</h2>

                  {/* Description */}
                  <div className="pt-5">Description</div>
                  <div className="text-gray-500 text-xs">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry...
                  </div>

                  {/* Leader */}
                  <div className="pt-10 pb-5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-400 pb-5">
                      <div className="overflow-hidden rounded-3xl h-[50px] w-[50px] bg-gray-200 flex items-center justify-center">
                        {team.leaderImage ? (
                          <img
                            src={team.leaderImage}
                            alt={`${team.leader?.first_name || ""} ${
                              team.leader?.last_name || ""
                            }`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No Img</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white">
                          Leader: {team.leader?.first_name}{" "}
                          {team.leader?.last_name}
                        </p>
                        <p className="text-xs">Field of Study</p>
                        <p className="text-xs">Institution/Company</p>
                        <p className="text-xs">Age</p>
                      </div>
                    </div>

                    {/* Members */}
                    {team.members?.length > 0 ? (
                      team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 border-b border-gray-400 pb-5"
                        >
                          <div className="overflow-hidden rounded-3xl h-[50px] w-[50px] bg-gray-200 flex items-center justify-center">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={`${member.first_name} ${member.last_name}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-500">
                                No Img
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-white">
                              Member: {member.first_name} {member.last_name}
                            </p>
                            <p className="text-xs">Field of Study</p>
                            <p className="text-xs">Institution/Company</p>
                            <p className="text-xs">Age</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs">No members found</p>
                    )}
                  </div>

                  {/* Competition info */}
                  <div className="pt-5 grid grid-cols-2">
                    <div>
                      <p className="text-lg font-medium text-white mt-2">
                        {compTitle || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {compCategory || "Unknown"}
                      </p>
                    </div>
                    <div className="flex pl-5 pt-5">
                      <Link
                        href={`/ui/detail-competition/${
                          isObject ? team.competition.id : team.competition
                        }`}
                      >
                        <button className="relative h-10 text-sm px-5 rounded-xl border border-white text-white overflow-hidden group cursor-pointer hover:border-blue-600">
                          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                            See Detail
                          </span>
                          <span className="absolute inset-0 bg-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="flex justify-center items-center align-top pt-15">
                    <BTN>Purpose</BTN>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
