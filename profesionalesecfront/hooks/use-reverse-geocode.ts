"use client"

import { useState, useEffect } from "react"

/**
 * Hook reutilizable para geocodificación inversa vía Nominatim (OpenStreetMap).
 * Convierte coordenadas (lat, lng) en una dirección legible.
 * Gratuito, sin API key, respetando la política de uso de Nominatim.
 */
export function useReverseGeocode(lat?: number | string | null, lng?: number | string | null) {
    const [address, setAddress] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!lat || !lng) {
            setAddress(null)
            return
        }

        const numLat = Number(lat)
        const numLng = Number(lng)

        if (isNaN(numLat) || isNaN(numLng)) {
            setAddress(null)
            return
        }

        let cancelled = false
        setLoading(true)

        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${numLat}&lon=${numLng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "es" } }
        )
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return
                if (data.display_name) {
                    setAddress(data.display_name)
                }
            })
            .catch(() => {
                // Silencioso: si falla, simplemente no mostramos dirección geocodificada
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => { cancelled = true }
    }, [lat, lng])

    return { address, loading }
}
