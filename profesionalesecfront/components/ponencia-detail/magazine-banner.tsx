"use client"

import { motion } from "framer-motion"
import { ExternalLink, FileText } from "lucide-react"
import { formatUrl } from "@/lib/utils"

interface MagazineBannerProps {
    ponencia: any
    loading: boolean
}

export default function MagazineBanner({ ponencia, loading }: MagazineBannerProps) {
    if (loading || !ponencia) return null

    // Use linked revista or fallback to general fields
    const revistaData = ponencia.revista || {
        titulo: "Revista Científica Profesionales Ecuador",
        descripcion: "Investigación, innovación y conocimiento multidisciplinario desde Ecuador para el mundo.",
        portada_url: ponencia.foto_revista_general,
        pdf_url: ponencia.url_revista_general
    }

    const finalPdfUrl = formatUrl(revistaData.pdf_url || revistaData.archivo_url || ponencia.url_revista_general)

    if (!finalPdfUrl) return null

    return (
        <section className="bg-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-black rounded-[2rem] p-10 md:p-14 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
                                {revistaData.titulo}
                            </h3>
                            <p className="text-base text-gray-400 font-light mb-8 max-w-lg">
                                {revistaData.descripcion}
                            </p>
                            <a
                                href={finalPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-black px-6 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-500 group-hover:px-10 shadow-xl shadow-emerald-500/5"
                            >
                                <FileText className="w-4 h-4" />
                                Leer Revista de Profesionales Ecuador
                            </a>
                        </div>
                        {revistaData.portada_url && (
                            <div className="w-48 md:w-64 relative group">
                                <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={revistaData.portada_url}
                                    alt="Revista Portada"
                                    className="relative rounded-xl shadow-[0_20px_40px_-12px_rgba(16,185,129,0.15)] transform group-hover:-rotate-2 group-hover:scale-105 transition-all duration-700"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
