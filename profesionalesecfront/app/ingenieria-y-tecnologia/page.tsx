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
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Cpu }
        return {
          id: spec.id,
          name: spec.nombre,
          description: meta.description,
          icon: meta.icon,
          professionId: spec.profesion_id,
          specialtyId: spec.id,
          count: countsBySpecialty.get(spec.id) || 0,
        }
      })
  }, [apiSpecialties, countsBySpecialty])

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
      />

      <ProfessionalsCategoryList
        professionIds={[2]}
        title="Ingenieros y Tecnólogos Expertos"
        description="Soluciones técnicas y tecnológicas con profesionales certificados"
      />

      <BlogSection professionIds={[PROFESSION_ID]} />

      <Footer />
    </main>
  )
}
