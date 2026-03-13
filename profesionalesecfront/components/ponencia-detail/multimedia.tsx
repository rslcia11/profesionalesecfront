"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface MultimediaProps {
    ponencia: any
    loading: boolean
}

export default function EventMultimedia({ ponencia, loading }: MultimediaProps) {
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

    if (loading || !ponencia || !ponencia.galeria_fotos?.length) return null

    const fotos = ponencia.galeria_fotos

    return (
        <section className="bg-black py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3 font-mono">
                        Memoria Visual
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                        GALERÍA DE MOMENTOS
                    </h3>
                </div>

                <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[2rem] overflow-hidden group border border-white/5">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeGalleryIndex}
                            src={fotos[activeGalleryIndex]}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {fotos.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveGalleryIndex(i)}
                                className={`h-0.5 rounded-full transition-all duration-500 ${
                                    i === activeGalleryIndex ? "w-10 bg-emerald-500" : "w-3 bg-white/20 hover:bg-white/40"
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setActiveGalleryIndex(prev => (prev === 0 ? fotos.length - 1 : prev - 1))}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActiveGalleryIndex(prev => (prev === fotos.length - 1 ? 0 : prev + 1))}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    )
}
