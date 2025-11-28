"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import { Building2, Home, Mountain, Hammer, Ruler, PenTool } from "lucide-react"

export default function DisenoYConstruccionPage() {
  const heroSlides = [
    {
      image: "/architect-blueprint-construction.jpg",
      title: "Profesionales en Diseño y Construcción",
      subtitle: "Expertos para materializar tus proyectos arquitectónicos",
    },
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Diseño y Construcción de Excelencia",
      subtitle: "Arquitectos, diseñadores y constructores certificados",
    },
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Transforma tus Espacios",
      subtitle: "De la idea al proyecto terminado con profesionales verificados",
    },
  ]

  const featuredProfessional = {
    name: "Arq. Diego Mendoza",
    specialty: "Arquitecto",
    experience: 15,
    city: "Quito",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Arquitecto con más de 15 años de experiencia en diseño arquitectónico residencial y comercial. Especializado en arquitectura sostenible y proyectos de alta complejidad.",
    achievements: [
      "Maestría en Arquitectura Sostenible",
      "Más de 80 proyectos residenciales completados",
      "Premio Nacional de Arquitectura 2023",
      "Miembro del Colegio de Arquitectos del Ecuador",
    ],
    clients: 150,
    satisfaction: 97,
  }

  const serviceCategories = [
    {
      id: "arquitectura",
      name: "Arquitectura",
      description: "Diseño arquitectónico residencial y comercial",
      icon: Building2,
      count: 48,
    },
    {
      id: "interiores",
      name: "Diseño de Interiores",
      description: "Espacios interiores funcionales y estéticos",
      icon: Home,
      count: 42,
    },
    {
      id: "topografia",
      name: "Topografía",
      description: "Levantamiento topográfico y mediciones",
      icon: Mountain,
      count: 28,
    },
    {
      id: "construccion",
      name: "Construcción Civil",
      description: "Gestión y supervisión de obras",
      icon: Hammer,
      count: 55,
    },
    {
      id: "planificacion",
      name: "Planificación Urbana",
      description: "Diseño y planificación de espacios urbanos",
      icon: Ruler,
      count: 22,
    },
    {
      id: "diseno-estructural",
      name: "Diseño Estructural",
      description: "Cálculo y diseño de estructuras",
      icon: PenTool,
      count: 35,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "arquitectura-sostenible-ecuador",
      title: "Arquitectura Sostenible en Ecuador",
      excerpt: "Descubre cómo implementar prácticas sostenibles en tus proyectos de construcción.",
      image: "/placeholder.svg?height=400&width=600",
      date: "22 de enero de 2025",
      readTime: "7 min",
      author: "Sofía Paredes",
      role: "Arquitecta Sostenible",
    },
    {
      id: "2",
      slug: "tendencias-diseno-interiores",
      title: "Tendencias de Diseño de Interiores 2025",
      excerpt: "Las últimas tendencias en diseño de interiores que transformarán tus espacios.",
      image: "/placeholder.svg?height=400&width=600",
      date: "16 de enero de 2025",
      readTime: "6 min",
      author: "Andrea Moreno",
      role: "Diseñadora de Interiores",
    },
    {
      id: "3",
      slug: "claves-construccion-exitosa",
      title: "Claves para una Construcción Exitosa",
      excerpt: "Aspectos fundamentales que debes considerar antes de iniciar tu proyecto constructivo.",
      image: "/placeholder.svg?height=400&width=600",
      date: "11 de enero de 2025",
      readTime: "8 min",
      author: "Ing. Roberto Castro",
      role: "Ingeniero Civil",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative">
        <ProfessionalHeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
      </section>

      <ProfessionalServicesGrid
        title="Especialidades en Diseño y Construcción"
        subtitle="Encuentra profesionales verificados para tu proyecto arquitectónico"
        categories={serviceCategories}
        basePath="/diseno-y-construccion"
      />

      <FeaturedProfessional professional={featuredProfessional} categorySlug="diseno-y-construccion" />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
