"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import { Code, Cpu, Zap, Leaf, Bot, Building2 } from "lucide-react"

export default function IngenieriaYTecnologiaPage() {
  const heroSlides = [
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Profesionales en Ingeniería y Tecnología",
      subtitle: "Expertos en innovación y soluciones tecnológicas",
    },
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Tecnología de Vanguardia",
      subtitle: "Ingenieros certificados para tus proyectos",
    },
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Innovación y Desarrollo",
      subtitle: "Soluciones tecnológicas con profesionales verificados",
    },
  ]

  const featuredProfessional = {
    name: "Ing. Carlos Mendoza",
    specialty: "Ingeniero Civil",
    experience: 18,
    city: "Quito",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Ingeniero Civil con más de 18 años de experiencia en gestión de proyectos de infraestructura. Especializado en obras civiles de gran envergadura y edificaciones.",
    achievements: [
      "Maestría en Gestión de Proyectos - PMI",
      "Director de más de 50 proyectos de infraestructura",
      "Certificación en BIM y modelado 3D",
      "Reconocimiento Nacional de Ingeniería Civil 2024",
    ],
    clients: 280,
    satisfaction: 96,
  }

  const serviceCategories = [
    {
      id: "ingenieria-civil",
      name: "Ingeniería Civil",
      description: "Construcción, estructuras y proyectos de infraestructura",
      icon: Building2,
      count: 48,
    },
    {
      id: "ingenieria-industrial",
      name: "Ingeniería Industrial",
      description: "Optimización de procesos y gestión industrial",
      icon: Cpu,
      count: 38,
    },
    {
      id: "ingenieria-electronica",
      name: "Ingeniería Electrónica",
      description: "Sistemas electrónicos, automatización y control",
      icon: Zap,
      count: 32,
    },
    {
      id: "ingenieria-sistemas",
      name: "Ingeniería en Sistemas",
      description: "Desarrollo de software, redes y TI",
      icon: Code,
      count: 65,
    },
    {
      id: "ingenieria-ambiental",
      name: "Ingeniería Ambiental",
      description: "Sostenibilidad y gestión ambiental",
      icon: Leaf,
      count: 25,
    },
    {
      id: "ingenieria-robotica",
      name: "Ingeniería Robótica",
      description: "Robótica, automatización e IA",
      icon: Bot,
      count: 18,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "transformacion-digital-empresas",
      title: "La Transformación Digital en las Empresas",
      excerpt: "Cómo la tecnología está revolucionando los procesos empresariales y aumentando la productividad.",
      image: "/placeholder.svg?height=400&width=600",
      date: "25 de enero de 2025",
      readTime: "7 min",
      author: "María Torres",
      role: "Ingeniera en Sistemas",
    },
    {
      id: "2",
      slug: "ingenieria-sostenible",
      title: "Ingeniería Sostenible y Medio Ambiente",
      excerpt: "El rol crucial de la ingeniería ambiental en la construcción de un futuro sostenible.",
      image: "/placeholder.svg?height=400&width=600",
      date: "19 de enero de 2025",
      readTime: "6 min",
      author: "Ana Gutiérrez",
      role: "Ingeniera Ambiental",
    },
    {
      id: "3",
      slug: "automatizacion-industria-40",
      title: "Automatización e Industria 4.0",
      excerpt: "Descubre cómo la automatización está transformando los procesos industriales modernos.",
      image: "/placeholder.svg?height=400&width=600",
      date: "13 de enero de 2025",
      readTime: "8 min",
      author: "Roberto Salazar",
      role: "Ingeniero Industrial",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative">
        <ProfessionalHeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
      </section>

      <ProfessionalServicesGrid
        title="Especialidades en Ingeniería y Tecnología"
        subtitle="Encuentra ingenieros especializados para tus proyectos tecnológicos"
        categories={serviceCategories}
        basePath="/ingenieria-y-tecnologia"
      />

      <FeaturedProfessional professional={featuredProfessional} categorySlug="ingenieria-y-tecnologia" />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
