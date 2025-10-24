"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const heroSlides = [
  {
    id: 1,
    image: "/construction-workers-professional-team.jpg",
    subtitle: "¿BUSCANDO UN PROFESIONAL?",
    title: "Encuentra a todos en Profesionales.ec",
  },
  {
    id: 2,
    image: "/business-professionals-working.jpg",
    subtitle: "¿NECESITAS SERVICIOS?",
    title: "Conecta con expertos en tu área",
  },
  {
    id: 3,
    image: "/team-collaboration-professional.jpg",
    subtitle: "¿QUIERES CRECER?",
    title: "Únete a nuestra comunidad",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setAutoPlay(false)
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative w-full h-screen mt-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url('${slide.image}')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <p className="text-lg md:text-xl font-light mb-4 text-shadow-lg">{slide.subtitle}</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-shadow-xl text-balance">{slide.title}</h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-base font-medium bg-transparent"
          >
            BUSCAR PROFESIONAL
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-base font-medium">REGISTRARSE</Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-2 absolute bottom-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition"
        aria-label="Next slide"
      >
        <ChevronRight size={40} />
      </button>
    </section>
  )
}
