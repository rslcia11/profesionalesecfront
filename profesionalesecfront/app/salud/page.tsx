"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import FeaturedProfessional from "@/components/shared/featured-professional"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import {
  Stethoscope,
  Heart,
  Baby,
  Eye,
  Ear,
  Bone,
  Pill,
  Syringe,
  Activity,
  Brain,
  Microscope,
  HeartPulse,
  Utensils,
  Radiation,
  Users,
  Thermometer,
  Wind,
  Shield,
  Droplet,
  HeartHandshake,
  UserRound,
  Hospital,
} from "lucide-react"

export default function SaludPage() {
  const heroSlides = [
    {
      image: "/doctor-consultation-patient-healthcare.jpg",
      title: "Cuidamos Tu Salud",
      subtitle: "Profesionales médicos comprometidos con tu bienestar",
    },
    {
      image: "/medical-team-hospital-professionals.jpg",
      title: "Excelencia en Atención Médica",
      subtitle: "Especialistas altamente calificados a tu servicio",
    },
    {
      image: "/healthcare-technology-modern-medicine.jpg",
      title: "Salud con Tecnología de Punta",
      subtitle: "Diagnósticos precisos y tratamientos efectivos",
    },
  ]

  const featuredProfessional = {
    name: "Dra. Yajaira González Fierro",
    specialty: "Odontología - Rehabilitación Oral",
    experience: 14,
    city: "Loja",
    image: "/featured-dentist-professional.jpg",
    description:
      "Odontóloga graduada en el año 2011 en la Universidad Nacional de Loja, con estudios de especialidad en la Universidad Estatal de Talca, Chile. Con más de 10 años de experiencia, especialista en rehabilitación oral, puedo restaurar la boca del paciente, devolviéndole su sonrisa y mejorando su calidad de vida.",
    achievements: [
      "Especialista en Rehabilitación Oral - Universidad Estatal de Talca, Chile (2019)",
      "Más de 500 casos de rehabilitación oral exitosos",
      "Certificación en técnicas de odontología estética avanzada",
      "Miembro activo del Colegio de Odontólogos del Ecuador",
    ],
    clients: 480,
    satisfaction: 98,
  }

  const serviceCategories = [
    {
      id: "medicina-general",
      name: "Medicina General",
      description: "Atención médica integral y diagnóstico de enfermedades comunes",
      icon: Stethoscope,
      count: 68,
    },
    {
      id: "odontologia",
      name: "Odontología",
      description: "Salud bucal, tratamientos dentales y rehabilitación oral",
      icon: UserRound,
      count: 54,
    },
    {
      id: "nutricion",
      name: "Nutrición",
      description: "Planes nutricionales personalizados y control de peso",
      icon: Utensils,
      count: 42,
    },
    {
      id: "cardiologia",
      name: "Cardiología",
      description: "Diagnóstico y tratamiento de enfermedades cardiovasculares",
      icon: Heart,
      count: 38,
    },
    {
      id: "pediatria",
      name: "Pediatría",
      description: "Atención médica especializada para niños y adolescentes",
      icon: Baby,
      count: 52,
    },
    {
      id: "ginecologia",
      name: "Ginecología",
      description: "Salud reproductiva y atención integral de la mujer",
      icon: HeartHandshake,
      count: 45,
    },
    {
      id: "dermatologia",
      name: "Dermatología",
      description: "Diagnóstico y tratamiento de enfermedades de la piel",
      icon: Shield,
      count: 36,
    },
    {
      id: "traumatologia",
      name: "Traumatología",
      description: "Lesiones óseas, fracturas y rehabilitación física",
      icon: Bone,
      count: 41,
    },
    {
      id: "oftalmologia",
      name: "Oftalmología",
      description: "Salud visual y tratamiento de enfermedades oculares",
      icon: Eye,
      count: 33,
    },
    {
      id: "otorrinolaringologia",
      name: "Otorrinolaringología",
      description: "Enfermedades de oído, nariz y garganta",
      icon: Ear,
      count: 28,
    },
    {
      id: "gastroenterologia",
      name: "Gastroenterología",
      description: "Diagnóstico y tratamiento del aparato digestivo",
      icon: Activity,
      count: 30,
    },
    {
      id: "neurologia",
      name: "Neurología",
      description: "Enfermedades del sistema nervioso y cerebral",
      icon: Brain,
      count: 25,
    },
    {
      id: "endocrinologia",
      name: "Endocrinología",
      description: "Trastornos hormonales, diabetes y metabolismo",
      icon: Pill,
      count: 27,
    },
    {
      id: "urologia",
      name: "Urología",
      description: "Salud del sistema urinario y reproductivo masculino",
      icon: Droplet,
      count: 31,
    },
    {
      id: "oncologia",
      name: "Oncología",
      description: "Diagnóstico y tratamiento de cáncer",
      icon: Microscope,
      count: 22,
    },
    {
      id: "neumologia",
      name: "Neumología",
      description: "Enfermedades respiratorias y pulmonares",
      icon: Wind,
      count: 24,
    },
    {
      id: "reumatologia",
      name: "Reumatología",
      description: "Enfermedades de articulaciones y tejido conectivo",
      icon: HeartPulse,
      count: 20,
    },
    {
      id: "radiologia",
      name: "Radiología",
      description: "Diagnóstico por imágenes médicas",
      icon: Radiation,
      count: 26,
    },
    {
      id: "infectologia",
      name: "Infectología",
      description: "Tratamiento de enfermedades infecciosas",
      icon: Syringe,
      count: 19,
    },
    {
      id: "inmunologia",
      name: "Inmunología",
      description: "Enfermedades del sistema inmunológico y alergias",
      icon: Shield,
      count: 18,
    },
    {
      id: "geriatria",
      name: "Geriatría",
      description: "Atención médica especializada para adultos mayores",
      icon: Users,
      count: 23,
    },
    {
      id: "enfermeria",
      name: "Enfermería",
      description: "Cuidados de enfermería profesional y atención domiciliaria",
      icon: Hospital,
      count: 65,
    },
    {
      id: "toxicologia",
      name: "Toxicología",
      description: "Intoxicaciones y envenenamientos",
      icon: Thermometer,
      count: 15,
    },
    {
      id: "proctologia",
      name: "Proctología",
      description: "Enfermedades del colon, recto y ano",
      icon: Activity,
      count: 17,
    },
  ]

  const blogPosts = [
    {
      id: "1",
      slug: "telemedicina-ecuador",
      title: "Telemedicina en Ecuador: Cómo la Pandemia Cambió el Sistema de Salud",
      excerpt:
        "Descubre cómo la telemedicina se ha convertido en una herramienta fundamental para el acceso a servicios de salud en Ecuador.",
      image: "/telemedicine-virtual-consultation.jpg",
      date: "17 de junio de 2024",
      readTime: "7 min",
      author: "Dr. Francisco Mora",
      role: "Especialista en Medicina Digital",
    },
    {
      id: "2",
      slug: "importancia-chequeos-medicos",
      title: "La Importancia de los Chequeos Médicos Preventivos",
      excerpt:
        "Conoce por qué los controles médicos regulares son esenciales para detectar enfermedades a tiempo y mantener una vida saludable.",
      image: "/preventive-health-checkup.jpg",
      date: "10 de junio de 2024",
      readTime: "5 min",
      author: "Dra. Carmen Rodríguez",
      role: "Médica General",
    },
    {
      id: "3",
      slug: "salud-mental-bienestar",
      title: "Salud Mental: Un Pilar Fundamental del Bienestar",
      excerpt:
        "La salud mental es tan importante como la salud física. Aprende cómo cuidar tu bienestar emocional y cuándo buscar ayuda profesional.",
      image: "/mental-health-wellness-care.jpg",
      date: "5 de junio de 2024",
      readTime: "6 min",
      author: "Dra. Isabel Vega",
      role: "Psiquiatra",
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
        title="Especialidades Médicas"
        subtitle="Encuentra el profesional de la salud que necesitas"
        categories={serviceCategories}
        basePath="/salud"
      />

      {/* Featured Professional */}
      <FeaturedProfessional professional={featuredProfessional} categorySlug="salud" />

      {/* Blog Section */}
      <BlogSection posts={blogPosts} />

      <Footer />
    </main>
  )
}
