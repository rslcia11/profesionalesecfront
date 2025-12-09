"use client"

import { Star, MapPin, Briefcase, Award } from "lucide-react"
import Link from "next/link"

const featuredProfessionals = [
  {
    id: 1,
    name: "Dr. Carlos Mendoza",
    profession: "Abogado Especialista",
    specialty: "Derecho Corporativo",
    location: "Quito",
    rating: 4.9,
    reviews: 127,
    image: "/professional-male-lawyer.jpg",
    verified: true,
    experience: "15 años",
  },
  {
    id: 2,
    name: "Dra. María Silva",
    profession: "Médica Cardióloga",
    specialty: "Cardiología",
    location: "Guayaquil",
    rating: 5.0,
    reviews: 203,
    image: "/professional-female-doctor.jpg",
    verified: true,
    experience: "12 años",
  },
  {
    id: 3,
    name: "Ing. Roberto Paz",
    profession: "Ingeniero Civil",
    specialty: "Construcción",
    location: "Cuenca",
    rating: 4.8,
    reviews: 89,
    image: "/professional-engineer.jpg",
    verified: true,
    experience: "10 años",
  },
  {
    id: 4,
    name: "Lcda. Ana Torres",
    profession: "Psicóloga Clínica",
    specialty: "Terapia Familiar",
    location: "Quito",
    rating: 4.9,
    reviews: 156,
    image: "/professional-psychologist.jpg",
    verified: true,
    experience: "8 años",
  },
]

export default function FeaturedProfessionals() {
  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">Profesionales Destacados</h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Los mejores profesionales verificados de Ecuador
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProfessionals.map((pro, index) => (
            <Link
              href={`/profesional/${pro.id}`}
              key={pro.id}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={pro.image || "/placeholder.svg"}
                  alt={pro.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {pro.verified && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                    <Award size={16} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-bold">{pro.rating}</span>
                    <span>({pro.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {pro.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">{pro.profession}</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground font-body">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" />
                    <span>{pro.specialty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span>{pro.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-primary" />
                    <span>{pro.experience} de experiencia</span>
                  </div>
                </div>

                <button className="w-full bg-primary/10 text-primary py-2 rounded-lg font-button font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
                  Ver perfil
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
