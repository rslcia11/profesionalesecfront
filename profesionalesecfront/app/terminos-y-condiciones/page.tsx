"use client"

import { motion } from "framer-motion"
import { FileText, Shield, Scale, AlertCircle, CheckCircle2, Lock } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TerminosYCondicionesPage() {
  const sections = [
    {
      id: "introduccion",
      icon: FileText,
      title: "1. Introducción",
      content: `Bienvenido(a) a Profesionales Ecuador. Estos Términos y Condiciones regulan el acceso, uso y participación en nuestra plataforma digital (www.profesionales.ec) y en todos los servicios relacionados que ofrecemos.

Al acceder, navegar, registrarte o utilizar nuestros servicios, aceptas expresamente y sin reservas estar sujeto(a) a los presentes Términos y Condiciones, así como a nuestra Política de Privacidad y demás políticas aplicables.`,
    },
    {
      id: "informacion-general",
      icon: Shield,
      title: "2. Información General",
      content: `Profesionales Ecuador es una plataforma que promueve la visibilidad, conexión y desarrollo de profesionales en distintas áreas de especialización en el Ecuador.

Actuamos como intermediarios digitales, brindando espacios de exposición, formación y difusión profesional, sin asumir responsabilidad directa sobre los servicios ofrecidos por los profesionales registrados.`,
    },
    {
      id: "registro",
      icon: CheckCircle2,
      title: "4. Registro y Evaluación de Profesionales",
      content: `El acceso como profesional registrado en Profesionales Ecuador no es automático ni garantizado.

Evaluación previa: Todos los aspirantes a formar parte de la plataforma serán objeto de una evaluación exhaustiva realizada por el equipo de Profesionales Ecuador.

Se considerarán aspectos como:
• Formación académica verificada
• Experiencia profesional demostrable
• Reputación, referencias y trayectoria
• Cumplimiento ético y profesional

Profesionales Ecuador se reserva el derecho exclusivo de aceptar o rechazar solicitudes sin necesidad de justificar su decisión, en resguardo de la calidad y reputación de la plataforma.`,
    },
    {
      id: "perfiles",
      icon: Lock,
      title: "5. Perfiles Profesionales",
      content: `Al registrarse y aceptar su incorporación, el profesional:

• Autoriza expresamente a Profesionales Ecuador a publicar y difundir su perfil, incluyendo nombre completo, imagen personal, formación académica, experiencia, certificaciones y otros datos profesionales relevantes.

• Dicha autorización incluye el uso de los datos para promoción dentro y fuera de la plataforma, material publicitario, educativo o institucional, y campañas de marketing.

Esta cesión de derechos de imagen y datos profesionales es gratuita, ilimitada en tiempo y territorio, y no generará contraprestaciones económicas salvo que se acuerde expresamente por escrito.`,
    },
    {
      id: "conversatorios",
      icon: AlertCircle,
      title: "6. Conversatorios y Eventos",
      content: `Al inscribirse o participar en cualquier conversatorio, seminario, webinar o evento organizado por Profesionales Ecuador, el participante acepta y autoriza expresamente:

• La grabación total o parcial de audio y video del evento
• La captura de fotografías durante el desarrollo del evento
• El uso, reproducción, distribución y difusión de dichas grabaciones e imágenes con fines promocionales, educativos o comerciales, sin limitaciones territoriales ni temporales

Los contenidos generados en los conversatorios serán propiedad exclusiva de Profesionales Ecuador, salvo pacto escrito en contrario.`,
    },
    {
      id: "propiedad",
      icon: Scale,
      title: "7. Propiedad Intelectual",
      content: `Todo el contenido de la plataforma, incluyendo pero no limitado a textos, gráficos, logos, íconos, imágenes, clips de audio, clips de video, descargas digitales, compilaciones de datos y software, es propiedad exclusiva de Profesionales Ecuador o de sus proveedores de contenido.

Está estrictamente prohibido copiar, reproducir, distribuir, modificar o crear obras derivadas de cualquier material sin autorización escrita de Profesionales Ecuador.`,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Scale className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Términos Legales</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Términos y <span className="text-blue-400">Condiciones</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Última actualización: 20 de febrero de 2025</p>
          </motion.div>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{section.title}</h2>
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">19. Contacto</h2>
            <p className="text-gray-300 mb-6">
              Para cualquier duda, comentario, solicitud o reclamo relacionado con estos Términos y Condiciones, puede
              contactarnos a:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400">📞</span>
                </div>
                <span className="text-white">Teléfono: 0994147639</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400">📧</span>
                </div>
                <a href="mailto:info@profesionales.ec" className="text-blue-400 hover:text-blue-300 transition-colors">
                  info@profesionales.ec
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
