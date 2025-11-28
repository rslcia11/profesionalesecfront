import { Award, ChevronRight, Briefcase, MapPin, Users, TrendingUp, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

interface FeaturedProfessionalProps {
  professional: {
    name: string
    specialty: string
    experience: number
    city: string
    image: string
    description: string
    achievements: string[]
    clients: number
    satisfaction: number
  }
  categorySlug: string
}

export default function FeaturedProfessional({ professional, categorySlug }: FeaturedProfessionalProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <Award className="text-primary" size={20} />
          <span className="text-sm font-semibold text-primary">Destacado del Mes</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Profesional del Mes</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Reconocemos la excelencia y dedicación de nuestros mejores profesionales
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background rounded-3xl overflow-hidden border border-primary/20 shadow-2xl hover:shadow-primary/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-96 md:h-auto overflow-hidden group">
            <img
              src={professional.image || "/placeholder.svg"}
              alt={professional.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-yellow-500 fill-yellow-500" size={24} />
                <span className="text-sm font-semibold text-white bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                  Mejor Calificado
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{professional.name}</h3>
                <p className="text-lg md:text-xl text-primary font-semibold">{professional.specialty}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    <span>{professional.experience} años de experiencia</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{professional.city}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{professional.description}</p>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Award className="text-primary" size={18} />
                  Logros Destacados
                </h4>
                {professional.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/achievement">
                    <ChevronRight
                      className="text-primary flex-shrink-0 mt-0.5 group-hover/achievement:translate-x-1 transition-transform"
                      size={18}
                    />
                    <span className="text-sm text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                <div className="text-center p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                  <Users className="mx-auto mb-2 text-primary" size={24} />
                  <div className="text-2xl font-bold text-foreground">{professional.clients}+</div>
                  <div className="text-xs text-muted-foreground">Clientes</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                  <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
                  <div className="text-2xl font-bold text-foreground">{professional.satisfaction}%</div>
                  <div className="text-xs text-muted-foreground">Satisfacción</div>
                </div>
              </div>

              <Link
                href={`/${categorySlug}`}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-95 group"
              >
                Ver Perfil Completo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
