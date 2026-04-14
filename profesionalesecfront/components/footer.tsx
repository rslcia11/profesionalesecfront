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
      answer: "Plataforma que conecta profesionales certificados con clientes.",
    },
    {
      question: "¿Registro?",
      answer: 'Clic en "Crear Perfil Profesional" y completa tus datos.',
    },
    {
      question: "¿Costo?",
      answer: "Registro básico gratuito. Planes premium disponibles.",
    },
  ]

  const conversatorioFAQs = [
    {
      question: "¿Conversatorios?",
      answer: "Eventos exclusivos de aprendizaje y networking."
    },
    {
      question: "¿Inscripción?",
      answer: 'Sección "Educación" y completa el formulario.',
    },
    {
      question: "¿Certificado?",
      answer: "Sí, certificado digital de participación incluido.",
    },
  ]

  return (
    <footer className="bg-black text-white py-6 px-4 text-xs">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Logo & Description */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-900 pb-4">
          <div className="flex items-center gap-3">
            <img src="/logo-white.png" alt="Profesionales Ecuador" className="w-20 h-auto object-contain" />
            <p className="text-gray-500 max-w-xs leading-tight hidden md:block">
              Conectando profesionales y oportunidades en Ecuador.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="https://www.facebook.com/profile.php?id=61556825827660" target="_blank" className="hover:opacity-80">
              <Facebook size={18} />
            </Link>
            <Link href="https://www.instagram.com/profesionalesec/" target="_blank" className="hover:opacity-80">
              <Instagram size={18} />
            </Link>
          </div>
        </div>

        {/* Middle Section: Compact Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">

          {/* Column 1: Links */}
          <div>
            <h3 className="font-bold text-gray-300 mb-2 uppercase tracking-wider">Enlaces</h3>
            <ul className="space-y-1 text-gray-500">
              <li><Link href="/profesionales" className="hover:text-white transition">Directorio</Link></li>
              <li><Link href="/conversatorios" className="hover:text-white transition">Educación</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-white transition">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Column 2: Únete */}
          <div>
            <h3 className="font-bold text-gray-300 mb-2 uppercase tracking-wider">Únete</h3>
            <div className="space-y-2 text-gray-500">
              <div>
                <p className="font-semibold text-gray-400">Ponente</p>
                <Link href="https://wa.link/i65ui8" target="_blank" className="text-blue-500 hover:text-blue-400 text-[10px]">Más info →</Link>
              </div>
              <div>
                <p className="font-semibold text-gray-400">Asistente</p>
                <Link href="https://wa.link/soekak" target="_blank" className="text-blue-500 hover:text-blue-400 text-[10px]">Más info →</Link>
              </div>
            </div>
          </div>

          {/* Column 3: FAQs Profesionales */}
          <div>
            <h3 className="font-bold text-gray-300 mb-2 uppercase tracking-wider">FAQs Prof.</h3>
            <div className="space-y-1">
              {professionalFAQs.map((faq, index) => (
                <div key={index}>
                  <button onClick={() => setOpenProfessional(openProfessional === index ? null : index)} className="text-left hover:text-white text-gray-500 flex items-center gap-1 w-full">
                    <span className="truncate">{faq.question}</span>
                    <ChevronDown size={10} className={`transform transition ${openProfessional === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openProfessional === index && <p className="text-[10px] text-gray-600 mt-1 pl-1">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: FAQs Eventos */}
          <div>
            <h3 className="font-bold text-gray-300 mb-2 uppercase tracking-wider">FAQs Eventos</h3>
            <div className="space-y-1">
              {conversatorioFAQs.map((faq, index) => (
                <div key={index}>
                  <button onClick={() => setOpenConversatorio(openConversatorio === index ? null : index)} className="text-left hover:text-white text-gray-500 flex items-center gap-1 w-full">
                    <span className="truncate">{faq.question}</span>
                    <ChevronDown size={10} className={`transform transition ${openConversatorio === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openConversatorio === index && <p className="text-[10px] text-gray-600 mt-1 pl-1">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600">
          <a href="https://mil998.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Developed by 1998 - Desarrollo Digital y Marketing
          </a>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/terminos-y-condiciones" className="hover:text-gray-400">Términos</Link>
            <span>|</span>
            <a href="mailto:info@profesionales.ec" className="hover:text-gray-400">info@profesionales.ec</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
