"use client"

import { useEffect, useMemo, useState } from "react"
import { profesionalApi } from "@/lib/api"

/**
 * Trae conteos agregados de profesionales verificados por especialidad.
 * Una sola query GROUP BY en la BD; payload mínimo.
 *
 * @param professionIds - IDs de profesión para acotar (opcional)
 * @returns { countsBySpecialty: Map<number, number>, totalByProfession: number, loading: boolean }
 */
export function useSpecialtyCounts(professionIds: number[]) {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  // Serializamos las dependencias para evitar refetch en cada render del padre.
  const idsKey = professionIds.join(",")

  useEffect(() => {
    let cancelled = false

    async function fetchStats() {
      setLoading(true)
      try {
        const data = await profesionalApi.obtenerStatsEspecialidades(professionIds)
        if (!cancelled && data && typeof data === "object") {
          setStats(data as Record<string, number>)
        }
      } catch (error) {
        console.error("Error loading specialty counts:", error)
        if (!cancelled) setStats({})
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStats()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  const countsBySpecialty = useMemo(() => {
    const map = new Map<number, number>()
    for (const [key, value] of Object.entries(stats)) {
      const id = parseInt(key, 10)
      if (Number.isInteger(id)) map.set(id, value)
    }
    return map
  }, [stats])

  const totalByProfession = useMemo(() => {
    let total = 0
    for (const v of countsBySpecialty.values()) total += v
    return total
  }, [countsBySpecialty])

  return { countsBySpecialty, totalByProfession, loading }
}
