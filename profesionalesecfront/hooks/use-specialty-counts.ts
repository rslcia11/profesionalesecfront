"use client"

import { useState, useEffect, useMemo } from "react"
import { profesionalApi } from "@/lib/api"

/**
 * Hook reutilizable para obtener conteos de profesionales verificados
 * agrupados por especialidad (especialidad_id) para una profesión dada.
 *
 * @param professionIds - IDs de las profesiones a filtrar
 * @returns { countsBySpecialty, totalByProfession, loading }
 *   - countsBySpecialty: Map<especialidad_id, number>
 *   - totalByProfession: número total de profesionales verificados en estas profesiones
 *   - loading: estado de carga
 */
export function useSpecialtyCounts(professionIds: number[]) {
    const [professionals, setProfessionals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function fetch() {
            try {
                setLoading(true)
                const response = await profesionalApi.obtenerVerificados()
                const allData = Array.isArray(response)
                    ? response
                    : (response?.data && Array.isArray(response.data) ? response.data : [])

                if (!cancelled) {
                    // Filtrar solo los de las profesiones indicadas
                    const filtered = allData.filter(
                        (p: any) => p.profesion_id !== undefined && professionIds.includes(p.profesion_id)
                    )
                    setProfessionals(filtered)
                }
            } catch (error) {
                console.error("Error loading verified professionals:", error)
                if (!cancelled) setProfessionals([])
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetch()
        return () => { cancelled = true }
    }, [JSON.stringify(professionIds)]) // eslint-disable-line react-hooks/exhaustive-deps

    const countsBySpecialty = useMemo(() => {
        const map = new Map<number, number>()
        for (const pro of professionals) {
            const specId = pro.especialidad_id
            if (specId !== undefined && specId !== null) {
                map.set(specId, (map.get(specId) || 0) + 1)
            }
        }
        return map
    }, [professionals])

    const totalByProfession = professionals.length

    return { countsBySpecialty, totalByProfession, loading }
}
