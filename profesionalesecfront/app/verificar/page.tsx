"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function VerificationContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Token de verificación no encontrado.")
            return
        }

        const verify = async () => {
            try {
                await authApi.verificarEmail(token)
                setStatus("success")
            } catch (error: any) {
                setStatus("error")
                setMessage(error.message || "El enlace de verificación es inválido o ha expirado.")
            }
        }

        verify()
    }, [token])

    return (
        <div className="bg-card w-full max-w-md p-8 rounded-2xl shadow-xl border border-border text-center">
            {status === "loading" && (
                <div className="flex flex-col items-center py-8">
                    <Loader2 className="size-12 text-primary animate-spin mb-4" />
                    <h2 className="text-xl font-bold font-oswald text-foreground">Verificando cuenta...</h2>
                    <p className="text-muted-foreground mt-2">Por favor espera un momento.</p>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center py-6">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="size-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold font-oswald text-foreground mb-4">¡Email Verificado!</h2>
                    <p className="text-muted-foreground mb-8">
                        Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión en la plataforma.
                    </p>
                    <Link
                        href="/login"
                        className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div className="flex flex-col items-center py-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <XCircle className="size-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold font-oswald text-foreground mb-4">Error de Verificación</h2>
                    <p className="text-muted-foreground mb-8">
                        {message}
                    </p>
                    <Link
                        href="/"
                        className="text-primary hover:underline font-medium"
                    >
                        Volver al inicio
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function VerificationPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div className="text-foreground">Cargando...</div>}>
                <VerificationContent />
            </Suspense>
        </div>
    )
}
