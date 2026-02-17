"use client"

import { useState, useCallback, useMemo } from "react"
import { MapPin, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ProfessionalsFilters, type FilterState } from "@/components/professionals-filters"
import { profesionalApi } from "@/lib/api"
import Link from "next/link"
import { useEffect } from "react"
import BookingModal from "@/components/booking-modal"

export default function ProfessionalsPage() {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    profession: "",
    specialty: "",
    province: "",
    city: "",
    verifiedOnly: false,
    sortBy: "featured",
  })

  // Raw data from API (fetched once)
  const [rawProfessionals, setRawProfessionals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // State for booking modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)

  // Fetch professionals ONCE on mount
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true)
      try {
        console.log("Fetching public profiles via /verificados endpoint");
        const allData = await profesionalApi.obtenerVerificados();

        if (Array.isArray(allData)) {
          setRawProfessionals(allData)
        } else {
          console.error("API did not return an array", allData);
          setRawProfessionals([])
        }
      } catch (error) {
        console.error("Error fetching professionals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessionals()
  }, []) // Empty deps = fetch once

  // Apply filters client-side using useMemo (derived state)
  const professionals = useMemo(() => {
    let data = [...rawProfessionals]

    // Keyword filter
    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase();
      data = data.filter((p: any) =>
        (p.usuario?.nombre || "").toLowerCase().includes(lowerKeyword) ||
        (p.profesion?.nombre || "").toLowerCase().includes(lowerKeyword) ||
        (p.especialidad?.nombre || "").toLowerCase().includes(lowerKeyword) ||
        (p.descripcion || "").toLowerCase().includes(lowerKeyword) ||
        (p.servicios && Array.isArray(p.servicios) && p.servicios.some((s: any) => (s.descripcion || "").toLowerCase().includes(lowerKeyword)))
      );
    }

    // Profession filter
    if (filters.profession) {
      data = data.filter((p: any) => p.profesion_id?.toString() === filters.profession);
    }

    // Specialty filter
    if (filters.specialty) {
      data = data.filter((p: any) => p.especialidad_id?.toString() === filters.specialty);
    }

    // Province filter
    if (filters.province) {
      data = data.filter((p: any) => p.ciudad?.provincia_id?.toString() === filters.province);
    }

    // City filter
    if (filters.city) {
      data = data.filter((p: any) => p.ciudad_id?.toString() === filters.city);
    }

    // Map to display format
    return data
      .filter((p: any) => !!p.verificado || p.estado_id === 3 || p.estado === 'aprobado')
      .map((p: any) => ({
        id: p.usuario_id,
        name: p.usuario?.nombre || "Usuario",
        specialty: p.especialidad?.nombre || p.profesion?.nombre || "Profesional",
        location: p.ciudad ? `${p.ciudad.nombre}, ${p.ciudad.provincia?.nombre || ""}` : "Ecuador",
        image: p.usuario?.foto_url || "/placeholder.svg",
        price: `$${p.tarifa_hora || p.tarifa || 0}`,
        unit: "hora",
        experience: "Experiencia verificada",
        category: "general",
        featured: false,
        verified: p.verificado,
        profession: p.profesion_id?.toString(),
        status: p.estado,
        status_id: p.estado_id,
        specialty_id: p.especialidad_id?.toString(),
        province: p.ciudad?.provincia_id?.toString(),
        city: p.ciudad_id?.toString(),
        description: p.descripcion
      }))
  }, [rawProfessionals, filters])

  // Sorting logic (can still be done client-side for these results)
  const sortedProfessionals = [...professionals].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return Number.parseFloat(a.price.replace("$", "")) - Number.parseFloat(b.price.replace("$", ""))
      case "price-high":
        return Number.parseFloat(b.price.replace("$", "")) - Number.parseFloat(a.price.replace("$", ""))
      case "featured":
      default:
        // Featured logic if backend provides it, otherwise default sort
        return 0
    }
  })

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="w-full bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-6 px-4 md:px-6 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
              Todos los
              <br />
              <span className="text-primary">Profesionales</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explora nuestra red completa de profesionales verificados. Filtra y encuentra el experto que necesitas.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <ProfessionalsFilters onFiltersChange={handleFiltersChange} />
      </section>

      {/* Results Summary */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-4">
        <p className="text-sm text-muted-foreground">
          {sortedProfessionals.length} profesional{sortedProfessionals.length !== 1 ? "es" : ""} encontrado
          {sortedProfessionals.length !== professionals.length && " (filtrado)"}
        </p>
      </section>

      {/* Professionals Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        {sortedProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProfessionals.map((professional, index) => (
              <div
                key={professional.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={professional.image || "/placeholder.svg"}
                    alt={professional.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

                  {/* Verified Badge */}
                  {professional.verified && (
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <span className="text-xs font-bold text-primary-foreground">✓ Verificado</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{professional.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-4">{professional.specialty}</p>

                  {/* Info Grid */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Experiencia</span>
                      <span className="font-semibold text-foreground">{professional.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {professional.location}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-blue-900">{professional.price}</span>
                      {professional.price !== '$0' && ( // Only show unit if price is not 0 placeholder
                        <span className="text-xs text-gray-500 font-medium">/ {professional.unit}</span>
                      )}
                    </div>
                    <Link
                      href={`/perfil/${professional.id}`}
                      className="bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2 group"
                    >
                      Ver Perfil <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No se encontraron profesionales con los filtros seleccionados.
            </p>
            <button
              onClick={() =>
                setFilters({
                  keyword: "",
                  profession: "",
                  specialty: "",
                  province: "",
                  city: "",
                  verifiedOnly: false,
                  sortBy: "featured",
                })
              }
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Eres un profesional destacado?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a nuestra red de expertos verificados y conecta con clientes que buscan excelencia
          </p>
          <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 inline-flex items-center gap-3">
            Crear perfil profesional
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      {selectedProfessional && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProfessional(null)
          }}
          professional={{
            id: selectedProfessional.id,
            name: selectedProfessional.name,
            specialty: selectedProfessional.specialty,
          }}
        />
      )}
    </div>
  )
}
