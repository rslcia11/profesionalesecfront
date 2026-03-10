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
import { Scale, Gavel, Users, Building2, FileText, Briefcase, Shield, Globe, BookOpen, Landmark } from "lucide-react"

export default function DerechoPage() {
  const heroSlides = [
    {
      image: "/lawyer-team-office-consultation.jpg",
      title: "Expertos en Derecho",
      subtitle: "Asesoría legal profesional para resolver tus necesidades jurídicas",
    },
    {
      image: "/lawyer-courtroom-justice-scales.jpg",
      title: "Justicia y Asesoría Legal",
      subtitle: "Protegemos tus derechos con excelencia profesional",
    },
    {
      image: "/lawyer-consultation-client-meeting.jpg",
      title: "Soluciones Legales Integrales",
      subtitle: "Tu mejor aliado en asuntos legales y jurídicos",
    },
  ]

  const featuredProfessional = {
    name: "Dr. Rodrigo Cajas",
    specialty: "Derecho Penal",
    experience: 18,
    city: "Quito",
    image: "/featured-lawyer-courtroom-professional.jpg",
    description:
      "Abogado especializado en derecho penal con más de 18 años de experiencia defendiendo casos complejos. Reconocido por su ética profesional y altos índices de éxito en juicios penales.",
    achievements: [
      "Ganador de 200+ casos penales con veredictos favorables",
      "Especialización en Derecho Penal Internacional - Universidad Complutense de Madrid",
      "Miembro activo del Colegio de Abogados del Ecuador",
      "Reconocimiento Nacional por Excelencia Jurídica 2023",
    ],
    clients: 350,
    satisfaction: 97,
  }

  const PROFESSION_ID = 3 // Derecho
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Derecho Penal": { description: "Defensa legal en casos penales, delitos y procesos judiciales", icon: Gavel },
    "Derecho Civil": { description: "Contratos, sucesiones, propiedad y asuntos civiles", icon: FileText },
    "Derecho Laboral": { description: "Relaciones laborales, contratos de trabajo y despidos", icon: Users },
    "Derecho Administrativo": { description: "Procedimientos administrativos y recursos gubernamentales", icon: Building2 },
    "Derecho Mercantil": { description: "Asesoría empresarial, sociedades y derecho comercial", icon: Briefcase },
    "Derecho Constitucional": { description: "Derechos fundamentales y garantías constitucionales", icon: Scale },
    "Derecho Internacional": { description: "Tratados internacionales y derecho transnacional", icon: Globe },
    "Derecho Corporativo": { description: "Fusiones, adquisiciones y gobierno corporativo", icon: Landmark },
    "Derecho Tributario": { description: "Asesoría fiscal, impuestos y litigios tributarios", icon: BookOpen },
    "Derecho de Familia": { description: "Divorcios, custodia, alimentos y asuntos familiares", icon: Shield },
  }

  const serviceCategories = useMemo(() => {
    if (apiSpecialties.length === 0) {
      return Object.entries(editorialMeta).map(([name, meta]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name, description: meta.description, icon: meta.icon,
      }))
    }
    return apiSpecialties.map(spec => {
      const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Scale }
      return {
        id: spec.nombre.toLowerCase().replace(/\s+/g, "-").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u"),
        name: spec.nombre, description: meta.description, icon: meta.icon,
        count: countsBySpecialty.get(spec.id) || 0,
      }
    })
  }, [apiSpecialties, countsBySpecialty])
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative">
        <ProfessionalHeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
      </section>

      {/* Professional Services Grid */}
      <ProfessionalServicesGrid
        title="Especialidades Legales"
        subtitle="Encuentra el abogado especializado que necesitas para tu caso"
        categories={serviceCategories}
        basePath="/derecho"
      />

      {/* Real Professionals List */}
      <ProfessionalsCategoryList
        professionIds={[3]}
        title="Abogados Destacados"
        description="Encuentra el experto legal profesional y verificado para tu caso"
      />

      {/* Blog Section */}
      <BlogSection professionId={3} limit={3} />

      <Footer />
    </main>
  )
}
