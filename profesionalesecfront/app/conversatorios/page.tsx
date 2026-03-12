"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, MapPin, Users, Award, MessageSquare, DollarSign, ArrowRight, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ponenciasApi, revistaApi } from "@/lib/api"
import CountdownTimer from "@/components/countdown-timer"
import MagazineCard from "@/components/magazine-card"
import { motion } from "framer-motion"
import { formatUrl } from "@/lib/utils"

export default function ConversatoriosPage() {
  const [selectedRole, setSelectedRole] = useState<"ponente" | "asistente" | "patrocinador" | null>(null)
  const [proximos, setProximos] = useState<any[]>([])
  const [realizados, setRealizados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [revistas, setRevistas] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ponenciasApi.listar()
        if (data && data.ponencias) {
          const now = new Date()
          const prox: any[] = []
          const real: any[] = []

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

        const magazinesRes = await revistaApi.listarPublicadas()
        setRevistas(magazinesRes.revistas || [])
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

      {/* Hero Section - Minimalist & Premium */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
              EDUCACIÓN
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              Espacios de conocimiento y <span className="text-emerald-500/80">crecimiento exponencial</span> para el profesional moderno.
            </p>
          </motion.div>
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

      {/* Próximo Conversatorio - Minimalist High Impact */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">Próximos Eventos</h2>
              <p className="text-gray-400 text-lg font-light">Inscríbete y forma parte de la vanguardia profesional.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Checking events...</div>
          ) : proximos.length > 0 ? (
            <div className="grid gap-8">
              {proximos.map((evento) => (
                <div key={evento.id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl overflow-hidden hover:shadow-emerald-50 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative z-10">
                       <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full mb-4 uppercase tracking-[0.2em] border border-emerald-100">
                         {new Date(evento.fecha_inicio).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}
                       </span>
                       <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
                          {evento.titulo}
                       </h3>
                       <p className="text-base text-gray-400 mb-8 max-w-2xl leading-relaxed font-light">
                          {evento.descripcion}
                       </p>

                       <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span>{evento.ciudad?.nombre || "Nacional"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-500" />
                            <span>{evento.cupo} Cupos</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                          <div className="shrink-0">
                             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">Comienza en:</p>
                             <CountdownTimer targetDate={evento.fecha_inicio} />
                          </div>

                          <Link
                            href={`/conversatorios/${evento.id}`}
                            className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/5"
                          >
                            VER DETALLES
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                       </div>
                  </div>
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

      {/* Conversatorios Realizados - Minimalist History */}
      <section className="py-20 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">Conversatorios Realizados</h2>
            <p className="text-gray-400 text-lg font-light italic">Revive junto a nosotros el conocimiento y la innovación.</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Cargando...</div>
          ) : realizados.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {realizados.map((evento) => (
                <div key={evento.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100">
                  <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
                    <img 
                       src={formatUrl(evento.imagen_banner) || "/images/event-placeholder.jpg"} 
                       alt={evento.titulo}
                       className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="relative z-20">
                       <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-emerald-500 transition-colors">
                          <Award className="w-6 h-6 text-white" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-6 grow flex flex-col">
                    <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                       {new Date(evento.fecha_inicio).toLocaleDateString('es-EC', { year: 'numeric' })}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {evento.titulo}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-6 font-light">
                       {evento.descripcion}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex items-center gap-1.5 text-gray-300 text-[10px] font-medium">
                          <MapPin className="w-3 h-3" />
                          <span>{evento.ciudad?.nombre || "Nacional"}</span>
                       </div>
                       <Link
                        href={`/conversatorios/${evento.id}`}
                        className="text-[10px] font-black text-emerald-600 tracking-widest hover:text-emerald-700 transition-colors"
                      >
                        VER EVENTO
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">Próximamente estaremos publicando nuestras memorias.</p>
            </div>
          )}
        </div>
      </section>

      {/* Revista Científica Section - Refined & Minimalist */}
      <section className="py-24 px-6 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="relative bg-[#0A0A0A] rounded-[3rem] p-8 md:p-16 overflow-hidden border border-white/5">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05),transparent_50%)]" />
               
               <div className="relative z-10 grid lg:grid-cols-5 gap-16 items-center">
                  <div className="lg:col-span-2">
                     <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
                        Revista Científica <br/>
                        <span className="bg-linear-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent opacity-80">Profesionales.ec</span>
                     </h2>
                     <p className="text-base text-gray-500 mb-8 leading-relaxed font-light">
                        Investigación e innovación multidisciplinaria. Accede a las últimas ediciones de nuestra publicación digital de forma gratuita.
                     </p>
                     <Button className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-6 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95">
                        LEER REVISTA
                        <ArrowRight className="ml-2 w-4 h-4" />
                     </Button>
                  </div>
                  
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {revistas.length > 0 ? revistas.slice(0, 2).map((mag) => (
                        <MagazineCard key={mag.id} magazine={mag} />
                     )) : (
                        <div className="col-span-full p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                           <p className="text-gray-500 text-xs italic font-light">Cargando ediciones recientes...</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Articles CTA Section */}
      <section className="py-16 px-6 bg-linear-to-br from-emerald-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <BookOpen className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explora el Conocimiento de Nuestra Comunidad</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre artículos, tips y guías prácticas escritas por los mismos profesionales que participan en nuestros conversatorios.
          </p>
          <Link
            href="/articulos"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-1 active:scale-95 group"
          >
            Ver todos los Artículos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
