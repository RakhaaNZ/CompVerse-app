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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Register: {competition.title}
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 rounded cursor-pointer"
          >
            Close
          </button>
        </div>

        {!competition.is_team_based ? (
          // Individual competition registration
          <div>
            <p className="mb-4">
              This is an individual competition. Click below to register.
            </p>
            <button
              onClick={handleIndividualRegistration}
              disabled={busy}
              className="px-4 py-2 bg-green-600 rounded"
            >
              {busy ? "Registering..." : "Register Now"}
            </button>
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </div>
        ) : mode === "choose" ? (
          // Team competition - choose mode
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-lg bg-white/6 cursor-pointer hover:bg-white/10"
              onClick={() => setMode("find")}
            >
              <h3 className="font-semibold">Find Team</h3>
              <p className="text-sm text-white/70">
                Browse teams that are looking for members and request to join.
              </p>
            </div>
            <div
              className="p-4 rounded-lg bg-white/6 cursor-pointer hover:bg-white/10"
              onClick={() => setMode("create")}
            >
              <h3 className="font-semibold">Create Team</h3>
              <p className="text-sm text-white/70">
                Create a new team and become its leader. You will be registered
                automatically.
              </p>
            </div>
          </div>
        ) : mode === "find" ? (
          // Find team mode
          <div>
            <button
              onClick={() => setMode("choose")}
              className="mb-3 text-sm underline"
            >
              ← Back
            </button>
            {loadingTeams ? (
              <p>Loading teams...</p>
            ) : teams.length === 0 ? (
              <p>No open teams found. You can create a team instead.</p>
            ) : (
              <div>
                <p className="mb-4 text-sm text-white/70">
                  These teams are looking for members:
                </p>
                <ul className="space-y-3">
                  {teams.map((t) => (
                    <li
                      key={t.id}
                      className="p-3 bg-white/6 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-white/70">
                          Leader: {t.leader?.first_name} {t.leader?.last_name}
                        </div>
                        <div className="text-sm text-white/70">
                          Members: {t.members?.length ?? 0}/
                          {t.competition.max_participants}
                        </div>
                        <div className="text-sm text-green-400 mt-1">
                          Accepting new members
                        </div>
                      </div>
                      <div>
                        <button
                          disabled={busy}
                          onClick={() => {
                            setSelectedTeamId(t.id);
                            handleJoinTeam();
                          }}
                          className="px-3 py-2 rounded bg-[#2541CD] hover:bg-[#1a36b5]"
                        >
                          {busy ? "Processing..." : "Join Team"}
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
          <div>
            <button
              onClick={() => setMode("choose")}
              className="mb-3 text-sm underline"
            >
              ← Back
            </button>
            <div className="space-y-3">
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Team name"
                className="w-full p-2 rounded bg-black/20"
              />

              {inviteEmails.map((email, index) => (
                <input
                  key={index}
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder={`Member email ${index + 1}`}
                  className="w-full p-2 rounded bg-black/20 mt-2"
                />
              ))}
              <button
                onClick={handleAddEmailField}
                className="text-sm underline mt-2"
              >
                + Add another email
              </button>

              <div className="flex gap-3">
                <button
                  disabled={busy}
                  onClick={handleCreateTeam}
                  className="px-4 py-2 bg-green-600 rounded"
                >
                  Create & Register
                </button>
                <button
                  onClick={() => setMode("choose")}
                  className="px-4 py-2 bg-white/10 rounded"
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-400 mt-2">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
