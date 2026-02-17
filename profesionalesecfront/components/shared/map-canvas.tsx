"use client"

import { useEffect, useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
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

const DEFAULT_CENTER = { lat: -1.831239, lng: -78.183406 }
const DEFAULT_ZOOM = 7

function LocationMarker({ position, onChange, readonly, address }: { position: { lat: number, lng: number } | null, onChange?: (lat: number, lng: number) => void, readonly?: boolean, address?: string }) {
    const map = useMap()

    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], map.getZoom())
        }
    }, [position, map])

    useMapEvents({
        click(e) {
            if (!readonly && onChange) {
                onChange(e.latlng.lat, e.latlng.lng)
            }
        },
    })

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

    return position === null ? null : (
        <Marker
            position={position}
            draggable={!readonly}
            eventHandlers={eventHandlers}
        >
            {address && <Popup>{address}</Popup>}
        </Marker>
    )
}

export default function MapCanvas({ lat, lng, readonly = false, address, onChange }: LocationMapProps) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)

    useEffect(() => {
        if (lat && lng) {
            setPosition({ lat, lng })
        }
    }, [lat, lng])

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0">
            <MapContainer
                center={position || DEFAULT_CENTER}
                zoom={position ? 15 : DEFAULT_ZOOM}
                scrollWheelZoom={!readonly}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    position={position}
                    onChange={(newLat, newLng) => {
                        setPosition({ lat: newLat, lng: newLng })
                        if (onChange) onChange(newLat, newLng)
                    }}
                    readonly={readonly}
                    address={address}
                />
            </MapContainer>

            {!readonly && !position && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-4 py-2 rounded-full shadow-lg z-1000 text-sm font-medium text-gray-600 pointer-events-none">
                    Haz clic o arrastra para ubicarte
                </div>
            )}
        </div>
    )
}
