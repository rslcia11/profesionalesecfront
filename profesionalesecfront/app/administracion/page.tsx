"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
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

  const serviceCategories = [
    {
      id: "contabilidad",
      name: "Contabilidad",
      description: "Gestión contable, estados financieros y auditorías",
      icon: Calculator,
      count: 45,
    },
    {
      id: "finanzas",
      name: "Finanzas",
      description: "Asesoría financiera, inversiones y planificación",
      icon: TrendingUp,
      count: 38,
    },
    {
      id: "recursos-humanos",
      name: "Recursos Humanos",
      description: "Gestión de talento, nómina y desarrollo organizacional",
      icon: Users,
      count: 32,
    },
    {
      id: "marketing-y-ventas",
      name: "Marketing y Ventas",
      description: "Estrategias comerciales y gestión de marketing",
      icon: Briefcase,
      count: 41,
    },
    {
      id: "administracion-empresas",
      name: "Administración de Empresas",
      description: "Gestión empresarial y consultoría estratégica",
      icon: Building2,
      count: 52,
    },
    {
      id: "negocios-internacionales",
      name: "Negocios Internacionales",
      description: "Comercio exterior, importaciones y exportaciones",
      icon: Globe,
      count: 28,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "gestion-financiera-efectiva",
      title: "Claves para una Gestión Financiera Efectiva",
      excerpt:
        "Descubre las mejores prácticas para optimizar las finanzas de tu empresa y tomar decisiones estratégicas informadas.",
      image: "/financial-planning-office.jpg",
      date: "15 de enero de 2025",
      readTime: "7 min",
      author: "Carlos Méndez",
      role: "Asesor Financiero",
    },
    {
      id: "2",
      slug: "optimizar-recursos-humanos",
      title: "Cómo Optimizar los Recursos Humanos en tu Empresa",
      excerpt: "Estrategias efectivas para atraer, retener y desarrollar el talento humano en tu organización.",
      image: "/team-management-meeting.jpg",
      date: "10 de enero de 2025",
      readTime: "6 min",
      author: "Ana Torres",
      role: "Especialista en RRHH",
    },
    {
      id: "3",
      slug: "marketing-digital-pequeñas-empresas",
      title: "Marketing Digital para Pequeñas Empresas",
      excerpt: "Aprende a implementar estrategias de marketing digital efectivas sin grandes presupuestos.",
      image: "/digital-marketing-strategy.png",
      date: "5 de enero de 2025",
      readTime: "5 min",
      author: "Roberto Silva",
      role: "Consultor de Marketing",
    },
  ]

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
        basePath="/administracion"
      />

      <FeaturedProfessional professional={featuredProfessional} categorySlug="administracion" />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
