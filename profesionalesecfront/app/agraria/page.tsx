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
import { Sprout, Beef, Factory, TrendingUp, UtensilsCrossed } from "lucide-react"

export default function AgrariaPage() {
  const carouselSlides = [
    {
      image: "/agriculture-modern-farming-technology.jpg",
      title: "Innovación Agrícola para el Futuro",
      description: "Conecta con especialistas en agronomía y tecnología agrícola",
      cta: { text: "Explorar Servicios", href: "#servicios" },
    },
    {
      image: "/livestock-farming-professional.jpg",
      title: "Producción Pecuaria Sostenible",
      description: "Expertos en zootecnia y manejo de ganado",
      cta: { text: "Ver Profesionales", href: "#servicios" },
    },
    {
      image: "/agroindustry-food-processing.jpg",
      title: "Agroindustria y Transformación",
      description: "Profesionales en procesamiento y valor agregado",
      cta: { text: "Conocer Más", href: "#servicios" },
    },
  ]

  const PROFESSION_ID = 15 // Agraria
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Agronomía": { description: "Especialistas en cultivos, suelos y producción agrícola sostenible", icon: Sprout },
    "Zootecnia": { description: "Expertos en producción animal, nutrición y mejoramiento genético", icon: Beef },
    "Agroindustria": { description: "Profesionales en procesamiento y transformación de productos agrícolas", icon: Factory },
    "Agroexportación": { description: "Especialistas en comercio internacional de productos agrícolas", icon: TrendingUp },
    "Alimentos": { description: "Expertos en tecnología, calidad y seguridad alimentaria", icon: UtensilsCrossed },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Sprout }
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
    name: "Ing. Carlos Pacheco Vargas",
    specialty: "Agrónomo Especialista",
    image: "/featured-agronomist-professional.jpg",
    experience: 18,
    clients: 150,
    satisfaction: 97,
    location: "Pichincha, Quito",
    verified: true,
    achievements: [
      "Asesor en proyectos de agricultura orgánica certificada",
      "Experto en sistemas de riego tecnificado",
      "Consultor en manejo integrado de plagas",
      "Especialista en cultivos de exportación",
    ],
    description:
      "Ingeniero Agrónomo con amplia experiencia en agricultura sostenible y tecnificada. Especializado en optimización de cultivos y manejo de recursos naturales.",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProfessionalHeroCarousel slides={carouselSlides} />
        <ProfessionalServicesGrid
          title="Especialidades Agrarias"
          subtitle="Profesionales expertos en agricultura, ganadería e industria alimentaria"
          categories={serviceCategories}
        />
        <ProfessionalsCategoryList
          professionIds={[PROFESSION_ID]}
          title="Ingenieros Agrónomos y Veterinarios"
          description="Especialistas verificados para el sector agropecuario"
        />
        <BlogSection professionIds={[PROFESSION_ID]} />
      </main>
      <Footer />
    </div>
  )
}
