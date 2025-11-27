"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ServiceCard {
  id: string
  title: string
  image: string
  href?: string
}

interface ServicesCarouselProps {
  services: ServiceCard[]
  itemsPerView?: number
}

export default function ServicesCarousel({ services, itemsPerView = 4 }: ServicesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false)

  const totalPages = Math.ceil(services.length / itemsPerView)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextPage = (prev + 1) % totalPages
        return nextPage
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, totalPages])

  const handlePrev = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const startIdx = currentIndex * itemsPerView
  const endIdx = Math.min(startIdx + itemsPerView, services.length)
  const visibleServices = services.slice(startIdx, endIdx)

  return (
    <div className="w-full space-y-8">
      {/* Carousel Container */}
      <div
        className="relative group"
        onMouseEnter={() => setIsHoveringCarousel(true)}
        onMouseLeave={() => setIsHoveringCarousel(false)}
      >
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleServices.map((service) => {
            const CardContent = (
              <div
                key={service.id}
                className="relative h-72 rounded-2xl overflow-hidden group/card cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                {/* Background Image */}
                <img
                  src={service.image || "/placeholder.svg?height=288&width=100%&query=professional service"}
                  alt={service.title}
                  className="w-full h-full object-cover absolute inset-0"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 group-hover/card:from-black/50 group-hover/card:to-black/80 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6 z-10">
                  <div className="w-full text-center">
                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full group-hover/card:bg-white/30 transition-all duration-300">
                      <p className="text-white font-semibold text-sm">{service.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            )

            return service.href ? (
              <Link key={service.id} href={service.href}>
                {CardContent}
              </Link>
            ) : (
              CardContent
            )
          })}
        </div>

        {/* Navigation Buttons - Left */}
        <button
          onClick={handlePrev}
          className={`absolute left-4 md:left-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-primary hover:bg-primary/80 text-white rounded-full shadow-lg transition-all duration-300 ${
            isHoveringCarousel
              ? "opacity-100 md:-translate-x-6 translate-x-0"
              : "opacity-0 md:translate-x-0 -translate-x-12"
          } active:scale-95 hover:shadow-xl`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Navigation Buttons - Right */}
        <button
          onClick={handleNext}
          className={`absolute right-4 md:right-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-primary hover:bg-primary/80 text-white rounded-full shadow-lg transition-all duration-300 ${
            isHoveringCarousel
              ? "opacity-100 md:translate-x-6 translate-x-0"
              : "opacity-0 md:translate-x-0 translate-x-12"
          } active:scale-95 hover:shadow-xl`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsAutoPlay(false)
              setCurrentIndex(idx)
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex ? "bg-primary w-3 h-3" : "bg-primary/30 hover:bg-primary/50 w-2 h-2"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
