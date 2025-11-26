"use client"

import { Briefcase, Stethoscope, BookOpen, Wrench, Code, Palette } from "lucide-react"
import Link from "next/link"

export default function Services() {
  const services = [
    {
      icon: Briefcase,
      title: "Derecho",
      description: "Consultoría legal profesional",
      link: "/profesionales",
    },
    {
      icon: Stethoscope,
      title: "Salud",
      description: "Servicios médicos especializados",
      link: "/medicos",
    },
    {
      icon: BookOpen,
      title: "Educación",
      description: "Capacitación profesional",
      link: "/educacion",
    },
    {
      icon: Wrench,
      title: "Ingeniería y Tecnología",
      description: "Soluciones tech avanzadas",
      link: "/ingenieria-y-tecnologia",
    },
    {
      icon: Code,
      title: "Desarrollo",
      description: "Software y aplicaciones",
      link: "/profesionales",
    },
    {
      icon: Palette,
      title: "Diseño",
      description: "Creatividad y branding",
      link: "/profesionales",
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
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Servicios especializados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Acceso a profesionales expertos en diversas áreas de expertise
          </p>
        </div>

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
      </div>
    </section>
  )
}
