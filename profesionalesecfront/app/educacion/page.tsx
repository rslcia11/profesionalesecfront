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

  const PROFESSION_ID = 993 // Educación (placeholder)
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
    if (apiSpecialties.length === 0) {
      return Object.entries(editorialMeta).map(([name, meta]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name, description: meta.description, icon: meta.icon,
      }))
    }
    return apiSpecialties.map(spec => {
      const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: BookOpen }
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
      slug: "metodologias-ensenanza-moderna",
      title: "Metodologías de Enseñanza para el Siglo XXI",
      excerpt: "Descubre las técnicas pedagógicas más efectivas para el aprendizaje en la era digital.",
      image: "/modern-teaching-classroom.jpg",
      date: "18 de enero de 2025",
      readTime: "6 min",
      author: "María González",
      role: "Pedagoga Especializada",
    },
    {
      id: "2",
      slug: "educacion-virtual-efectiva",
      title: "Cómo Implementar Educación Virtual Efectiva",
      excerpt: "Estrategias y herramientas para maximizar el aprendizaje en entornos virtuales.",
      image: "/online-education-technology.jpg",
      date: "12 de enero de 2025",
      readTime: "7 min",
      author: "Carlos Ramírez",
      role: "Experto en Tecnología Educativa",
    },
    {
      id: "3",
      slug: "desarrollo-integral-estudiantes",
      title: "El Desarrollo Integral de los Estudiantes",
      excerpt: "La importancia de educar más allá de lo académico: habilidades socioemocionales.",
      image: "/student-development-classroom.jpg",
      date: "8 de enero de 2025",
      readTime: "5 min",
      author: "Ana Martínez",
      role: "Psicopedagoga",
    },
  ]

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
        basePath="/educacion"
      />

      <ProfessionalsCategoryList
        professionIds={[PROFESSION_ID]}
        title="Docentes y Educadores Verificados"
        description="Encuentra los mejores profesionales para tu formación académica"
      />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
