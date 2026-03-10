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
import { Brain, BookOpen, Briefcase, Shield, Baby, Activity, Target, Pill, School, Home } from "lucide-react"

export default function SaludMentalPage() {
  const heroSlides = [
    {
      image: "/mental-health-therapy-counseling.jpg",
      title: "Apoyo profesional para tu bienestar emocional",
      description: "Especialistas en salud mental comprometidos con tu equilibrio psicológico",
    },
    {
      image: "/psychology-clinical-therapy-session.jpg",
      title: "Encuentra el psicólogo ideal para ti",
      description: "Profesionales certificados en diversas áreas de la psicología",
    },
    {
      image: "/mental-wellness-emotional-health.jpg",
      title: "Tu salud mental es nuestra prioridad",
      description: "Atención personalizada para cada etapa de tu vida",
    },
  ]

  const PROFESSION_ID = 6 // Salud Mental
  const { countsBySpecialty, loading: loadingCounts } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  // Mapa editorial: nombre de especialidad -> metadata visual
  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Psicología Clínica": { description: "Evaluación y tratamiento de trastornos mentales y emocionales", icon: Brain },
    "Psicología Educativa": { description: "Apoyo en procesos de aprendizaje y desarrollo académico", icon: School },
    "Psicología Ocupacional": { description: "Bienestar laboral y desarrollo organizacional", icon: Briefcase },
    "Psicología Forense": { description: "Evaluaciones psicológicas en contextos legales", icon: Shield },
    "Psicología del Desarrollo": { description: "Acompañamiento en cada etapa del ciclo vital", icon: Baby },
    "Psicología del Deporte": { description: "Optimización del rendimiento deportivo y mental", icon: Activity },
    "Psicología Cognitiva": { description: "Estudio y mejora de procesos mentales y cognitivos", icon: Brain },
    "Neuropsicología": { description: "Evaluación y rehabilitación de funciones cerebrales", icon: Brain },
    "Coaching Personal": { description: "Desarrollo personal y consecución de metas", icon: Target },
    "Psiquiatría": { description: "Diagnóstico y tratamiento médico de trastornos mentales", icon: Pill },
    "Psicopedagogía": { description: "Intervención en dificultades de aprendizaje", icon: BookOpen },
    "Terapia Familiar": { description: "Fortalecimiento de vínculos y comunicación familiar", icon: Home },
  }

  // Generar categorías dinámicas desde API + editorial
  const serviceCategories = useMemo(() => {
    if (apiSpecialties.length === 0) {
      // Fallback: usar editorial sin conteos
      return Object.entries(editorialMeta).map(([name, meta]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name,
        description: meta.description,
        icon: meta.icon,
      }))
    }
    return apiSpecialties.map(spec => {
      const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Brain }
      return {
        id: spec.nombre.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name: spec.nombre,
        description: meta.description,
        icon: meta.icon,
        count: countsBySpecialty.get(spec.id) || 0,
      }
    })
  }, [apiSpecialties, countsBySpecialty])

  const featuredProfessional = {
    name: "Erika Noriega Desintonio",
    title: "Psi. Cl.",
    specialty: "Psicología Clínica",
    image: "/featured-psychologist-professional.jpg",
    experience: 12,
    clients: 500,
    rating: 4.9,
    achievements: [
      "Especialista en ruptura amorosa, duelo y manejo de estrés",
      "Experta en tratamiento de depresión y ansiedad",
      "Enfoque terapéutico centrado en el desarrollo de autoconciencia",
      "Atención psicológica personalizada y empática",
    ],
    description:
      "Con una pasión arraigada por el bienestar emocional y la salud mental, la Psi. Cl. Erika Noriega se especializa en la atención psicológica en temas de ruptura amorosa, duelo, estrés, depresión y ansiedad. Su enfoque terapéutico se centra en proporcionar un ambiente seguro y de apoyo donde los clientes puedan explorar sus sentimientos más profundos.",
  }

  const blogPosts = [
    {
      id: "1",
      slug: "terapia-crisis-mental-health",
      title: "La Importancia de la Terapia en Tiempos de Crisis",
      excerpt:
        "Descubre cómo la terapia psicológica puede ser tu mejor aliada durante momentos difíciles y por qué buscar ayuda profesional es un acto de fortaleza.",
      image: "/therapy-crisis-mental-health.jpg",
      author: "Dra. María López",
      role: "Psicóloga Clínica",
      date: "15 de noviembre de 2024",
      readTime: "6 min",
    },
    {
      id: "2",
      slug: "mindfulness-stress-reduction",
      title: "Técnicas de Mindfulness para el Estrés Diario",
      excerpt:
        "Aprende técnicas prácticas de atención plena que puedes incorporar en tu rutina diaria para reducir el estrés y mejorar tu bienestar emocional.",
      image: "/mindfulness-stress-reduction.jpg",
      author: "Ps. Carlos Mendoza",
      role: "Psicólogo Cognitivo",
      date: "10 de noviembre de 2024",
      readTime: "5 min",
    },
    {
      id: "3",
      slug: "mental-health-warning-signs",
      title: "Señales de Advertencia de Problemas de Salud Mental",
      excerpt:
        "Conoce las señales tempranas que indican que tú o un ser querido podrían necesitar apoyo psicológico profesional y cómo actuar a tiempo.",
      image: "/mental-health-warning-signs.jpg",
      author: "Dra. Ana Rodríguez",
      role: "Psiquiatra",
      date: "5 de noviembre de 2024",
      readTime: "7 min",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProfessionalHeroCarousel slides={heroSlides} />
        <ProfessionalServicesGrid
          title="Especialidades en Salud Mental"
          subtitle="Profesionales comprometidos con tu bienestar emocional y psicológico"
          categories={serviceCategories}
          basePath="/salud-mental"
        />
        <ProfessionalsCategoryList
          professionIds={[6]}
          title="Psicólogos y Terapeutas"
          description="Profesionales de la salud mental verificados y comprometidos"
        />
        <BlogSection posts={blogPosts} />
      </main>
      <Footer />
    </div>
  )
}
