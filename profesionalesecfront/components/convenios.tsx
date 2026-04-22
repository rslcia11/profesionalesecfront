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

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        const response = await fetch(`${backendUrl}/convenios?limit=10&offset=0`)

        if (!response.ok) {
          throw new Error("Error al cargar convenios")
        }

        const data = await response.json()
        // El backend devuelve { data: [...], meta: {...} }
        const conveniosData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []

        const mappedConvenios = conveniosData.map((conv: any) => ({
          id: conv.id,
          titulo: conv.titulo,
          descripcion: conv.descripcion,
          link: conv.link,
          beneficios: conv.beneficios || [],
          categorias: conv.categorias,
          logoUrl: conv.logoUrl,
          bannerUrl: conv.bannerUrl,
        }))

        setConvenios(mappedConvenios)

        if (currentIndex >= mappedConvenios.length && mappedConvenios.length > 0) {
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

  const getVisibleConvenios = () => {
    if (convenios.length === 0) return []
    if (convenios.length === 1) return [convenios[0]]
    const first = convenios[currentIndex]
    const second = convenios[(currentIndex + 1) % convenios.length]
    return [first, second]
  }

  return (
    <section className="py-8 md:py-16 px-4 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            Nuestros Convenios
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Alianzas estratégicas que fortalecen tu crecimiento profesional
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-0 md:px-14 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {getVisibleConvenios().map((convenio, idx) => {
              const IconComponent = getIconComponent(convenio.categorias)
              return (
                <div
                  key={`${convenio.id}-${idx}`}
                  className={`bg-card border border-border rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 flex-col h-full ${
                    idx === 1 ? "hidden md:flex" : "flex"
                  }`}
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative group mt-2 mb-2">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                      <img
                        src={convenio.logoUrl || "/placeholder.svg"}
                        alt={convenio.titulo}
                        className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-card object-cover relative z-10 transform group-hover:scale-105 transition-transform duration-500 shadow-xl"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-full z-20 shadow-lg">
                        <IconComponent size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 flex-grow flex flex-col">
                    <div className="text-center flex flex-col items-center">
                      <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 text-foreground">
                        {convenio.titulo}
                      </h3>
                      {convenio.categorias && (
                        <div className="inline-block px-4 py-1.5 mb-4 bg-primary/10 text-primary rounded-full text-xs font-button font-bold uppercase tracking-wider">
                          {convenio.categorias}
                        </div>
                      )}
                      <p className="text-muted-foreground font-body leading-relaxed text-xs md:text-sm max-w-[90%] mx-auto">
                        {convenio.descripcion}
                      </p>
                    </div>

                    {convenio.beneficios && convenio.beneficios.length > 0 && (
                      <div className="flex-grow pt-4 border-t border-border/50 mt-4">
                        <h4 className="text-sm font-heading font-bold mb-4 text-foreground text-center uppercase tracking-wider text-muted-foreground">
                          Beneficios Incluidos
                        </h4>
                        <ul className="space-y-2 max-w-sm mx-auto">
                          {convenio.beneficios.map((benefit: string, bIndex: number) => (
                            <li
                              key={bIndex}
                              className="flex items-start gap-2 text-muted-foreground font-body text-xs md:text-sm"
                            >
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0 shadow-sm" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {convenio.link && (
                      <div className="text-center pt-6 mt-auto">
                        <a
                          href={convenio.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-button font-bold transition-colors group"
                        >
                          Visitar sitio
                          <TrendingUp size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-2 md:left-2 lg:-left-4 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-3 md:p-4 shadow-xl hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 z-20"
            aria-label="Anterior convenio"
          >
            <ChevronLeft size={24} className="md:w-7 md:h-7" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-2 md:right-2 lg:-right-4 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-3 md:p-4 shadow-xl hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 z-20"
            aria-label="Siguiente convenio"
          >
            <ChevronRight size={24} className="md:w-7 md:h-7" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-10 md:mt-12">
            {convenios.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-10 bg-primary shadow-md" : "w-2.5 bg-border hover:bg-primary/50"
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
