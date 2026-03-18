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
    const fondoBanner = formatUrl(ponente.fondo_banner)
    const galeria = Array.isArray(ponente.galeria_fotos) ? ponente.galeria_fotos : []

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            <Header />

            <Header />
            
            {/* Premium Back Button overlaying the banner */}
            <div className="absolute top-28 left-0 right-0 z-40 px-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-start">
                    <motion.button 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.back()}
                        className="pointer-events-auto group flex items-center gap-3 px-6 py-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white/90 hover:bg-white hover:text-black hover:border-white transition-all shadow-2xl"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Regresar al evento</span>
                    </motion.button>
                </div>
            </div>

            {/* Banner Section */}
            <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-[#0a0a0a]">
                {fondoBanner ? (
                    <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.4 }}
                        transition={{ duration: 1.5 }}
                        src={fondoBanner} 
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Background"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-black opacity-80" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                
                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
                </div>
            </div>

            {/* Profile Content */}
            <section className="relative -mt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Avatar Column */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-4 sticky top-32"
                        >
                            <div className="aspect-[4/5] rounded-[3.5rem] bg-white overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white group relative">
                                {fotoUrl ? (
                                    <img 
                                        src={fotoUrl} 
                                        alt={nombre}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                                        <User size={120} strokeWidth={1} />
                                    </div>
                                )}
                                
                                {ponente.slogan && (
                                    <div className="absolute bottom-0 inset-x-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                                        <Quote className="text-emerald-400 w-8 h-8 mb-4 opacity-50" />
                                        <p className="text-white font-black text-xl leading-tight uppercase tracking-tighter italic">
                                            "{ponente.slogan}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Info Column */}
                        <div className="lg:col-span-8 pt-12 lg:pt-32 space-y-16">
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase leading-[0.85] tracking-tighter mb-4">
                                        {nombre}
                                    </h1>
                                    <div className="inline-flex items-center gap-4 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-sm font-black text-emerald-800 uppercase tracking-widest">
                                            {profesion}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-900/10 transition-transform group-hover:rotate-12">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Ponencia Magistral</p>
                                        <p className="text-2xl font-black text-slate-900 uppercase leading-tight tracking-tight">
                                            {ponente.tema_charla || "Tema destacado"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid md:grid-cols-2 gap-12"
                            >
                                <div className="space-y-6">
                                    <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="h-px w-8 bg-slate-200" /> Biografía
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                        {ponente.biografia || "Información profesional próximamente."}
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="h-px w-8 bg-slate-200" /> Especialidad
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {profesion.split(',').map((p: string, idx: number) => (
                                            <span key={idx} className="bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold text-slate-700">
                                                {p.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Gallery Section */}
                            {galeria.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-8"
                                >
                                    <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="h-px w-8 bg-slate-200" /> Galería de Momentos
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {galeria.map((img: string, idx: number) => (
                                            <div key={idx} className="aspect-square rounded-3xl overflow-hidden bg-slate-50 group border border-slate-100">
                                                <img 
                                                    src={formatUrl(img) || undefined} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    alt={`Galleria ${idx}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            {ponente.video_url && (
                <section className="bg-slate-900 py-32 px-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />
                    
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.span 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="inline-block bg-white/5 border border-white/10 px-6 py-2 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4"
                            >
                                Multimedia
                            </motion.span>
                            <h3 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
                                REVIVE LA <span className="text-emerald-500">EXPERIENCIA</span>
                            </h3>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-video rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 shadow-3xl relative group"
                        >
                            <iframe 
                                src={ponente.video_url.includes("watch?v=") ? ponente.video_url.replace("watch?v=", "embed/") : ponente.video_url} 
                                className="w-full h-full"
                                allowFullScreen
                                title="Video Ponente"
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <div className="bg-white">
                <CommunityCTA />
            </div>

            <Footer />
        </main>
    )
}
