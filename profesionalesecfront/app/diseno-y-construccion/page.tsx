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

  const PROFESSION_ID = 4 // Diseño y Construcción
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Arquitectura": { description: "Diseño arquitectónico residencial y comercial", icon: Building2 },
    "Diseño de Interiores": { description: "Espacios interiores funcionales y estéticos", icon: Home },
    "Topografía": { description: "Levantamiento topográfico y mediciones", icon: Mountain },
    "Construcción Civil": { description: "Gestión y supervisión de obras", icon: Hammer },
    "Planificación Urbana": { description: "Diseño y planificación de espacios urbanos", icon: Ruler },
    "Diseño Estructural": { description: "Cálculo y diseño de estructuras", icon: PenTool },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Building2 }
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
        title="Especialidades en Diseño y Construcción"
        subtitle="Encuentra profesionales verificados para tu proyecto arquitectónico"
        categories={serviceCategories}
      />

      <ProfessionalsCategoryList
        professionIds={[PROFESSION_ID]}
        title="Arquitectos y Constructores"
        description="Diseña y construye tus sueños con expertos verificados"
      />

      <BlogSection professionIds={[PROFESSION_ID]} />

      <Footer />
    </main>
  )
}
