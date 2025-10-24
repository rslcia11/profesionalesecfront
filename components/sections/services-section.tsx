"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const services = [
  {
    id: 1,
    title: "Derecho",
    image: "/lawyer-professional-office.jpg",
  },
  {
    id: 2,
    title: "Salud",
    image: "/healthcare-medical-professional.jpg",
  },
  {
    id: 3,
    title: "Economía y Administración",
    image: "/business-professional-woman.jpg",
  },
  {
    id: 4,
    title: "Oficios y más",
    image: "/mechanic-professional-working.jpg",
  },
]

export function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">Servicios Profesionales</h2>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {services.map((service) => (
                  <div key={service.id} className="w-full flex-shrink-0 px-2">
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 text-black hover:text-gray-600 transition"
              aria-label="Previous service"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 text-black hover:text-gray-600 transition"
              aria-label="Next service"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex gap-2 justify-center mt-6">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-black w-6" : "bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: (typeof services)[0] }) {
  return (
    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group cursor-pointer">
      <img
        src={service.image || "/placeholder.svg"}
        alt={service.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="absolute inset-0 flex items-end justify-center pb-6">
        <div className="border border-white text-white px-6 py-2 rounded-full text-center font-medium">
          {service.title}
        </div>
      </div>
    </div>
  )
}
