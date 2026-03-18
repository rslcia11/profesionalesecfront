"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, Users, Award } from "lucide-react"

export default function CommunityCTA() {
  const participationRoles = [
    {
      role: "Ponente",
      icon: MessageSquare,
      description: "Comparte tu conocimiento y experencia con nuestra comunidad multidisciplinaria.",
      color: "emerald"
    },
    {
      role: "Asistente",
      icon: Users,
      description: "Aprende de los mejores y expande tu red de contactos profesionales.",
      color: "blue"
    },
    {
      role: "Patrocinador",
      icon: Award,
      description: "Posiciona tu marca ante una audiencia de profesionales calificados.",
      color: "amber"
    }
  ]

  return (
    <div className="space-y-32 py-20">
      {/* Section 1: Se parte de Profesionales.ec */}
      <section className="bg-gray-50 rounded-[3rem] p-12 md:p-20 border border-gray-100 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
            SE PARTE DE PROFESIONALES.EC
          </h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            Únete a la red de conocimiento más influyente del país y potencia tu carrera.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {participationRoles.map((role, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
              <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-colors ${
                idx === 0 ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
                idx === 1 ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
                "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
              }`}>
                <role.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{role.role}</h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                {role.description}
              </p>
              <Link 
                href={`https://wa.me/593994147639?text=${encodeURIComponent(`Hola, me interesa participar como ${role.role} en Profesionales.ec`)}`} 
                target="_blank"
                className="text-[10px] font-black tracking-widest text-emerald-600 uppercase hover:text-emerald-700"
              >
                Saber más
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
