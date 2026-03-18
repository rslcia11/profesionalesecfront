"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, Quote, User, Info, Video, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ponentesApi } from "@/lib/api"
import { formatUrl } from "@/lib/utils"
import CommunityCTA from "@/components/shared/community-cta"

export default function SpeakerProfilePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const slug = params.slug as string

    const [ponente, setPonente] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ponentesApi.obtenerPerfilPublico(id, slug)
                setPonente(data)
            } catch (e: any) {
                setError(e.message || "No se pudo cargar el perfil del ponente.")
            } finally {
                setLoading(false)
            }
        }
        if (id && slug) load()
    }, [id, slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (error || !ponente) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Info size={40} />
                </div>
                <h1 className="text-2xl font-black text-black uppercase mb-2">Ups! Algo salió mal</h1>
                <p className="text-gray-500 mb-8 max-w-sm">{error || "El ponente no fue encontrado."}</p>
                <button onClick={() => router.back()} className="px-8 py-3 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors">
                    Volver atrás
                </button>
            </div>
        )
    }

    const userObj = ponente.usuario || ponente.Usuario
    const nombre = userObj?.nombre || ponente.nombre_ponente
    const fotoUrl = formatUrl(userObj?.foto_url || ponente.foto_revista_url)
    const profesion = ponente.profesion || (userObj ? 'Profesional Verificado' : 'Experto Invitado')

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Header />

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-6 pt-32">
                <button 
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Regresar al evento</span>
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Image Column */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[3rem] bg-gray-50 overflow-hidden border border-gray-100 shadow-2xl relative z-10 group">
                            {fotoUrl ? (
                                <img 
                                    src={fotoUrl} 
                                    alt={nombre}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                    <User size={120} strokeWidth={1} />
                                </div>
                            )}
                            {/* Accent Decoration */}
                            <div className="absolute top-8 right-8 w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white rotate-12 shadow-xl shadow-emerald-500/20">
                                <Quote size={32} fill="white" />
                            </div>
                        </div>
                        {/* Background Shapes */}
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10" />
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    {/* Content Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
                                Ponente Destacado
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-black uppercase leading-[0.9] tracking-tighter mb-4">
                                {nombre}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="h-0.5 w-12 bg-emerald-500" />
                                <p className="text-xl font-bold text-gray-400 uppercase italic">
                                    {profesion}
                                </p>
                            </div>
                        </div>

                        {ponente.slogan && (
                            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-tight italic border-l-4 border-emerald-500 pl-6 py-2">
                                "{ponente.slogan}"
                            </p>
                        )}

                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                <Info className="w-4 h-4" /> Biografía
                            </h2>
                            <p className="text-gray-500 leading-relaxed text-lg font-light">
                                {ponente.biografia || "Información biográfica próximamente disponible."}
                            </p>
                        </div>

                        <div className="pt-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                                Participación en el evento
                            </h3>
                            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-0.5">Charla Masterclass</p>
                                    <p className="text-lg font-black text-black uppercase leading-tight">
                                        {ponente.tema_charla || "Tema Magistral"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Video Section */}
            {ponente.video_url && (
                <section className="bg-black py-32 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Multimedia</h2>
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                                REVIVE LA PONENCIA
                            </h3>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-video rounded-[2rem] overflow-hidden bg-gray-900 border border-white/10 shadow-3xl relative group"
                        >
                            <iframe 
                                src={ponente.video_url.replace("watch?v=", "embed/")} 
                                className="w-full h-full"
                                allowFullScreen
                                title="Video Ponente"
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <CommunityCTA />

            <Footer />
        </main>
    )
}
