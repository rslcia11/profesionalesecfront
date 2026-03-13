"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface JustificationProps {
    ponencia: any
    loading: boolean
}

export default function EventJustification({ ponencia, loading }: JustificationProps) {
    if (loading || !ponencia) return null

    // Helper to format YouTube URL to embed
    const getEmbedUrl = (url: string) => {
        if (!url) return null
        if (url.includes("youtube.com/embed/")) return url
        const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1]?.split("?")[0]
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    const embedUrl = getEmbedUrl(ponencia.video_url)

    return (
        <section className="bg-black py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-3">
                            Análisis Académico
                        </h2>
                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                            JUSTIFICACIÓN DEL EVENTO
                        </h3>
                        <div className="space-y-6 text-gray-300 text-xl md:text-2xl font-light leading-snug tracking-tight">
                            {ponencia.justificacion ? (
                                <p>{ponencia.justificacion}</p>
                            ) : (
                                <p>{ponencia.descripcion}</p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl opacity-20 rounded-full" />
                        <div className="relative aspect-video rounded-[1.5rem] overflow-hidden border border-white/5 group">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                                    <Play className="w-10 h-10 text-white/10" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
