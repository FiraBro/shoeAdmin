const API_BASE = "http://localhost:3000/api/v3/user";

const getToken = () => localStorage.getItem("token");

const headers = (auth = false) => ({
  "Content-Type": "application/json",
  ...(auth && {
    Authorization: `Bearer ${getToken()}`,
  }),
});

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

// Optional: example of a protected route
export const getProfile = async () => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "GET",
    headers: headers(true),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
};
