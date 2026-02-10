"use client"

import { useState } from "react"
import { X, Calendar, Clock } from "lucide-react"
import { citasApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface RescheduleModalProps {
    isOpen: boolean
    onClose: () => void
    cita: {
        id: number
        usuario: {
            nombre: string
        }
        fecha_hora: string | null
    } | null
    onSuccess: () => void
}

export default function RescheduleModal({ isOpen, onClose, cita, onSuccess }: RescheduleModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fecha_cita: "",
        hora_cita: "",
    })

    if (!isOpen || !cita) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem("auth_token")
            if (!token) throw new Error("No hay sesión activa")

            await citasApi.reagendar(cita.id, formData, token)

            toast({
                title: "Cita reagendada",
                description: "La fecha y hora de la cita han sido actualizadas exitosamente.",
            })

            onSuccess()
            onClose()
            setFormData({ fecha_cita: "", hora_cita: "" }) // Reset form
        } catch (error: any) {
            console.error("Error reagendando:", error)
            toast({
                title: "Error",
                description: error.message || "No se pudo reagendar la cita.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Reagendar Cita</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Cliente: <span className="font-medium text-gray-900">{cita.usuario.nombre}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nueva Fecha *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_cita}
                                    onChange={(e) => setFormData({ ...formData, fecha_cita: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nueva Hora *
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="time"
                                    required
                                    value={formData.hora_cita}
                                    onChange={(e) => setFormData({ ...formData, hora_cita: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Guardando..." : "Confirmar Cambio"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
