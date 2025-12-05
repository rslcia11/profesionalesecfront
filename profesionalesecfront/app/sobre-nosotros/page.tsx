"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Users, Target, Eye, Award, Lightbulb, Shield, Heart } from "lucide-react"

export default function SobreNosotrosPage() {
  const valores = [
    {
      icon: Award,
      title: "Excelencia",
      description: "Promovemos siempre lo mejor de cada profesional.",
    },
    {
      icon: Lightbulb,
      title: "Innovación",
      description: "Apostamos por la mejora continua y el uso de nuevas tecnologías.",
    },
    {
      icon: Shield,
      title: "Ética",
      description: "Actuamos con transparencia, respeto y responsabilidad.",
    },
    {
      icon: Heart,
      title: "Compromiso Social",
      description: "Buscamos impactar positivamente en nuestra sociedad.",
    },
  ]

  const razones = [
    "Somos un espacio de crecimiento y formación continua.",
    "Contamos con una red de expertos evaluados y certificados.",
    "Trabajamos bajo principios éticos y legales que protegen a todos nuestros usuarios.",
    "Nos comprometemos con tu desarrollo personal y profesional.",
  ]

  const compromisos = [
    "Evaluamos cuidadosamente el perfil de cada profesional antes de su incorporación a la plataforma.",
    "Organizamos conversatorios y eventos con los más altos estándares de calidad.",
    "Fomentamos la actualización constante y la difusión de conocimientos a través de contenidos confiables y pertinentes.",
    "Protegemos y promovemos la imagen de nuestros profesionales, siempre respetando acuerdos claros y transparentes.",
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sobre Nosotros</h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-8 border border-blue-800/50 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Misión</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Impulsar el desarrollo profesional en Ecuador y en la región, proporcionando una plataforma de difusión,
                capacitación y networking basada en altos estándares de calidad, ética y excelencia académica.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-8 border border-purple-800/50 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Visión</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Convertirnos en la principal red de profesionales en Ecuador, reconocida por su contribución activa al
                crecimiento educativo, social y empresarial del país.
              </p>
            </div>
          </div>

          <div className="mb-16 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 pb-4 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-fit">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">¿Quiénes Somos?</h2>
              </div>
              <p className="text-gray-300 leading-snug mb-2">
                En <span className="text-blue-400 font-semibold">Profesionales Ecuador</span> creemos en el poder de la
                excelencia, la educación continua y la colaboración entre expertos.
              </p>
              <p className="text-gray-300 leading-snug mb-2">
                Somos una plataforma diseñada para conectar a profesionales de diversas áreas con personas, empresas e
                instituciones que valoran el conocimiento especializado y la formación de calidad.
              </p>
              <p className="text-gray-400 text-sm italic leading-snug mb-0">
                Nuestro propósito es crear un espacio confiable donde el crecimiento profesional y la capacitación sean
                accesibles para todos.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-10 mb-16 border border-gray-800 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Nuestra Historia</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <span className="text-blue-400 font-semibold">Profesionales Ecuador</span> nace de la visión compartida
                de dos profesionales apasionados: el{" "}
                <span className="text-white font-semibold">Ing. Terry Mendieta</span> y el{" "}
                <span className="text-white font-semibold">Ing. Juan Estrada</span>, quienes identificaron la necesidad
                de un espacio serio y organizado para conectar a expertos de diferentes áreas.
              </p>
              <p>
                Contamos además con el valioso apoyo del{" "}
                <span className="text-white font-semibold">Dr. Luis Gutiérrez</span> en nuestro primer conversatorio,
                marcando el inicio de esta gran comunidad.
              </p>
              <p className="text-blue-400 font-medium">
                Desde entonces, hemos crecido consolidándonos como un referente en el ámbito de conversatorios,
                formación continua y eventos de alta calidad.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-10">
              <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  TM
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Terry Mendieta</h3>
                <p className="text-blue-400 text-sm">CEO / Fundador</p>
              </div>

              <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  JE
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Juan Estrada</h3>
                <p className="text-blue-400 text-sm">CEO / Fundador</p>
              </div>
            </div>
          </div>

          <div className="mb-16 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Nuestros Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valores.map((valor, index) => {
                const Icon = valor.icon
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105"
                  >
                    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center mb-2">{valor.title}</h3>
                    <p className="text-gray-400 text-sm text-center leading-relaxed">{valor.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-blue-900/20 rounded-2xl p-10 mb-16 border border-blue-800/50 animate-in fade-in slide-in-from-bottom duration-700 delay-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              ¿Por Qué Confiar en Profesionales Ecuador?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {razones.map((razon, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{razon}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 mb-16 border border-gray-800 animate-in fade-in slide-in-from-bottom duration-700 delay-1000">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Nuestro Compromiso</h2>
            <div className="space-y-4">
              {compromisos.map((compromiso, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-gray-300 leading-relaxed">{compromiso}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-900/20 rounded-2xl p-10 border border-yellow-800/50 animate-in fade-in slide-in-from-bottom duration-700 delay-1000">
            <h2 className="text-2xl font-bold text-white mb-4">Conversatorios y Eventos</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              En cada evento, conversatorio o actividad organizada por{" "}
              <span className="text-blue-400 font-semibold">Profesionales Ecuador</span>, los participantes autorizan la
              grabación de audio y video, así como la captura de fotografías.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Estas grabaciones podrán ser utilizadas posteriormente con fines promocionales, educativos o comerciales,
              sin limitaciones territoriales ni temporales.
            </p>
            <p className="text-yellow-400 font-semibold">
              Importante: El profesional autoriza de manera gratuita el uso comercial de su imagen, salvo que se llegue
              a un acuerdo diferente por escrito en algún caso extraordinario. Todos los contenidos generados en
              nuestros conversatorios son propiedad de Profesionales Ecuador, salvo pacto en contrario formalizado por
              escrito.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
