"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
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

  const serviceCategories = [
    {
      id: "agronomia",
      name: "Agronomía",
      description: "Especialistas en cultivos, suelos y producción agrícola sostenible",
      icon: Sprout,
      count: 48,
    },
    {
      id: "zootecnia",
      name: "Zootecnia",
      description: "Expertos en producción animal, nutrición y mejoramiento genético",
      icon: Beef,
      count: 35,
    },
    {
      id: "agroindustria",
      name: "Agroindustria",
      description: "Profesionales en procesamiento y transformación de productos agrícolas",
      icon: Factory,
      count: 42,
    },
    {
      id: "agroexportacion",
      name: "Agroexportación",
      description: "Especialistas en comercio internacional de productos agrícolas",
      icon: TrendingUp,
      count: 28,
    },
    {
      id: "alimentos",
      name: "Alimentos",
      description: "Expertos en tecnología, calidad y seguridad alimentaria",
      icon: UtensilsCrossed,
      count: 38,
    },
  ]

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

  const blogPosts = [
    {
      id: "1",
      slug: "invernaderos-inteligentes-ecuador",
      title: "La Revolución Silenciosa de los Invernaderos Inteligentes en la Sierra Ecuatoriana",
      excerpt:
        "Descubre cómo la tecnología de invernaderos inteligentes está transformando la producción agrícola en las zonas altas del Ecuador, optimizando recursos y aumentando rendimientos.",
      image: "/smart-greenhouse-technology.jpg",
      author: "Ing. María Fernández",
      role: "Ingeniera Agrónoma",
      date: "18 de junio de 2024",
      readTime: "6 min",
    },
    {
      id: "2",
      slug: "tecnologia-agricultura-ecuador",
      title: "Revolución Verde 2.0: ¿Cómo la Tecnología Está Transformando el Campo Ecuatoriano?",
      excerpt:
        "Explora las innovaciones tecnológicas que están revolucionando la agricultura ecuatoriana: drones, sensores IoT y agricultura de precisión al servicio del campo.",
      image: "/agricultural-technology-drones.jpg",
      author: "Ing. Roberto Salazar",
      role: "Especialista en Agricultura de Precisión",
      date: "17 de junio de 2024",
      readTime: "7 min",
    },
    {
      id: "3",
      slug: "ganaderia-sostenible-ecuador",
      title: "Ganadería Sostenible: Prácticas que Benefician al Ambiente y la Producción",
      excerpt:
        "Conoce las mejores prácticas de ganadería sostenible que permiten aumentar la productividad mientras se protege el medio ambiente y se mejora el bienestar animal.",
      image: "/sustainable-livestock-farming.jpg",
      author: "Ing. Andrea Morales",
      role: "Zootecnista",
      date: "15 de junio de 2024",
      readTime: "5 min",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProfessionalHeroCarousel slides={carouselSlides} />
        <ProfessionalServicesGrid
          title="Especialidades Agrarias"
          subtitle="Profesionales expertos en agricultura, ganadería e industria alimentaria"
          categories={serviceCategories}
          basePath="/agraria"
        />
        <FeaturedProfessional professional={featuredProfessional} categorySlug="agraria" />
        <BlogSection posts={blogPosts} />
      </main>
      <Footer />
    </div>
  )
}
