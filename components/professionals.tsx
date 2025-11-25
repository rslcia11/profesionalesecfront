"use client"

import { Star, MapPin, Mail, ArrowRight, Play } from "lucide-react"
import { useState } from "react"

export default function Professionals() {
  const [activeFilter, setActiveFilter] = useState("all")

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
    },
  ]

  const categories = [
    { id: "all", label: "Todos" },
    { id: "salud", label: "Salud" },
    { id: "legal", label: "Legal" },
    { id: "tecnologia", label: "Tecnología" },
    { id: "diseño", label: "Diseño" },
  ]

  const filteredProfessionals =
    activeFilter === "all" ? professionals : professionals.filter((p) => p.category === activeFilter)

  const featuredProfessional = professionals.find((p) => p.featured && p.id === 1)

  return (
    <section id="profesionales" className="relative bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-6 tracking-tight">
              Conectando
              <br />
              <span className="text-primary">talento excepcional</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Descubre profesionales verificados que están redefiniendo la excelencia en sus campos
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center gap-3 text-base">
              Explorar profesionales
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-8 py-4 bg-transparent border-2 border-foreground/20 text-foreground rounded-full font-semibold hover:border-primary hover:text-primary transition-all flex items-center gap-3 text-base">
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              Ver presentación
            </button>
          </div>
        </div>
      </div>

      {/* Featured Professional Spotlight */}
      {featuredProfessional && (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl overflow-hidden border border-primary/10">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-[500px] md:h-auto overflow-hidden">
                <img
                  src={featuredProfessional.image || "/placeholder.svg"}
                  alt={featuredProfessional.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 w-fit">
                  Profesional destacado
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{featuredProfessional.name}</h2>
                <p className="text-xl text-primary font-semibold mb-6">{featuredProfessional.specialty}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Experiencia</div>
                    <div className="text-2xl font-bold text-foreground">{featuredProfessional.experience}</div>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Calificación</div>
                    <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {featuredProfessional.rating}
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Ubicación</div>
                    <div className="text-lg font-semibold text-foreground">{featuredProfessional.location}</div>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Tarifa</div>
                    <div className="text-lg font-semibold text-foreground">
                      {featuredProfessional.price}/{featuredProfessional.unit}
                    </div>
                  </div>
                </div>

                <button className="group w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3">
                  <Mail size={20} />
                  Contactar ahora
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeFilter === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional, index) => (
            <div
              key={professional.id}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <img
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

                {/* Floating rating badge */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-foreground">{professional.rating}</span>
                </div>
              </div>

              {/* Content */}
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
      </div>

      {/* Bottom CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-32 text-center">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Eres un profesional destacado?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a nuestra red de expertos verificados y conecta con clientes que buscan excelencia
          </p>
          <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center gap-3 mx-auto">
            Crear perfil profesional
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
