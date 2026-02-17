"use client"

import { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface LocationMapProps {
    lat?: number
    lng?: number
    readonly?: boolean
    address?: string
    onChange?: (lat: number, lng: number) => void
}

// Dynamically import Map components to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
)
const useMap = dynamic(
    () => import("react-leaflet").then((mod) => mod.useMap),
    { ssr: false }
)
const useMapEvents = dynamic(
    () => import("react-leaflet").then((mod) => mod.useMapEvents),
    { ssr: false }
)

// Default center (Ecuador)
const DEFAULT_CENTER = { lat: -1.831239, lng: -78.183406 }
const DEFAULT_ZOOM = 7

// Child component to handle map events and updates
function MapController({
    position,
    onChange,
    readonly,
    address
}: {
    position: { lat: number, lng: number } | null,
    onChange?: (lat: number, lng: number) => void,
    readonly?: boolean,
    address?: string
}) {
    const MapEvents = require("react-leaflet").useMapEvents
    const MapHook = require("react-leaflet").useMap

    const map = MapHook()

    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], 15)
        }
    }, [position, map])

    MapEvents({
        click(e: any) {
            if (!readonly && onChange) {
                onChange(e.latlng.lat, e.latlng.lng)
            }
        },
    })

    // Marker drag handler
    const eventHandlers = useMemo(
        () => ({
            dragend(e: any) {
                if (!readonly && onChange) {
                    const marker = e.target
                    const newPos = marker.getLatLng()
                    onChange(newPos.lat, newPos.lng)
                }
            },
        }),
        [readonly, onChange],
    )

    if (!position) return null

    // We need to use the Marker component passed from parent or imported here?
    // Since we are inside a client component that is already dynamic-wrapped, 
    // let's rely on the outer dynamic imports. But wait, we can't render dynamic components 
    // easily inside this inner function if they are not passed down.
    // Actually, standard react-leaflet components work fine if the PARENT (LocationMap) is client-only.
    // The issue is importing 'react-leaflet' at top level.

    // Pivot: Let's make the whole LocationMap component dynamic from the usage side? 
    // OR just keep the top-level dynamic imports and use them in the main return.

    return null // This controller only handles logic and side-effects on the map instance
}

// ... wait, the above approach is getting complicated with dynamic imports inside components.
// Better approach: Make a separate component for the logic that imports standard react-leaflet, 
// and then dynamically import THAT component.

export default function LocationMap(props: LocationMapProps) {
    const MapCanvas = useMemo(() => dynamic(
        () => import("./map-canvas"),
        {
            loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Cargando mapa...</div>,
            ssr: false
        }
    ), [])

    return <MapCanvas {...props} />
}
