"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfessionalHeroCarousel from "@/components/shared/professional-hero-carousel"
import ProfessionalsCategoryList from "@/components/shared/professionals-category-list"
import ProfessionalServicesGrid from "@/components/shared/professional-services-grid"
import BlogSection from "@/components/shared/blog-section"
import { useState, useEffect, useMemo } from "react"
import { useSpecialtyCounts } from "@/hooks/use-specialty-counts"
import { catalogosApi } from "@/lib/api"
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

  const PROFESSION_IDS = [1, 6, 7, 9, 10]
  const { countsBySpecialty } = useSpecialtyCounts(PROFESSION_IDS)
  const [apiSpecialties, setApiSpecialties] = useState<any[]>([])

  useEffect(() => {
    Promise.all(PROFESSION_IDS.map(id => catalogosApi.obtenerEspecialidades(id)))
      .then(results => {
        const combined = results.flatMap(data => Array.isArray(data) ? data : [])
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
        setApiSpecialties(unique)
      })
      .catch(() => setApiSpecialties([]))
  }, [])

  const editorialMeta: Record<string, { description: string; icon: any }> = {
    "Medicina General": { description: "Atención médica integral y diagnóstico de enfermedades comunes", icon: Stethoscope },
    "Odontología": { description: "Salud bucal, tratamientos dentales y rehabilitación oral", icon: UserRound },
    "Nutrición": { description: "Planes nutricionales personalizados y control de peso", icon: Utensils },
    "Cardiología": { description: "Diagnóstico y tratamiento de enfermedades cardiovasculares", icon: Heart },
    "Pediatría": { description: "Atención médica especializada para niños y adolescentes", icon: Baby },
    "Ginecología": { description: "Salud reproductiva y atención integral de la mujer", icon: HeartHandshake },
    "Dermatología": { description: "Diagnóstico y tratamiento de enfermedades de la piel", icon: Shield },
    "Traumatología": { description: "Lesiones óseas, fracturas y rehabilitación física", icon: Bone },
    "Oftalmología": { description: "Salud visual y tratamiento de enfermedades oculares", icon: Eye },
    "Otorrinolaringología": { description: "Enfermedades de oído, nariz y garganta", icon: Ear },
    "Gastroenterología": { description: "Diagnóstico y tratamiento del aparato digestivo", icon: Activity },
    "Neurología": { description: "Enfermedades del sistema nervioso y cerebral", icon: Brain },
    "Endocrinología": { description: "Trastornos hormonales, diabetes y metabolismo", icon: Pill },
    "Urología": { description: "Salud del sistema urinario y reproductivo masculino", icon: Droplet },
    "Oncología": { description: "Diagnóstico y tratamiento de cáncer", icon: Microscope },
    "Neumología": { description: "Enfermedades respiratorias y pulmonares", icon: Wind },
    "Reumatología": { description: "Enfermedades de articulaciones y tejido conectivo", icon: HeartPulse },
    "Radiología": { description: "Diagnóstico por imágenes médicas", icon: Radiation },
    "Infectología": { description: "Tratamiento de enfermedades infecciosas", icon: Syringe },
    "Inmunología": { description: "Enfermedades del sistema inmunológico y alergias", icon: Shield },
    "Geriatría": { description: "Atención médica especializada para adultos mayores", icon: Users },
    "Enfermería": { description: "Cuidados de enfermería profesional y atención domiciliaria", icon: Hospital },
    "Toxicología": { description: "Intoxicaciones y envenenamientos", icon: Thermometer },
    "Proctología": { description: "Enfermedades del colon, recto y ano", icon: Activity },
  }

  const serviceCategories = useMemo(() => {
    return apiSpecialties
      .filter((spec) => spec.profesion_id)
      .map((spec) => {
        const meta = editorialMeta[spec.nombre] || { description: spec.nombre, icon: Stethoscope }
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

      {/* Hero Carousel Section */}
      <section className="relative">
        <ProfessionalHeroCarousel slides={heroSlides} autoplay={true} autoplayInterval={5000} />
      </section>

      {/* Professional Services Grid */}
      <ProfessionalServicesGrid
        title="Especialidades Médicas"
        subtitle="Encuentra el profesional de la salud que necesitas"
        categories={serviceCategories}
      />

      {/* Real Professionals List */}
      <ProfessionalsCategoryList
        professionIds={[1, 6, 7, 9, 10]}
        title="Especialistas en Salud"
        description="Médicos y profesionales de la salud verificados"
      />

      {/* Blog Section */}
      <BlogSection professionIds={PROFESSION_IDS} />

      <Footer />
    </main>
  )
}
