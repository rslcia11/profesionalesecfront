"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
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

  const serviceCategories = [
    {
      id: "derecho-penal",
      name: "Derecho Penal",
      description: "Defensa legal en casos penales, delitos y procesos judiciales",
      icon: Gavel,
      count: 45,
    },
    {
      id: "derecho-civil",
      name: "Derecho Civil",
      description: "Contratos, sucesiones, propiedad y asuntos civiles",
      icon: FileText,
      count: 52,
    },
    {
      id: "derecho-laboral",
      name: "Derecho Laboral",
      description: "Relaciones laborales, contratos de trabajo y despidos",
      icon: Users,
      count: 38,
    },
    {
      id: "derecho-administrativo",
      name: "Derecho Administrativo",
      description: "Procedimientos administrativos y recursos gubernamentales",
      icon: Building2,
      count: 28,
    },
    {
      id: "derecho-mercantil",
      name: "Derecho Mercantil",
      description: "Asesoría empresarial, sociedades y derecho comercial",
      icon: Briefcase,
      count: 41,
    },
    {
      id: "derecho-constitucional",
      name: "Derecho Constitucional",
      description: "Derechos fundamentales y garantías constitucionales",
      icon: Scale,
      count: 22,
    },
    {
      id: "derecho-internacional",
      name: "Derecho Internacional",
      description: "Tratados internacionales y derecho transnacional",
      icon: Globe,
      count: 18,
    },
    {
      id: "derecho-corporativo",
      name: "Derecho Corporativo",
      description: "Fusiones, adquisiciones y gobierno corporativo",
      icon: Landmark,
      count: 35,
    },
    {
      id: "derecho-tributario",
      name: "Derecho Tributario",
      description: "Asesoría fiscal, impuestos y litigios tributarios",
      icon: BookOpen,
      count: 30,
    },
    {
      id: "derecho-familia",
      name: "Derecho de Familia",
      description: "Divorcios, custodia, alimentos y asuntos familiares",
      icon: Shield,
      count: 48,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "derechos-consumidor-ecuador",
      title: "Conoce Tus Derechos Como Consumidor en Ecuador",
      excerpt:
        "Una guía completa sobre los derechos que te protegen como consumidor y cómo hacerlos valer ante cualquier inconveniente.",
      image: "/consumer-rights-law.jpg",
      date: "12 de enero de 2025",
      readTime: "6 min",
      author: "Dra. María Sánchez",
      role: "Especialista en Derecho del Consumidor",
    },
    {
      id: "2",
      slug: "proceso-divorcio-ecuador",
      title: "Guía Paso a Paso: Proceso de Divorcio en Ecuador",
      excerpt:
        "Todo lo que necesitas saber sobre el proceso de divorcio, requisitos, tiempos y consideraciones legales importantes.",
      image: "/divorce-law-family.jpg",
      date: "8 de enero de 2025",
      readTime: "8 min",
      author: "Dr. Carlos Méndez",
      role: "Abogado de Derecho Familiar",
    },
    {
      id: "3",
      slug: "contratos-trabajo-ecuador",
      title: "Aspectos Clave de los Contratos de Trabajo",
      excerpt:
        "Entiende los elementos esenciales de un contrato laboral y conoce tus derechos como trabajador en Ecuador.",
      image: "/employment-contract-law.jpg",
      date: "5 de enero de 2025",
      readTime: "5 min",
      author: "Dra. Ana Torres",
      role: "Abogada Laboralista",
    },
  ]

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

      {/* Featured Professional */}
      <FeaturedProfessional professional={featuredProfessional} categorySlug="derecho" />

      {/* Blog Section */}
      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
