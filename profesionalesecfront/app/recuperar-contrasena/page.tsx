"use client"

import type React from "react"
import { useState } from "react"
import { ShieldCheck, ArrowLeft, Mail, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { authApi } from "@/lib/api"

export default function RecuperarContrasenaPage() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)
        setStatus("loading")

        try {
            await authApi.solicitarRecuperacion(email)
            setStatus("success")
        } catch (err: any) {
            console.error("Recovery error:", err)
            setErrorMessage(err.message || "Error al solicitar la recuperación. Por favor, intenta de nuevo.")
            setStatus("error")
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    {/* Hero Section */}
                    <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Recuperar Acceso</h1>
                        <p className="text-gray-600 text-lg">Te enviaremos las instrucciones a tu correo</p>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            {/* Decorative gradient overlay */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                            {status === "success" ? (
                                <div className="text-center space-y-6 py-4">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                                        <Mail className="h-10 w-10 text-green-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900">¡Correo Enviado!</h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            Si el correo <strong>{email}</strong> está en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 text-sm text-amber-700 font-medium">
                                        💡 El enlace de recuperación expira en 60 minutos por razones de seguridad.
                                    </div>
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                                        </Link>
                                        <h2 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h2>
                                    </div>

                                    {errorMessage && (
                                        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-100">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">
                                                Correo Electrónico
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-lg shadow-inner"
                                                    placeholder="tu@correo.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className={`w-full py-4 font-black text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 ${status === "loading"
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-500/40"
                                                }`}
                                        >
                                            {status === "loading" ? "Procesando..." : "Enviar Enlace"}
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </form>

                                    <div className="pt-6 border-t border-gray-100 text-center">
                                        <p className="text-sm text-gray-500 italic">
                                            ¿Recuerdas tu contraseña?{" "}
                                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                                Inicia sesión
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 text-center animate-in fade-in duration-700 delay-200">
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2 font-medium">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            Protección de datos de nivel profesional
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
