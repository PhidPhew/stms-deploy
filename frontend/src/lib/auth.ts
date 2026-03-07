import axios from "./axios"

export async function getCurrentUser() {
  try {
    const res = await axios.get("/api/auth/me")
    return res.data.user
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function setToken(token: string): void {
  localStorage.setItem("token", token)
}

export function removeToken(): void {
  localStorage.removeItem("token")
}