"use client"

import { User } from "lucide-react"
import { formatUrl } from "@/lib/utils"

interface SpeakerCardProps {
  ponente: any
}

export default function SpeakerCard({ ponente }: SpeakerCardProps) {
  // Extract data based on registered user (usuario/Usuario) or guest speaker fields
  const userObj = ponente.usuario || ponente.Usuario
  const nombre = userObj?.nombre || ponente.nombre_ponente || "Ponente Invitado"
  const fotoUrl = userObj?.foto_url || ponente.foto_revista_url
  const profesion = ponente.profesion || (userObj ? 'Profesional Verificado' : 'Experto Invitado')

  return (
    <div className="flex items-start gap-4 p-5 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
      <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-2xl border border-emerald-100 overflow-hidden shadow-inner group-hover:scale-110 transition-transform">
        {fotoUrl ? (
          <img 
            src={fotoUrl} 
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
      <div className="space-y-1">
        <p className="font-black text-black uppercase tracking-tight">{nombre}</p>
        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
          {profesion}
        </p>
        {ponente.tema_charla && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed pt-1">
            <span className="font-bold text-gray-400 text-[10px] uppercase block mb-0.5">Tema a exponer:</span>
            {ponente.tema_charla}
          </p>
        )}
      </div>
    </div>
  )
}
