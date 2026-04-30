"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import ProfessionalsCategoryList from "@/components/shared/professionals-category-list"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import { useState, useEffect, useMemo } from "react"
import { useSpecialtyCounts } from "@/hooks/use-specialty-counts"
import { catalogosApi } from "@/lib/api"
import {
  Camera,
  Radio,
  Tv,
  Newspaper,
  Megaphone,
  Film,
  Mic,
  Globe,
  Users,
  FileText,
  Video,
  PenTool,
} from "lucide-react"

export default function ComunicacionPage() {
  const heroSlides = [
    {
      image: "/communication-professional-media-broadcast.jpg",
      title: "Expertos en Comunicación y Medios",
      subtitle: "Conectamos tu mensaje con el mundo",
    },
    {
      image: "/journalism-news-reporter-professional.jpg",
      title: "Periodistas y Comunicadores",
      subtitle: "Información veraz y profesional",
    },
    {
      image: "/digital-marketing-social-media.jpg",
      title: "Comunicación Digital y Marketing",
      subtitle: "Tu marca en todas las plataformas",
    },
  ]

  const PROFESSION_ID = 13 // Comunicación
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Periodismo": { description: "Reporteros, columnistas y editores profesionales", icon: Newspaper },
    "Fotografía Periodística": { description: "Captura de noticias y eventos importantes", icon: Camera },
    "Comunicación Audiovisual": { description: "Producción de contenido para TV y streaming", icon: Tv },
    "Locución y Radio": { description: "Voces profesionales para medios y eventos", icon: Radio },
    "Relaciones Públicas": { description: "Gestión de imagen y comunicación corporativa", icon: Megaphone },
    "Producción Audiovisual": { description: "Creación de contenido multimedia", icon: Film },
    "Comunicación Corporativa": { description: "Estrategias de comunicación interna y externa", icon: Mic },
    "Social Media": { description: "Gestión de redes sociales y contenido digital", icon: Globe },
    "Comunicación Organizacional": { description: "Consultoría en comunicación empresarial", icon: Users },
    "Redacción y Contenidos": { description: "Copywriting y creación de contenidos", icon: FileText },
    "Multimedia": { description: "Diseño y producción de contenido interactivo", icon: Video },
    "Diseño Editorial": { description: "Maquetación y diseño de publicaciones", icon: PenTool },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Mic }
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

  const featuredProfessional = {
    name: "María José Vásconez",
    role: "Periodista y Comunicadora Senior",
    specialty: "Periodismo de Investigación",
    image: "/featured-journalist-professional.jpg",
    experience: "12 años",
    projects: "150+",
    rating: "4.9/5",
    bio: "Periodista galardonada con amplia experiencia en medios nacionales e internacionales, especializada en investigación y comunicación digital.",
    achievements: [
      "Premio Nacional de Periodismo 2023",
      "Corresponsal internacional para medios latinoamericanos",
      "Docente universitaria en comunicación",
      "Más de 200 reportajes publicados",
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Carousel */}
      <ProfessionalHeroCarousel slides={heroSlides} />

      {/* Services Grid */}
      <ProfessionalServicesGrid
        title="Especialidades en Comunicación"
        subtitle="Profesionales expertos en todas las áreas de la comunicación moderna"
        categories={serviceCategories}
      />

      {/* Featured Professional */}
      <ProfessionalsCategoryList
        professionIds={[PROFESSION_ID]}
        title="Comunicadores Profesionales"
        description="Periodistas, locutores y expertos en medios verificados"
      />

      {/* Blog Section */}
      <BlogSection professionIds={[PROFESSION_ID]} />

      <Footer />
    </div>
  )
}
