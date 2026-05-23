"use client"

import { useEffect, useState, useCallback } from "react"
import { catalogosApi } from "@/lib/api"

type Catalogs = {
  profesiones: any[]
  provincias: any[]
  ciudades: any[]
}

let cachedCatalogs: Catalogs | null = null
let fetchPromise: Promise<Catalogs> | null = null

export function useAdminCatalogs() {
  const [catalogs, setCatalogs] = useState<Catalogs>({
    profesiones: cachedCatalogs?.profesiones ?? [],
    provincias: cachedCatalogs?.provincias ?? [],
    ciudades: cachedCatalogs?.ciudades ?? [],
  })
  const [loading, setLoading] = useState(!cachedCatalogs)

  const fetchCatalogs = useCallback(async () => {
    if (cachedCatalogs) {
      setCatalogs(cachedCatalogs)
      setLoading(false)
      return cachedCatalogs
    }

    if (fetchPromise) {
      const result = await fetchPromise
      setCatalogs(result)
      setLoading(false)
      return result
    }

    fetchPromise = (async () => {
      try {
        const [profs, provs] = await Promise.all([
          catalogosApi.obtenerProfesiones(),
          catalogosApi.obtenerProvincias(),
        ])
        const result: Catalogs = {
          profesiones: Array.isArray(profs) ? profs : [],
          provincias: Array.isArray(provs) ? provs : [],
          ciudades: [],
        }
        cachedCatalogs = result
        return result
      } catch (error) {
        console.warn("Could not load catalogs:", error)
        const empty: Catalogs = { profesiones: [], provincias: [], ciudades: [] }
        cachedCatalogs = empty
        return empty
      } finally {
        fetchPromise = null
      }
    })()

    const result = await fetchPromise
    setCatalogs(result)
    setLoading(false)
    return result
  }, [])

  useEffect(() => {
    fetchCatalogs()
  }, [fetchCatalogs])

  const refresh = useCallback(async () => {
    cachedCatalogs = null
    fetchPromise = null
    setLoading(true)
    await fetchCatalogs()
  }, [fetchCatalogs])

  return {
    profesiones: catalogs.profesiones,
    provincias: catalogs.provincias,
    ciudades: catalogs.ciudades,
    loading,
    refresh,
  }
}