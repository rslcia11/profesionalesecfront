"use client"

import { useState } from "react"
import { Building2, Handshake, Award, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"

const convenios = [
  {
    id: 1,
    name: "Universidad Central del Ecuador",
    logo: "/universidad-central.jpg",
    category: "Educación",
    description: "Convenio de cooperación académica y desarrollo profesional",
    benefits: ["Descuentos en capacitaciones", "Acceso a biblioteca digital", "Eventos exclusivos"],
    icon: Award,
  },
  {
    id: 2,
    name: "Cámara de Comercio de Quito",
    logo: "/camara-comercio.jpg",
    category: "Empresarial",
    description: "Alianza estratégica para fomentar el networking empresarial",
    benefits: ["Red de contactos", "Eventos de networking", "Asesoría empresarial"],
    icon: Building2,
  },
  {
    id: 3,
    name: "Ministerio de Trabajo",
    logo: "/ministerio-trabajo.jpg",
    category: "Gubernamental",
    description: "Colaboración para promover oportunidades laborales",
    benefits: ["Bolsa de empleo", "Capacitación gratuita", "Certificaciones oficiales"],
    icon: Handshake,
  },
  {
    id: 4,
    name: "Asociación de Profesionales",
    logo: "/asociacion-profesionales.jpg",
    category: "Gremial",
    description: "Unión para fortalecer el desarrollo profesional en Ecuador",
    benefits: ["Representación gremial", "Eventos especializados", "Publicaciones técnicas"],
    icon: TrendingUp,
  },
]

export default function Convenios() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % convenios.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + convenios.length) % convenios.length)
  }

  const currentConvenio = convenios[currentIndex]
  const IconComponent = currentConvenio.icon

  return (
    <section className="py-8 md:py-10 px-4 bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">Nuestros Convenios</h2>
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
                    src={currentConvenio.logo || "/placeholder.svg"}
                    alt={currentConvenio.name}
                    className="w-40 h-40 rounded-full border-4 border-primary/20 object-cover relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-full z-20 shadow-lg">
                    <IconComponent size={24} />
                  </div>
                </div>
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-button font-semibold">
                  {currentConvenio.category}
                </div>
              </div>

              {/* Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-heading font-bold mb-3 text-foreground">{currentConvenio.name}</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">{currentConvenio.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-heading font-semibold mb-3 text-foreground">Beneficios:</h4>
                  <ul className="space-y-2">
                    {currentConvenio.benefits.map((benefit, index) => (
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
