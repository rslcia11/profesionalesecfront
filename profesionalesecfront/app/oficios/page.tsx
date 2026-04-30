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
import { Sparkles, Camera, Dumbbell, ChefHat, Wrench, Cookie, Car, Zap, Hammer, Trophy, Briefcase } from "lucide-react"

export default function OficiosPage() {
  const carouselSlides = [
    {
      image: "/craftsman-skilled-work-professional.jpg",
      title: "Profesionales en Oficios",
      subtitle: "Expertos certificados en servicios especializados",
    },
    {
      image: "/photography-professional-camera-work.jpg",
      title: "Calidad y Experiencia",
      subtitle: "Encuentra el profesional ideal para tu proyecto",
    },
    {
      image: "/beauty-salon-professional-service.jpg",
      title: "Servicios Confiables",
      subtitle: "Profesionales verificados y evaluados por clientes",
    },
  ]

  const PROFESSION_ID = 16 // Oficios
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Belleza": { description: "Estilistas, peluqueros, maquilladores y especialistas en estética", icon: Sparkles },
    "Fotografía": { description: "Fotógrafos profesionales, filmmakers y creadores de contenido audiovisual", icon: Camera },
    "Preparador Físico": { description: "Entrenadores personales y especialistas en acondicionamiento físico", icon: Dumbbell },
    "Chefs": { description: "Chefs profesionales, cocineros y especialistas en gastronomía", icon: ChefHat },
    "Plomería": { description: "Plomeros certificados para instalación y reparación de sistemas hidráulicos", icon: Wrench },
    "Panadería y Pastelería": { description: "Panaderos, pasteleros y reposteros especializados", icon: Cookie },
    "Mecánica Automotriz": { description: "Mecánicos automotrices y técnicos en reparación de vehículos", icon: Car },
    "Electricista": { description: "Electricistas certificados para instalaciones eléctricas residenciales y comerciales", icon: Zap },
    "Carpintería": { description: "Carpinteros profesionales para muebles a medida y trabajos en madera", icon: Hammer },
    "Deporte": { description: "Entrenadores deportivos y especialistas en diferentes disciplinas", icon: Trophy },
    "Servicios Varios": { description: "Diversos oficios y servicios especializados", icon: Briefcase },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Wrench }
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
    name: "Paul Pineda",
    title: "Fotógrafo y Filmmaker",
    specialty: "Fotografía",
    image: "/featured-photographer-filmmaker.jpg",
    experience: "8+ años",
    clients: "150+",
    satisfaction: "99%",
    verified: true,
    achievements: [
      "Especialista en marketing para marcas",
      "Creador de contenido audiovisual de alta calidad",
      "Servicios de fotografía comercial y corporativa",
      "Experto en videos impactantes para redes sociales",
    ],
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <ProfessionalHeroCarousel slides={carouselSlides} />
        <ProfessionalServicesGrid
          title="Oficios Especializados"
          subtitle="Encuentra profesionales certificados en diversos oficios y servicios"
          categories={serviceCategories}
        />
        <ProfessionalsCategoryList
          professionIds={[PROFESSION_ID]}
          title="Profesionales en Oficios"
          description="Expertos calificados para cada necesidad de tu hogar o negocio"
        />
        <BlogSection professionIds={[PROFESSION_ID]} />
      </main>
      <Footer />
    </>
  )
}
