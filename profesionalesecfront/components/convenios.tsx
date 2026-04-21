"use client"

import { useState, useEffect } from "react"
import { Building2, Handshake, Award, TrendingUp, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface Convenio {
  id: number
  titulo: string
  descripcion: string
  link?: string
  beneficios: string[]
  categorias?: string
  logoUrl?: string
  bannerUrl?: string
}

// Icon mapping for compatibility with existing design
const ICON_MAP: Record<string, any> = {
  Building2,
  Handshake,
  Award,
  TrendingUp,
}

const DEFAULT_ICON = Handshake

export default function Convenios() {
  const [convenios, setConvenios] = useState<Convenio[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/convenios?limit=10&offset=0")
        
        if (!response.ok) {
          throw new Error("Error al cargar convenios")
        }

        const data = await response.json()
        const conveniosData = Array.isArray(data.data) ? data.data : []
        
        // Filter only published convenios and map for display
        const publishedConvenios = conveniosData.map((conv: any) => ({
          id: conv.id,
          titulo: conv.titulo,
          descripcion: conv.descripcion,
          link: conv.link,
          beneficios: conv.beneficios || [],
          categorias: conv.categorias,
          logoUrl: conv.logoUrl,
          bannerUrl: conv.bannerUrl,
        }))

        setConvenios(publishedConvenios)
        
        // Reset index if it's out of bounds
        if (currentIndex >= publishedConvenios.length && publishedConvenios.length > 0) {
          setCurrentIndex(0)
        }
      } catch (err) {
        console.error("Error fetching convenios:", err)
        setError("No se pudieron cargar los convenios")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConvenios()
  }, [])

  const nextSlide = () => {
    if (convenios.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % convenios.length)
  }

  const prevSlide = () => {
    if (convenios.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + convenios.length) % convenios.length)
  }

  // If no convenios or loading, show nothing (or could show a fallback)
  if (isLoading) {
    return (
      <section className="py-8 md:py-10 px-4 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
              Nuestros Convenios
            </h2>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Alianzas estratégicas que fortalecen tu crecimiento profesional
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error || convenios.length === 0) {
    return null // Hide section if no convenios or error
  }

  const currentConvenio = convenios[currentIndex]

  // Determine icon based on category or use default
  const getIconComponent = (category?: string) => {
    if (category) {
      const normalizedCategory = category.toLowerCase()
      if (normalizedCategory.includes("educación") || normalizedCategory.includes("educacion")) return Award
      if (normalizedCategory.includes("empresarial") || normalizedCategory.includes("negocios")) return Building2
      if (normalizedCategory.includes("gubernamental") || normalizedCategory.includes("gobierno")) return Handshake
      if (normalizedCategory.includes("profesional") || normalizedCategory.includes("gremial")) return TrendingUp
    }
    return DEFAULT_ICON
  }

  const IconComponent = getIconComponent(currentConvenio.categorias)

  return (
    <section className="py-8 md:py-10 px-4 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            Nuestros Convenios
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Alianzas estratégicas que fortalecen tu crecimiento profesional
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Logo and Icon */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src={currentConvenio.logoUrl || "/placeholder.svg"}
                    alt={currentConvenio.titulo}
                    className="w-40 h-40 rounded-full border-4 border-primary/20 object-cover relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-full z-20 shadow-lg">
                    <IconComponent size={24} />
                  </div>
                </div>
                {currentConvenio.categorias && (
                  <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-button font-semibold">
                    {currentConvenio.categorias}
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-heading font-bold mb-3 text-foreground">
                    {currentConvenio.titulo}
                  </h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    {currentConvenio.descripcion}
                  </p>
                </div>

                {currentConvenio.beneficios && currentConvenio.beneficios.length > 0 && (
                  <div>
                    <h4 className="text-lg font-heading font-semibold mb-3 text-foreground">
                      Beneficios:
                    </h4>
                    <ul className="space-y-2">
                      {currentConvenio.beneficios.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-muted-foreground font-body animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentConvenio.link && (
                  <a
                    href={currentConvenio.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Visitar sitio
                    <TrendingUp size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-card border border-border rounded-full p-3 shadow-lg hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 z-20"
            aria-label="Anterior convenio"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-card border border-border rounded-full p-3 shadow-lg hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 z-20"
            aria-label="Siguiente convenio"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {convenios.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                }`}
                aria-label={`Ir a convenio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
