"use client"

import { useState } from "react"
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react"
import { citasApi } from "@/lib/api"

interface BookingFormProps {
    professional: {
        id: number
        name: string
        specialty?: string
    }
}

export default function BookingForm({ professional }: BookingFormProps) {
    const [formData, setFormData] = useState({
        nombres_completos: "",
        correo: "",
        telefono: "",
        fecha_cita: "",
        hora_cita: "",
        comentario: "",
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await citasApi.agendarPublico({
                profesional_id: professional.id,
                ...formData,
            })
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || "Error al agendar la cita. Por favor intente nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 p-8 rounded-lg text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cita Agendada!</h3>
                <p className="text-gray-600 mb-6">
                    Tu solicitud para <strong>{professional.name}</strong> ha sido enviada con éxito.
                    Te contactaremos pronto para confirmar.
                </p>
                <button
                    onClick={() => {
                        setSuccess(false)
                        setFormData({
                            nombres_completos: "",
                            correo: "",
                            telefono: "",
                            fecha_cita: "",
                            hora_cita: "",
                            comentario: "",
                        })
                    }}
                    className="py-2 px-6 bg-black text-white rounded hover:bg-gray-800 transition uppercase text-sm font-bold tracking-wide"
                >
                    Agendar otra cita
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            {/* Nombre */}
            <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre *</label>
                <input
                    type="text"
                    required
                    value={formData.nombres_completos}
                    onChange={(e) => setFormData({ ...formData, nombres_completos: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent"
                    placeholder="Tu nombre completo"
                />
            </div>

            {/* Contacto Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Teléfono *</label>
                    <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent"
                        placeholder="099..."
                        maxLength={10}
                        pattern="[0-9]{10}"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Correo electrónico *</label>
                    <input
                        type="email"
                        required
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            {/* Fecha y Hora Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha de agendamiento *</label>
                    <input
                        type="date"
                        required
                        value={formData.fecha_cita}
                        onChange={(e) => setFormData({ ...formData, fecha_cita: e.target.value })}
                        className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent text-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Hora *</label>
                    <input
                        type="time"
                        required
                        value={formData.hora_cita}
                        onChange={(e) => setFormData({ ...formData, hora_cita: e.target.value })}
                        className="w-full border-b border-gray-300 py-2 focus:border-black focus:outline-none bg-transparent text-gray-600"
                    />
                </div>
            </div>

            {/* Mensaje */}
            <div>
                <input
                    type="text"
                    value={formData.comentario}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    className="w-full border border-gray-200 rounded p-4 h-32 align-top focus:border-black focus:outline-none resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                />
            </div>

            {/* Botón */}
            <button
                type="submit"
                disabled={loading}
                className={`bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded hover:bg-gray-300 transition text-sm tracking-wide uppercase ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Agendando..." : "AGENDAR CITA"}
            </button>
        </form>
    )
}
