"use client"

import { useEffect, useState } from "react"
import BGCard from "../../../public/teams-assets/teamsbg.png"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const BTN = ({ children, onClick, disabled }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-[150px] h-[40px] rounded-[15px] flex items-center justify-center text-white text-[15px] ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#1C2F91] cursor-pointer hover:bg-[#2541CD]"
      } transition-colors duration-200`}
    >
      {children}
    </motion.button>
  )
}

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [competitions, setCompetitions] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  const [busyTeamId, setBusyTeamId] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    // Get user data from localStorage safely
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setCurrentUser(JSON.parse(userData))
      }
    } catch (err) {
      console.error("Failed to parse user data:", err)
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
            description: comp.description,
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

  const handleJoinTeam = async (teamId) => {
    if (!token || !currentUser) {
      alert("Please log in first.")
      return
    }

    setBusyTeamId(teamId)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(
        `http://localhost:8000/api/teams/${teamId}/join/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        let errorMsg = "Failed to join team"

        if (errorData.error?.includes("already registered")) {
          errorMsg = "You're already registered for this competition"
        } else if (errorData.error?.includes("already a member")) {
          errorMsg = "You're already a member of this team"
        } else if (errorData.error) {
          errorMsg = errorData.error
        }

        setError(errorMsg)
        return
      }

      setSuccessMessage("Successfully joined the team!")

      // Update the team's members list in the UI without reloading
      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              members: [
                ...(team.members || []),
                {
                  id: currentUser.id,
                  first_name: currentUser.first_name,
                  last_name: currentUser.last_name,
                  image: currentUser.profile_picture || null,
                },
              ],
            }
          }
          return team
        })
      )
    } catch (err) {
      setError(err.message || "Error joining team")
    } finally {
      setBusyTeamId(null)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  if (!token) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold drop-shadow-[0px_0px_5px_#FF7272]">
        To See Teams Please Create Your Account
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {teams.length === 0 ? (
        <p className="text-gray-500">No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-30 items-start">
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
            const compDescription = isObject
              ? team.competition.description
              : competitions[team.competition]?.description

            const isMember =
              currentUser &&
              (team.members?.some((member) => member.id === currentUser.id) ||
                team.leader?.id === currentUser.id)

            return (
              <div
                key={team.id}
                className="relative flex flex-col overflow-hidden min-h-[350px] min-w-[400px] h-auto border rounded-xl"
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
                        className="w-full h-[180px] object-cover rounded-xl"
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

                  <div className="pb-2 pt-5">Description</div>
                  <div className="text-gray-500 text-xs">{compDescription}</div>

                  <div className="flex items-center gap-4 border-b border-gray-400 pb-5 pt-10">
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

                  {team.members?.length > 0 ? (
                    team.members
                      .filter((member) => member.id !== team.leader?.id)
                      .map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 border-b border-gray-400 pb-5 pt-5"
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
                    <div className="flex justify-center items-center align-top pt-15">
                      <BTN
                        onClick={() => handleJoinTeam(team.id)}
                        disabled={
                          busyTeamId === team.id || isMember || !currentUser
                        }
                      >
                        {busyTeamId === team.id
                          ? "Processing..."
                          : isMember
                          ? "Already Joined"
                          : "Purpose"}
                      </BTN>
                    </div>
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
