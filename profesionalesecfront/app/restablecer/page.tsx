"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, ChevronRight, XCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { authApi } from "@/lib/api"

function RestablecerForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "invalid_token">("idle")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!token) {
            setStatus("invalid_token")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.")
            return
        }

        if (password.length < 8) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres.")
            return
        }

        setStatus("loading")

        try {
            await authApi.restablecerContrasena(token as string, password)
            setStatus("success")
            setTimeout(() => {
                router.push("/login")
            }, 5000)
        } catch (err: any) {
            console.error("Reset error:", err)
            setErrorMessage(err.message || "Error al restablecer la contraseña. El enlace puede haber expirado.")
            setStatus("error")
        }
    }

    if (status === "invalid_token") {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
                    <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Enlace Inválido</h2>
                    <p className="text-gray-600 leading-relaxed">
                        No se ha proporcionado un token de seguridad válido o el enlace está mal formado.
                    </p>
                </div>
                <Link
                    href="/recuperar-contrasena"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
                >
                    Solicitar nuevo enlace
                </Link>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">¡Contraseña Actualizada!</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Tu contraseña ha sido restablecida con éxito. Serás redirigido al inicio de sesión en unos segundos.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
                >
                    Ir al Login Ahora
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Nueva Contraseña</h2>
                <p className="text-gray-500 text-sm">Define tus nuevas credenciales de acceso</p>
            </div>

            {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-100">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="pass" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Nueva Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="pass"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Confirmar Contraseña
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                        </div>
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
                    {status === "loading" ? "Guardando..." : "Cambiar Contraseña"}
                    <ChevronRight className="h-5 w-5" />
                </button>
            </form>
        </div>
    )
}

export default function RestablecerPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    {/* Hero */}
                    <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Crea tu nueva clave</h1>
                        <p className="text-gray-600 text-lg">Un último paso para recuperar el control</p>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

                            <Suspense fallback={<div className="text-center py-12 text-slate-400 italic">Cargando seguridad...</div>}>
                                <RestablecerForm />
                            </Suspense>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 text-center animate-in fade-in duration-700 delay-200">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-2 uppercase tracking-widest font-black">
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                            Seguridad de acceso garantizada
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
