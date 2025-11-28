"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import { BookOpen, GraduationCap, Users, Globe, School, Microscope } from "lucide-react"

export default function EducacionPage() {
  const heroSlides = [
    {
      image: "/teacher-classroom-students.jpg",
      title: "Profesionales en Educación",
      subtitle: "Docentes calificados para transformar el aprendizaje",
    },
    {
      image: "/university-professor-lecture.jpg",
      title: "Excelencia Educativa",
      subtitle: "Conecta con los mejores educadores del país",
    },
    {
      image: "/online-education-teacher.jpg",
      title: "Educación de Calidad",
      subtitle: "Profesores verificados y con experiencia comprobada",
    },
  ]

  const featuredProfessional = {
    name: "Dr. Roberto Vega",
    specialty: "Docente Universitario de Ingeniería",
    experience: 20,
    city: "Quito",
    image: "/university-professor-engineering.jpg",
    description:
      "Doctor en Ingeniería con más de 20 años de experiencia en docencia universitaria. Especializado en investigación académica y formación de profesionales de excelencia.",
    achievements: [
      "PhD en Ingeniería - Universidad Politécnica de Madrid",
      "Catedrático universitario por 20 años",
      "Autor de 15 publicaciones científicas",
      "Premio Nacional de Excelencia Docente 2023",
    ],
    clients: 500,
    satisfaction: 96,
  }

  const serviceCategories = [
    {
      id: "inicial",
      name: "Educación Inicial",
      description: "Pedagogía infantil y desarrollo temprano",
      icon: Users,
      count: 35,
    },
    {
      id: "basica",
      name: "Educación Básica",
      description: "Docencia para niveles de primaria",
      icon: BookOpen,
      count: 48,
    },
    {
      id: "secundaria",
      name: "Educación Secundaria",
      description: "Profesores especializados para bachillerato",
      icon: School,
      count: 42,
    },
    {
      id: "bilingue",
      name: "Educación Bilingüe",
      description: "Docentes certificados en idiomas",
      icon: Globe,
      count: 28,
    },
    {
      id: "universitaria",
      name: "Docencia Universitaria",
      description: "Catedráticos y profesores universitarios",
      icon: GraduationCap,
      count: 31,
    },
    {
      id: "investigacion",
      name: "Investigación Académica",
      description: "Asesores de tesis y proyectos de investigación",
      icon: Microscope,
      count: 22,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "metodologias-ensenanza-moderna",
      title: "Metodologías de Enseñanza para el Siglo XXI",
      excerpt: "Descubre las técnicas pedagógicas más efectivas para el aprendizaje en la era digital.",
      image: "/modern-teaching-classroom.jpg",
      date: "18 de enero de 2025",
      readTime: "6 min",
      author: "María González",
      role: "Pedagoga Especializada",
    },
    {
      id: "2",
      slug: "educacion-virtual-efectiva",
      title: "Cómo Implementar Educación Virtual Efectiva",
      excerpt: "Estrategias y herramientas para maximizar el aprendizaje en entornos virtuales.",
      image: "/online-education-technology.jpg",
      date: "12 de enero de 2025",
      readTime: "7 min",
      author: "Carlos Ramírez",
      role: "Experto en Tecnología Educativa",
    },
    {
      id: "3",
      slug: "desarrollo-integral-estudiantes",
      title: "El Desarrollo Integral de los Estudiantes",
      excerpt: "La importancia de educar más allá de lo académico: habilidades socioemocionales.",
      image: "/student-development-classroom.jpg",
      date: "8 de enero de 2025",
      readTime: "5 min",
      author: "Ana Martínez",
      role: "Psicopedagoga",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative">
        <ProfessionalHeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
      </section>

      <ProfessionalServicesGrid
        title="Especialidades Educativas"
        subtitle="Encuentra docentes calificados para todos los niveles educativos"
        categories={serviceCategories}
        basePath="/educacion"
      />

      <FeaturedProfessional professional={featuredProfessional} categorySlug="educacion" />

      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
