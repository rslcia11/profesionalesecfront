"use client"

import { ArrowRight } from "lucide-react"
import { useState } from "react"

export default function CTA() {
  const [formData, setFormData] = useState({ name: "", email: "", profile: "" })

  return (
    <section id="contacto" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">¿Listo para comenzar?</h2>

        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Únete a miles de profesionales que están creciendo y conectando con nuevas oportunidades
        </p>

        {/* Form */}
        <div className="bg-background border border-border/50 rounded-xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
            />
            <input
              type="email"
              placeholder="Tu email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <select
            value={formData.profile}
            onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground mb-6"
          >
            <option value="">¿Qué tipo de perfil eres?</option>
            <option value="professional">Profesional buscando clientes</option>
            <option value="client">Cliente buscando profesional</option>
            <option value="company">Empresa</option>
          </select>

          <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            Registrarse ahora
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Sin tarjeta de crédito • Acceso inmediato • Cancela cuando quieras
        </p>
      </div>
    </section>
  )
}
