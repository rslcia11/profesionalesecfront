"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, MapPin, Users, Award, MessageSquare, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConversatoriosPage() {
  const [selectedRole, setSelectedRole] = useState<"ponente" | "asistente" | "patrocinador" | null>(null)

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Conversatorios Profesionales</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Espacios de conocimiento, networking y crecimiento profesional. Conecta con expertos y amplía tu red de
              contactos.
            </p>
          </div>
        </div>
      </section>

      {/* Próximo Conversatorio */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Próximos Conversatorios</h2>
            <p className="text-gray-600 text-lg">Próximamente Junio 2025</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-emerald-100 p-4 rounded-xl">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Segundo Conversatorio Nacional Multidisciplinario de P.ec
                </h3>
                <p className="text-lg text-emerald-600 font-medium">
                  Innovación, Conocimiento y Futuro: Desafíos y Oportunidades en el Mundo Profesional
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-5 h-5" />
              <span>Lugar: Por Confirmarse</span>
            </div>

            <Link
              href="/preparando-conversatorio"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Más Información del Evento
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Conversatorios Realizados */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Conversatorios Realizados</h2>
            <p className="text-gray-600 text-lg">19, 20 y 21 de Marzo de 2025</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-emerald-100 p-4 rounded-xl">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Primer Conversatorio Nacional Multidisciplinario de P.ec
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  Innovación, Derecho y Aprendizaje Colaborativo, avalado por el Colegio de Abogado de Loja y sus
                  avales.
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>Auditorio Manuel Carrión Pinzano, Judicatura de Loja</span>
                </div>
              </div>
            </div>

            <Link
              href="/educacion/1er-cnmp"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300"
            >
              Ver evento gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sé Parte de Profesionales.ec */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sé Parte de Profesionales.ec</h2>
            <p className="text-gray-600 text-lg">Elige tu rol y únete a nuestra comunidad</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ponente */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ponente</h3>
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                Únete al selecto grupo de expertos que lideran los conversatorios de Profesionales.ec. Comparte tu
                experiencia, tus conocimientos y tus ideas con una audiencia ávida de aprender y crecer.
              </p>
              <Link
                href="https://wa.link/i65ui8"
                target="_blank"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600 transition-all duration-300 w-full justify-center mt-auto"
              >
                Más información
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Asistente */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Asistente</h3>
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                Participa en los conversatorios de Profesionales.ec y adquiere conocimientos directamente de expertos en
                diversas áreas. Aprovecha esta oportunidad para aprender, interactuar con ponentes destacados y resolver
                tus dudas.
              </p>
              <Link
                href="https://wa.link/soekak"
                target="_blank"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all duration-300 w-full justify-center mt-auto"
              >
                Más Información
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Patrocinador */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <div className="bg-amber-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Patrocinador</h3>
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                Impulsa tu marca apoyando los conversatorios de Profesionales.ec. Sé parte de un espacio donde expertos
                y profesionales se reúnen para compartir conocimientos y experiencias.
              </p>
              <Link
                href="https://wa.link/55n3u5"
                target="_blank"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-all duration-300 w-full justify-center mt-auto"
              >
                Más información
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
