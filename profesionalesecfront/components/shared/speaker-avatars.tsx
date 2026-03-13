import React from "react"
import Image from "next/image"
import { SPACING } from "@/constants"

interface SpeakerAvatarsProps {
  speakers: {
    id: number
    nombre: string
    foto_url?: string
  }[]
  size?: number
}

/**
 * SpeakerAvatars - Componente de UI Puro
 * Crea el efecto de burbujas traslapadas visto en el benchmark.
 */
export const SpeakerAvatars: React.FC<SpeakerAvatarsProps> = ({ speakers, size = 32 }) => {
  if (!speakers || speakers.length === 0) return null

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2 mr-2">
        {speakers.map((speaker, index) => (
          <div 
            key={speaker.id} 
            className="inline-block rounded-full ring-2 ring-white overflow-hidden bg-gray-100"
            style={{ width: size, height: size, zIndex: speakers.length - index }}
            title={speaker.nombre}
          >
            {speaker.foto_url ? (
              <Image 
                src={speaker.foto_url} 
                alt={speaker.nombre} 
                width={size} 
                height={size} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                {speaker.nombre.charAt(0)}
              </div>
            )}
          </div>
        ))}
      </div>
      {speakers.length > 0 && (
        <span className="text-xs font-medium text-gray-500 truncate max-w-[100px]">
          {speakers.length === 1 ? speakers[0].nombre : `${speakers[0].nombre} +${speakers.length - 1}`}
        </span>
      )}
    </div>
  )
}
