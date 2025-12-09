"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ConnectingProfessionals() {
  return (
    <section className="py-8 md:py-12 px-4 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">Conectando Profesionales</h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Una red que impulsa el crecimiento profesional en Ecuador
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/profesionales"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-button font-semibold text-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los profesionales
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
