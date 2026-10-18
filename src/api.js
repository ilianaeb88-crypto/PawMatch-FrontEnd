// Talks to the PawMatch backend. The address comes from VITE_API_BASE_URL
// (set in Netlify, or in .env.local for local testing), e.g.
// https://pawmatch-backend-win6.onrender.com/api
const API = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(/\/+$/, "");
 
async function request(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${path}`);
  return response.json();
}
 
export async function getPets() {
  return (await request("/pets")).pets;
}
 
export async function getPet(id) {
  return (await request(`/pets/${encodeURIComponent(id)}`)).pet;
}