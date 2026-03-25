"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { profesionalApi } from "@/lib/api"
import { formatUrl } from "@/lib/utils"
import { Star, MapPin, Briefcase, Award, ArrowRight } from "lucide-react"

interface Professional {
    usuario_id: number
    usuario: {
        nombre: string
        foto_url?: string
    }
    profesion?: {
        nombre: string
    }
    profesion_id?: number
    especialidad?: {
        nombre: string
    }
    especialidades?: {
        nombre: string
    }[]
    ciudad: {
        nombre: string
    }
    calificacion?: number
    resenas?: number
    verificado?: boolean
    tarifa?: string
    descripcion?: string
}

interface ProfessionalsCategoryListProps {
    professionIds: number[]
    title?: string
    description?: string
}

export default function ProfessionalsCategoryList({
    professionIds,
    title = "Profesionales Destacados",
    description = "Expertos verificados listos para ayudarte"
}: ProfessionalsCategoryListProps) {
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfessionals() {
            try {
                setLoading(true)
                // Usamos obtenerVerificados para consistencia
                const response = await profesionalApi.obtenerVerificados()

                let allData: Professional[] = []
                if (Array.isArray(response)) {
                    allData = response
                } else if (response && response.data && Array.isArray(response.data)) {
                    allData = response.data
                }

                // Filter by profession IDs (check if the professional's ID is in the provided array)
                const filtered = allData.filter(pro =>
                    pro.profesion_id !== undefined && professionIds.includes(pro.profesion_id)
                )
                setProfessionals(filtered)
            } catch (error) {
                console.error("Error fetching professionals for category:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfessionals()
    }, [professionIds])

    if (loading) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Buscando profesionales...</p>
                </div>
            </section>
        )
    }

    if (professionals.length === 0) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">{title}</h2>
                    <p className="text-muted-foreground mb-8">{description}</p>
                    <div className="bg-white p-8 rounded-xl shadow-sm border">
                        <p className="text-lg text-gray-500">
                            Aún no tenemos profesionales verificados visibles en esta categoría.
                        </p>
                        <Link href="/top-profesionales" className="text-primary hover:underline mt-2 inline-block">
                            Ver todos los profesionales
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {professionals.map((pro, index) => (
                        <Link
                            href={`/perfil/${pro.usuario_id}`}
                            key={pro.usuario_id}
                            className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={formatUrl(pro.usuario.foto_url) || "/logo-black.png"}
                                    alt={pro.usuario.nombre}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Verified Badge */}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-primary">
                                    <Award size={16} />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                                    <div className="flex items-center gap-1 text-white text-sm font-medium">
                                        <Star className="fill-yellow-400 text-yellow-400" size={14} />
                                        <span>{pro.calificacion || "5.0"}</span>
                                        <span className="opacity-80">({pro.resenas || 0})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                    {pro.usuario.nombre}
                                </h3>
                                <p className="text-sm font-medium text-primary mb-3 line-clamp-1">
                                    {pro.especialidad?.nombre || pro.profesion?.nombre || "Profesional"}
                                </p>

                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span className="truncate">{pro.ciudad?.nombre || "Ecuador"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={14} className="text-gray-400" />
                                        <span className="truncate">Experiencia verificada</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="font-bold text-gray-900">
                                        ${pro.tarifa || "0"}
                                        {pro.tarifa && <span className="text-xs text-gray-400 font-normal ml-1">/ hora</span>}
                                    </div>
                                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Ver perfil <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
