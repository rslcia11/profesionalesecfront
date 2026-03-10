"use client"

import { useState, useEffect, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import ProfessionalsCategoryList from "@/components/shared/professionals-category-list"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import { useSpecialtyCounts } from "@/hooks/use-specialty-counts"
import { catalogosApi } from "@/lib/api"
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

  const PROFESSION_ID = 2 // Ingeniería y Tecnología
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Ingeniería Civil": { description: "Construcción, estructuras y proyectos de infraestructura", icon: Building2 },
    "Ingeniería Industrial": { description: "Optimización de procesos y gestión industrial", icon: Cpu },
    "Ingeniería Electrónica": { description: "Sistemas electrónicos, automatización y control", icon: Zap },
    "Ingeniería en Sistemas": { description: "Desarrollo de software, redes y TI", icon: Code },
    "Ingeniería Ambiental": { description: "Sostenibilidad y gestión ambiental", icon: Leaf },
    "Ingeniería Robótica": { description: "Robótica, automatización e IA", icon: Bot },
  }

  const serviceCategories = useMemo(() => {
    if (apiSpecialties.length === 0) {
      return Object.entries(editorialMeta).map(([name, meta]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name, description: meta.description, icon: meta.icon,
      }))
    }
    return apiSpecialties.map(spec => {
      const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Cpu }
      return {
        id: spec.nombre.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name: spec.nombre, description: meta.description, icon: meta.icon,
        count: countsBySpecialty.get(spec.id) || 0,
      }
    })
  }, [apiSpecialties, countsBySpecialty])

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

      <ProfessionalsCategoryList
        professionIds={[2]}
        title="Ingenieros y Tecnólogos Expertos"
        description="Soluciones técnicas y tecnológicas con profesionales certificados"
      />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
