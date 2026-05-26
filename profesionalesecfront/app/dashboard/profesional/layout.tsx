"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProfesionalSidebar from "@/components/profesional/profesional-sidebar"
import ProfesionalMobileNav from "@/components/profesional/profesional-mobile-nav"
import Header from "@/components/header"
import { ProfesionalProvider } from "@/context/profesional-context"

type GuardState = "checking" | "allowed" | "blocked"

const PROFESIONAL_ROLE = "profesional"

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

export default function ProfesionalDashboardLayout({ children }: { children: ReactNode }) {
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

    if (!role || role !== PROFESIONAL_ROLE) {
      setGuardState("blocked")
      router.replace("/")
      return
    }

    if (exp && exp * 1000 < Date.now()) {
      logout()
      return
    }

    setGuardState("allowed")
  }, [router])

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
    <ProfesionalProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
        <Header />
        <ProfesionalSidebar />
        <ProfesionalMobileNav />
        <div className="lg:ml-[70px] transition-all duration-200">
          <main className="pt-20 pb-12 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProfesionalProvider>
  )
}
