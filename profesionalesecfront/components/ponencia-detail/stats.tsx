"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react"

interface StatsProps {
    ponencia: any
    loading: boolean
}

export default function EventStats({ ponencia, loading }: StatsProps) {
    if (loading || !ponencia) return null

    const stats = [
        { 
            icon: MapPin, 
            label: "Lugar", 
            value: ponencia.direccion || "Por confirmar", 
            color: "text-emerald-500" 
        },
        { 
            icon: Calendar, 
            label: "Fecha", 
            value: ponencia.fecha_inicio ? new Date(ponencia.fecha_inicio).toLocaleDateString() : "TBA", 
            color: "text-blue-500" 
        },
        { 
            icon: Users, 
            label: "Cupos", 
            value: ponencia.cupo ? `${ponencia.cupo} Asistentes` : "Sin límite", 
            color: "text-orange-500" 
        },
        { 
            icon: DollarSign, 
            label: "Inversión", 
            value: Number(ponencia.precio) === 0 ? "Gratuito" : `$${ponencia.precio}`, 
            color: "text-purple-500" 
        },
        { 
            icon: Clock, 
            label: "Horario", 
            value: ponencia.hora_inicio && ponencia.hora_fin ? `${ponencia.hora_inicio.slice(0, 5)} - ${ponencia.hora_fin.slice(0, 5)}` : "09:00 - 18:00", 
            color: "text-rose-500" 
        }
    ]

    return (
        <section className="bg-white py-12 px-6 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stats.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 hover:border-emerald-500/20 transition-all duration-500 group"
                        >
                            <item.icon className={`w-5 h-5 ${item.color} mb-3 group-hover:scale-105 transition-transform`} />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                <span className="text-black font-black text-[10px] md:text-xs uppercase tracking-tight line-clamp-2">{item.value}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
