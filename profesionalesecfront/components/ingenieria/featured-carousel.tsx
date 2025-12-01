"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Professional {
    id: string
    name: string
    specialty: string
    image: string
    rating: number
    projects: number
}

interface FeaturedCarouselProps {
    professionals: Professional[]
}

export function FeaturedCarousel({ professionals }: FeaturedCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-play carousel every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % professionals.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [professionals.length])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % professionals.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + professionals.length) % professionals.length)
    }

    const currentProfessional = professionals[currentSlide]

    return (
        <>
            {/* Hero Section with Carousel Background */}
            <section className="relative text-white overflow-hidden">
                <div className="relative h-[70vh] min-h-[600px]">
                    {/* Background Images */}
                    {professionals.map((professional, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === idx ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <img
                                src={professional.image || "/placeholder.svg"}
                                alt={professional.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                    ))}

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center px-6">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8">Profesionales Destacados</h1>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <Button
                        onClick={prevSlide}
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 rounded-full border-white/50 hover:bg-white hover:text-gray-900 bg-black/50 text-white backdrop-blur-sm h-14 w-14 border-2"
                    >
                        <ChevronLeft size={28} />
                    </Button>

                    <Button
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 rounded-full border-white/50 hover:bg-white hover:text-gray-900 bg-black/50 text-white backdrop-blur-sm h-14 w-14 border-2"
                    >
                        <ChevronRight size={28} />
                    </Button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-3 z-20">
                        {professionals.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-3 rounded-full transition-all ${currentSlide === idx ? "w-12 bg-white" : "w-3 bg-white/40"}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Info Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <img
                                    src={currentProfessional.image || "/placeholder.svg"}
                                    alt={currentProfessional.name}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200"
                                />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-4xl font-bold text-gray-900 mb-3">{currentProfessional.name}</h2>
                                <p className="text-2xl text-gray-600 mb-6">{currentProfessional.specialty}</p>
                                <Link href={`/perfil/${currentProfessional.id}`}>
                                    <Button className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 rounded-lg text-lg">
                                        Ver perfil completo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
