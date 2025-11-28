"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
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

  const serviceCategories = [
    {
      id: "belleza",
      name: "Belleza",
      description: "Estilistas, peluqueros, maquilladores y especialistas en estética",
      icon: Sparkles,
      count: 45,
    },
    {
      id: "fotografia",
      name: "Fotografía",
      description: "Fotógrafos profesionales, filmmakers y creadores de contenido audiovisual",
      icon: Camera,
      count: 38,
    },
    {
      id: "preparador-fisico",
      name: "Preparador Físico",
      description: "Entrenadores personales y especialistas en acondicionamiento físico",
      icon: Dumbbell,
      count: 32,
    },
    {
      id: "chefs",
      name: "Chefs",
      description: "Chefs profesionales, cocineros y especialistas en gastronomía",
      icon: ChefHat,
      count: 28,
    },
    {
      id: "plomeria",
      name: "Plomería",
      description: "Plomeros certificados para instalación y reparación de sistemas hidráulicos",
      icon: Wrench,
      count: 35,
    },
    {
      id: "panaderia",
      name: "Panadería y Pastelería",
      description: "Panaderos, pasteleros y reposteros especializados",
      icon: Cookie,
      count: 24,
    },
    {
      id: "mecanica",
      name: "Mecánica Automotriz",
      description: "Mecánicos automotrices y técnicos en reparación de vehículos",
      icon: Car,
      count: 40,
    },
    {
      id: "electricista",
      name: "Electricista",
      description: "Electricistas certificados para instalaciones eléctricas residenciales y comerciales",
      icon: Zap,
      count: 42,
    },
    {
      id: "carpinteria",
      name: "Carpintería",
      description: "Carpinteros profesionales para muebles a medida y trabajos en madera",
      icon: Hammer,
      count: 30,
    },
    {
      id: "deporte",
      name: "Deporte",
      description: "Entrenadores deportivos y especialistas en diferentes disciplinas",
      icon: Trophy,
      count: 36,
    },
    {
      id: "servicios-varios",
      name: "Servicios Varios",
      description: "Diversos oficios y servicios especializados",
      icon: Briefcase,
      count: 50,
    },
  ]

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
        <ProfessionalHeroCarousel slides={carouselSlides} category="Oficios y más" />
        <ProfessionalServicesGrid
          title="Oficios Especializados"
          subtitle="Encuentra profesionales certificados en diversos oficios y servicios"
          categories={serviceCategories}
          basePath="/oficios"
        />
        <FeaturedProfessional professional={featuredProfessional} categorySlug="oficios" />
        <BlogSection posts={blogPosts} />
      </main>
      <Footer />
    </>
  )
}
