const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCompetitions(filters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.category) queryParams.append("category", filters.category);
  if (filters.type) queryParams.append("type", filters.type);

  const res = await fetch(
    `${API_BASE_URL}/competitions/?${queryParams.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch competitions");
  return res.json();
}

export async function fetchCompetitionById(id) {
  const res = await fetch(`${API_BASE_URL}/competitions/${id}/`);
  if (!res.ok) throw new Error(`Failed to fetch competition ${id}`);
  return res.json();
}
