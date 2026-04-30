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
import { Calculator, TrendingUp, Users, Briefcase, Building2, Globe } from "lucide-react"

export default function AdministracionPage() {
  const heroSlides = [
    {
      image: "/business-professionals-team-meeting-office.jpg",
      title: "Expertos en Economía y Administración",
      subtitle: "Potencia tu negocio con profesionales certificados",
    },
    {
      image: "/financial-advisor-consulting-client-modern-office.jpg",
      title: "Gestión Empresarial de Excelencia",
      subtitle: "Impulsa el crecimiento de tu organización",
    },
    {
      image: "/business-team-collaboration-strategy-planning.jpg",
      title: "Soluciones Estratégicas para tu Empresa",
      subtitle: "Profesionales comprometidos con tu éxito",
    },
  ]

  const featuredProfessional = {
    name: "María Elena Rodríguez",
    specialty: "Contadora Senior",
    experience: 15,
    city: "Quito",
    image: "/featured-accountant-professional-office.jpg",
    description:
      "Contadora pública certificada con más de 15 años de experiencia en gestión contable y asesoría tributaria. Especializada en auditorías financieras y optimización de procesos contables para empresas.",
    achievements: [
      "Certificación CPA Internacional",
      "Más de 200 empresas asesoradas exitosamente",
      "Especialista en normativa tributaria ecuatoriana",
      "Reconocimiento por excelencia profesional 2024",
    ],
    clients: 200,
    satisfaction: 98,
  }

  const PROFESSION_ID = 5 // Administración
  const { countsBySpecialty } = useSpecialtyCounts([PROFESSION_ID])
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    catalogosApi.obtenerEspecialidades(PROFESSION_ID).then(data => {
      setApiSpecialties(Array.isArray(data) ? data : [])
    }).catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Contabilidad": { description: "Gestión contable, estados financieros y auditorías", icon: Calculator },
    "Finanzas": { description: "Asesoría financiera, inversiones y planificación", icon: TrendingUp },
    "Recursos Humanos": { description: "Gestión de talento, nómina y desarrollo organizacional", icon: Users },
    "Marketing y Ventas": { description: "Estrategias comerciales y gestión de marketing", icon: Briefcase },
    "Administración de Empresas": { description: "Gestión empresarial y consultoría estratégica", icon: Building2 },
    "Negocios Internacionales": { description: "Comercio exterior, importaciones y exportaciones", icon: Globe },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Building2 }
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
        title="Especialidades en Economía y Administración"
        subtitle="Encuentra el profesional que necesitas para impulsar tu negocio"
        categories={serviceCategories}
      />

      <ProfessionalsCategoryList
        professionIds={[5]}
        title="Expertos en Administración y Economía"
        description="Profesionales verificados para optimizar tu negocio"
      />

      <BlogSection professionIds={[PROFESSION_ID]} />

      <Footer />
    </main>
  )
}
