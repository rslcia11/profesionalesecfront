"use client"

import { BookOpen, ExternalLink, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatUrl } from "@/lib/utils"

interface MagazineCardProps {
  magazine: {
    id: number
    titulo: string
    descripcion: string
    portada_url?: string
    pdf_url: string
    fecha_publicacion: string
    edicion?: string
  }
}

export default function MagazineCard({ magazine }: MagazineCardProps) {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      {/* Portada / Image Placeholder */}
      <div className="aspect-3/4 overflow-hidden bg-gray-100 relative">
        {magazine.portada_url ? (
          <img
            src={formatUrl(magazine.portada_url) || "/placeholder.jpg"}
            alt={magazine.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-linear-to-br from-gray-900 to-gray-800">
             <BookOpen className="w-16 h-16 text-emerald-500/20 mb-4" />
             <div className="text-center">
               <span className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-1">Edición</span>
               <span className="text-white text-3xl font-bold">{magazine.edicion || "01"}</span>
             </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-emerald-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
           <button 
             onClick={() => window.open(formatUrl(magazine.pdf_url) || "#", '_blank')}
             className="p-3 bg-white rounded-full text-emerald-600 hover:scale-110 transition-transform"
           >
              <ExternalLink className="w-6 h-6" />
           </button>
           <button className="p-3 bg-emerald-700 rounded-full text-white hover:scale-110 transition-transform">
              <Download className="w-6 h-6" />
           </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-emerald-50/50 text-emerald-700 border-none px-2 py-0 text-[10px] font-bold">
            {new Date(magazine.fecha_publicacion).toLocaleDateString('es-EC', { year: 'numeric', month: 'short' })}
          </Badge>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {magazine.titulo}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed font-light">
          {magazine.descripcion}
        </p>
      </div>
    </div>
  )
}
