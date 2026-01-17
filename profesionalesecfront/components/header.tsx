"use client"

import { useState, useEffect } from "react"
import { Menu, X, LogIn } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Profesionales", href: "/profesionales" },
    { label: "Educación", href: "/conversatorios" },
  ]

  return (
    <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity duration-300">
            <img src="/logo-white.png" alt="Profesionales.ec" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          {!isLoggedIn ? (
            <>
              <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300 ${isActive(link.href)
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50"
                        }`}
                    />
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </Link>
                <Link
                  href="/preinscripcion"
                  className="text-sm font-medium bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 hover:shadow-2xl active:scale-95"
                >
                  Crear Perfil Profesional
                </Link>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
              >
                <LogIn className="h-4 w-4 rotate-180" />
                Cerrar Sesión
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white active:scale-95"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="md:hidden pb-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex flex-col space-y-2 pt-4">
              {!isLoggedIn ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 ${isActive(link.href)
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    className="text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/preinscripcion"
                    className="w-full px-6 py-3 bg-white text-black rounded-full font-medium text-sm mt-4 active:scale-95 transition-transform text-center"
                  >
                    Crear Perfil Profesional
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-2 w-full text-left"
                >
                  <LogIn className="h-4 w-4 rotate-180" />
                  Cerrar Sesión
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
