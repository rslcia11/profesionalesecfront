"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, MapPin, Users, Award, MessageSquare, DollarSign, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { ponenciasApi } from "@/lib/api"

export default function ConversatoriosPage() {
  const [selectedRole, setSelectedRole] = useState<"ponente" | "asistente" | "patrocinador" | null>(null)
  const [proximos, setProximos] = useState<any[]>([])
  const [realizados, setRealizados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ponenciasApi.listar()
        if (data && data.ponencias) {
          const now = new Date()
          const prox = []
          const real = []

          data.ponencias.forEach((p: any) => {
            const fechaInicio = new Date(p.fecha_inicio)
            if (fechaInicio >= now) {
              prox.push(p)
            } else {
              real.push(p)
            }
          })

          setProximos(prox)
          setRealizados(real)
        }
      } catch (error) {
        console.error("Error loading ponencias:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Black background with white text */}
      <section className="relative pt-32 pb-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Conversatorios Profesionales</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Espacios de conocimiento, networking y crecimiento profesional. Conecta con expertos y amplía tu red de
              contactos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-emerald-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">¿Qué son los Conversatorios?</h2>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Los conversatorios de <span className="font-bold text-emerald-600">Profesionales.ec</span> son eventos
              diseñados para promover el intercambio de conocimientos, experiencias y mejores prácticas entre
              profesionales de diversas disciplinas. Estos espacios permiten a expertos y asistentes conectar, aprender
              y crecer profesionalmente en un ambiente colaborativo.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center text-center p-6 bg-emerald-50 rounded-xl">
                <MessageSquare className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Conocimiento</h3>
                <p className="text-gray-600 text-sm">
                  Aprende de expertos reconocidos y adquiere nuevas habilidades relevantes para tu carrera profesional
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Networking</h3>
                <p className="text-gray-600 text-sm">
                  Conecta con otros profesionales, amplía tu red de contactos y crea oportunidades de colaboración
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-xl">
                <Award className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Crecimiento</h3>
                <p className="text-gray-600 text-sm">
                  Desarrolla tu carrera profesional con certificaciones, reconocimientos y nuevas perspectivas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximo Conversatorio - Reduced spacing */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Próximos Conversatorios</h2>
            <p className="text-gray-600 text-lg">Inscríbete y participa</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Checking events...</div>
          ) : proximos.length > 0 ? (
            <div className="grid gap-8">
              {proximos.map((evento) => (
                <div key={evento.id} className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-emerald-100 p-4 rounded-xl">
                      <Calendar className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {evento.titulo}
                      </h3>
                      <p className="text-lg text-emerald-600 font-medium">
                        {new Date(evento.fecha_inicio).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 mt-2">
                        {evento.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin className="w-5 h-5" />
                    <span>Lugar: Por Confirmarse</span>
                  </div>

                  <Link
                    href={`/conversatorios/${evento.id}`}
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Más Información del Evento
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">No hay próximos eventos programados por el momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Conversatorios Realizados - Reduced spacing */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Conversatorios Realizados</h2>
            <p className="text-gray-600 text-lg">Eventos anteriores</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : realizados.length > 0 ? (
            <div className="grid gap-8">
              {realizados.map((evento) => (
                <div key={evento.id} className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-emerald-100 p-4 rounded-xl">
                      <Award className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {evento.titulo}
                      </h3>
                      <p className="text-lg text-gray-700 mb-4">
                        {evento.descripcion}
                      </p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span>Lugar: Por Confirmarse</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/conversatorios/${evento.id}`}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300"
                  >
                    Ver detalle
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500">No hay eventos pasados registrados.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sé Parte de Profesionales.ec - Reduced spacing */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
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
