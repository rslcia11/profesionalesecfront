"use client"

import ServicesCarousel from "./services-carousel"
import {
  Briefcase,
  Stethoscope,
  BookOpen,
  Wrench,
  Palette,
  Bone as Money,
  Building,
  Paintbrush as PaintBrush,
  Heart,
  Sprout,
} from "lucide-react"

export default function Services() {
  const services = [
    {
      id: "derecho",
      title: "Derecho",
      image: "/lawyer-professional-office-desk.jpg",
      icon: Briefcase,
      href: "/derecho",
    },
    {
      id: "salud",
      title: "Salud",
      image: "/healthcare-doctor-medical-clinic.jpg",
      icon: Stethoscope,
      href: "/salud",
    },
    {
      id: "economia",
      title: "Economía y Administración",
      image: "/business-finance-administration-office.jpg",
      icon: Money,
      href: "/administracion",
    },
    {
      id: "oficios",
      title: "Oficios y más",
      image: "/craftsman-trades-work-skilled.jpg",
      icon: Building,
      href: "/oficios",
    },
    {
      id: "comunicacion",
      title: "Comunicación",
      image: "/communication-media-marketing-broadcast.jpg",
      icon: PaintBrush,
      href: "/comunicacion",
    },
    {
      id: "educacion",
      title: "Educación",
      image: "/education-teaching-classroom-learning.jpg",
      icon: BookOpen,
      href: "/educacion",
    },
    {
      id: "ingenieria",
      title: "Ingeniería y Tecnología",
      image: "/engineering-technology-software-development.jpg",
      icon: Wrench,
      href: "/ingenieria-y-tecnologia",
    },
    {
      id: "diseno",
      title: "Diseño y Construcción",
      image: "/design-construction-architecture-building.jpg",
      icon: Palette,
      href: "/diseno-y-construccion",
    },
    {
      id: "agraria",
      title: "Agraria",
      image: "/agriculture-farming-agricultural-field.jpg",
      icon: Sprout,
      href: "/agraria",
    },
    {
      id: "arte",
      title: "Arte y Cultura",
      image: "/art-culture-artist-creative.jpg",
      icon: PaintBrush,
      href: "/arte-y-cultura",
    },
    {
      id: "saludmental",
      title: "Salud mental",
      image: "/mental-health-psychology-wellness-therapy.jpg",
      icon: Heart,
      href: "/salud-mental",
    },
  ]

  return (
    <section id="servicios" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Servicios Profesionales</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Acceso a profesionales expertos en diversas áreas de expertise
          </p>
        </div>

        <ServicesCarousel services={services} itemsPerView={4} />
      </div>
    </section>
  )
}
