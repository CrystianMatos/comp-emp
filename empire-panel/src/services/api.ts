const BASE = "http://localhost:3000";

export type User = {
  id: string;
  email: string;
  credits: number;
  createdAt?: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

function token() {
  return localStorage.getItem("token");
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: token() ? { Authorization: `Bearer ${token()}` } : {},
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const data = await apiPost<LoginResponse>("/api/login", { email, password });
  localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}
