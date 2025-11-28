"use client"

import { useState } from "react"
import { Facebook, Instagram, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const [openProfessional, setOpenProfessional] = useState<number | null>(null)
  const [openConversatorio, setOpenConversatorio] = useState<number | null>(null)

  const professionalFAQs = [
    {
      question: "¿Qué es Profesionales.ec?",
      answer:
        "Profesionales.ec es la plataforma líder en Ecuador que conecta profesionales certificados con clientes que necesitan sus servicios. Certificamos tu experiencia y te ayudamos a crecer profesionalmente.",
    },
    {
      question: "¿Cómo me registro como profesional?",
      answer:
        'Para registrarte, haz clic en "Crear Perfil Profesional" en el menú principal, completa tus datos, adjunta tus certificaciones y espera la aprobación de nuestro equipo.',
    },
    {
      question: "¿Tiene algún costo el registro?",
      answer:
        "El registro básico es gratuito. Ofrecemos planes premium con mayor visibilidad y funcionalidades adicionales para impulsar tu presencia profesional.",
    },
  ]

  const conversatorioFAQs = [
    {
      question: "¿Qué son los Conversatorios Multidisciplinarios?",
      answer:
        "Son eventos educativos donde expertos comparten conocimientos y experiencias en diferentes áreas profesionales. Una oportunidad única de aprendizaje y networking.",
    },
    {
      question: "¿Cómo me inscribo a los Conversatorios?",
      answer:
        'Desde la plataforma puedes inscribirte como asistente, ponente o patrocinador. Solo debes ingresar a la sección "Educación" y completar el formulario correspondiente.',
    },
    {
      question: "¿Recibo un certificado al asistir a un conversatorio?",
      answer:
        "Sí, todos los asistentes reciben un certificado digital de participación al finalizar el conversatorio, válido para tu desarrollo profesional continuo.",
    },
  ]

  return (
    <footer className="bg-black text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-lg">P</span>
              <span className="text-black text-[10px]">.ec</span>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">Profesionales Ecuador</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Impulsamos el crecimiento profesional en Ecuador. Certifícate, conecta con clientes y accede a
                oportunidades reales para tu desarrollo profesional.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="text-base font-bold mb-3 text-blue-400">SÉ PARTE DE PROFESIONALES.EC</h3>
            <div className="space-y-4">
              <div className="group">
                <h4 className="text-sm font-bold mb-2 text-white">PONENTE</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  Únete al selecto grupo de expertos que lideran los conversatorios. Comparte tu experiencia y
                  conocimientos con una audiencia ávida de aprender.
                </p>
                <Link
                  href="https://wa.link/i65ui8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Más información →
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold mb-3 text-transparent">.</h3>
            <div className="group">
              <h4 className="text-sm font-bold mb-2 text-white">ASISTENTE</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                Participa en los conversatorios y adquiere conocimientos directamente de expertos en diversas áreas. Haz
                que tu desarrollo profesional sea más dinámico.
              </p>
              <Link
                href="https://wa.link/soekak"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 transition-all duration-200 inline-block hover:translate-x-1"
              >
                Más información →
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold mb-3 text-transparent">.</h3>
            <div className="group">
              <h4 className="text-sm font-bold mb-2 text-white">PATROCINADOR</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                Impulsa tu marca apoyando los conversatorios. Posiciona tu marca frente a una comunidad en crecimiento y
                refuerza tu compromiso con el desarrollo profesional.
              </p>
              <Link
                href="https://wa.link/55n3u5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 transition-all duration-200 inline-block hover:translate-x-1"
              >
                Más información →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pt-6 border-t border-gray-800">
          <div>
            <h3 className="text-base font-bold mb-4">Nuestros Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/profesionales"
                  className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Directorio Profesional
                </Link>
              </li>
              <li>
                <Link
                  href="/conversatorios"
                  className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Educación
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos-y-condiciones"
                  className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Preguntas Profesionales</h3>
            <div className="space-y-2">
              {professionalFAQs.map((faq, index) => (
                <div key={index} className="border-b border-gray-800 pb-2">
                  <button
                    onClick={() => setOpenProfessional(openProfessional === index ? null : index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-blue-400 flex-shrink-0 ml-2 transition-transform duration-300 ${
                        openProfessional === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openProfessional === index ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Preguntas Conversatorios</h3>
            <div className="space-y-2">
              {conversatorioFAQs.map((faq, index) => (
                <div key={index} className="border-b border-gray-800 pb-2">
                  <button
                    onClick={() => setOpenConversatorio(openConversatorio === index ? null : index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-blue-400 flex-shrink-0 ml-2 transition-transform duration-300 ${
                        openConversatorio === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openConversatorio === index ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-xs text-gray-400">
              <span>Legal</span>
              <span className="hidden md:inline">|</span>
              <span>Contacto directo</span>
              <span className="hidden md:inline">|</span>
              <a
                href="mailto:info@profesionales.ec"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                info@profesionales.ec
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Síguenos en redes sociales</span>
              <div className="flex gap-2">
                <Link
                  href="https://www.facebook.com/profile.php?id=61556825827660"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                >
                  <Facebook size={16} fill="white" stroke="white" />
                </Link>
                <Link
                  href="https://www.instagram.com/profesionalesec/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                >
                  <Instagram size={16} stroke="white" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">1998 - Desarrollo Digital y Marketing</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
