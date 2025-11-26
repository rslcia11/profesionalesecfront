"use client"

import Header from "@/components/header"
import { Search, Star, MapPin, Mail, Filter } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function AllProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "Todos", count: 24 },
    { id: "legal", label: "Legal", count: 8 },
    { id: "salud", label: "Salud", count: 12 },
    { id: "salud-mental", label: "Salud Mental", count: 5 },
    { id: "artistas", label: "Artistas", count: 6 },
    { id: "administracion", label: "Administración", count: 7 },
    { id: "oficios", label: "Oficios y más", count: 9 },
  ]

  // 👉 Tarjetas grandes de áreas (como en tu screenshot)
  const areas = [
    {
      title: "Derecho",
      description: "Consultoría legal profesional",
      href: "#",
    },
    {
      title: "Salud",
      description: "Servicios médicos especializados",
      href: "#",
    },
    {
      title: "Educación",
      description: "Capacitación profesional",
      href: "#",
    },
    {
      // 👇 ESTA ES LA QUE TE IMPORTA
      title: "Ingeniería y Tecnología",
      description: "Soluciones tech avanzadas",
      href: "/ingenieria-y-tecnologia", // ⬅️ va a tu nueva página
    },
    {
      title: "Desarrollo",
      description: "Software y aplicaciones",
      href: "#",
    },
    {
      title: "Diseño",
      description: "Creatividad y branding",
      href: "#",
    },
  ]

  const professionals = [
    {
      id: 1,
      name: "Dr. Carlos López Mendoza",
      specialty: "Médico Cirujano Especialista",
      rating: 4.9,
      reviews: 127,
      location: "Quito, Pichincha",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1000&fit=crop",
      price: "$150",
      unit: "consulta",
      experience: "15 años",
      category: "salud",
      verified: true,
      description:
        "Especialista en cirugía general con amplia experiencia en procedimientos mínimamente invasivos",
    },
    {
      id: 2,
      name: "Lic. María Gómez Paredes",
      specialty: "Abogada Especialista en Derecho Civil",
      rating: 4.8,
      reviews: 89,
      location: "Guayaquil, Guayas",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop",
      price: "$120",
      unit: "hora",
      experience: "12 años",
      category: "legal",
      verified: true,
      description: "Experta en litigios civiles, derecho de familia y sucesiones",
    },
    {
      id: 3,
      name: "Dra. Ana Martínez Silva",
      specialty: "Psicóloga Clínica",
      rating: 4.7,
      reviews: 94,
      location: "Cuenca, Azuay",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=1000&fit=crop",
      price: "$100",
      unit: "sesión",
      experience: "8 años",
      category: "salud-mental",
      verified: true,
      description: "Especialista en terapia cognitivo-conductual y trastornos de ansiedad",
    },
    {
      id: 4,
      name: "Arq. Felipe Torres Ruiz",
      specialty: "Arquitecto y Diseñador",
      rating: 4.9,
      reviews: 112,
      location: "Quito, Pichincha",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
      price: "$140",
      unit: "proyecto",
      experience: "18 años",
      category: "artistas",
      verified: true,
      description: "Especializado en diseño residencial y arquitectura sostenible",
    },
    {
      id: 5,
      name: "Dra. Patricia Sánchez Vera",
      specialty: "Odontóloga - Estética Dental",
      rating: 4.8,
      reviews: 203,
      location: "Quito, Pichincha",
      image: "https://images.unsplash.com/photo-1559839734291-00dcc994a43e?w=800&h=1000&fit=crop",
      price: "$90",
      unit: "consulta",
      experience: "14 años",
      category: "salud",
      verified: true,
      description: "Experta en rehabilitación oral, implantes y diseño de sonrisa",
    },
    {
      id: 6,
      name: "Ing. Roberto García Morales",
      specialty: "Contador Público Autorizado",
      rating: 4.6,
      reviews: 78,
      location: "Guayaquil, Guayas",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      price: "$80",
      unit: "hora",
      experience: "10 años",
      category: "administracion",
      verified: true,
      description: "Especialista en auditoría, tributación y asesoría financiera",
    },
    {
      id: 7,
      name: "Maestro Luis Pérez Castro",
      specialty: "Electricista Certificado",
      rating: 5.0,
      reviews: 145,
      location: "Quito, Pichincha",
      image: "https://images.unsplash.com/photo-1500648767791-0a1dd7228bf5?w=800&h=1000&fit=crop",
      price: "$60",
      unit: "servicio",
      experience: "20 años",
      category: "oficios",
      verified: true,
      description:
        "Instalaciones eléctricas residenciales, comerciales e industriales",
    },
    {
      id: 8,
      name: "Lic. Carmen Rodríguez Vega",
      specialty: "Psiquiatra",
      rating: 4.9,
      reviews: 67,
      location: "Cuenca, Azuay",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=1000&fit=crop",
      price: "$130",
      unit: "consulta",
      experience: "16 años",
      category: "salud-mental",
      verified: true,
      description:
        "Especialista en trastornos del estado de ánimo y psicofarmacología",
    },
  ]

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || prof.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Todos los profesionales
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra al profesional perfecto para tus necesidades
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 🧩 Tarjetas de Áreas de Expertise */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {areas.map((area) => (
              <Link
                key={area.title}
                href={area.href}
                className="block rounded-3xl border border-border/60 bg-card p-8 hover:shadow-xl hover:border-primary/40 transition-all"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {area.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Layout principal */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Categorías
                </h2>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <span
                        className={`text-sm ${
                          selectedCategory === category.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre, especialidad o ubicación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border/50 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Mostrando{" "}
                <span className="font-semibold text-foreground">
                  {filteredProfessionals.length}
                </span>{" "}
                profesionales
                {selectedCategory !== "all" && (
                  <span>
                    {" "}
                    en{" "}
                    <span className="font-semibold text-primary">
                      {
                        categories.find(
                          (c) => c.id === selectedCategory
                        )?.label
                      }
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Professionals Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProfessionals.map((professional) => (
                <div
                  key={professional.id}
                  className="group bg-card rounded-xl border border-border/50 hover:border-primary/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="grid sm:grid-cols-5 gap-4">
                    {/* Image */}
                    <div className="sm:col-span-2 relative h-48 sm:h-auto overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                      <img
                        src={professional.image || "/placeholder.svg"}
                        alt={professional.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {professional.verified && (
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                          Verificado
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="sm:col-span-3 p-4">
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {professional.name}
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-3">
                        {professional.specialty}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Star
                            size={14}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="font-semibold text-foreground">
                            {professional.rating}
                          </span>
                          <span className="text-muted-foreground">
                            ({professional.reviews} reseñas)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          {professional.location}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {professional.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {professional.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            por {professional.unit}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2">
                          <Mail size={16} />
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProfessionals.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No se encontraron profesionales
                </h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tu búsqueda o filtros para encontrar lo que
                  necesitas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
