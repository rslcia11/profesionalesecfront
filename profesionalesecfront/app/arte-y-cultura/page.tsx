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
import { Music, Palette, Theater, Camera, Mic, Brush } from "lucide-react"

export default function ArteCulturaPage() {
  const heroSlides = [
    {
      image: "/artist-painting-studio.png",
      title: "Artistas y Profesionales del Arte",
      subtitle: "Talento ecuatoriano excepcional para tus proyectos",
    },
    {
      image: "/musician-performing-stage.jpg",
      title: "Creatividad Sin Límites",
      subtitle: "Conecta con artistas verificados y profesionales",
    },
    {
      image: "/theater-performance-actors.jpg",
      title: "Arte y Cultura Ecuatoriana",
      subtitle: "Encuentra el talento perfecto para tu evento",
    },
  ]

  const featuredProfessional = {
    name: "María Fernández",
    specialty: "Pintora Contemporánea",
    experience: 15,
    city: "Cuenca",
    image: "/female-painter-artist-studio.jpg",
    description:
      "Artista visual especializada en arte contemporáneo y abstracto. Con más de 15 años de trayectoria, sus obras han sido exhibidas en galerías nacionales e internacionales.",
    achievements: [
      "Exposiciones en 12 países de Latinoamérica",
      "Premio Nacional de Artes Visuales 2022",
      "Más de 200 obras vendidas a coleccionistas",
      "Docente de arte en universidades prestigiosas",
    ],
    clients: 180,
    satisfaction: 95,
  }

  const PROFESSION_ID = 12 // Arte y Cultura
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Música": { description: "Músicos, DJs y productores musicales profesionales", icon: Music },
    "Pintura y Escultura": { description: "Artistas visuales y escultores contemporáneos", icon: Palette },
    "Artes Escénicas": { description: "Bailarines, coreógrafos y artistas escénicos", icon: Theater },
    "Actuación": { description: "Actores profesionales de teatro y cine", icon: Mic },
    "Fotografía Artística": { description: "Fotógrafos especializados en arte visual", icon: Camera },
    "Arte Urbano": { description: "Grafiteros y muralistas profesionales", icon: Brush },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Palette }
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
        title="Disciplinas Artísticas"
        subtitle="Descubre talento ecuatoriano excepcional para tu proyecto o evento"
        categories={serviceCategories}
      />

      <ProfessionalsCategoryList
        professionIds={[PROFESSION_ID]}
        title="Artistas y Gestores Culturales"
        description="Talento creativo verificado para tus proyectos culturales"
      />

      <BlogSection professionIds={[PROFESSION_ID]} />

      <Footer />
    </main>
  )
}
