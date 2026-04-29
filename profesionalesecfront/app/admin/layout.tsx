"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type GuardState = "checking" | "allowed" | "blocked"

const ADMIN_ROLES = ["superadmin", "moderador"]

function parseRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))
    return payload?.rol ?? null
  } catch {
    return null
  }
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

    const role = parseRoleFromToken(token)

    if (!role || !ADMIN_ROLES.includes(role)) {
      setGuardState("blocked")
      router.replace("/")
      return
    }

    setGuardState("allowed")
  }, [router])

  if (guardState !== "allowed") {
    return null
  }

  return <>{children}</>
}
