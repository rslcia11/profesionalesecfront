"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
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

  const serviceCategories = [
    {
      id: "musica",
      name: "Música",
      description: "Músicos, DJs y productores musicales profesionales",
      icon: Music,
      count: 52,
    },
    {
      id: "pintura-escultura",
      name: "Pintura y Escultura",
      description: "Artistas visuales y escultores contemporáneos",
      icon: Palette,
      count: 38,
    },
    {
      id: "artes-escenicas",
      name: "Artes Escénicas",
      description: "Bailarines, coreógrafos y artistas escénicos",
      icon: Theater,
      count: 31,
    },
    {
      id: "actuacion",
      name: "Actuación",
      description: "Actores profesionales de teatro y cine",
      icon: Mic,
      count: 28,
    },
    {
      id: "fotografia",
      name: "Fotografía Artística",
      description: "Fotógrafos especializados en arte visual",
      icon: Camera,
      count: 45,
    },
    {
      id: "arte-urbano",
      name: "Arte Urbano",
      description: "Grafiteros y muralistas profesionales",
      icon: Brush,
      count: 22,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "tendencias-arte-contemporaneo",
      title: "Tendencias del Arte Contemporáneo Ecuatoriano",
      excerpt: "Explora las corrientes artísticas que están definiendo el arte nacional e internacional.",
      image: "/contemporary-art-gallery.png",
      date: "20 de enero de 2025",
      readTime: "6 min",
      author: "Roberto Aguirre",
      role: "Crítico de Arte",
    },
    {
      id: "2",
      slug: "vivir-del-arte",
      title: "Cómo Vivir del Arte en Ecuador",
      excerpt: "Estrategias y consejos para artistas que buscan profesionalizar su carrera artística.",
      image: "/artist-working-studio.jpg",
      date: "14 de enero de 2025",
      readTime: "8 min",
      author: "Laura Sánchez",
      role: "Gestora Cultural",
    },
    {
      id: "3",
      slug: "importancia-arte-cultura",
      title: "La Importancia del Arte en la Sociedad",
      excerpt: "Reflexión sobre el rol transformador del arte y la cultura en nuestras comunidades.",
      image: "/cultural-art-community.jpg",
      date: "9 de enero de 2025",
      readTime: "5 min",
      author: "Diego Torres",
      role: "Antropólogo Cultural",
    },
  ]

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
        basePath="/arte-y-cultura"
      />

      <FeaturedProfessional professional={featuredProfessional} categorySlug="arte-y-cultura" />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
