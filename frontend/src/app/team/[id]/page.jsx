"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function TeamDetailPage({ params }) {
  const { id } = use(params);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Dapatkan token dari localStorage
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  // Dapatkan user ID dari token atau localStorage
  const getCurrentUserId = () => {
    const token = getAccessToken();
    if (!token) return null;

    // Decode token untuk mendapatkan user ID (jika menggunakan JWT)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    } catch (e) {
      console.error("Failed to decode token:", e);
      return localStorage.getItem("userId");
    }
  };

  const fetchTeam = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/teams/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch team");
      }

      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const handleAddMember = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:8000/api/teams/${id}/add-member/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add member");
      }

      setEmail("");
      setSuccess("Member added successfully");
      setError("");
      fetchTeam();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setSuccess("");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:8000/api/teams/${id}/remove-member/${memberId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove member");
      }

      setSuccess("Member removed successfully");
      setError("");
      fetchTeam();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setSuccess("");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading team...</div>
      </div>
    );

  if (!team)
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-2xl">Team not found.</div>
      </div>
    );

  const currentUserId = getCurrentUserId();
  const isLeader = currentUserId && team.leader.id === parseInt(currentUserId);

  console.log("Debug Info:", {
    teamLeaderId: team.leader.id,
    currentUserId,
    isLeader,
    token: getAccessToken(),
  });

  return (
    <div className="min-h-screen bg-[#030210] text-white p-6">
      {/* Header Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-[#2541CD]">
          Your Team
        </h1>
        <h2 className="text-2xl font-semibold">{team.name}</h2>
        <div className="flex justify-center mt-4 space-x-4">
          <span className="px-3 py-1 bg-purple-800/20 rounded-full text-sm">
            {team.competition?.name || "N/A"}
          </span>
          <span className="px-3 py-1 bg-[#2541CD]/20 rounded-full text-sm">
            Leader: {team.leader.first_name} {team.leader.last_name}
          </span>
        </div>
      </header>

      {/* Members Section */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-white/20 pb-3">
          Team Members
        </h2>

        <ul className="space-y-3">
          {team.members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center p-4 bg-indigo-900/30 rounded-lg hover:bg-indigo-800/40 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2541CD] to-blue-500 flex items-center justify-center">
                  <span className="font-bold">
                    {member.first_name.charAt(0)}
                    {member.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {member.first_name} {member.last_name}
                  </p>
                  <p className="text-sm text-white/70">{member.email}</p>
                </div>
              </div>

              {isLeader && member.id !== team.leader.id && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}

              {member.id === team.leader.id && (
                <span className="px-2 py-1 text-xs bg-yellow-400/20 text-yellow-300 rounded-full">
                  Leader
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Member Section */}
      {isLeader && (
        <div className="max-w-3xl mx-auto mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Member</h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member's email"
              className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-[#2541CD] to-blue-500 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Add Member
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div className="max-w-3xl mx-auto mt-6">
        {error && (
          <div className="p-4 bg-red-400/20 text-red-100 rounded-lg flex items-center">
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

        {success && (
          <div className="p-4 bg-green-400/20 text-green-100 rounded-lg flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}
