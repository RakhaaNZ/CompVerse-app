"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

export default function RegistrationModal({
  competition,
  onClose,
  onRegistered,
}) {
  const [mode, setMode] = useState(
    competition.is_team_based ? "choose" : "individual"
  );
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [createName, setCreateName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || localStorage.getItem("access_token");
  };

  useEffect(() => {
    if (mode === "find") {
      fetchTeams();
    }
  }, [mode]);

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `http://localhost:8000/api/teams/?competition=${competition.id}&is_looking_for_members=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleIndividualRegistration = async () => {
    try {
      setBusy(true);
      setError(null);

      const token = await getAccessToken();
      const res = await fetch(`http://localhost:8000/api/registrations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          competition_id: competition.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Registration error:", errorData); // Debug log
        throw new Error(
          errorData.detail || errorData.error || "Registration failed"
        );
      }

      const data = await res.json();
      console.log("Registration success:", data); // Debug log

      alert("Successfully registered for the competition!");
      onClose();
      if (onRegistered) onRegistered();
    } catch (err) {
      console.error("Registration failed:", err); // Debug log
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleJoinTeam = async () => {
    try {
      if (!selectedTeamId) {
        setError("Please select a team first");
        return;
      }

      setBusy(true);
      setError(null);

      const token = await getAccessToken();
      const res = await fetch(
        `http://localhost:8000/api/teams/${selectedTeamId}/join/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.error?.includes("already registered")) {
          setError("You're already registered for this competition");
        } else {
          setError(errorData.error || "Failed to join team");
        }
        return;
      }

      alert("Successfully joined team!");
      onClose();
      onRegistered();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      setBusy(true);
      const token = await getAccessToken();

      // 1. Create team
      const teamRes = await fetch(`http://localhost:8000/api/teams/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_name: createName,
          competition_id: competition.id,
        }),
      });

      const teamData = await teamRes.json();
      if (!teamRes.ok)
        throw new Error(teamData.error || "Failed to create team");

      alert("Team created and registered successfully!");
      onClose();
      onRegistered();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const [inviteEmails, setInviteEmails] = useState([""]);

  const handleAddEmailField = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl">
      <div className="max-w-2xl w-full bg-gradient-to-b from-black/30 to-[#2541CD]/80  rounded-2xl p-6 text-white border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-[#2541CD]">
              CompVerse
            </h2>
            <h3 className="text-xl font-semibold mt-1">
              Register : {competition.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!competition.is_team_based ? (
          // Individual competition registration
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
            <p className="mb-6 text-white/80">
              This is an individual competition. Click below to register.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleIndividualRegistration}
                disabled={busy}
                className="px-8 py-3 bg-gradient-to-r from-[#2541CD] to-blue-600 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center"
              >
                {busy ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register Now"
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-400/20 text-red-100 rounded-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>
        ) : mode === "choose" ? (
          // Team competition - choose mode
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
              onClick={() => setMode("find")}
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-[#2541CD]/20 flex items-center justify-center text-[#2541CD] group-hover:text-blue-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Find Team</h3>
              <p className="text-sm text-white/70">
                Browse teams that are looking for members and request to join.
              </p>
            </div>
            <div
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
              onClick={() => setMode("create")}
            >
              <div className="w-12 h-12 mb-4 rounded-lg bg-[#2541CD]/20 flex items-center justify-center text-[#2541CD] group-hover:text-blue-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Create Team</h3>
              <p className="text-sm text-white/70">
                Create a new team and become its leader. You will be registered
                automatically.
              </p>
            </div>
          </div>
        ) : mode === "find" ? (
          // Find team mode
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setMode("choose")}
              className="flex items-center text-sm text-white/70 hover:text-white mb-4 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to options
            </button>

            {loadingTeams ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2541CD]"></div>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/70 mb-4">No open teams found.</p>
                <button
                  onClick={() => setMode("create")}
                  className="px-4 py-2 bg-[#2541CD] rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Create a team instead
                </button>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold mb-4 text-lg">
                  Teams Looking for Members
                </h4>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {teams.map((t) => (
                    <li
                      key={t.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#2541CD]/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold">{t.name}</div>
                          <div className="text-sm text-white/70 mt-1">
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              {t.leader?.first_name} {t.leader?.last_name}{" "}
                              (Leader)
                            </span>
                            <span className="flex items-center mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {t.members?.length ?? 0}/
                              {t.competition.max_participants} members
                            </span>
                          </div>
                        </div>
                        <button
                          disabled={busy}
                          onClick={() => {
                            setSelectedTeamId(t.id);
                            handleJoinTeam();
                          }}
                          className="px-4 py-2 rounded-lg bg-[#2541CD] hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                        >
                          {busy && selectedTeamId === t.id ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Joining...
                            </>
                          ) : (
                            "Join Team"
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // Create team mode
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setMode("choose")}
              className="flex items-center text-sm text-white/70 hover:text-white mb-4 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to options
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Name
                </label>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Enter your team name"
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Invite Members
                </label>
                {inviteEmails.map((email, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder={`member${index + 1}@example.com`}
                      className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#2541CD]"
                    />
                    {index > 0 && (
                      <button
                        onClick={() =>
                          setInviteEmails(
                            inviteEmails.filter((_, i) => i !== index)
                          )
                        }
                        className="ml-2 p-2 text-red-400 hover:text-red-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddEmailField}
                  className="text-sm text-[#2541CD] hover:text-blue-400 flex items-center mt-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add another member
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  disabled={busy || !createName}
                  onClick={handleCreateTeam}
                  className="px-6 py-3 bg-gradient-to-r from-[#2541CD] to-blue-600 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center"
                >
                  {busy ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create & Register"
                  )}
                </button>
                <button
                  onClick={() => setMode("choose")}
                  className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-400/20 text-red-100 rounded-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
