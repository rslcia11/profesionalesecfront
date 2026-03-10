"use client"

import { User } from "lucide-react"

interface SpeakerCardProps {
  ponente: any
}

export default function SpeakerCard({ ponente }: SpeakerCardProps) {
  // Extract name based on backend structure (registered user vs guest)
  const nombre = ponente.Usuario?.nombre || ponente.nombre_ponente || ponente.nombre || "Ponente Invitado"
  const isRegistrado = !!ponente.usuario_id

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl border border-emerald-200 overflow-hidden">
        {ponente.Usuario?.foto_url ? (
          <img 
            src={ponente.Usuario.foto_url} 
            alt={nombre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          nombre.charAt(0).toUpperCase()
        )}
      </div>
      <div>
        <p className="font-bold text-gray-900">{nombre}</p>
        <p className="text-sm text-gray-500">
          {isRegistrado ? 'Profesional Verificado' : 'Experto Invitado'}
        </p>
      </div>
    </div>
  )
}
