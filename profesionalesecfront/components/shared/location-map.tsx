"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"

interface LocationMapProps {
    lat?: number
    lng?: number
    readonly?: boolean
    address?: string
    onChange?: (lat: number, lng: number) => void
}

export default function LocationMap(props: LocationMapProps) {
    const MapCanvas = useMemo(() => dynamic(
        () => import("./map-canvas"),
        {
            loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400 text-sm">Cargando mapa...</div>,
            ssr: false
        }
    ), [])

    return <MapCanvas {...props} />
}
