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
import { BookOpen, GraduationCap, Users, Globe, School, Microscope } from "lucide-react"

export default function EducacionPage() {
  const heroSlides = [
    {
      image: "/teacher-classroom-students.jpg",
      title: "Profesionales en Educación",
      subtitle: "Docentes calificados para transformar el aprendizaje",
    },
    {
      image: "/university-professor-lecture.jpg",
      title: "Excelencia Educativa",
      subtitle: "Conecta con los mejores educadores del país",
    },
    {
      image: "/online-education-teacher.jpg",
      title: "Educación de Calidad",
      subtitle: "Profesores verificados y con experiencia comprobada",
    },
  ]

  const featuredProfessional = {
    name: "Dr. Roberto Vega",
    specialty: "Docente Universitario de Ingeniería",
    experience: 20,
    city: "Quito",
    image: "/university-professor-engineering.jpg",
    description:
      "Doctor en Ingeniería con más de 20 años de experiencia en docencia universitaria. Especializado en investigación académica y formación de profesionales de excelencia.",
    achievements: [
      "PhD en Ingeniería - Universidad Politécnica de Madrid",
      "Catedrático universitario por 20 años",
      "Autor de 15 publicaciones científicas",
      "Premio Nacional de Excelencia Docente 2023",
    ],
    clients: 500,
    satisfaction: 96,
  }

  const PROFESSION_ID = 14 // Educación
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Educación Inicial": { description: "Pedagogía infantil y desarrollo temprano", icon: Users },
    "Educación Básica": { description: "Docencia para niveles de primaria", icon: BookOpen },
    "Educación Secundaria": { description: "Profesores especializados para bachillerato", icon: School },
    "Educación Bilingüe": { description: "Docentes certificados en idiomas", icon: Globe },
    "Docencia Universitaria": { description: "Catedráticos y profesores universitarios", icon: GraduationCap },
    "Investigación Académica": { description: "Asesores de tesis y proyectos de investigación", icon: Microscope },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: BookOpen }
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
        title="Especialidades Educativas"
        subtitle="Encuentra docentes calificados para todos los niveles educativos"
        categories={serviceCategories}
      />

      <ProfessionalsCategoryList
        professionIds={[PROFESSION_ID]}
        title="Docentes y Educadores Verificados"
        description="Encuentra los mejores profesionales para tu formación académica"
      />

      <BlogSection professionIds={[PROFESSION_ID]} />

      <Footer />
    </main>
  )
}
