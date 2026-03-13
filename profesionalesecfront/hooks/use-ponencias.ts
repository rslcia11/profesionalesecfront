"use client"

import { useState, useEffect, useCallback } from "react"
import { ponenciasApi, Ponencia } from "@/lib/api"

/**
 * Hook Elite para gestión de Ponencias
 * Sigue la Regla de Oro: Manejo de estado robusto y Heurística #1 (Visibilidad)
 */
export function usePonencias() {
  const [ponencias, setPonencias] = useState<Ponencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPonencias = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ponenciasApi.listar()
      // La data ya viene desempaquetada por el fetchApi actualizado
      setPonencias(Array.isArray(data.ponencias) ? data.ponencias : [])
    } catch (err: any) {
      setError(err.message || "Error al cargar conversatorios")
      console.error("🔥 Error usePonencias:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPonencias()
  }, [fetchPonencias])

  return {
    ponencias,
    loading,
    error,
    refresh: fetchPonencias
  }
}
