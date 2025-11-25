"use client"

import { Scale, DollarSign, Briefcase } from "lucide-react"

export default function LawyersServices() {
  const services = [
    {
      icon: Scale,
      title: "Derecho Penal",
      description: "Defensa en procesos penales y delitos",
    },
    {
      icon: DollarSign,
      title: "Derecho Civil",
      description: "Contratos, herencias y propiedades",
    },
    {
      icon: Briefcase,
      title: "Derecho Laboral",
      description: "Conflictos laborales y derechos del trabajador",
    },
  ]

  return (
    <section id="servicios-legales" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Servicios Legales</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">Especialidades que cubrimos para tu tranquilidad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <div
                key={idx}
                className="group p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:bg-primary/5"
              >
                <div className="mb-6">
                  <Icon className="text-primary w-8 h-8" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                <div className="inline-flex text-primary text-sm font-medium">Ver abogados disponibles →</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
