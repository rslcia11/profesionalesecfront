"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface HeroSlide {
  image: string
  title: string
  subtitle?: string
  ctaText: string
  ctaLink: string
}

interface ImageHeroCarouselProps {
  slides: HeroSlide[]
  autoplay?: boolean
  autoplayInterval?: number
}

export default function ImageHeroCarousel({
  slides,
  autoplay = true,
  autoplayInterval = 5000,
}: ImageHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!autoplay || slides.length <= 1 || isHovered) return

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, autoplayInterval)

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    }
  }, [autoplay, slides.length, autoplayInterval, isHovered])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <div
      className="relative w-full h-[600px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-6">
            <div className="text-center max-w-4xl">
              {slide.subtitle && (
                <p className="text-white/90 text-lg md:text-xl mb-4 animate-fade-in font-light tracking-wide">
                  {slide.subtitle}
                </p>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in-up text-balance">
                {slide.title}
              </h1>
              <Link
                href={slide.ctaLink}
                className="inline-block px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/50 animate-fade-in-up"
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex ? "bg-white w-12 h-3" : "bg-white/50 hover:bg-white/70 w-3 h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
