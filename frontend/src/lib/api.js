const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCompetitions() {
  const res = await fetch(`${API_BASE_URL}/competitions/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch competitions: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchCompetitionById(id) {
  const res = await fetch(`${API_BASE_URL}/competitions/${id}/`);
  if (!res.ok) throw new Error(`Failed to fetch competition ${id}`);
  return res.json();
}
