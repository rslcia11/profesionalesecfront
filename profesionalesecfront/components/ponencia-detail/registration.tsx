"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, DollarSign } from "lucide-react"
import { ponenciasApi } from "@/lib/api"
import { UI_MESSAGES } from "@/constants/ponencias"

interface RegistrationProps {
    ponencia: any
    loading: boolean
}

export default function EventRegistration({ ponencia, loading }: RegistrationProps) {
    const [inscForm, setInscForm] = useState({ cedula: "", correo: "", celular: "" })
    const [inscLoading, setInscLoading] = useState(false)
    const [inscSuccess, setInscSuccess] = useState(false)
    const [inscError, setInscError] = useState("")

    if (loading || !ponencia) return null

    const handleInscripcion = async (e: React.FormEvent) => {
        e.preventDefault()
        setInscLoading(true)
        setInscError("")
        try {
            await ponenciasApi.inscribir({
                ponencia_id: ponencia.id,
                ...inscForm
            })
            setInscSuccess(true)
        } catch (err: any) {
            setInscError(err.message || "Error al inscribirse")
        } finally {
            setInscLoading(false)
        }
    }
    return (
        <section id="registro" className="bg-black py-16 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5" />
            <div className="max-w-7xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-xl mx-auto bg-white/[0.01] border border-white/5 backdrop-blur-xl p-10 md:p-14 rounded-[2rem]"
                >
                    {inscSuccess ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
                                {UI_MESSAGES.successInscripton}
                            </h3>
                            <p className="text-gray-400 text-sm">{UI_MESSAGES.successInscriptonDesc}</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-3">
                                REGISTRAR ASISTENCIA
                            </h3>
                            <p className="text-gray-400 text-sm mb-10">
                                Asegura tu lugar en este encuentro transformador.
                            </p>

                            <form onSubmit={handleInscripcion} className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Cédula de Identidad / RUC</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="0000000000"
                                        className="w-full bg-white text-black h-16 px-8 rounded-2xl font-bold placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                        value={inscForm.cedula}
                                        onChange={e => setInscForm({ ...inscForm, cedula: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Correo Electrónico</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="w-full bg-white text-black h-16 px-8 rounded-2xl font-bold placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                        value={inscForm.correo}
                                        onChange={e => setInscForm({ ...inscForm, correo: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Número de Celular</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="0900000000"
                                        className="w-full bg-white text-black h-16 px-8 rounded-2xl font-bold placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
                                        value={inscForm.celular}
                                        onChange={e => setInscForm({ ...inscForm, celular: e.target.value })}
                                    />
                                </div>

                                {inscError && (
                                    <p className="text-red-400 text-xs font-bold bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20">{inscError}</p>
                                )}

                                <button
                                    disabled={inscLoading}
                                    className="w-full bg-emerald-500 text-white h-20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {inscLoading ? "Procesando..." : "Confirmar mi Registro"}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
