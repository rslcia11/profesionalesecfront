"use client"

import { useState, useCallback } from "react"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ProfessionalsFilters, type FilterState } from "@/components/professionals-filters"

export default function ProfessionalsPage() {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    profession: "",
    specialty: "",
    province: "",
    city: "",
    verifiedOnly: false,
    minRating: 0,
    sortBy: "featured",
  })

  const professionals = [
    {
      id: 1,
      name: "Dr. Carlos López",
      specialty: "Médico Cirujano",
      rating: 4.9,
      reviews: 127,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1000&fit=crop",
      price: "$150",
      unit: "hora",
      experience: "15 años",
      category: "salud",
      featured: true,
      verified: true,
      profession: "1",
      specialty_id: "1",
      province: "19",
      city: "4",
    },
    {
      id: 2,
      name: "Lic. María Gómez",
      specialty: "Abogada Especialista",
      rating: 4.8,
      reviews: 89,
      location: "Guayaquil, Ecuador",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop",
      price: "$120",
      unit: "hora",
      experience: "12 años",
      category: "legal",
      featured: true,
      verified: true,
      profession: "2",
      specialty_id: "4",
      province: "10",
      city: "1",
    },
    {
      id: 3,
      name: "Ing. Juan Rodríguez",
      specialty: "Ingeniero de Software",
      rating: 5.0,
      reviews: 156,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      price: "$180",
      unit: "hora",
      experience: "10 años",
      category: "tecnologia",
      featured: true,
      verified: true,
      profession: "3",
      specialty_id: "7",
      province: "19",
      city: "4",
    },
    {
      id: 4,
      name: "Dra. Ana Martínez",
      specialty: "Psicóloga Clínica",
      rating: 4.7,
      reviews: 94,
      location: "Cuenca, Ecuador",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=1000&fit=crop",
      price: "$100",
      unit: "hora",
      experience: "8 años",
      category: "salud",
      featured: false,
      verified: true,
      profession: "1",
      specialty_id: "2",
      province: "1",
      city: "7",
    },
    {
      id: 5,
      name: "Arq. Felipe Torres",
      specialty: "Arquitecto Diseñador",
      rating: 4.9,
      reviews: 112,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
      price: "$140",
      unit: "proyecto",
      experience: "18 años",
      category: "diseño",
      featured: false,
      verified: true,
      profession: "4",
      specialty_id: "10",
      province: "19",
      city: "4",
    },
    {
      id: 6,
      name: "Dra. Patricia Sánchez",
      specialty: "Dentista Estética",
      rating: 4.8,
      reviews: 203,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1000&fit=crop",
      price: "$90",
      unit: "consulta",
      experience: "14 años",
      category: "salud",
      featured: false,
      verified: false,
      profession: "1",
      specialty_id: "3",
      province: "19",
      city: "4",
    },
    {
      id: 7,
      name: "Cons. Roberto Díaz",
      specialty: "Asesor Financiero",
      rating: 4.9,
      reviews: 145,
      location: "Guayaquil, Ecuador",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      price: "$160",
      unit: "sesión",
      experience: "16 años",
      category: "finanzas",
      featured: false,
      verified: true,
      profession: "5",
      specialty_id: "13",
      province: "10",
      city: "1",
    },
    {
      id: 8,
      name: "Lic. Sofia Reyes",
      specialty: "Coach Empresarial",
      rating: 4.8,
      reviews: 78,
      location: "Ambato, Ecuador",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
      price: "$130",
      unit: "hora",
      experience: "11 años",
      category: "coaching",
      featured: false,
      verified: true,
      profession: "6",
      specialty_id: "16",
      province: "23",
      city: "",
    },
    {
      id: 9,
      name: "Ing. Marco Flores",
      specialty: "Especialista en Energía",
      rating: 4.7,
      reviews: 65,
      location: "Quito, Ecuador",
      image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=800&h=1000&fit=crop",
      price: "$150",
      unit: "consulta",
      experience: "13 años",
      category: "ingenieria",
      featured: false,
      verified: true,
      profession: "7",
      specialty_id: "19",
      province: "19",
      city: "4",
    },
  ]

  const filteredProfessionals = professionals.filter((prof) => {
    // Filtrar por palabra clave
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      if (!prof.name.toLowerCase().includes(keyword) && !prof.specialty.toLowerCase().includes(keyword)) {
        return false
      }
    }

    // Filtrar por profesión
    if (filters.profession && prof.profession !== filters.profession) {
      return false
    }

    // Filtrar por especialidad
    if (filters.specialty && prof.specialty_id !== filters.specialty) {
      return false
    }

    // Filtrar por provincia
    if (filters.province && prof.province !== filters.province) {
      return false
    }

    // Filtrar por ciudad
    if (filters.city && prof.city !== filters.city) {
      return false
    }

    // Filtrar solo verificados
    if (filters.verifiedOnly && !prof.verified) {
      return false
    }

    // Filtrar por calificación mínima
    if (filters.minRating && prof.rating < filters.minRating) {
      return false
    }

    return true
  })

  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (filters.sortBy) {
      case "rating-high":
        return b.rating - a.rating
      case "reviews-high":
        return b.reviews - a.reviews
      case "price-low":
        return Number.parseInt(a.price.replace("$", "")) - Number.parseInt(b.price.replace("$", ""))
      case "price-high":
        return Number.parseInt(b.price.replace("$", "")) - Number.parseInt(a.price.replace("$", ""))
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="w-full bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 md:px-6 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
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
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <ProfessionalsFilters onFiltersChange={handleFiltersChange} />
      </section>

      {/* Results Summary */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
        <p className="text-sm text-muted-foreground">
          {sortedProfessionals.length} profesional{sortedProfessionals.length !== 1 ? "es" : ""} encontrado
          {sortedProfessionals.length !== professionals.length && " (filtrado)"}
        </p>
      </section>

      {/* Professionals Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-32">
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

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-foreground">{professional.rating}</span>
                  </div>

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
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reseñas</span>
                      <span className="font-semibold text-foreground">{professional.reviews} valoraciones</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {professional.location}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <div className="text-2xl font-bold text-primary">{professional.price}</div>
                      <div className="text-xs text-muted-foreground">por {professional.unit}</div>
                    </div>
                    <button className="group/btn px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2">
                      Contactar
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
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
                  minRating: 0,
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
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-32">
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
    </div>
  )
}
