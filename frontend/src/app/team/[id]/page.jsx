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

  if (loading) return <p>Loading team...</p>;
  if (!team) return <p>Team not found.</p>;

  const currentUserId = getCurrentUserId();
  const isLeader = currentUserId && team.leader.id === parseInt(currentUserId);

  console.log("Debug Info:", {
    teamLeaderId: team.leader.id,
    currentUserId,
    isLeader,
    token: getAccessToken(),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{team.name}</h1>
      <p className="mb-2">Competition: {team.competition?.name || "N/A"}</p>
      <p className="mb-6">
        Leader: {team.leader.first_name} {team.leader.last_name}
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Members</h2>
        <ul className="space-y-2">
          {team.members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                {member.first_name} {member.last_name}
                {member.id === team.leader.id && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Leader
                  </span>
                )}
              </div>
              {isLeader && member.id !== team.leader.id && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isLeader && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-3">Add New Member</h3>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member's email"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Member
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-500">{success}</p>}
    </div>
  );
}
