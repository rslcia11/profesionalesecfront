"use client"

import { useState, useEffect } from "react"
import { Menu, X, LogIn, LogOut, User, Settings, FileText, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { getToken, removeToken } from "@/lib/api"

interface UserData {
  id: number
  nombre: string
  rol: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = getToken()
    if (token) {
      setIsAuthenticated(true)
      // Decodificar token JWT para obtener datos del usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserData({
          id: payload.id,
          nombre: payload.nombre,
          rol: payload.rol || 'profesional'
        })
      } catch (error) {
        console.error("Error al decodificar token:", error)
        removeToken()
        setIsAuthenticated(false)
      }
    }
  }, [])

  const handleLogout = () => {
    removeToken()
    setIsAuthenticated(false)
    setUserData(null)
    setIsUserMenuOpen(false)
    router.push("/")
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

  const getUserMenuItems = () => {
    const isAdmin = userData?.rol === 'admin' || userData?.rol === 'superadmin'
    
    if (isAdmin) {
      return [
        { label: "Panel Admin", href: "/admin", icon: LayoutDashboard },
        { label: "Configuración", href: "/admin/configuracion", icon: Settings },
      ]
    } else {
      return [
        { label: "Mi Perfil", href: "/dashboard/profesional", icon: User },
        { label: "Mis Documentos", href: "/dashboard/profesional/documentos", icon: FileText },
        { label: "Configuración", href: "/dashboard/profesional/configuracion", icon: Settings },
      ]
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity duration-300">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="white" />
              <path
                d="M12 28V12H16.5C17.7 12 18.7 12.3 19.5 12.9C20.3 13.5 20.7 14.4 20.7 15.6C20.7 16.3 20.5 16.9 20.1 17.4C19.7 17.9 19.2 18.2 18.6 18.4C19.3 18.5 19.9 18.9 20.4 19.4C20.9 19.9 21.1 20.6 21.1 21.4C21.1 22.7 20.7 23.7 19.8 24.4C18.9 25.1 17.8 25.4 16.4 25.4H15.5V28H12ZM15.5 17.2H16.3C16.9 17.2 17.4 17.1 17.7 16.8C18 16.5 18.2 16.1 18.2 15.6C18.2 15.1 18 14.7 17.7 14.4C17.4 14.1 16.9 14 16.3 14H15.5V17.2ZM15.5 23.4H16.5C17.2 23.4 17.7 23.2 18.1 22.9C18.5 22.6 18.7 22.1 18.7 21.5C18.7 20.9 18.5 20.4 18.1 20.1C17.7 19.8 17.2 19.6 16.5 19.6H15.5V23.4Z"
                fill="black"
              />
              <circle cx="28" cy="20" r="6" fill="#10B981" />
              <path
                d="M26 20L27.5 21.5L30 19"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white font-bold text-xl tracking-tight">
              Profesionales<span className="text-emerald-400">.ec</span>
            </span>
          </Link>

          {/* Desktop Navigation - Solo mostrar si NO está autenticado */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                    isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300 ${
                      isActive(link.href)
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50"
                    }`}
                  />
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && userData ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                    {getInitials(userData.nombre)}
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{userData.nombre}</p>
                    <p className="text-white/50 text-xs capitalize">{userData.rol}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-medium text-sm">{userData.nombre}</p>
                        <p className="text-white/50 text-xs capitalize">{userData.rol}</p>
                      </div>
                      
                      <div className="py-2">
                        {getUserMenuItems().map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
                          >
                            <item.icon className="h-4 w-4" />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-white/10 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

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
          <nav className="md:hidden pb-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-2 pt-4">
              {/* Solo mostrar links de navegación si NO está autenticado */}
              {!isAuthenticated && navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(link.href) ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && userData ? (
                <>
                  <div className="px-4 py-3 border-t border-white/10 mt-2">
                    <p className="text-white font-medium text-sm">{userData.nombre}</p>
                    <p className="text-white/50 text-xs capitalize">{userData.rol}</p>
                  </div>
                  
                  {getUserMenuItems().map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/preinscripcion"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-6 py-3 bg-white text-black rounded-full font-medium text-sm mt-4 active:scale-95 transition-transform text-center"
                  >
                    Crear Perfil Profesional
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}