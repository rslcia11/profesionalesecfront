"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import {
  Camera,
  Radio,
  Tv,
  Newspaper,
  Megaphone,
  Film,
  Mic,
  Globe,
  Users,
  FileText,
  Video,
  PenTool,
} from "lucide-react"

export default function ComunicacionPage() {
  const heroSlides = [
    {
      image: "/communication-professional-media-broadcast.jpg",
      title: "Expertos en Comunicación y Medios",
      subtitle: "Conectamos tu mensaje con el mundo",
    },
    {
      image: "/journalism-news-reporter-professional.jpg",
      title: "Periodistas y Comunicadores",
      subtitle: "Información veraz y profesional",
    },
    {
      image: "/digital-marketing-social-media.jpg",
      title: "Comunicación Digital y Marketing",
      subtitle: "Tu marca en todas las plataformas",
    },
  ]

  const serviceCategories = [
    {
      id: "periodismo",
      name: "Periodismo",
      description: "Reporteros, columnistas y editores profesionales",
      icon: Newspaper,
      count: 42,
    },
    {
      id: "fotografia-periodistica",
      name: "Fotografía Periodística",
      description: "Captura de noticias y eventos importantes",
      icon: Camera,
      count: 28,
    },
    {
      id: "comunicacion-audiovisual",
      name: "Comunicación Audiovisual",
      description: "Producción de contenido para TV y streaming",
      icon: Tv,
      count: 35,
    },
    {
      id: "locucion-radio",
      name: "Locución y Radio",
      description: "Voces profesionales para medios y eventos",
      icon: Radio,
      count: 24,
    },
    {
      id: "relaciones-publicas",
      name: "Relaciones Públicas",
      description: "Gestión de imagen y comunicación corporativa",
      icon: Megaphone,
      count: 31,
    },
    {
      id: "produccion-audiovisual",
      name: "Producción Audiovisual",
      description: "Creación de contenido multimedia",
      icon: Film,
      count: 38,
    },
    {
      id: "comunicacion-corporativa",
      name: "Comunicación Corporativa",
      description: "Estrategias de comunicación interna y externa",
      icon: Mic,
      count: 26,
    },
    {
      id: "social-media",
      name: "Social Media",
      description: "Gestión de redes sociales y contenido digital",
      icon: Globe,
      count: 45,
    },
    {
      id: "comunicacion-organizacional",
      name: "Comunicación Organizacional",
      description: "Consultoría en comunicación empresarial",
      icon: Users,
      count: 22,
    },
    {
      id: "redaccion-contenidos",
      name: "Redacción y Contenidos",
      description: "Copywriting y creación de contenidos",
      icon: FileText,
      count: 40,
    },
    {
      id: "multimedia",
      name: "Multimedia",
      description: "Diseño y producción de contenido interactivo",
      icon: Video,
      count: 33,
    },
    {
      id: "diseno-editorial",
      name: "Diseño Editorial",
      description: "Maquetación y diseño de publicaciones",
      icon: PenTool,
      count: 29,
    },
  ]

  const featuredProfessional = {
    name: "María José Vásconez",
    role: "Periodista y Comunicadora Senior",
    specialty: "Periodismo de Investigación",
    image: "/featured-journalist-professional.jpg",
    experience: "12 años",
    projects: "150+",
    rating: "4.9/5",
    bio: "Periodista galardonada con amplia experiencia en medios nacionales e internacionales, especializada en investigación y comunicación digital.",
    achievements: [
      "Premio Nacional de Periodismo 2023",
      "Corresponsal internacional para medios latinoamericanos",
      "Docente universitaria en comunicación",
      "Más de 200 reportajes publicados",
    ],
  }

  const blogPosts = [
    {
      id: "1",
      slug: "futuro-periodismo-digital",
      title: "El Futuro del Periodismo Digital en Ecuador",
      excerpt: "Cómo las nuevas tecnologías están transformando la manera de hacer periodismo en el país.",
      image: "/digital-journalism-future.jpg",
      date: "15 de noviembre de 2024",
      readTime: "6 min",
      author: "Carlos Mendoza",
      role: "Periodista Digital",
    },
    {
      id: "2",
      slug: "estrategias-comunicacion-corporativa",
      title: "Estrategias Efectivas de Comunicación Corporativa",
      excerpt: "Guía completa para construir una estrategia de comunicación que fortalezca tu empresa.",
      image: "/corporate-communication-strategy.jpg",
      date: "10 de noviembre de 2024",
      readTime: "7 min",
      author: "Ana Rojas",
      role: "Consultora en Comunicación",
    },
    {
      id: "3",
      slug: "social-media-tendencias-2025",
      title: "Social Media: Tendencias 2025",
      excerpt: "Las principales tendencias en redes sociales que dominarán el próximo año.",
      image: "/social-media-trends-2025.jpg",
      date: "5 de noviembre de 2024",
      readTime: "5 min",
      author: "Diego Torres",
      role: "Social Media Manager",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Carousel */}
      <ProfessionalHeroCarousel slides={heroSlides} />

      {/* Services Grid */}
      <ProfessionalServicesGrid
        title="Especialidades en Comunicación"
        subtitle="Profesionales expertos en todas las áreas de la comunicación moderna"
        categories={serviceCategories}
        basePath="/comunicacion"
      />

      {/* Featured Professional */}
      <FeaturedProfessional professional={featuredProfessional} categorySlug="comunicacion" />

      {/* Blog Section */}
      <BlogSection posts={blogPosts} />

      <Footer />
    </div>
  )
}
