"use client"

<<<<<<< Updated upstream
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
} from "lucide-react"
=======
import { Briefcase, Stethoscope, BookOpen, Wrench, Code, Palette } from "lucide-react"
import Link from "next/link"
>>>>>>> Stashed changes

export default function Services() {
  const services = [
    {
      id: "derecho",
      title: "Derecho",
<<<<<<< Updated upstream
      image: "/lawyer-professional-office-desk.jpg",
      icon: Briefcase,
      href: "/profesionales",
=======
      description: "Consultoría legal profesional",
      link: "/profesionales",
>>>>>>> Stashed changes
    },
    {
      id: "salud",
      title: "Salud",
<<<<<<< Updated upstream
      image: "/healthcare-doctor-medical-clinic.jpg",
      icon: Stethoscope,
      href: "/profesionales",
=======
      description: "Servicios médicos especializados",
      link: "/profesionales",
>>>>>>> Stashed changes
    },
    {
      id: "economia",
      title: "Economía y Administración",
      image: "/business-finance-administration-office.jpg",
      icon: Money,
      href: "/profesionales",
    },
    {
      id: "oficios",
      title: "Oficios y más",
      image: "/craftsman-trades-work-skilled.jpg",
      icon: Building,
      href: "/profesionales",
    },
    {
      id: "comunicacion",
      title: "Comunicación",
      image: "/communication-media-marketing-broadcast.jpg",
      icon: PaintBrush,
      href: "/profesionales",
    },
    {
      id: "educacion",
      title: "Educación",
<<<<<<< Updated upstream
      image: "/education-teaching-classroom-learning.jpg",
      icon: BookOpen,
      href: "/profesionales",
=======
      description: "Capacitación profesional",
      link: "/educacion",
>>>>>>> Stashed changes
    },
    {
      id: "ingenieria",
      title: "Ingeniería y Tecnología",
      image: "/engineering-technology-software-development.jpg",
      icon: Wrench,
<<<<<<< Updated upstream
      href: "/profesionales",
=======
      title: "Ingeniería y Tecnología",
      description: "Soluciones tech avanzadas",
      link: "/ingenieria-y-tecnologia",
    },
    {
      icon: Code,
      title: "Desarrollo",
      description: "Software y aplicaciones",
      link: "/profesionales",
>>>>>>> Stashed changes
    },
    {
      id: "diseno",
      title: "Diseño y Construcción",
      image: "/design-construction-architecture-building.jpg",
      icon: Palette,
<<<<<<< Updated upstream
      href: "/profesionales",
    },
    {
      id: "agraria",
      title: "Agraria",
      image: "/agriculture-farming-agricultural-field.jpg",
      icon: Briefcase,
      href: "/profesionales",
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
      href: "/profesionales",
=======
      title: "Diseño",
      description: "Creatividad y branding",
      link: "/profesionales",
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        <ServicesCarousel services={services} itemsPerView={4} />
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <Link
                key={idx}
                href={service.link}
                className="group p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:bg-primary/5 block"
              >
                <div className="mb-6">
                  <Icon className="text-primary w-8 h-8" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>

                <div className="mt-6 inline-flex text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorar →
                </div>
              </Link>
            )
          })}
        </div>
>>>>>>> Stashed changes
      </div>
    </section>
  )
}
