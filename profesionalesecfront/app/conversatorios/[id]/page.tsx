"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ponenciasApi, ponentesApi } from "@/lib/api"
import { useReverseGeocode } from "@/hooks/use-reverse-geocode"
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, CheckCircle2, Clock, Globe, Info } from "lucide-react"
import Link from "next/link"
import LocationMap from "@/components/shared/location-map"
import SpeakerCard from "@/components/speaker-card"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Video, Play, FileText, Share2, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { formatUrl } from "@/lib/utils"

export default function ConversatorioDetallePage() {
    const params = useParams()
    const id = Number(params.id)

    const [ponencia, setPonencia] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Inscription form
    const [inscForm, setInscForm] = useState({ cedula: "", correo: "", celular: "" })
    const [inscLoading, setInscLoading] = useState(false)
    const [inscSuccess, setInscSuccess] = useState(false)
    const [inscError, setInscError] = useState("")
    const [ponentes, setPonentes] = useState<any[]>([])
    const [activeAccordion, setActiveAccordion] = useState<string | null>("day-1")

    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                // Backend no tiene GET /ponencias/:id, obtenemos la lista y filtramos
                const data = await ponenciasApi.listar()
                const lista = Array.isArray(data) ? data : (data.ponencias || [])
                const found = lista.find((p: any) => p.id === id)
                
                if (found) {
                    setPonencia(found)
                    
                    // Prioridad 1: Usar ponentes incluidos en la respuesta pública (Regla de Oro: Eficiencia)
                    const publicPonentes = found.PonenciaPonentes || found.ponentes || []
                    if (publicPonentes.length > 0) {
                        setPonentes(publicPonentes)
                    }
                } else {
                    setError("No se encontró el conversatorio.")
                }
            } catch (e) {
                setError("No se pudo cargar el conversatorio.")
            } finally {
                setLoading(false)
            }
        }
        if (id) load()
    }, [id])

    const handleInscripcion = async (e: React.FormEvent) => {
        e.preventDefault()
        setInscError("")

        if (!inscForm.cedula || !inscForm.correo) {
            setInscError("La cédula y el correo son obligatorios.")
            return
        }

        setInscLoading(true)
        try {
            await ponenciasApi.inscribir({
                ponencia_id: id,
                cedula: inscForm.cedula,
                correo: inscForm.correo,
                celular: inscForm.celular || undefined,
            })
            setInscSuccess(true)
        } catch (e: any) {
            setInscError(e?.message || "Error al inscribirse. Intenta de nuevo.")
        } finally {
            setInscLoading(false)
        }
    }

    // Geocodificación inversa: si no hay dirección de texto pero sí coordenadas
    const { address: geocodedAddress } = useReverseGeocode(
        ponencia?.direccion ? null : ponencia?.latitud,
        ponencia?.direccion ? null : ponencia?.longitud
    )

    const isFuturo = ponencia ? new Date(ponencia.fecha_inicio) >= new Date() : false

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="pt-32 pb-8 px-6 bg-black">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/conversatorios"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-bold tracking-[0.2em] mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        VOLVER A EDUCACIÓN
                    </Link>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500 text-sm font-light">Sincronizando...</div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400/80 text-sm">{error}</div>
                    ) : ponencia ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full mb-4 border border-emerald-500/20 uppercase tracking-[0.2em]">
                                {isFuturo ? "Próximo Evento" : "Evento Realizado"}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-[1.1]">
                                {ponencia.titulo}
                            </h1>
                            <p className="text-base text-gray-400 leading-relaxed font-light max-w-2xl">
                                {ponencia.descripcion}
                            </p>
                        </motion.div>
                    ) : null}
                </div>
            </section>

            {ponencia && (
                <>
                    {/* Details Section */}
                    <section className="py-12 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="bg-emerald-100 p-3 rounded-lg">
                                            <Calendar className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de Inicio</p>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(ponencia.fecha_inicio).toLocaleDateString("es-EC", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                                {ponencia.hora_inicio && ` a las ${ponencia.hora_inicio.slice(0, 5)}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de Finalización</p>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(ponencia.fecha_fin).toLocaleDateString("es-EC", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                                {ponencia.hora_fin && ` a las ${ponencia.hora_fin.slice(0, 5)}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="bg-amber-100 p-3 rounded-lg">
                                            <DollarSign className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Precio</p>
                                            <p className="font-semibold text-gray-900">
                                                {Number(ponencia.precio) === 0 ? "Gratuito" : `$${Number(ponencia.precio).toFixed(2)}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Cupo Máximo</p>
                                            <p className="font-semibold text-gray-900">{ponencia.cupo} participantes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="mb-12 bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <MapPin className="w-7 h-7 text-emerald-600" />
                                    Ubicación del Evento
                                </h2>

                                <div className="grid lg:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dirección</p>
                                            <p className="text-lg text-gray-800 font-medium">
                                                {ponencia.direccion || geocodedAddress || "Dirección por confirmarse"}
                                            </p>
                                            <p className="text-gray-500 mt-2">
                                                {ponencia.ciudad?.nombre ? `${ponencia.ciudad.nombre}, ${ponencia.provincia?.nombre}` : "Ciudad por confirmar"}
                                            </p>
                                        </div>

                                        {ponencia.direccion && (
                                            <div className="flex gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm border border-emerald-100">
                                                <Info className="h-5 w-5 shrink-0" />
                                                <p>Te recomendamos llegar 15 minutos antes para completar tu registro de asistencia.</p>
                                            </div>
                                        )}
                                    </div>

                                    {(ponencia.latitud && ponencia.longitud) ? (
                                        <div className="h-[300px] rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-gray-200">
                                            <LocationMap
                                                lat={Number(ponencia.latitud)}
                                                lng={Number(ponencia.longitud)}
                                                readonly={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-[300px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                                            <Globe className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="text-sm">Mapa no disponible para este evento</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* MULTIMEDIA PREMIUM: Video y Galería */}
                            {(ponencia.video_url || (ponencia.galeria_fotos && ponencia.galeria_fotos.length > 0)) && (
                                <div className="mb-12 space-y-8">
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                        <Globe className="w-6 h-6 text-emerald-600" />
                                        Contenido Premium
                                    </h2>

                                    {/* Video Embed */}
                                    {ponencia.video_url && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">
                                                <Video className="w-4 h-4" /> Video del Evento
                                            </div>
                                            <div className="aspect-video relative rounded-3xl overflow-hidden bg-black shadow-2xl group">
                                                <iframe 
                                                    src={ponencia.video_url.includes('watch?v=') ? ponencia.video_url.replace('watch?v=', 'embed/') : ponencia.video_url}
                                                    className="absolute inset-0 w-full h-full"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Photo Gallery */}
                                    {ponencia.galeria_fotos && ponencia.galeria_fotos.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">
                                                <ImageIcon className="w-4 h-4" /> Galería de Momentos
                                            </div>
                                            <div className="relative group rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-video md:aspect-21/9 shadow-xl">
                                                <AnimatePresence mode="wait">
                                                    <motion.img 
                                                        key={activeGalleryIndex}
                                                        initial={{ opacity: 0, scale: 1.05 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.5 }}
                                                        src={formatUrl(ponencia.galeria_fotos[activeGalleryIndex]) || ""}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </AnimatePresence>
                                                
                                                {ponencia.galeria_fotos.length > 1 && (
                                                    <>
                                                        <button 
                                                            onClick={() => setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : ponencia.galeria_fotos.length - 1))}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                                                        >
                                                            <ChevronLeft className="w-6 h-6" />
                                                        </button>
                                                        <button 
                                                            onClick={() => setActiveGalleryIndex((prev) => (prev < ponencia.galeria_fotos.length - 1 ? prev + 1 : 0))}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                                                        >
                                                            <ChevronRight className="w-6 h-6" />
                                                        </button>
                                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                                            {ponencia.galeria_fotos.map((_: any, idx: number) => (
                                                                <button 
                                                                    key={idx}
                                                                    onClick={() => setActiveGalleryIndex(idx)}
                                                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeGalleryIndex ? 'bg-white w-6' : 'bg-white/40'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ponentes Section */}
                            <div className="mb-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-emerald-600" />
                                    Ponentes Invitados
                                </h2>

                                    {ponentes.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {ponentes.map((p: any) => (
                                                <SpeakerCard key={p.id} ponente={p} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-gray-500 italic">Los ponentes para este evento serán anunciados próximamente.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Inscription Form — Refined Minimalism */}
                             {isFuturo && ponencia.estado === "publicada" && (
                                 <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-xl p-6 md:p-8">
                                     <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Inscríbete</h2>
                                     <p className="text-gray-500 text-sm mb-6 font-light">Reserva tu lugar en este conversatorio.</p>

                                     {inscSuccess ? (
                                         <div className="flex flex-col items-center text-center py-6">
                                             <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                                             <h3 className="text-lg font-bold text-gray-900 mb-1">¡Inscripción Exitosa!</h3>
                                             <p className="text-gray-500 text-sm">Te hemos registrado. Revisa tu correo.</p>
                                         </div>
                                     ) : (
                                         <form onSubmit={handleInscripcion} className="space-y-4">
                                             <div className="grid md:grid-cols-2 gap-4">
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                                         Cédula <span className="text-red-500">*</span>
                                                     </label>
                                                     <input
                                                         type="text"
                                                         placeholder="1712345678"
                                                         value={inscForm.cedula}
                                                         onChange={(e) => setInscForm({ ...inscForm, cedula: e.target.value })}
                                                         className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
                                                         required
                                                     />
                                                 </div>
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                                         Correo <span className="text-red-500">*</span>
                                                     </label>
                                                     <input
                                                         type="email"
                                                         placeholder="tu@correo.com"
                                                         value={inscForm.correo}
                                                         onChange={(e) => setInscForm({ ...inscForm, correo: e.target.value })}
                                                         className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
                                                         required
                                                     />
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Celular</label>
                                                 <input
                                                     type="tel"
                                                     placeholder="0991234567"
                                                     value={inscForm.celular}
                                                     onChange={(e) => setInscForm({ ...inscForm, celular: e.target.value })}
                                                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
                                                 />
                                             </div>

                                             {inscError && (
                                                 <p className="text-red-600 text-[10px] bg-red-50 p-2 rounded">{inscError}</p>
                                             )}

                                             <button
                                                 type="submit"
                                                 disabled={inscLoading}
                                                 className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50"
                                             >
                                                 {inscLoading ? "Procesando..." : "INSCRIBIRME"}
                                             </button>
                                         </form>
                                     )}
                                 </div>
                             )}

                            {/* Past event message */}
                            {!isFuturo && (
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Este conversatorio ya se realizó</h3>
                                    <p className="text-gray-500">Las inscripciones para este evento han finalizado.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            <Footer />
        </main>
    )
}
