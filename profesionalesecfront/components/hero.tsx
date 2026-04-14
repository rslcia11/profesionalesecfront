"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Hero() {
  const carouselImages = [
    "/images/0cef6a13d87d872103747b3f8da1cd07.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
    "/images/7.jpg",
    "/images/8.jpg",
    "/images/9.jpg",
    "/images/10.jpg",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [startX, setStartX] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [carouselImages.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }, [carouselImages.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
  }, [carouselImages.length])

  return (
    <section className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-black">
      {/* Images */}
      <div className="absolute inset-0 w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Profesional ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Desktop Navigation */}
      <button
        onClick={goToPrevious}
        className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={goToNext}
        className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Desktop Indicators */}
      <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30 gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile/Tablet Indicators */}
      <div className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {carouselImages.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-4 h-1.5" : "bg-white/40 w-1.5 h-1.5"
            }`}
          />
        ))}
      </div>

      {/* Text */}
      <div className="relative z-10 px-6 lg:px-16 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="max-w-3xl">
          <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 leading-[1.1] text-white break-words">
            Conectando
            <br />
            profesionales
            <br />
            de excelencia
          </h1>
        </div>
      </div>

      {/* Invisible swipe overlay for mobile/tablet */}
      <div 
        className="lg:hidden absolute inset-0 z-25"
        onTouchStart={(e) => setStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const endX = e.changedTouches[0].clientX
          const diff = startX - endX
          if (Math.abs(diff) > 50) {
            if (diff > 0) goToNext()
            else goToPrevious()
          }
        }}
        style={{ zIndex: 25 }}
      />
    </section>
  )
}
