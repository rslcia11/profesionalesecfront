"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  image: string
  title: string
  subtitle?: string
}

interface ProfessionalHeroCarouselProps {
  slides: Slide[]
  autoplay?: boolean
  autoplayInterval?: number
}

export default function ProfessionalHeroCarousel({
  slides,
  autoplay = true,
  autoplayInterval = 5000,
}: ProfessionalHeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, currentSlide])

  return (
    <div className="relative h-[70vh] min-h-[500px] md:min-h-[600px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === idx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Slide Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-balance drop-shadow-2xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-white/90 text-balance drop-shadow-lg">{slide.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 rounded-full border-2 border-white/50 hover:bg-white hover:text-gray-900 bg-black/30 text-white backdrop-blur-sm h-12 w-12 md:h-14 md:w-14 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 rounded-full border-2 border-white/50 hover:bg-white hover:text-gray-900 bg-black/30 text-white backdrop-blur-sm h-12 w-12 md:h-14 md:w-14 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 md:gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "w-8 md:w-12 bg-white" : "w-2 md:w-3 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
