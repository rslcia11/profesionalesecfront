"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminMobileNav from "@/components/admin/admin-mobile-nav"
import Header from "@/components/header"

type GuardState = "checking" | "allowed" | "blocked"

const ADMIN_ROLES = ["superadmin", "moderador"]

function parseRoleFromToken(token: string): { role: string | null; exp: number | null } {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return { role: null, exp: null }

    const payload = JSON.parse(atob(parts[1]))
    return {
      role: payload?.rol ?? null,
      exp: payload?.exp ?? null,
    }
  } catch {
    return { role: null, exp: null }
  }
}

function logout() {
  localStorage.removeItem("auth_token")
  window.location.href = "/"
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [guardState, setGuardState] = useState<GuardState>("checking")

  useEffect(() => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      setGuardState("blocked")
      router.replace("/")
      return
    }

    const { role, exp } = parseRoleFromToken(token)

    if (!role || !ADMIN_ROLES.includes(role)) {
      setGuardState("blocked")
      router.replace("/")
      return
    }

    // If token is already expired, kick out immediately
    if (exp && exp * 1000 < Date.now()) {
      logout()
      return
    }

    setGuardState("allowed")
  }, [router])

  // Periodically check if the token has expired
  useEffect(() => {
    if (guardState !== "allowed") return

    const interval = setInterval(() => {
      const token = localStorage.getItem("auth_token")

      if (!token) {
        logout()
        return
      }

      const { exp } = parseRoleFromToken(token)

      if (exp && exp * 1000 < Date.now()) {
        logout()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [guardState])

  // Listen for storage changes (e.g., token removed in another tab)
  useEffect(() => {
    if (guardState !== "allowed") return

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "auth_token" && !event.newValue) {
        logout()
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [guardState])

  if (guardState !== "allowed") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <Header />
      <AdminSidebar />
      <AdminMobileNav />
      <div className="lg:ml-[70px] transition-all duration-200">
        <main className="pt-20 pb-12 px-4 lg:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}