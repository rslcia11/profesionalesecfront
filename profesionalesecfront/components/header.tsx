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
    <header className="fixed top-0 w-full z-50">
      {/* Top Bar - Kept as is, maybe slightly thinner if requested, but user said "reduce size of THAT bar" pointing to the main one usually. Let's keep top bar same size for now or slightly tighter padding. */}
      <div className="bg-black text-white py-1 px-4 text-[10px] md:text-xs border-b border-white/10 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="mailto:info@profesionales.ec" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            info@profesionales.ec
          </a>
        </div>
        <div className="font-bold tracking-widest text-center flex-1">
          SE PARTE DE PROFESIONALES.EC
        </div>
        <div className="flex items-center gap-3">
          <Link href="https://www.facebook.com/profile.php?id=61556825827660" target="_blank" className="hover:text-emerald-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></Link>
          <Link href="https://www.instagram.com/profesionalesec/" target="_blank" className="hover:text-emerald-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg></Link>
        </div>
      </div>

      <div className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main Header Container - Height reduced to h-16 (was h-20) */}
          <div className="relative flex justify-between items-center h-16">

            {/* Logo - Z-index to stay above centered nav */}
            <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity duration-300 z-10 shrink-0">
              <img src="/logo-white.png" alt="Profesionales.ec" className="h-10 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation - CENTERED ABSOLUTELY */}
            {!isLoggedIn && (
              <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-2 py-1 text-sm font-medium transition-all duration-300 group ${isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300 ${isActive(link.href)
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50"
                        }`}
                    />
                  </Link>
                ))}
              </nav>
            )}

            {/* Auth Buttons - Z-index to stay above centered nav */}
            <div className="flex items-center gap-3 z-10">
              {!isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-3">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/preinscripcion"
                      className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 active:scale-95"
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
      </div>
    </header>
  )
}
