"use client"

import { useState } from "react"
import { Menu, X } from 'lucide-react'
import Link from "next/link"
import { LoginDialog } from "@/components/login-dialog"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-white font-bold text-3xl tracking-tight">p</span>
              <span className="text-emerald-400 font-bold text-2xl">.ec</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-12">
              <Link href="#inicio" className="text-sm text-white/70 hover:text-white transition-colors font-medium">
                Inicio
              </Link>
              <Link
                href="/profesionales"
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
              >
                Profesionales
              </Link>
              <Link
                href="/educacion"
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
              >
                Educación
              </Link>
              <Link href="#nosotros" className="text-sm text-white/70 hover:text-white transition-colors font-medium">
                Sobre Nosotros
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-semibold text-white px-6 py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all border border-white/30 shadow-lg hover:shadow-xl"
              >
                Iniciar Sesión
              </button>
              <Link
                href="/registro-profesional"
                className="text-sm font-medium bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-all inline-block"
              >
                Crear Perfil Profesional
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 border-t border-white/10">
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="#inicio" className="text-sm text-white/70 hover:text-white transition-colors px-2 py-2">
                  Inicio
                </Link>
                <Link
                  href="/profesionales"
                  className="text-sm text-white/70 hover:text-white transition-colors px-2 py-2"
                >
                  Profesionales
                </Link>
                <Link
                  href="/educacion"
                  className="text-sm text-white/70 hover:text-white transition-colors px-2 py-2"
                >
                  Educación
                </Link>
                <Link href="#nosotros" className="text-sm text-white/70 hover:text-white transition-colors px-2 py-2">
                  Sobre Nosotros
                </Link>
                <button
                  onClick={() => {
                    setIsLoginOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full font-semibold text-sm mt-2 shadow-lg"
                >
                  Iniciar Sesión
                </button>
                <Link
                  href="/registro-profesional"
                  className="w-full px-6 py-3 bg-white text-black rounded-full font-medium text-sm inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Crear Perfil Profesional
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}
