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

  // Esta página ya usaba [4, 8] en su CategoryList, así que usaremos ambas.
  // 4 y 8 corresponden posiblemente a Diseño y Arquitectura / Construcción Civil
  const PROFESSION_IDS = [4, 8]
  const { countsBySpecialty } = useSpecialtyCounts(PROFESSION_IDS)
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    // Para esta página vamos a traer especialidades de ambas profesiones si es posible,
    // o simplemente usamos 4 como base para los catálogos.
    Promise.all(PROFESSION_IDS.map(id => catalogosApi.obtenerEspecialidades(id)))
      .then(results => {
        const combined = results.flatMap(data => Array.isArray(data) ? data : [])
        // Filtrar duplicados por id si existen
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
        setApiSpecialties(unique)
      })
      .catch(() => setApiSpecialties([]))
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
    if (apiSpecialties.length === 0) {
      return Object.entries(editorialMeta).map(([name, meta]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name, description: meta.description, icon: meta.icon,
      }))
    }
    return apiSpecialties.map(spec => {
      const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Building2 }
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

      <ProfessionalsCategoryList
        professionIds={[4, 8]}
        title="Arquitectos y Constructores"
        description="Diseña y construye tus sueños con expertos verificados"
      />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
