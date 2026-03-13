import React from "react"
import { SPACING } from "@/constants"

/**
 * EventCardSkeleton - Heurística #1 (Visibilidad del estado del sistema)
 * Proporciona feedback visual inmediato mientras se cargan los datos.
 */
export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse shadow-sm">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-100 rounded-full" />
          <div className="h-4 w-12 bg-gray-100 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
        <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
        <div className="flex -space-x-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white" />
          ))}
        </div>
      </div>
    </div>
  )
}
