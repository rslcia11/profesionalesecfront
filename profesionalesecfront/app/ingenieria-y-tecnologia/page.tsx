"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Code, Cpu, Zap, Leaf, Bot, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IngenieriaYTecnologia() {
  const [currentProfessionalSlide, setCurrentProfessionalSlide] = useState(0)

  const categories = [
    {
      icon: Building2,
      title: "Ingeniería Civil",
      slug: "ingenieria-civil",
      description: "Expertos en construcción, estructuras y proyectos de infraestructura",
      count: 24,
    },
    {
      icon: Cpu,
      title: "Ingeniería Industrial",
      slug: "ingenieria-industrial",
      description: "Optimización de procesos, producción y gestión industrial",
      count: 18,
    },
    {
      icon: Zap,
      title: "Ingeniería Electrónica",
      slug: "ingenieria-electronica",
      description: "Sistemas electrónicos, automatización y control",
      count: 15,
    },
    {
      icon: Code,
      title: "Ingeniería en Sistemas",
      slug: "ingenieria-sistemas",
      description: "Desarrollo de software, redes y tecnologías de información",
      count: 32,
    },
    {
      icon: Leaf,
      title: "Ingeniería Ambiental",
      slug: "ingenieria-ambiental",
      description: "Sostenibilidad, gestión ambiental y proyectos ecológicos",
      count: 12,
    },
    {
      icon: Bot,
      title: "Ingeniería Robótica",
      slug: "ingenieria-robotica",
      description: "Robótica, automatización e inteligencia artificial",
      count: 9,
    },
  ]

  const featuredProfessionals = [
    {
      id: "carlos-mendoza",
      name: "Ing. Carlos Mendoza",
      specialty: "Ingeniería Civil",
      image: "/professional-engineer.png",
      rating: 4.9,
      projects: 45,
    },
    {
      id: "maria-torres",
      name: "Ing. María Torres",
      specialty: "Ingeniería en Sistemas",
      image: "/female-software-engineer.jpg",
      rating: 5.0,
      projects: 68,
    },
    {
      id: "roberto-salazar",
      name: "Ing. Roberto Salazar",
      specialty: "Ingeniería Industrial",
      image: "/industrial-engineer.jpg",
      rating: 4.8,
      projects: 52,
    },
    {
      id: "ana-gutierrez",
      name: "Ing. Ana Gutiérrez",
      specialty: "Ingeniería Ambiental",
      image: "/environmental-engineer.jpg",
      rating: 4.9,
      projects: 38,
    },
    {
      id: "diego-ramirez",
      name: "Ing. Diego Ramírez",
      specialty: "Ingeniería Electrónica",
      image: "/electronic-engineer.jpg",
      rating: 4.7,
      projects: 41,
    },
  ]

  const nextProfessionalSlide = () => {
    setCurrentProfessionalSlide((prev) => (prev + 1) % featuredProfessionals.length)
  }

  const prevProfessionalSlide = () => {
    setCurrentProfessionalSlide((prev) => (prev - 1 + featuredProfessionals.length) % featuredProfessionals.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextProfessionalSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [currentProfessionalSlide])

  const blogPost = {
    image: "/artificial-intelligence-technology.png",
    title: "Cómo Mejorar la Eficiencia en Proyectos de Ingeniería",
    date: "15 de octubre de 2023",
    excerpt: "Descubre técnicas y herramientas para optimizar la gestión y ejecución de proyectos de ingeniería.",
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="relative text-white overflow-hidden">
          {/* Background Image Carousel */}
          <div className="relative h-[70vh] min-h-[600px]">
            {featuredProfessionals.map((professional, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ${currentProfessionalSlide === idx ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50" />
              </div>
            ))}

            {/* Content over the image */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-6">
                <h1 className="text-5xl md:text-7xl font-bold mb-8">Profesionales Destacados</h1>
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              onClick={prevProfessionalSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 rounded-full border-2 border-white/50 hover:bg-white hover:text-gray-900 bg-black/50 text-white backdrop-blur-sm h-14 w-14 flex items-center justify-center"
            >
              <ChevronLeft size={28} />
            </Button>

            <Button
              onClick={nextProfessionalSlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 rounded-full border-2 border-white/50 hover:bg-white hover:text-gray-900 bg-black/50 text-white backdrop-blur-sm h-14 w-14 flex items-center justify-center"
            >
              <ChevronRight size={28} />
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-3 z-20">
              {featuredProfessionals.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentProfessionalSlide(idx)}
                  className={`h-3 rounded-full transition-all ${currentProfessionalSlide === idx ? "w-12 bg-white" : "w-3 bg-white/40"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Professional Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={featuredProfessionals[currentProfessionalSlide].image || "/placeholder.svg"}
                    alt={featuredProfessionals[currentProfessionalSlide].name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>

                {/* Professional Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    {featuredProfessionals[currentProfessionalSlide].name}
                  </h2>
                  <p className="text-2xl text-gray-600 mb-6">
                    {featuredProfessionals[currentProfessionalSlide].specialty}
                  </p>
                  <Link href={`/perfil/${featuredProfessionals[currentProfessionalSlide].id}`}>
                    <Button className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 text-lg">
                      Ver perfil completo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servicios Profesionales</h2>
            <p className="text-gray-600 mb-12">Explora nuestras categorías de ingeniería especializadas</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, idx) => {
                const Icon = category.icon
                return (
                  <Link key={idx} href={`/categoria/${category.slug}`}>
                    <div className="group p-8 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all cursor-pointer">
                      <div className="bg-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                        <Icon className="text-gray-700 group-hover:text-white transition-colors" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{category.count} profesionales</span>
                        <Button className="bg-transparent hover:bg-transparent text-gray-900 font-semibold text-sm px-0">
                          VER PROFESIONALES →
                        </Button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Nuestro blog</h2>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <img
                  src={blogPost.image || "/placeholder.svg"}
                  alt={blogPost.title}
                  className="w-full h-full object-cover min-h-[300px]"
                />
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-sm text-gray-500 mb-4">{blogPost.date}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-balance">{blogPost.title}</h3>
                  <p className="text-gray-600 mb-6">{blogPost.excerpt}</p>
                  <Link href="/blog/ingenieria" className="self-start">
                    <Button className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent px-6 py-2">
                      Leer más →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">¿Eres ingeniero profesional?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Únete a nuestra red de profesionales y conecta con clientes que necesitan tus servicios
            </p>
            <Link href="/registro-profesional">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-8 text-lg">
                Crear Perfil Profesional
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
