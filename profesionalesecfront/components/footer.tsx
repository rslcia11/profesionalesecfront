"use client"

import { Facebook, Instagram, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Footer() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  const professionalFaqs = [
    { id: "faq1", question: "¿Qué es Profesionales.ec?" },
    { id: "faq2", question: "¿Cómo me registro como profesional?" },
    { id: "faq3", question: "¿Tiene algún costo el registro para profesionales?" },
  ]

  const conversatorioFaqs = [
    { id: "conv1", question: "¿Qué son los Conversatorios Multidisciplinarios?" },
    { id: "conv2", question: "¿Cómo me inscribo a los Conversatorios?" },
    { id: "conv3", question: "¿Recibo un certificado al asistir a un conversatorio?" },
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
          <div>
            <h3 className="text-base font-bold mb-4">Nuestros Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/profesionales"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Directorio Profesional
                </Link>
              </li>
              <li>
                <Link
                  href="/educacion"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Educación
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Políticas de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Preguntas Profesionales</h3>
            <ul className="space-y-2">
              {professionalFaqs.map((faq) => (
                <li key={faq.id}>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex items-center justify-between w-full text-left text-sm text-blue-400 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 group"
                  >
                    <span>{faq.question}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp size={16} className="flex-shrink-0 ml-2 transition-transform duration-200" />
                    ) : (
                      <ChevronDown size={16} className="flex-shrink-0 ml-2 transition-transform duration-200" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold mb-4">Preguntas Conversatorios</h3>
            <ul className="space-y-2">
              {conversatorioFaqs.map((faq) => (
                <li key={faq.id}>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex items-center justify-between w-full text-left text-sm text-blue-400 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 group"
                  >
                    <span>{faq.question}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp size={16} className="flex-shrink-0 ml-2 transition-transform duration-200" />
                    ) : (
                      <ChevronDown size={16} className="flex-shrink-0 ml-2 transition-transform duration-200" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
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
