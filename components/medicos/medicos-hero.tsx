"use client"

import { Stethoscope, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

const slides = [
  {
    id: 0,
    type: "intro",
    image: "/professionals-working-in-modern-office-environment.jpg",
    message: "¿Necesitas un médico?",
    subtitle: "Momento de cuidar Tu Salud",
    description: "Encuentra los mejores profesionales de la salud en Ecuador",
  },
  {
    id: 1,
    type: "featured",
    name: "Dra. María González",
    specialty: "Cardiología",
    image: "/female-doctor-cardiology.jpg",
    message: "¿Necesitas un cardiólogo?",
    subtitle: "Cuida tu corazón con expertos",
    description: "Profesional del mes en Cardiología. Más de 15 años de experiencia.",
  },
  {
    id: 2,
    type: "featured",
    name: "Dr. Carlos Mendoza",
    specialty: "Odontología",
    image: "/male-dentist-professional.jpg",
    message: "¿Buscas un odontólogo?",
    subtitle: "Tu sonrisa en las mejores manos",
    description: "Profesional del mes en Odontología. Especialista en estética dental.",
  },
  {
    id: 3,
    type: "featured",
    name: "Dra. Ana Ramírez",
    specialty: "Nutrición",
    image: "/female-nutritionist-professional.jpg",
    message: "¿Necesitas un nutricionista?",
    subtitle: "Alimentación saludable para ti",
    description: "Profesional del mes en Nutrición. Experta en nutrición deportiva.",
  },
]

export default function MedicosHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const currentContent = slides[currentSlide]

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.name || "Medical professional"}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      <div className="relative z-10 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl text-center lg:text-left">
          {currentContent.type === "featured" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-semibold mb-6">
              <Stethoscope size={16} />
              Profesional del Mes - {currentContent.specialty}
            </div>
          )}

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight text-white text-balance">
            {currentContent.message}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-white/90 font-semibold mb-6">{currentContent.subtitle}</p>

          {currentContent.type === "featured" && (
            <div className="mb-8">
              <p className="text-xl font-bold text-white mb-2">{currentContent.name}</p>
              <p className="text-base text-white/80">{currentContent.description}</p>
            </div>
          )}

          {currentContent.type === "intro" && (
            <div className="mb-8">
              <p className="text-lg text-white/90">{currentContent.description}</p>
            </div>
          )}

          {/* CTA Button */}
          <a
            href="#categorias"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-foreground rounded-full font-semibold hover:bg-white/90 transition-all hover:shadow-xl"
          >
            <Search size={20} />
            Buscar profesional
          </a>
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 md:left-4 md:right-4 z-20 flex justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto text-white hover:text-white/80 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft size={48} strokeWidth={1.5} />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto text-white hover:text-white/80 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight size={48} strokeWidth={1.5} />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-12 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
