const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCompetitions() {
  const res = await fetch(`${API_BASE_URL}/competitions/`);
  if (!res.ok) throw new Error("Failed to fetch competitions");
  return res.json();
}

// export async function registerUser(form) {
//   const res = await fetch(`${API_BASE}/register/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(form),
//   });
//   if (!res.ok) throw await res.json();
//   return await res.json();
// }

// export async function loginUser(credentials) {
//   const response = await fetch(`${BASE_URL}/api/token/`, {
//     // <<< ini perbedaannya
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   });

//   if (!response.ok) {
//     throw new Error("Login failed");
//   }

//   return response.json(); // Akan mengembalikan access dan refresh token
// }

// export async function fetchProtected(endpoint, token) {
//   const res = await fetch(`${API_BASE}/${endpoint}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw await res.json();
//   return await res.json();
// }
