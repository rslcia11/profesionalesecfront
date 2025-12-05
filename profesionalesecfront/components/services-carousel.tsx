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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  const totalPages = Math.ceil(services.length / itemsPerView)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setDirection("right")
      setCurrentIndex((prev) => {
        const nextPage = (prev + 1) % totalPages
        return nextPage
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, totalPages])

  const handlePrev = () => {
    if (isTransitioning) return
    setIsAutoPlay(false)
    setIsTransitioning(true)
    setDirection("left")
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
    setTimeout(() => {
      setIsTransitioning(false)
      setDirection(null)
    }, 1000)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsAutoPlay(false)
    setIsTransitioning(true)
    setDirection("right")
    setCurrentIndex((prev) => (prev + 1) % totalPages)
    setTimeout(() => {
      setIsTransitioning(false)
      setDirection(null)
    }, 1000)
  }

  const startIdx = currentIndex * itemsPerView
  const endIdx = Math.min(startIdx + itemsPerView, services.length)
  const visibleServices = services.slice(startIdx, endIdx)

  const getAnimationClass = () => {
    if (!direction) return "opacity-100 translate-x-0"
    if (direction === "right") return "animate-slide-in-right"
    return "animate-slide-in-left"
  }

  return (
    <div className="w-full space-y-8">
      <style jsx>{`
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div
        className="relative group overflow-hidden"
        onMouseEnter={() => setIsHoveringCarousel(true)}
        onMouseLeave={() => setIsHoveringCarousel(false)}
      >
        <div className={`transition-all duration-1000 ease-in-out ${getAnimationClass()}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleServices.map((service, index) => {
              const CardContent = (
                <div
                  key={service.id}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    opacity: 0,
                  }}
                  className="relative h-72 rounded-2xl overflow-hidden group/card cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                >
                  <img
                    src={service.image || "/placeholder.svg?height=288&width=100%&query=professional service"}
                    alt={service.title}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 ease-out group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 group-hover/card:from-black/50 group-hover/card:to-black/80 transition-all duration-500 ease-out" />
                  <div className="absolute inset-0 flex items-end p-6 z-10">
                    <div className="w-full text-center">
                      <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full group-hover/card:bg-white/30 group-hover/card:scale-105 transition-all duration-500 ease-out">
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
        </div>
        <button
          onClick={handlePrev}
          className={`absolute left-4 md:left-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-primary hover:bg-primary/80 text-white rounded-full shadow-lg transition-all duration-500 ease-out ${
            isHoveringCarousel
              ? "opacity-100 md:-translate-x-6 translate-x-0 scale-100"
              : "opacity-0 md:translate-x-0 -translate-x-12 scale-75"
          } active:scale-95 hover:shadow-2xl hover:scale-110`}
          aria-label="Previous slide"
          disabled={isTransitioning}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={handleNext}
          className={`absolute right-4 md:right-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-primary hover:bg-primary/80 text-white rounded-full shadow-lg transition-all duration-500 ease-out ${
            isHoveringCarousel
              ? "opacity-100 md:translate-x-6 translate-x-0 scale-100"
              : "opacity-0 md:translate-x-0 translate-x-12 scale-75"
          } active:scale-95 hover:shadow-2xl hover:scale-110`}
          aria-label="Next slide"
          disabled={isTransitioning}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isTransitioning) {
                setIsAutoPlay(false)
                setIsTransitioning(true)
                setDirection(idx > currentIndex ? "right" : "left")
                setCurrentIndex(idx)
                setTimeout(() => {
                  setIsTransitioning(false)
                  setDirection(null)
                }, 1000)
              }
            }}
            className={`transition-all duration-500 ease-in-out rounded-full ${
              idx === currentIndex
                ? "bg-primary w-3 h-3 scale-110"
                : "bg-primary/30 hover:bg-primary/50 w-2 h-2 hover:scale-125"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
