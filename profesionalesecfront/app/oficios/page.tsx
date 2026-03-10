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

  const PROFESSION_ID = 99 // Oficios (placeholder)
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
    if (apiSpecialties.length === 0) {
      return Object.entries(editorialMeta).map(([name, meta]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name, description: meta.description, icon: meta.icon,
      }))
    }
    return apiSpecialties.map(spec => {
      const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Wrench }
      return {
        id: spec.nombre.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name: spec.nombre, description: meta.description, icon: meta.icon,
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

  const blogPosts = [
    {
      id: "1",
      slug: "fotografia-comercial-profesional",
      title: "Cómo la Fotografía Profesional Impulsa tu Marca",
      excerpt:
        "Descubre por qué invertir en fotografía profesional es clave para destacar tu negocio en el mercado digital actual.",
      image: "/commercial-photography-branding.jpg",
      date: "15 de enero de 2025",
      readTime: "6 min",
      author: "Paul Pineda",
      role: "Fotógrafo Profesional",
    },
    {
      id: "2",
      slug: "mantenimiento-hogar-consejos",
      title: "Guía Completa de Mantenimiento del Hogar",
      excerpt:
        "Consejos de expertos en plomería, electricidad y carpintería para mantener tu hogar en perfectas condiciones.",
      image: "/home-maintenance-guide.jpg",
      date: "10 de enero de 2025",
      readTime: "8 min",
      author: "Carlos Ramírez",
      role: "Plomero Certificado",
    },
    {
      id: "3",
      slug: "gastronomia-ecuatoriana-moderna",
      title: "La Nueva Gastronomía Ecuatoriana",
      excerpt:
        "Chefs ecuatorianos están revolucionando la cocina tradicional con técnicas modernas y presentaciones innovadoras.",
      image: "/modern-ecuadorian-cuisine.jpg",
      date: "5 de enero de 2025",
      readTime: "7 min",
      author: "María González",
      role: "Chef Ejecutiva",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <ProfessionalHeroCarousel slides={carouselSlides} />
        <ProfessionalServicesGrid
          title="Oficios Especializados"
          subtitle="Encuentra profesionales certificados en diversos oficios y servicios"
          categories={serviceCategories}
          basePath="/oficios"
        />
        <ProfessionalsCategoryList
          professionIds={[PROFESSION_ID]}
          title="Profesionales en Oficios"
          description="Expertos calificados para cada necesidad de tu hogar o negocio"
        />
        <BlogSection posts={blogPosts} />
      </main>
      <Footer />
    </>
  )
}
