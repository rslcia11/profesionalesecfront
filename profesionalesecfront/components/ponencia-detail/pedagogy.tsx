"use client"

import { motion } from "framer-motion"
import { Globe, Users, Info, FileText } from "lucide-react"
import { EDUCATIONAL_CONTEXT_REASONS } from "@/constants/ponencias"

interface PedagogyProps {
    ponencia: any
    loading: boolean
}

export default function EventPedagogy({ ponencia, loading }: PedagogyProps) {
    if (loading || !ponencia) return null

    // Use dynamic pillars from DB or fallback to constants
    const pilares = ponencia.pilares || EDUCATIONAL_CONTEXT_REASONS

    const getIcon = (icon: any) => {
        if (!icon) return Info
        if (typeof icon !== 'string') return icon
        
        switch (icon.toLowerCase()) {
            case 'globe': return Globe
            case 'users': return Users
            case 'filetext': case 'file-text': return FileText
            default: return Info
        }
    }

    return (
        <section className="bg-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter">
                        ¿POR QUÉ ESTE FORMATO?
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pilares.map((reason: any, index: number) => {
                        const Icon = getIcon(reason.icon)
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 hover:border-emerald-500/10 hover:bg-white transition-all duration-500 group shadow-sm hover:shadow-xl"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border border-gray-50 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <Icon className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-xl font-black text-black mb-3 uppercase leading-tight group-hover:text-emerald-500 transition-colors">
                                    {reason.title}
                                </h4>
                                <p className="text-gray-400 text-sm font-light leading-relaxed">
                                    {reason.desc}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
