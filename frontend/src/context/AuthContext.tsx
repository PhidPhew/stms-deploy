"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { setToken, removeToken, getCurrentUser } from "@/lib/auth"

type User = {
  id: string | number
  email: string
  role: string
  name?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u ?? null))
      .finally(() => setLoading(false))
  }, [])

  function login(token: string, newUser: User) {
    setToken(token)
    setUser(newUser)
  }

  function logout() {
    removeToken()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
