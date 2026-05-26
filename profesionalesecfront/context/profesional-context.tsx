"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { usuarioApi, profesionalApi, type Usuario } from "@/lib/api"

interface ProfesionalContextValue {
  user: Usuario | null
  perfil: any | null
  perfiles: any[]
  token: string
  loading: boolean
  loadData: () => Promise<void>
  setPerfil: (perfil: any) => void
}

const ProfesionalContext = createContext<ProfesionalContextValue | null>(null)

export function ProfesionalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [perfil, setPerfilState] = useState<any | null>(null)
  const [perfiles, setPerfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")

  const loadData = useCallback(async () => {
    const storedToken = localStorage.getItem("auth_token")
    if (!storedToken) return
    setToken(storedToken)

    try {
      const [userData, perfilData] = await Promise.all([
        usuarioApi.obtenerMiPerfil(storedToken).catch(() => null),
        profesionalApi.obtenerMiPerfil(storedToken).catch(() => null),
      ])

      setUser(userData)

      const profilesArray = Array.isArray(perfilData)
        ? perfilData
        : perfilData?.perfil
          ? [perfilData.perfil]
          : perfilData
            ? [perfilData]
            : []

      setPerfiles(profilesArray)

      if (profilesArray.length > 0) {
        setPerfilState((prev: any) => {
          if (prev) {
            const found = profilesArray.find((p: any) => p.id === prev.id)
            return found || profilesArray[0]
          }
          return profilesArray[0]
        })
      }
    } catch (error) {
      console.error("Error loading professional context:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const setPerfil = (newPerfil: any) => {
    setPerfilState(newPerfil)
  }

  return (
    <ProfesionalContext.Provider
      value={{ user, perfil, perfiles, token, loading, loadData, setPerfil }}
    >
      {children}
    </ProfesionalContext.Provider>
  )
}

export function useProfesional() {
  const context = useContext(ProfesionalContext)
  if (!context) {
    throw new Error("useProfesional must be used within a ProfesionalProvider")
  }
  return context
}
