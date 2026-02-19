"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ponenciasApi } from "@/lib/api"
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

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

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ponenciasApi.obtener(id)
                setPonencia(data.ponencia || data)
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

    const isFuturo = ponencia ? new Date(ponencia.fecha_inicio) >= new Date() : false

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="pt-32 pb-8 px-6 bg-black">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/conversatorios"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Conversatorios
                    </Link>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Cargando...</div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400">{error}</div>
                    ) : ponencia ? (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{ponencia.titulo}</h1>
                            <p className="text-lg text-gray-300 leading-relaxed">{ponencia.descripcion}</p>
                        </div>
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

                            {/* Inscription Form — only for future events */}
                            {isFuturo && ponencia.estado === "publicada" && (
                                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-8 md:p-12">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Inscríbete Ahora</h2>
                                    <p className="text-gray-600 mb-8">Completa tus datos para reservar tu lugar en este conversatorio.</p>

                                    {inscSuccess ? (
                                        <div className="flex flex-col items-center text-center py-8">
                                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Inscripción Exitosa!</h3>
                                            <p className="text-gray-600">Te hemos registrado. Revisa tu correo para más detalles.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleInscripcion} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cédula <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: 1712345678"
                                                        value={inscForm.cedula}
                                                        onChange={(e) => setInscForm({ ...inscForm, cedula: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Correo Electrónico <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        placeholder="tu@correo.com"
                                                        value={inscForm.correo}
                                                        onChange={(e) => setInscForm({ ...inscForm, correo: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Celular (opcional)</label>
                                                <input
                                                    type="tel"
                                                    placeholder="Ej: 0991234567"
                                                    value={inscForm.celular}
                                                    onChange={(e) => setInscForm({ ...inscForm, celular: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                />
                                            </div>

                                            {inscError && (
                                                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{inscError}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={inscLoading}
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {inscLoading ? "Procesando..." : "Inscribirme al Conversatorio"}
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
