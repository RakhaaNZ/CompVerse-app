const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCompetitions() {
  const res = await fetch(`${API_BASE_URL}/competitions/`);
  if (!res.ok) throw new Error("Failed to fetch competitions");
  return res.json();
}
